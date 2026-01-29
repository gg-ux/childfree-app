import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const sessionToken = request.cookies.get("admin_session")?.value;
  if (!sessionToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { db } = await import("@/lib/db");

  const session = await db.adminSession.findUnique({
    where: { token: sessionToken },
  });
  if (!session || new Date() > session.expiresAt) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get("days") || "7");
  const since = new Date(Date.now() - days * 86400000);

  const [uniqueVisitors, recentVisits, totalViews, adminPageViews] = await Promise.all([
    db.pageVisit.findMany({
      where: { createdAt: { gte: since }, isAdmin: false },
      distinct: ["ip"],
      select: { ip: true },
    }),
    db.pageVisit.findMany({
      where: { createdAt: { gte: since } },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    db.pageVisit.count({
      where: { createdAt: { gte: since } },
    }),
    db.pageVisit.count({
      where: { createdAt: { gte: since }, isAdmin: true },
    }),
  ]);

  return NextResponse.json({
    uniqueVisitorCount: uniqueVisitors.length,
    totalPageViews: totalViews,
    adminPageViews,
    recentVisits: recentVisits.map((v: { id: string; ip: string; path: string; isAdmin: boolean; city: string | null; country: string | null; referrer: string | null; createdAt: Date }) => ({
      id: v.id,
      ip: v.ip,
      path: v.path,
      isAdmin: v.isAdmin,
      city: v.city,
      country: v.country,
      referrer: v.referrer,
      createdAt: v.createdAt.toISOString(),
    })),
  });
}
