import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { db } = await import("@/lib/db");
    const sessionToken = request.cookies.get("user_session")?.value;
    if (!sessionToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const session = await db.userSession.findUnique({
      where: { token: sessionToken },
      include: { user: { include: { profile: true } } },
    });
    if (!session || new Date() > session.expiresAt || !session.user.profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { order } = await request.json();
    if (!Array.isArray(order)) {
      return NextResponse.json({ error: "Invalid order" }, { status: 400 });
    }

    // Update each photo's position
    await Promise.all(
      order.map((photoId: string, index: number) =>
        db.photo.updateMany({
          where: { id: photoId, profileId: session.user.profile!.id },
          data: { position: index },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Photo reorder error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
