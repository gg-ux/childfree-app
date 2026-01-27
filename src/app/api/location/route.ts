import { NextRequest, NextResponse } from "next/server";
import { geocodeZip } from "@/lib/geocode";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

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

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const { allowed } = rateLimit(`location:${ip}`, { limit: 10, windowSeconds: 60 });
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const user = await getAuthUser(request);
    if (!user || !user.profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { zip } = await request.json();
    if (!zip || typeof zip !== "string") {
      return NextResponse.json({ error: "Zip code required" }, { status: 400 });
    }

    const location = await geocodeZip(zip.trim());
    if (!location) {
      return NextResponse.json({ error: "Could not find that zip code" }, { status: 400 });
    }

    const { db } = await import("@/lib/db");
    await db.profile.update({
      where: { userId: user.id },
      data: {
        locationCity: location.city,
        locationLat: location.lat,
        locationLng: location.lng,
      },
    });

    return NextResponse.json({
      city: location.city,
      lat: location.lat,
      lng: location.lng,
    });
  } catch (error) {
    console.error("Location update error:", error);
    return NextResponse.json({ error: "Failed to update location" }, { status: 500 });
  }
}
