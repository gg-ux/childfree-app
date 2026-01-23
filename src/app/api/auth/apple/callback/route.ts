import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import * as jose from "jose";

export const dynamic = "force-dynamic";

interface AppleTokenResponse {
  access_token: string;
  id_token: string;
  expires_in: number;
  token_type: string;
  refresh_token?: string;
}

interface AppleIdTokenPayload {
  iss: string;
  aud: string;
  exp: number;
  iat: number;
  sub: string;
  email?: string;
  email_verified?: string;
  is_private_email?: string;
}

async function generateClientSecret(): Promise<string> {
  const teamId = process.env.APPLE_TEAM_ID;
  const clientId = process.env.APPLE_CLIENT_ID;
  const keyId = process.env.APPLE_KEY_ID;
  const privateKey = process.env.APPLE_PRIVATE_KEY;

  if (!teamId || !clientId || !keyId || !privateKey) {
    throw new Error("Missing Apple OAuth configuration");
  }

  // Parse the private key (handle both newline formats)
  const formattedKey = privateKey.replace(/\\n/g, "\n");
  const key = await jose.importPKCS8(formattedKey, "ES256");

  const now = Math.floor(Date.now() / 1000);

  const jwt = await new jose.SignJWT({})
    .setProtectedHeader({ alg: "ES256", kid: keyId })
    .setIssuer(teamId)
    .setIssuedAt(now)
    .setExpirationTime(now + 86400 * 180) // 180 days
    .setAudience("https://appleid.apple.com")
    .setSubject(clientId)
    .sign(key);

  return jwt;
}

export async function POST(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    const { db } = await import("@/lib/db");

    const formData = await request.formData();
    const code = formData.get("code") as string;
    const error = formData.get("error") as string;
    const userDataString = formData.get("user") as string;

    if (error) {
      return NextResponse.redirect(`${baseUrl}/auth/signup?error=${error}`);
    }

    if (!code) {
      return NextResponse.redirect(`${baseUrl}/auth/signup?error=no_code`);
    }

    const clientId = process.env.APPLE_CLIENT_ID;

    if (!clientId) {
      return NextResponse.redirect(`${baseUrl}/auth/signup?error=oauth_not_configured`);
    }

    const redirectUri = `${baseUrl}/api/auth/apple/callback`;

    // Generate client secret
    let clientSecret: string;
    try {
      clientSecret = await generateClientSecret();
    } catch (err) {
      console.error("Failed to generate Apple client secret:", err);
      return NextResponse.redirect(`${baseUrl}/auth/signup?error=oauth_not_configured`);
    }

    // Exchange code for tokens
    const tokenResponse = await fetch("https://appleid.apple.com/auth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      console.error("Apple token exchange failed:", await tokenResponse.text());
      return NextResponse.redirect(`${baseUrl}/auth/signup?error=token_exchange_failed`);
    }

    const tokens: AppleTokenResponse = await tokenResponse.json();

    // Decode the id_token to get user info
    const idTokenPayload = jose.decodeJwt(tokens.id_token) as AppleIdTokenPayload;

    // Apple only sends user data on first sign-in
    let email = idTokenPayload.email;

    if (!email && userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        email = userData.email;
      } catch {
        // Ignore parsing error
      }
    }

    if (!email) {
      return NextResponse.redirect(`${baseUrl}/auth/signup?error=no_email`);
    }

    // Find or create user
    let user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { profile: true },
    });

    if (!user) {
      user = await db.user.create({
        data: {
          email: email.toLowerCase(),
          status: "PENDING",
          onboardingStep: 0,
        },
        include: { profile: true },
      });
    }

    // Create session
    const sessionToken = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await db.userSession.create({
      data: {
        userId: user.id,
        token: sessionToken,
        expiresAt,
      },
    });

    // Determine redirect
    const needsOnboarding = !user.profile || user.onboardingStep < 4;
    const redirectPath = needsOnboarding ? "/onboarding" : "/discover";

    const response = NextResponse.redirect(`${baseUrl}${redirectPath}`);

    // Set session cookie
    response.cookies.set("user_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Apple OAuth error:", error);
    return NextResponse.redirect(`${baseUrl}/auth/signup?error=oauth_failed`);
  }
}
