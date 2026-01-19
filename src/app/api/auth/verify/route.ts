import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { db } = await import("@/lib/db");

    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 400 });
    }

    // Find and validate token
    const userToken = await db.userToken.findUnique({
      where: { token },
    });

    if (!userToken) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (userToken.used) {
      return NextResponse.json({ error: "Token already used" }, { status: 401 });
    }

    if (new Date() > userToken.expiresAt) {
      return NextResponse.json({ error: "Token expired" }, { status: 401 });
    }

    // Mark token as used
    await db.userToken.update({
      where: { id: userToken.id },
      data: { used: true },
    });

    // Find or create user
    let user = await db.user.findUnique({
      where: { email: userToken.email },
      include: { profile: true },
    });

    const isNewUser = !user;

    if (!user) {
      user = await db.user.create({
        data: {
          email: userToken.email,
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

    // Determine where to redirect
    const needsOnboarding = !user.profile || user.onboardingStep < 5;

    const response = NextResponse.json({
      success: true,
      isNewUser,
      needsOnboarding,
      onboardingStep: user.onboardingStep,
    });

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
    console.error("Auth verify error:", error);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
