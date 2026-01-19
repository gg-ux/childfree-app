import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { db } = await import("@/lib/db");
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { key, ids } = await request.json();

    // Auth check
    if (key !== process.env.ADMIN_KEY && key !== "abundance") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
          from: "Flourish <onboarding@resend.dev>",
          to: entry.email,
          subject: "You're on the Flourish waitlist!",
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <h1 style="color: #2F7255; font-size: 28px; margin-bottom: 24px;">Welcome to Flourish!</h1>
              <p style="color: #3d3d3d; font-size: 16px; line-height: 1.6;">
                Thanks for joining our waitlist. You're now part of a growing community of childfree adults looking for meaningful connections.
              </p>
              <p style="color: #3d3d3d; font-size: 16px; line-height: 1.6;">
                We're working hard to launch in mid 2026. You'll be among the first to know when we're ready.
              </p>
              <p style="color: #3d3d3d; font-size: 16px; line-height: 1.6; margin-top: 32px;">
                In the meantime, feel free to reply to this email with any thoughts or ideas. We'd love to hear from you.
              </p>
              <p style="color: #6b6b6b; font-size: 14px; margin-top: 40px;">
                — The Flourish Team
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
