import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function getAuthUser(request: NextRequest) {
  const { db } = await import("@/lib/db");
  const sessionToken = request.cookies.get("user_session")?.value;
  if (!sessionToken) return null;

  const session = await db.userSession.findUnique({
    where: { token: sessionToken },
    include: { user: true },
  });

  if (!session || new Date() > session.expiresAt) return null;
  return session.user;
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { photoId } = await request.json();
    if (!photoId) {
      return NextResponse.json({ error: "Photo ID required" }, { status: 400 });
    }

    const { db } = await import("@/lib/db");

    const profile = await db.profile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Verify the photo belongs to this profile
    const photo = await db.photo.findUnique({
      where: { id: photoId },
    });

    if (!photo || photo.profileId !== profile.id) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    await db.photo.delete({ where: { id: photoId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete photo error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
