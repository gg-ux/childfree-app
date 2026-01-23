import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  // Check authentication
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("admin_session")?.value;

  if (!sessionToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { db } = await import("@/lib/db");

    // Reset all entries to emailSent: false
    const result = await db.waitlistEntry.updateMany({
      data: { emailSent: false, emailSentAt: null },
    });

    return NextResponse.json({
      message: `Reset ${result.count} entries to not invited`,
      count: result.count,
    });
  } catch (error) {
    console.error("Reset invited error:", error);
    return NextResponse.json(
      { error: "Failed to reset entries" },
      { status: 500 }
    );
  }
}
