import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

// Helper to refresh Pinterest access token
async function refreshAccessToken(refreshToken: string): Promise<{
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  refresh_token_expires_in?: number;
} | null> {
  const clientId = process.env.PINTEREST_CLIENT_ID;
  const clientSecret = process.env.PINTEREST_CLIENT_SECRET;

  if (!clientId || !clientSecret) return null;

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  try {
    const response = await fetch("https://api.pinterest.com/v5/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${basicAuth}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) return null;

    return response.json();
  } catch {
    return null;
  }
}

export async function GET() {
  const cookieStore = await cookies();

  // Check admin authentication
  const sessionToken = cookieStore.get("admin_session")?.value;
  if (!sessionToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check for direct access token from env (preferred) or cookie
  const envAccessToken = process.env.PINTEREST_ACCESS_TOKEN;
  let accessToken = envAccessToken || cookieStore.get("pinterest_access_token")?.value;
  const refreshToken = cookieStore.get("pinterest_refresh_token")?.value;

  // Not connected
  if (!accessToken && !refreshToken) {
    return NextResponse.json({
      connected: false,
      configured: !!process.env.PINTEREST_ACCESS_TOKEN || !!process.env.PINTEREST_CLIENT_ID,
    });
  }

  // Try to refresh if no access token but have refresh token
  if (!accessToken && refreshToken) {
    const newTokens = await refreshAccessToken(refreshToken);
    if (newTokens) {
      accessToken = newTokens.access_token;

      // We can't set cookies directly in a GET response body,
      // so we'll indicate refresh is needed
      return NextResponse.json({
        connected: true,
        needsRefresh: true,
      });
    } else {
      // Refresh failed, need to re-authenticate
      return NextResponse.json({
        connected: false,
        configured: true,
      });
    }
  }

  // Verify token by fetching user info
  try {
    const userResponse = await fetch("https://api.pinterest.com/v5/user_account", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (userResponse.ok) {
      const userData = await userResponse.json();
      return NextResponse.json({
        connected: true,
        user: {
          username: userData.username,
          profileImage: userData.profile_image,
        },
      });
    } else if (userResponse.status === 401 && refreshToken) {
      // Token expired, try refresh
      const newTokens = await refreshAccessToken(refreshToken);
      if (newTokens) {
        return NextResponse.json({
          connected: true,
          needsRefresh: true,
        });
      }
    }

    return NextResponse.json({
      connected: false,
      configured: true,
    });
  } catch (error) {
    console.error("Pinterest status check error:", error);
    return NextResponse.json({
      connected: false,
      configured: true,
    });
  }
}
