import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Force dynamic - prevents static analysis at build time
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // Lazy import to avoid build-time initialization
    const { db } = await import("@/lib/db");
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { email, source } = await request.json();

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Check if already on waitlist
    const existing = await db.waitlistEntry.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      return NextResponse.json(
        { message: "You're already on the waitlist!" },
        { status: 200 }
      );
    }

    // Add to waitlist
    const entry = await db.waitlistEntry.create({
      data: {
        email: email.toLowerCase(),
        source: source || "website",
      },
    });

    // Send confirmation email
    await resend.emails.send({
      from: "Flourish <onboarding@resend.dev>",
      to: email,
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

    // Mark email as sent
    await db.waitlistEntry.update({
      where: { id: entry.id },
      data: { emailSent: true, emailSentAt: new Date() },
    });

    return NextResponse.json(
      { message: "You're on the list! Check your email for confirmation." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Waitlist error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
