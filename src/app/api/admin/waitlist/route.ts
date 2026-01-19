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
