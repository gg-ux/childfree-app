import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const clientId = process.env.APPLE_CLIENT_ID;

  if (!clientId) {
    return NextResponse.redirect(
      new URL("/auth/signup?error=oauth_not_configured", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000")
    );
  }

  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/apple/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "name email",
    response_mode: "form_post",
  });

  const appleAuthUrl = `https://appleid.apple.com/auth/authorize?${params.toString()}`;

  return NextResponse.redirect(appleAuthUrl);
}
