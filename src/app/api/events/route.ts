import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

interface MeetupEvent {
  id: string;
  title: string;
  dateTime: string;
  eventUrl: string;
  groupName: string;
  venueName: string | null;
  venueCity: string | null;
  venueState: string | null;
  imageUrl: string | null;
  description: string | null;
}

// In-memory cache: key = "lat,lng", value = { events, expiry }
const eventsCache = new Map<string, { events: MeetupEvent[]; expiry: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

const SEARCH_KEYWORDS = ["childfree", "child-free", "DINK", "no kids"];

async function scrapeMeetupEvents(lat: number, lng: number): Promise<MeetupEvent[]> {
  const allEvents: MeetupEvent[] = [];
  const seenIds = new Set<string>();

  for (const keyword of SEARCH_KEYWORDS) {
    try {
      const url = `https://www.meetup.com/find/?keywords=${encodeURIComponent(keyword)}&source=EVENTS&eventType=inPerson&location=${lat},${lng}`;

      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
      });

      if (!res.ok) continue;

      const html = await res.text();

      // Extract Apollo state JSON from the page
      const scriptMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
      if (!scriptMatch) continue;

      const nextData = JSON.parse(scriptMatch[1]);

      // Navigate Apollo cache to find events
      const apolloState = nextData?.props?.pageProps?.apolloState || nextData?.props?.pageProps?.__apollo_state__;
      if (!apolloState) continue;

      for (const key of Object.keys(apolloState)) {
        if (!key.startsWith("Event:")) continue;

        const event = apolloState[key];
        if (!event || seenIds.has(event.id)) continue;

        seenIds.add(event.id);

        // Resolve group reference
        const groupRef = event.group?.__ref || event.group;
        const group = typeof groupRef === "string" ? apolloState[groupRef] : groupRef;

        // Resolve venue reference
        const venueRef = event.venue?.__ref || event.venue;
        const venue = typeof venueRef === "string" ? apolloState[venueRef] : venueRef;

        // Resolve image reference
        const imageRef = event.featuredEventPhoto?.__ref || event.featuredEventPhoto || event.image?.__ref || event.image;
        const image = typeof imageRef === "string" ? apolloState[imageRef] : imageRef;

        allEvents.push({
          id: event.id || key.replace("Event:", ""),
          title: event.title || "",
          dateTime: event.dateTime || "",
          eventUrl: event.eventUrl || "",
          groupName: group?.name || "",
          venueName: venue?.name || null,
          venueCity: venue?.city || null,
          venueState: venue?.state || null,
          imageUrl: image?.highResUrl || image?.baseUrl || null,
          description: event.description ? event.description.substring(0, 200) : null,
        });
      }

      // Small delay between requests
      await new Promise((r) => setTimeout(r, 500));
    } catch {
      // Continue to next keyword on error
    }
  }

  // Sort by date
  allEvents.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  return allEvents;
}

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
    const ip = getClientIp(request);
    const { allowed } = rateLimit(`events:${ip}`, { limit: 10, windowSeconds: 60 });
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const lat = request.nextUrl.searchParams.get("lat");
    const lng = request.nextUrl.searchParams.get("lng");

    if (!lat || !lng) {
      return NextResponse.json({ error: "Location required" }, { status: 400 });
    }

    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    if (isNaN(latNum) || isNaN(lngNum)) {
      return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
    }

    // Round coords for cache key (same area = same cache)
    const cacheKey = `${latNum.toFixed(1)},${lngNum.toFixed(1)}`;
    const cached = eventsCache.get(cacheKey);

    if (cached && cached.expiry > Date.now()) {
      return NextResponse.json({ events: cached.events });
    }

    const events = await scrapeMeetupEvents(latNum, lngNum);

    eventsCache.set(cacheKey, { events, expiry: Date.now() + CACHE_TTL });

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Events API error:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}
