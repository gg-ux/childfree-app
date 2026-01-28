import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { scrapeLumaEvents } from "./luma";
import { scrapeRAEvents } from "./ra";
import { scrapeEventbriteEvents } from "./eventbrite";

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
  source: "meetup" | "luma" | "ra" | "eventbrite" | "community";
}

const TAG_RULES: { tag: string; patterns: RegExp }[] = [
  { tag: "Childfree", patterns: new RegExp("childfree|child-free|child free|no kids|dink\\b", "i") },
  { tag: "Outdoors", patterns: new RegExp("hik(e|ing)|trail|outdoor|camping|beach|kayak|nature|walk\\b|backpack", "i") },
  { tag: "Food & Drink", patterns: new RegExp("wine|beer|cocktail|happy hour|brunch|dinner|food|tasting|restaurant|bar crawl|cooking class", "i") },
  { tag: "Games", patterns: new RegExp("game night|board game|trivia|bingo|bunko|puzzle", "i") },
  { tag: "Fitness", patterns: new RegExp("yoga|gym|fitness|run\\b|running|cycling|workout|pilates|CrossFit", "i") },
  { tag: "Music", patterns: new RegExp("live music|concert|karaoke|jazz|jam session", "i") },
  { tag: "Arts", patterns: new RegExp("art walk|gallery|museum|paint|pottery|craft|theater|theatre|comedy", "i") },
  { tag: "Dance", patterns: new RegExp("danc(e|ing)|salsa|bachata|line danc", "i") },
  { tag: "Singles", patterns: new RegExp("singles|speed dating|singles mixer|singles night|match.?making|single professionals", "i") },
  { tag: "Social", patterns: new RegExp("meetup|social|mixer|networking|hangout|get.together", "i") },
  { tag: "Books", patterns: new RegExp("book club|reading|literary|author", "i") },
  { tag: "Travel", patterns: new RegExp("travel|adventure|road trip|explore", "i") },
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

// Prioritize childfree/adult-focused, then quality social keywords
const SEARCH_KEYWORDS = [
  "childfree", "child free", "DINK", "adults only",
  "happy hour", "hiking", "game night",
  "wine tasting", "comedy show", "art walk",
];

// ~100 miles in degrees (rough approximation)
const MAX_DISTANCE_DEG = 1.5;

// Map US states to approximate center coords
const STATE_COORDS: Record<string, [number, number]> = {
  "CA": [36.78, -119.42], "NY": [40.71, -74.01], "IL": [41.88, -87.63],
  "FL": [27.66, -81.52], "TX": [31.97, -99.90], "WA": [47.75, -120.74],
  "CO": [39.55, -105.78], "DC": [38.91, -77.04], "MA": [42.41, -71.38],
  "GA": [32.16, -82.90], "OR": [43.80, -120.55], "TN": [35.52, -86.58],
  "AZ": [34.05, -111.09], "MN": [46.73, -94.69], "MI": [44.31, -85.60],
  "PA": [41.20, -77.19], "OH": [40.42, -82.91], "NC": [35.76, -79.02],
  "NJ": [40.06, -74.41], "VA": [37.43, -78.66], "NV": [38.80, -116.42],
  "LA": [30.98, -91.96], "IN": [40.27, -86.13], "MO": [38.57, -92.60],
};

function isNearby(eventLat: number | null, eventLng: number | null, targetLat: number, targetLng: number, venueState?: string | null): boolean {
  let lat = eventLat;
  let lng = eventLng;

  // Fall back to state-level coords if no venue coords
  if (lat == null || lng == null) {
    if (venueState) {
      const stateCoords = STATE_COORDS[venueState.toUpperCase().trim()];
      if (stateCoords) {
        // Use a looser threshold for state-level matching (~3 degrees / ~200mi)
        const d = Math.sqrt(Math.pow(stateCoords[0] - targetLat, 2) + Math.pow(stateCoords[1] - targetLng, 2));
        return d <= 5;
      }
    }
    // No coords and no state — allow through (Meetup already filtered by location param)
    return true;
  }

  const d = Math.sqrt(Math.pow(lat - targetLat, 2) + Math.pow(lng - targetLng, 2));
  return d <= MAX_DISTANCE_DEG;
}

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

      // Filter by proximity — skip events far from the target location
      const venueLat = venue?.lat ?? group?.lat ?? null;
      const venueLng = venue?.lng ?? venue?.lon ?? group?.lng ?? group?.lon ?? null;
      if (!isNearby(venueLat, venueLng, lat, lng, venue?.state)) continue;

      const title = event.title || "";

      // Skip events with no venue (likely spam/placeholder)
      if (!venue?.name && event.eventType !== "ONLINE") continue;

      // Skip spammy titles (all caps, excessive punctuation)
      if (title === title.toUpperCase() && title.length > 10) continue;
      if ((title.match(/!/g) || []).length >= 3) continue;

      // Skip open mic events (low relevance for social discovery)
      if (new RegExp("open mic", "i").test(title)) continue;

      // Skip new groups with no rating history (low quality signal)
      const stats = group?.stats;
      const statsRef = typeof stats?.__ref === "string" ? apolloState[stats.__ref] : stats;
      const totalRatings = statsRef?.eventRatings?.totalRatings ?? 0;
      const isNewGroup = group?.isNewGroup ?? false;
      if (isNewGroup && totalRatings === 0) continue;

      // RSVP count for sorting
      const rsvpCount = event.rsvps?.totalCount ?? 0;

      const imageRef = event.featuredEventPhoto?.__ref || event.featuredEventPhoto || event.image?.__ref || event.image;
      const image = typeof imageRef === "string" ? apolloState[imageRef] : imageRef;

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
        source: "meetup",
        _rsvpCount: rsvpCount,
      } as MeetupEvent);
    }

    return events;
  } catch (_err) {
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

    // Small delay between batches
    if (i + BATCH_SIZE < SEARCH_KEYWORDS.length) {
      await new Promise((r) => setTimeout(r, 300));
    }
  }

  // Sort: childfree-tagged first, then by RSVP count (desc), then by date
  allEvents.sort((a, b) => {
    const aChildfree = a.tag === "Childfree" ? 0 : 1;
    const bChildfree = b.tag === "Childfree" ? 0 : 1;
    if (aChildfree !== bChildfree) return aChildfree - bChildfree;

    const aRsvp = (a as unknown as Record<string, unknown>)._rsvpCount as number || 0;
    const bRsvp = (b as unknown as Record<string, unknown>)._rsvpCount as number || 0;
    if (bRsvp !== aRsvp) return bRsvp - aRsvp;

    return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
  });

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

