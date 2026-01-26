import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Vercel provides these headers automatically
  const city = request.headers.get("x-vercel-ip-city") || null;
  const region = request.headers.get("x-vercel-ip-country-region") || null;
  const country = request.headers.get("x-vercel-ip-country") || null;

  // Decode URL-encoded city names (e.g., "Los%20Angeles" -> "Los Angeles")
  const decodedCity = city ? decodeURIComponent(city) : null;

  return NextResponse.json({
    city: decodedCity,
    region,
    country,
  });
}
