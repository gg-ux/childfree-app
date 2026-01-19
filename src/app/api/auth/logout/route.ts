import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { db } = await import("@/lib/db");

    const sessionToken = request.cookies.get("user_session")?.value;

    if (sessionToken) {
      await db.userSession.delete({
        where: { token: sessionToken },
      }).catch(() => {
        // Ignore if session doesn't exist
      });
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set("user_session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(0),
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Auth logout error:", error);
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}
