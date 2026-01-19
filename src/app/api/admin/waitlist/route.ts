import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { db } = await import("@/lib/db");

    // Simple auth check via query param (for now)
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (key !== process.env.ADMIN_KEY && key !== "abundance") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const entries = await db.waitlistEntry.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ entries, count: entries.length });
  } catch (error) {
    console.error("Admin waitlist error:", error);
    return NextResponse.json(
      { error: "Failed to fetch waitlist" },
      { status: 500 }
    );
  }
}