function deduplicateEvents(events: MeetupEvent[]): MeetupEvent[] {
  const seenTitles = new Set<string>();
  return events.filter((e) => {
    const key = e.title.toLowerCase().trim();
    if (seenTitles.has(key)) return false;
    seenTitles.add(key);
    return true;
  });
}

async function fetchCommunityEvents(): Promise<MeetupEvent[]> {
  try {
    const { db } = await import("@/lib/db");
    const events = await db.event.findMany({
      where: {
        status: "PUBLISHED",
        startsAt: { gte: new Date() },
      },
      include: {
        creator: { include: { profile: true } },
      },
      orderBy: { startsAt: "asc" },
      take: 50,
    });

    return events.map((e) => ({
      id: `community-${e.id}`,
      title: e.title,
      dateTime: e.startsAt.toISOString(),
      eventUrl: "",
      groupName: (e as any).creator?.profile?.displayName || "Chosn Member",
      venueName: e.locationAddress || null,
      venueCity: e.locationCity || null,
      venueState: null,
      imageUrl: null,
      description: e.description?.substring(0, 200) || null,
      tag: getEventTag(e.title, e.description, ""),
      source: "community" as const,
    }));
  } catch {
    return [];
  }
}

function mergeEvents(scraped: MeetupEvent[], community: MeetupEvent[]): MeetupEvent[] {
  const all = [...scraped, ...community];
  all.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
  return all;
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
      // Still fetch fresh community events from DB
      const communityEvents = await fetchCommunityEvents();
      return NextResponse.json({ events: mergeEvents(cached.events, communityEvents) });
    }

    // Scrape Meetup + Lu.ma in parallel
    const [meetupEvents, lumaEvents, raEvents, ebEvents, communityEvents] = await Promise.all([
      scrapeMeetupEvents(latNum, lngNum),
      scrapeLumaEvents(latNum, lngNum),
      scrapeRAEvents(latNum, lngNum),
      scrapeEventbriteEvents(latNum, lngNum),
      fetchCommunityEvents(),
    ]);

    const scrapedEvents = deduplicateEvents([...meetupEvents, ...lumaEvents, ...raEvents, ...ebEvents]);
    eventsCache.set(cacheKey, { events: scrapedEvents, expiry: Date.now() + CACHE_TTL });

    return NextResponse.json({ events: mergeEvents(scrapedEvents, communityEvents) });
  } catch (error) {
    console.error("Events API error:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}
