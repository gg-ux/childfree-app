interface LumaEvent {
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
  source: "luma";
}

// Map lat/lng to nearest Lu.ma city slug
const LUMA_CITIES: { slug: string; lat: number; lng: number; name: string }[] = [
  { slug: "sf", lat: 37.77, lng: -122.42, name: "San Francisco" },
  { slug: "nyc", lat: 40.71, lng: -74.01, name: "New York" },
  { slug: "la", lat: 34.05, lng: -118.24, name: "Los Angeles" },
  { slug: "chicago", lat: 41.88, lng: -87.63, name: "Chicago" },
  { slug: "austin", lat: 30.27, lng: -97.74, name: "Austin" },
  { slug: "seattle", lat: 47.61, lng: -122.33, name: "Seattle" },
  { slug: "miami", lat: 25.76, lng: -80.19, name: "Miami" },
  { slug: "boston", lat: 42.36, lng: -71.06, name: "Boston" },
  { slug: "denver", lat: 39.74, lng: -104.99, name: "Denver" },
  { slug: "portland", lat: 45.52, lng: -122.68, name: "Portland" },
  { slug: "dc", lat: 38.91, lng: -77.04, name: "Washington DC" },
  { slug: "atlanta", lat: 33.75, lng: -84.39, name: "Atlanta" },
  { slug: "san-diego", lat: 32.72, lng: -117.16, name: "San Diego" },
  { slug: "dallas", lat: 32.78, lng: -96.80, name: "Dallas" },
  { slug: "nashville", lat: 36.16, lng: -86.78, name: "Nashville" },
  { slug: "houston", lat: 29.76, lng: -95.37, name: "Houston" },
];

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

function getNearestCity(lat: number, lng: number): { slug: string; name: string } | null {
  let closest: (typeof LUMA_CITIES)[0] | null = null;
  let minDist = Infinity;

  for (const city of LUMA_CITIES) {
    const d = Math.sqrt(Math.pow(lat - city.lat, 2) + Math.pow(lng - city.lng, 2));
    if (d < minDist) {
      minDist = d;
      closest = city;
    }
  }

  // Only use if within ~100mi (~1.5 degrees)
  if (!closest || minDist > 1.5) return null;
  return { slug: closest.slug, name: closest.name };
}

// In-memory cache
const lumaCache = new Map<string, { events: LumaEvent[]; expiry: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export async function scrapeLumaEvents(lat: number, lng: number): Promise<LumaEvent[]> {
  const city = getNearestCity(lat, lng);
  if (!city) return [];

  const cached = lumaCache.get(city.slug);
  if (cached && cached.expiry > Date.now()) return cached.events;

  try {
    const res = await fetch(`https://luma.com/${city.slug}?k=p`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    if (!res.ok) return [];

    const html = await res.text();
    const scriptMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
    if (!scriptMatch) return [];

    const nextData = JSON.parse(scriptMatch[1]);
    const initialData = nextData?.props?.pageProps?.initialData;
    if (!initialData) return [];

    // Data is nested under initialData.data
    const dataObj = initialData.data || initialData;
    const rawEvents = [
      ...(dataObj.events || []),
      ...(dataObj.featured_events || []),
    ];
    const events: LumaEvent[] = [];

    for (const item of rawEvents) {
      const event = item.event || item;
      if (!event.name || !event.start_at) continue;

      const slug = event.url || item.api_id || "";
      const geo = event.geo_address_info;

      // Use structured geo fields when available
      const vCity = geo?.city || null;
      const vState = geo?.region || null;
      const venueName = geo?.address || null;

      const calendarName = item.calendar?.name || "";
      const desc = item.calendar?.description_short || event.description_short || null;

      events.push({
        id: `luma-${event.api_id || slug}`,
        title: event.name,
        dateTime: event.start_at,
        eventUrl: slug ? `https://lu.ma/${slug}` : "",
        groupName: calendarName || "Lu.ma Event",
        venueName: venueName,
        venueCity: vCity || city.name,
        venueState: vState,
        imageUrl: event.cover_url || item.cover_image?.url || null,
        description: desc,
        tag: getEventTag(event.name, desc),
        source: "luma",
      });
    }

    lumaCache.set(city.slug, { events, expiry: Date.now() + CACHE_TTL });
    return events;
  } catch {
    return [];
  }
}
