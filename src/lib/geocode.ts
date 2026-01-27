const geocodeCache = new Map<string, { lat: number; lng: number; city: string; expiry: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export async function geocodeZip(zip: string): Promise<{ lat: number; lng: number; city: string } | null> {
  const cached = geocodeCache.get(zip);
  if (cached && cached.expiry > Date.now()) {
    return { lat: cached.lat, lng: cached.lng, city: cached.city };
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(zip)}&country=US&format=json&limit=1`,
      { headers: { "User-Agent": "Chosn/1.0 (hello@chosn.co)" } }
    );

    if (!res.ok) return null;

    const data = await res.json();
    if (!data.length) return null;

    const { lat, lon, display_name } = data[0];
    const city = display_name.split(",")[0].trim();
    const result = { lat: parseFloat(lat), lng: parseFloat(lon), city };

    geocodeCache.set(zip, { ...result, expiry: Date.now() + CACHE_TTL });
    return result;
  } catch {
    return null;
  }
}
