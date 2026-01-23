import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

// GET: Initiate Pinterest OAuth flow
export async function GET() {
  // Check admin authentication
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("admin_session")?.value;

  if (!sessionToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clientId = process.env.PINTEREST_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json(
      { error: "Pinterest API not configured" },
      { status: 500 }
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const redirectUri = `${baseUrl}/api/admin/pinterest/callback`;

  // Pinterest OAuth scopes needed for creating pins and reading boards
  const scopes = [
    "boards:read",
    "boards:write",
    "pins:read",
    "pins:write",
  ].join(",");

  // Generate state for CSRF protection
  const state = Buffer.from(JSON.stringify({
    timestamp: Date.now(),
    random: Math.random().toString(36).substring(7)
  })).toString("base64");

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: scopes,
    state,
  });

  const pinterestAuthUrl = `https://www.pinterest.com/oauth/?${params.toString()}`;

  // Store state in cookie for verification
  const response = NextResponse.redirect(pinterestAuthUrl);
  response.cookies.set("pinterest_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10, // 10 minutes
    path: "/",
  });

  return response;
}

// DELETE: Disconnect Pinterest account
export async function DELETE() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("admin_session")?.value;

  if (!sessionToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });

  // Clear Pinterest tokens
  response.cookies.delete("pinterest_access_token");
  response.cookies.delete("pinterest_refresh_token");

  return response;
}
