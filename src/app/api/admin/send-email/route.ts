import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

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

export async function POST(request: NextRequest) {
  try {
    const { db } = await import("@/lib/db");
    const resend = new Resend(process.env.RESEND_API_KEY);

    const adminEmail = await checkAdminAuth(request);
    if (!adminEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No entries selected" }, { status: 400 });
    }

    // Get entries to send to
    const entries = await db.waitlistEntry.findMany({
      where: { id: { in: ids } },
    });

    let sent = 0;
    let failed = 0;

    for (const entry of entries) {
      try {
        await resend.emails.send({
          from: "Chosn <hello@chosn.co>",
          to: entry.email,
          subject: "Chosn is ready for you!",
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <h1 style="color: #2F7255; font-size: 28px; margin-bottom: 24px;">You're invited to Chosn!</h1>
              <p style="color: #3d3d3d; font-size: 16px; line-height: 1.6;">
                Thanks for your patience! Chosn is now ready, and as a waitlist member, you're among the first to join.
              </p>
              <p style="color: #3d3d3d; font-size: 16px; line-height: 1.6;">
                Chosn is the community for childfree adults looking for meaningful connections — whether that's friendships, dating, or simply finding others who get it.
              </p>
              <div style="margin: 32px 0;">
                <a href="https://chosn.co" style="display: inline-block; background-color: #2F7255; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 500;">
                  Join Chosn
                </a>
              </div>
              <p style="color: #3d3d3d; font-size: 16px; line-height: 1.6;">
                We can't wait to see you there!
              </p>
              <p style="color: #6b6b6b; font-size: 14px; margin-top: 40px;">
                — The Chosn Team
              </p>
            </div>
          `,
        });

        await db.waitlistEntry.update({
          where: { id: entry.id },
          data: { emailSent: true, emailSentAt: new Date() },
        });

        sent++;
      } catch (err) {
        console.error(`Failed to send to ${entry.email}:`, err);
        failed++;
      }
    }

    return NextResponse.json({
      message: `Sent ${sent} email${sent !== 1 ? "s" : ""}${failed > 0 ? `, ${failed} failed` : ""}`,
      sent,
      failed,
    });
  } catch (error) {
    console.error("Admin send error:", error);
    return NextResponse.json(
      { error: "Failed to send emails" },
      { status: 500 }
    );
  }
}
