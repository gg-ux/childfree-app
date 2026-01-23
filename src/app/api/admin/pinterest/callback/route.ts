import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

interface PinterestTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
  scope: string;
}

export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const adminUrl = `${baseUrl}/admin`;

  try {
    const cookieStore = await cookies();

    // Check admin authentication
    const sessionToken = cookieStore.get("admin_session")?.value;
    if (!sessionToken) {
      return NextResponse.redirect(`${adminUrl}?pinterest=error&message=unauthorized`);
    }

    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error) {
      console.error("Pinterest OAuth error:", error);
      return NextResponse.redirect(`${adminUrl}?pinterest=error&message=${error}`);
    }

    if (!code) {
      return NextResponse.redirect(`${adminUrl}?pinterest=error&message=no_code`);
    }

    // Verify state for CSRF protection
    const savedState = cookieStore.get("pinterest_oauth_state")?.value;
    if (!savedState || savedState !== state) {
      return NextResponse.redirect(`${adminUrl}?pinterest=error&message=invalid_state`);
    }

    const clientId = process.env.PINTEREST_CLIENT_ID;
    const clientSecret = process.env.PINTEREST_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.redirect(`${adminUrl}?pinterest=error&message=not_configured`);
    }

    const redirectUri = `${baseUrl}/api/admin/pinterest/callback`;

    // Exchange code for tokens
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const tokenResponse = await fetch("https://api.pinterest.com/v5/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${basicAuth}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Pinterest token exchange failed:", errorText);
      return NextResponse.redirect(`${adminUrl}?pinterest=error&message=token_exchange_failed`);
    }

    const tokens: PinterestTokenResponse = await tokenResponse.json();

    // Create response with success redirect
    const response = NextResponse.redirect(`${adminUrl}?pinterest=connected`);

    // Store tokens in httpOnly cookies
    const accessTokenExpiry = new Date(Date.now() + tokens.expires_in * 1000);
    const refreshTokenExpiry = new Date(Date.now() + tokens.refresh_token_expires_in * 1000);

    response.cookies.set("pinterest_access_token", tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: accessTokenExpiry,
      path: "/",
    });

    response.cookies.set("pinterest_refresh_token", tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: refreshTokenExpiry,
      path: "/",
    });

    // Clear the OAuth state cookie
    response.cookies.delete("pinterest_oauth_state");

    return response;
  } catch (error) {
    console.error("Pinterest OAuth callback error:", error);
    return NextResponse.redirect(`${adminUrl}?pinterest=error&message=callback_failed`);
  }
}
