interface EventbriteEvent {
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
  source: "eventbrite";
}

const TAG_RULES: { tag: string; pattern: RegExp }[] = [
  { tag: "Childfree", pattern: new RegExp("childfree|child-free|child free|no kids|dink\\b", "i") },
  { tag: "Food & Drink", pattern: new RegExp("wine|beer|cocktail|happy hour|brunch|dinner|food|tasting|restaurant|bar crawl|cooking", "i") },
  { tag: "Outdoors", pattern: new RegExp("hik(e|ing)|trail|outdoor|camping|beach|kayak|nature|walk\\b", "i") },
  { tag: "Games", pattern: new RegExp("game night|board game|trivia|bingo|bunko|puzzle", "i") },
  { tag: "Fitness", pattern: new RegExp("yoga|gym|fitness|run\\b|running|cycling|workout|pilates|CrossFit", "i") },
  { tag: "Music", pattern: new RegExp("live music|concert|karaoke|jazz|jam session", "i") },
  { tag: "Arts", pattern: new RegExp("art walk|gallery|museum|paint|pottery|craft|theater|theatre|comedy", "i") },
  { tag: "Dance", pattern: new RegExp("danc(e|ing)|salsa|bachata|line danc", "i") },
  { tag: "Singles", pattern: new RegExp("singles|speed dating|singles mixer|singles night|match.?making|single professionals", "i") },
  { tag: "Social", pattern: new RegExp("meetup|social|mixer|networking|hangout|get.together", "i") },
  { tag: "Books", pattern: new RegExp("book club|reading|literary|author", "i") },
  { tag: "Travel", pattern: new RegExp("travel|adventure|road trip|explore", "i") },
];

function getEventTag(title: string, description: string | null): string | null {
  const text = `${title} ${description || ""}`;
  for (const rule of TAG_RULES) {
    if (rule.pattern.test(text)) return rule.tag;
  }
  return null;
}

// Map lat/lng to Eventbrite location slugs
const EB_CITIES: { slug: string; lat: number; lng: number }[] = [
  { slug: "ca--los-angeles", lat: 34.05, lng: -118.24 },
  { slug: "ny--new-york", lat: 40.71, lng: -74.01 },
  { slug: "ca--san-francisco", lat: 37.77, lng: -122.42 },
  { slug: "il--chicago", lat: 41.88, lng: -87.63 },
  { slug: "tx--austin", lat: 30.27, lng: -97.74 },
  { slug: "wa--seattle", lat: 47.61, lng: -122.33 },
  { slug: "fl--miami", lat: 25.76, lng: -80.19 },
  { slug: "ma--boston", lat: 42.36, lng: -71.06 },
  { slug: "co--denver", lat: 39.74, lng: -104.99 },
  { slug: "or--portland", lat: 45.52, lng: -122.68 },
  { slug: "dc--washington", lat: 38.91, lng: -77.04 },
  { slug: "ga--atlanta", lat: 33.75, lng: -84.39 },
  { slug: "ca--san-diego", lat: 32.72, lng: -117.16 },
  { slug: "tx--dallas", lat: 32.78, lng: -96.80 },
  { slug: "tn--nashville", lat: 36.16, lng: -86.78 },
  { slug: "tx--houston", lat: 29.76, lng: -95.37 },
];

function getNearestCity(lat: number, lng: number): string | null {
  let closest: (typeof EB_CITIES)[0] | null = null;
  let minDist = Infinity;

  for (const city of EB_CITIES) {
    const d = Math.sqrt(Math.pow(lat - city.lat, 2) + Math.pow(lng - city.lng, 2));
    if (d < minDist) {
      minDist = d;
      closest = city;
    }
  }

  if (!closest || minDist > 1.5) return null;
  return closest.slug;
}

const SEARCH_KEYWORDS = ["happy-hour", "social", "hiking", "game-night", "comedy", "live-music"];

const ebCache = new Map<string, { events: EventbriteEvent[]; expiry: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export async function scrapeEventbriteEvents(lat: number, lng: number): Promise<EventbriteEvent[]> {
  const citySlug = getNearestCity(lat, lng);
  if (!citySlug) return [];

  const cached = ebCache.get(citySlug);
  if (cached && cached.expiry > Date.now()) return cached.events;

  const seenIds = new Set<string>();
  const allEvents: EventbriteEvent[] = [];

  // Fetch a few keyword pages in parallel
  const results = await Promise.all(
    SEARCH_KEYWORDS.map(async (keyword) => {
      try {
        const url = `https://www.eventbrite.com/d/${citySlug}/${keyword}/`;
        const res = await fetch(url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          },
        });

        if (!res.ok) return [];

        const html = await res.text();
        const match = html.match(/window\.__SERVER_DATA__\s*=\s*(\{[\s\S]*?\});\s*<\/script>/);
        if (!match) return [];

        const serverData = JSON.parse(match[1]);
        const results = serverData?.search_data?.events?.results || [];
        const events: EventbriteEvent[] = [];

        for (const item of results) {
          if (!item.name || !item.start_date) continue;

          const dateTime = item.start_time
            ? `${item.start_date}T${item.start_time}`
            : item.start_date;

          const venue = item.primary_venue;

          events.push({
            id: `eb-${item.id || item.eid}`,
            title: item.name,
            dateTime,
            eventUrl: item.url || "",
            groupName: item.primary_organizer?.name || "Eventbrite",
            venueName: venue?.name || null,
            venueCity: venue?.address?.city || null,
            venueState: venue?.address?.region || null,
            imageUrl: item.image?.url || null,
            description: item.summary || null,
            tag: getEventTag(item.name, item.summary || null),
            source: "eventbrite",
          });
        }

        return events;
      } catch {
        return [];
      }
    })
  );

  for (const events of results) {
    for (const event of events) {
      if (seenIds.has(event.id)) continue;
      seenIds.add(event.id);
      allEvents.push(event);
    }
  }

  allEvents.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
  ebCache.set(citySlug, { events: allEvents, expiry: Date.now() + CACHE_TTL });
  return allEvents;
}
