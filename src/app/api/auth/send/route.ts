import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { randomBytes } from "crypto";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const { allowed } = rateLimit(`auth-send:${ip}`, { limit: 3, windowSeconds: 60 });
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

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
      from: "Chosn <hello@chosn.co>",
      to: email,
      subject: "Your magic link to Chosn",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #ffffff;">
          <h1 style="color: #2F7255; font-size: 28px; margin-bottom: 8px; font-weight: 600;">Sign in to Chosn</h1>
          <p style="color: #6b6b6b; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">
            Click the button below to securely sign in. No password needed.
          </p>
          <div style="margin: 32px 0;">
            <a href="${verifyUrl}" style="display: inline-block; background-color: #2F7255; color: white; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 16px;">
              Sign in to Chosn →
            </a>
          </div>
          <p style="color: #9a9a9a; font-size: 14px; line-height: 1.6; margin-top: 32px;">
            This link expires in 15 minutes and can only be used once.
          </p>
          <p style="color: #9a9a9a; font-size: 14px; line-height: 1.6;">
            If you didn't request this email, you can safely ignore it.
          </p>
          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 40px 0 24px;" />
          <p style="color: #9a9a9a; font-size: 13px;">
            Chosn — The community for childfree adults
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
