interface RAEvent {
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
  source: "ra";
}

// RA uses area IDs for their listings pages
const RA_AREAS: { id: number; lat: number; lng: number; name: string; slug: string }[] = [
  { id: 308, lat: 34.05, lng: -118.24, name: "Los Angeles", slug: "us/losangeles" },
  { id: 8, lat: 40.71, lng: -74.01, name: "New York", slug: "us/newyork" },
  { id: 218, lat: 37.77, lng: -122.42, name: "San Francisco", slug: "us/sanfrancisco" },
  { id: 359, lat: 41.88, lng: -87.63, name: "Chicago", slug: "us/chicago" },
  { id: 317, lat: 25.76, lng: -80.19, name: "Miami", slug: "us/miami" },
  { id: 411, lat: 47.61, lng: -122.33, name: "Seattle", slug: "us/seattle" },
  { id: 321, lat: 30.27, lng: -97.74, name: "Austin", slug: "us/austin" },
  { id: 82, lat: 39.74, lng: -104.99, name: "Denver", slug: "us/denver" },
  { id: 22, lat: 38.91, lng: -77.04, name: "Washington DC", slug: "us/washington" },
  { id: 79, lat: 42.36, lng: -71.06, name: "Boston", slug: "us/boston" },
  { id: 64, lat: 33.75, lng: -84.39, name: "Atlanta", slug: "us/atlanta" },
  { id: 410, lat: 45.52, lng: -122.68, name: "Portland", slug: "us/portland" },
  { id: 72, lat: 36.16, lng: -86.78, name: "Nashville", slug: "us/nashville" },
  { id: 309, lat: 32.72, lng: -117.16, name: "San Diego", slug: "us/sandiego" },
  { id: 319, lat: 32.78, lng: -96.80, name: "Dallas", slug: "us/dallas" },
  { id: 318, lat: 29.76, lng: -95.37, name: "Houston", slug: "us/houston" },
  { id: 65, lat: 29.95, lng: -90.07, name: "New Orleans", slug: "us/neworleans" },
  { id: 47, lat: 36.17, lng: -115.14, name: "Las Vegas", slug: "us/lasvegas" },
  { id: 81, lat: 44.98, lng: -93.27, name: "Minneapolis", slug: "us/minneapolis" },
  { id: 360, lat: 42.33, lng: -83.05, name: "Detroit", slug: "us/detroit" },
  { id: 102, lat: 33.45, lng: -112.07, name: "Phoenix", slug: "us/phoenix" },
  { id: 316, lat: 27.95, lng: -82.46, name: "Tampa", slug: "us/tampa" },
  { id: 315, lat: 28.54, lng: -81.38, name: "Orlando", slug: "us/orlando" },
];

function getNearestArea(lat: number, lng: number): (typeof RA_AREAS)[0] | null {
  let closest: (typeof RA_AREAS)[0] | null = null;
  let minDist = Infinity;

  for (const area of RA_AREAS) {
    const d = Math.sqrt(Math.pow(lat - area.lat, 2) + Math.pow(lng - area.lng, 2));
    if (d < minDist) {
      minDist = d;
      closest = area;
    }
  }

  if (!closest || minDist > 1.5) return null;
  return closest;
}

const raCache = new Map<string, { events: RAEvent[]; expiry: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export async function scrapeRAEvents(lat: number, lng: number): Promise<RAEvent[]> {
  const area = getNearestArea(lat, lng);
  if (!area) return [];

  const cached = raCache.get(area.slug);
  if (cached && cached.expiry > Date.now()) return cached.events;

  try {
    // RA has a GraphQL API used by their frontend
    const res = await fetch("https://ra.co/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": `https://ra.co/events/${area.slug}`,
      },
      body: JSON.stringify({
        operationName: "GET_DEFAULT_EVENTS_LISTING",
        variables: {
          filters: {
            areas: { eq: area.id },
            listingDate: {
              gte: new Date().toISOString().split("T")[0],
              lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            },
          },
          pageSize: 20,
          page: 1,
        },
        query: `query GET_DEFAULT_EVENTS_LISTING($filters: FilterInputDtoInput, $pageSize: Int, $page: Int) {
          eventListings(filters: $filters, pageSize: $pageSize, page: $page) {
            data {
              id
              listingDate
              event {
                id
                title
                date
                startTime
                endTime
                contentUrl
                flyerFront
                images {
                  filename
                }
                venue {
                  name
                  address
                  area {
                    name
                  }
                }
                artists {
                  name
                }
              }
            }
            totalResults
          }
        }`,
      }),
    });

    if (!res.ok) return [];

    const json = await res.json();
    const listings = json?.data?.eventListings?.data || [];
    const events: RAEvent[] = [];

    for (const listing of listings) {
      const event = listing.event;
      if (!event?.title || !event.date) continue;

      // startTime is a full ISO string like "2026-01-27T21:00:00.000"
      const dateTime = event.startTime || event.date || listing.listingDate;

      const artists = event.artists?.map((a: { name: string }) => a.name).join(", ") || null;

      // Parse city/state from address like "1192 Folsom St, San Francisco, CA 94103"
      const addrParts = (event.venue?.address || "").split(",").map((s: string) => s.trim());
      let venueCity: string | null = null;
      let venueState: string | null = null;
      if (addrParts.length >= 3) {
        venueCity = addrParts[addrParts.length - 2]; // "San Francisco"
        const stateZip = addrParts[addrParts.length - 1]; // "CA 94103"
        venueState = stateZip.split(" ")[0] || null; // "CA"
      }

      events.push({
        id: `ra-${event.id}`,
        title: event.title,
        dateTime,
        eventUrl: event.contentUrl ? `https://ra.co${event.contentUrl}` : "",
        groupName: artists || "Resident Advisor",
        venueName: event.venue?.name || null,
        venueCity: venueCity || event.venue?.area?.name || area.name,
        venueState,
        imageUrl: event.flyerFront || event.images?.[0]?.filename || null,
        description: artists ? `Featuring ${artists}` : null,
        tag: "Music",
        source: "ra",
      });
    }

    raCache.set(area.slug, { events, expiry: Date.now() + CACHE_TTL });
    return events;
  } catch {
    return [];
  }
}
