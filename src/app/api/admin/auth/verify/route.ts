import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { db } = await import("@/lib/db");

    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 400 });
    }

    // Find token
    const adminToken = await db.adminToken.findUnique({
      where: { token },
    });

    if (!adminToken) {
      return NextResponse.json({ error: "Invalid or expired link" }, { status: 401 });
    }

    if (adminToken.used) {
      return NextResponse.json({ error: "This link has already been used" }, { status: 401 });
    }

    if (new Date() > adminToken.expiresAt) {
      return NextResponse.json({ error: "This link has expired" }, { status: 401 });
    }

    // Mark token as used
    await db.adminToken.update({
      where: { id: adminToken.id },
      data: { used: true },
    });

    // Create session
    const sessionToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await db.adminSession.create({
      data: {
        email: adminToken.email,
        token: sessionToken,
        expiresAt,
      },
    });

    const response = NextResponse.json({ success: true });

    // Set session cookie
    response.cookies.set("admin_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Admin auth verify error:", error);
    return NextResponse.json(
      { error: "Failed to verify token" },
      { status: 500 }
    );
  }
}
