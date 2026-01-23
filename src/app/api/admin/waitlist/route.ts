import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function checkAdminAuth(request: NextRequest) {
  const { db } = await import("@/lib/db");
  const sessionToken = request.cookies.get("admin_session")?.value;

  if (!sessionToken) return null;

  const session = await db.adminSession.findUnique({
    where: { token: sessionToken },
  });

  if (!session || new Date() > session.expiresAt) return null;

  return session.email;
}

export async function GET(request: NextRequest) {
  try {
    const { db } = await import("@/lib/db");

    const adminEmail = await checkAdminAuth(request);
    if (!adminEmail) {
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

export async function DELETE(request: NextRequest) {
  try {
    const { db } = await import("@/lib/db");

    const adminEmail = await checkAdminAuth(request);
    if (!adminEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No entries selected" }, { status: 400 });
    }

    await db.waitlistEntry.deleteMany({
      where: { id: { in: ids } },
    });

    return NextResponse.json({ message: `Deleted ${ids.length} entry${ids.length !== 1 ? "ies" : ""}` });
  } catch (error) {
    console.error("Admin waitlist delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete entries" },
      { status: 500 }
    );
  }
}
