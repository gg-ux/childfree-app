import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

async function getAuthUser(request: NextRequest) {
  const { db } = await import("@/lib/db");
  const sessionToken = request.cookies.get("user_session")?.value;
  if (!sessionToken) return null;

  const session = await db.userSession.findUnique({
    where: { token: sessionToken },
    include: { user: { include: { profile: true } } },
  });

  if (!session || new Date() > session.expiresAt) return null;
  return session.user;
}

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const { allowed } = rateLimit(`community-events:${ip}`, { limit: 20, windowSeconds: 60 });
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { db } = await import("@/lib/db");

    // Fetch all published future events
    const events = await db.event.findMany({
      where: {
        status: "PUBLISHED",
        startsAt: { gte: new Date() },
      },
      include: {
        creator: {
          include: { profile: true },
        },
        _count: { select: { rsvps: true } },
      },
      orderBy: { startsAt: "asc" },
      take: 50,
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Community events GET error:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const { allowed } = rateLimit(`create-event:${ip}`, { limit: 5, windowSeconds: 60 });
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, eventType, locationCity, locationAddress, locationLat, locationLng, startsAt, endsAt, maxAttendees } = body;

    if (!title || !description || !startsAt) {
      return NextResponse.json({ error: "Title, description, and start date are required" }, { status: 400 });
    }

    if (title.length > 200) {
      return NextResponse.json({ error: "Title too long" }, { status: 400 });
    }

    if (description.length > 2000) {
      return NextResponse.json({ error: "Description too long" }, { status: 400 });
    }

    const startDate = new Date(startsAt);
    if (isNaN(startDate.getTime()) || startDate < new Date()) {
      return NextResponse.json({ error: "Start date must be in the future" }, { status: 400 });
    }

    const { db } = await import("@/lib/db");

    const event = await db.event.create({
      data: {
        creatorId: user.id,
        title: title.trim(),
        description: description.trim(),
        eventType: eventType === "VIRTUAL" ? "VIRTUAL" : "IN_PERSON",
        locationCity: locationCity || null,
        locationAddress: locationAddress || null,
        locationLat: locationLat ? parseFloat(locationLat) : null,
        locationLng: locationLng ? parseFloat(locationLng) : null,
        startsAt: startDate,
        endsAt: endsAt ? new Date(endsAt) : null,
        maxAttendees: maxAttendees ? parseInt(maxAttendees) : null,
        status: "PUBLISHED",
      },
    });

    return NextResponse.json({ success: true, event });
  } catch (error) {
    console.error("Community events POST error:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
