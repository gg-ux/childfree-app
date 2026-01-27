import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { db } = await import("@/lib/db");

    const sessionToken = request.cookies.get("user_session")?.value;

    if (!sessionToken) {
      return NextResponse.json({ authenticated: false });
    }

    const session = await db.userSession.findUnique({
      where: { token: sessionToken },
      include: {
        user: {
          include: { profile: true },
        },
      },
    });

    if (!session || new Date() > session.expiresAt) {
      return NextResponse.json({ authenticated: false });
    }

    // Update last active
    await db.user.update({
      where: { id: session.user.id },
      data: { lastActiveAt: new Date() },
    });

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        status: session.user.status,
        onboardingStep: session.user.onboardingStep,
        hasProfile: !!session.user.profile,
        profile: session.user.profile
          ? {
              displayName: session.user.profile.displayName,
              isVerified: session.user.profile.isVerified,
              locationCity: session.user.profile.locationCity,
              locationLat: session.user.profile.locationLat,
              locationLng: session.user.profile.locationLng,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ authenticated: false });
  }
}
