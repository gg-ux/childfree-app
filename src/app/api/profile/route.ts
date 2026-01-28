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

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { db } = await import("@/lib/db");

    const profile = await db.profile.findUnique({
      where: { userId: user.id },
      include: {
        photos: { orderBy: { position: "asc" } },
        prompts: { orderBy: { position: "asc" } },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: "No profile found" }, { status: 404 });
    }

    // Get events attended
    const rsvps = await db.eventRsvp.findMany({
      where: { userId: user.id, status: "GOING" },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            startsAt: true,
            locationCity: true,
            eventType: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 6,
    });

    return NextResponse.json({
      profile: {
        ...profile,
        email: user.email,
      },
      eventsAttended: rsvps.map((r: any) => r.event),
    });
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { db } = await import("@/lib/db");
    const body = await request.json();

    // Allowed profile fields for update
    const allowedFields = [
      "displayName", "bio", "gender", "genderPreferences",
      "childfreeStatus", "relationshipStatus", "seeking",
      "interests", "musicGenres", "anthem", "values", "dealBreakers",
      "pets", "diet", "drinking", "smoking", "cannabis", "workStyle",
      "pronouns", "identityTags", "petTypes",
      "zodiacSign", "mbtiType", "locationCity", "locationLat", "locationLng",
      "ageMin", "ageMax", "distanceMax",
    ];

    const updateData: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const updated = await db.profile.update({
      where: { userId: user.id },
      data: updateData,
      include: {
        photos: { orderBy: { position: "asc" } },
        prompts: { orderBy: { position: "asc" } },
      },
    });

    return NextResponse.json({ profile: updated });
  } catch (error) {
    console.error("Profile PATCH error:", error);
    return NextResponse.json({ error: "Server error", detail: String(error) }, { status: 500 });
  }
}
