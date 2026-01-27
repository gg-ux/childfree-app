import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";
export const maxDuration = 30; // Allow up to 30s on Vercel

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
  tag: string | null;
}

const TAG_RULES: { tag: string; patterns: RegExp }[] = [
  { tag: "Childfree", patterns: /childfree|child-free|child free|no kids|dink\b/i },
  { tag: "Food & Drink", patterns: /wine|beer|cocktail|happy hour|brunch|dinner|food|tasting|restaurant|bar crawl|cooking class/i },
  { tag: "Outdoors", patterns: /hik(e|ing)|trail|outdoor|camping|beach|kayak|nature|walk\b/i },
  { tag: "Games", patterns: /game night|board game|trivia|bingo|bunko|puzzle/i },
  { tag: "Fitness", patterns: /yoga|gym|fitness|run\b|running|cycling|workout|pilates|CrossFit/i },
  { tag: "Music", patterns: /live music|concert|karaoke|open mic|jazz|jam session/i },
  { tag: "Arts", patterns: /art walk|gallery|museum|paint|pottery|craft|theater|theatre|comedy/i },
  { tag: "Dance", patterns: /danc(e|ing)|salsa|bachata|line danc/i },
  { tag: "Social", patterns: /meetup|social|mixer|networking|hangout|get.together/i },
  { tag: "Books", patterns: /book club|reading|literary|author/i },
  { tag: "Travel", patterns: /travel|adventure|road trip|explore/i },
];

function getEventTag(title: string, description: string | null, groupName: string): string | null {
  const text = `${title} ${description || ""} ${groupName}`;
  for (const rule of TAG_RULES) {
    if (rule.patterns.test(text)) return rule.tag;
  }
  return null;
}

// In-memory cache: key = "lat,lng", value = { events, expiry }
const eventsCache = new Map<string, { events: MeetupEvent[]; expiry: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

// Keep keyword list small to stay within Vercel's serverless timeout (10s)
const SEARCH_KEYWORDS = [
  "childfree", "happy hour", "hiking",
  "game night", "wine tasting", "comedy show",
  "art walk", "live music",
];

async function fetchKeywordEvents(keyword: string, lat: number, lng: number): Promise<MeetupEvent[]> {
  try {
    const url = `https://www.meetup.com/find/?keywords=${encodeURIComponent(keyword)}&source=EVENTS&eventType=inPerson&location=${lat},${lng}`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    if (!res.ok) return [];

    const html = await res.text();

    const scriptMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
    if (!scriptMatch) return [];

    const nextData = JSON.parse(scriptMatch[1]);
    const apolloState = nextData?.props?.pageProps?.__APOLLO_STATE__ || nextData?.props?.pageProps?.apolloState || nextData?.props?.pageProps?.__apollo_state__;
    if (!apolloState) return [];

    const events: MeetupEvent[] = [];

    for (const key of Object.keys(apolloState)) {
      if (!key.startsWith("Event:")) continue;

      const event = apolloState[key];
      if (!event) continue;

      const groupRef = event.group?.__ref || event.group;
      const group = typeof groupRef === "string" ? apolloState[groupRef] : groupRef;

      const venueRef = event.venue?.__ref || event.venue;
      const venue = typeof venueRef === "string" ? apolloState[venueRef] : venueRef;

      const imageRef = event.featuredEventPhoto?.__ref || event.featuredEventPhoto || event.image?.__ref || event.image;
      const image = typeof imageRef === "string" ? apolloState[imageRef] : imageRef;

      const title = event.title || "";
      const desc = event.description ? event.description.substring(0, 200) : null;
      const gName = group?.name || "";

      events.push({
        id: event.id || key.replace("Event:", ""),
        title,
        dateTime: event.dateTime || "",
        eventUrl: event.eventUrl || "",
        groupName: gName,
        venueName: venue?.name || null,
        venueCity: venue?.city || null,
        venueState: venue?.state || null,
        imageUrl: image?.highResUrl || image?.baseUrl || null,
        description: desc,
        tag: getEventTag(title, desc, gName),
      });
    }

    return events;
  } catch {
    return [];
  }
}

async function scrapeMeetupEvents(lat: number, lng: number): Promise<MeetupEvent[]> {
  const seenIds = new Set<string>();
  const seenTitles = new Set<string>();
  const allEvents: MeetupEvent[] = [];

  // Fetch in parallel batches of 4 to avoid hammering Meetup
  const BATCH_SIZE = 4;
  for (let i = 0; i < SEARCH_KEYWORDS.length; i += BATCH_SIZE) {
    const batch = SEARCH_KEYWORDS.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(batch.map((kw) => fetchKeywordEvents(kw, lat, lng)));

    for (const events of results) {
      for (const event of events) {
        // Skip broken entries
        if (!event.title || event.title === "undefined" || !event.dateTime || !event.eventUrl) continue;
        // Deduplicate by ID and title
        const titleKey = event.title.toLowerCase().trim();
        if (seenIds.has(event.id) || seenTitles.has(titleKey)) continue;
        seenIds.add(event.id);
        seenTitles.add(titleKey);
        allEvents.push(event);
        }
      }
    }

    // Small delay between batches
    if (i + BATCH_SIZE < SEARCH_KEYWORDS.length) {
      await new Promise((r) => setTimeout(r, 300));
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
