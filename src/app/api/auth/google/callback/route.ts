import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";

export const dynamic = "force-dynamic";

interface GoogleTokenResponse {
  access_token: string;
  id_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  refresh_token?: string;
}

interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
}

export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    const { db } = await import("@/lib/db");

    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      return NextResponse.redirect(`${baseUrl}/auth/signup?error=${error}`);
    }

    if (!code) {
      return NextResponse.redirect(`${baseUrl}/auth/signup?error=no_code`);
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.redirect(`${baseUrl}/auth/signup?error=oauth_not_configured`);
    }

    const redirectUri = `${baseUrl}/api/auth/google/callback`;

    // Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
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
      console.error("Token exchange failed:", await tokenResponse.text());
      return NextResponse.redirect(`${baseUrl}/auth/signup?error=token_exchange_failed`);
    }

    const tokens: GoogleTokenResponse = await tokenResponse.json();

    // Get user info from Google
    const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!userInfoResponse.ok) {
      console.error("User info fetch failed:", await userInfoResponse.text());
      return NextResponse.redirect(`${baseUrl}/auth/signup?error=user_info_failed`);
    }

    const googleUser: GoogleUserInfo = await userInfoResponse.json();

    if (!googleUser.email) {
      return NextResponse.redirect(`${baseUrl}/auth/signup?error=no_email`);
    }

    // Find or create user
    let user = await db.user.findUnique({
      where: { email: googleUser.email.toLowerCase() },
      include: { profile: true },
    });

    if (!user) {
      user = await db.user.create({
        data: {
          email: googleUser.email.toLowerCase(),
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
    console.error("Google OAuth error:", error);
    return NextResponse.redirect(`${baseUrl}/auth/signup?error=oauth_failed`);
  }
}
