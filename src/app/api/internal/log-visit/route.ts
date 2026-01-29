import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const secret = request.headers.get("x-internal-secret");
  if (secret !== process.env.INTERNAL_API_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { ip, path, isAdmin, city, country, referrer } = await request.json();
    const { db } = await import("@/lib/db");

    await db.pageVisit.create({
      data: { ip, path, isAdmin: !!isAdmin, city: city || null, country: country || null, referrer: referrer || null },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("log-visit error:", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
