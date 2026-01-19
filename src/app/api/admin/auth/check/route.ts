import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { db } = await import("@/lib/db");

    const sessionToken = request.cookies.get("admin_session")?.value;

    if (!sessionToken) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const session = await db.adminSession.findUnique({
      where: { token: sessionToken },
    });

    if (!session || new Date() > session.expiresAt) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      email: session.email,
    });
  } catch (error) {
    console.error("Admin auth check error:", error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
