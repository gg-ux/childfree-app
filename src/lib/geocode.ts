const geocodeCache = new Map<string, { lat: number; lng: number; city: string; expiry: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export async function geocodeLocation(input: string): Promise<{ lat: number; lng: number; city: string } | null> {
  const key = input.toLowerCase().trim();
  const cached = geocodeCache.get(key);
  if (cached && cached.expiry > Date.now()) {
    return { lat: cached.lat, lng: cached.lng, city: cached.city };
  }

  // Detect if input is a zip code (digits only, 5-10 chars)
  const isZip = /^\d{5}(-\d{4})?$/.test(input.trim());

  try {
    const url = isZip
      ? `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(input)}&country=US&format=json&limit=1`
      : `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(input)}&format=json&limit=1&addressdetails=1`;

    const res = await fetch(url, {
      headers: { "User-Agent": "Chosn/1.0 (hello@chosn.co)" },
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (!data.length) return null;

    const { lat, lon, display_name, address } = data[0];

    // Extract city name
    let city: string;
    if (address?.city) {
      city = address.city;
    } else if (address?.town) {
      city = address.town;
    } else if (address?.village) {
      city = address.village;
    } else {
      const parts = display_name.split(",").map((s: string) => s.trim());
      city = parts.find((p: string) =>
        !/^\d+$/.test(p) && !p.includes("County") && p !== "United States" && !p.includes("State")
      ) || parts[0];
    }

    const result = { lat: parseFloat(lat), lng: parseFloat(lon), city };
    geocodeCache.set(key, { ...result, expiry: Date.now() + CACHE_TTL });
    return result;
  } catch {
    return null;
  }
}

// Backwards-compatible alias
export const geocodeZip = geocodeLocation;
