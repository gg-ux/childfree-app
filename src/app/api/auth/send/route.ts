import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { randomBytes } from "crypto";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { db } = await import("@/lib/db");
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    // Generate token
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store token
    await db.userToken.create({
      data: {
        email: email.toLowerCase(),
        token,
        expiresAt,
      },
    });

    // Send email
    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/verify?token=${token}`;

    await resend.emails.send({
      from: "Flourish <onboarding@resend.dev>",
      to: email,
      subject: "Sign in to Flourish",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="color: #2F7255; font-size: 28px; margin-bottom: 24px;">Welcome to Flourish!</h1>
          <p style="color: #3d3d3d; font-size: 16px; line-height: 1.6;">
            Click the button below to sign in and join the childfree community.
          </p>
          <div style="margin: 32px 0;">
            <a href="${verifyUrl}" style="display: inline-block; background-color: #2F7255; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 500;">
              Sign in to Flourish
            </a>
          </div>
          <p style="color: #6b6b6b; font-size: 14px;">
            This link expires in 15 minutes. If you didn't request this, you can safely ignore this email.
          </p>
          <p style="color: #6b6b6b; font-size: 14px; margin-top: 40px;">
            — The Flourish Team
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Auth send error:", error);
    return NextResponse.json(
      { error: "Failed to send login link" },
      { status: 500 }
    );
  }
}
