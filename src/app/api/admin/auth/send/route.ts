import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import crypto from "crypto";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const ALLOWED_ADMIN_EMAILS = ["graceguo.design@gmail.com"];

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const { allowed } = rateLimit(`admin-auth:${ip}`, { limit: 3, windowSeconds: 60 });
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const { db } = await import("@/lib/db");
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { email } = await request.json();

    if (!email || !ALLOWED_ADMIN_EMAILS.includes(email.toLowerCase())) {
      // Don't reveal if email is invalid vs not allowed
      return NextResponse.json(
        { message: "If this email is registered, you'll receive a login link." },
        { status: 200 }
      );
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Save token
    await db.adminToken.create({
      data: {
        email: email.toLowerCase(),
        token,
        expiresAt,
      },
    });

    // Get base URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ||
      (request.headers.get("host")?.includes("localhost")
        ? `http://${request.headers.get("host")}`
        : `https://${request.headers.get("host")}`);

    const loginUrl = `${baseUrl}/admin/verify?token=${token}`;

    // Send email
    await resend.emails.send({
      from: "Chosn <hello@chosn.co>",
      to: email,
      subject: "Your Chosn Admin Login Link",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="color: #2F7255; font-size: 24px; margin-bottom: 24px;">Admin Login</h1>
          <p style="color: #3d3d3d; font-size: 16px; line-height: 1.6;">
            Click the button below to log in to your Chosn admin dashboard.
          </p>
          <a href="${loginUrl}" style="display: inline-block; background: #2F7255; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin: 24px 0; font-weight: 500;">
            Log in to Admin
          </a>
          <p style="color: #6b6b6b; font-size: 14px; margin-top: 24px;">
            This link expires in 15 minutes. If you didn't request this, you can ignore this email.
          </p>
        </div>
      `,
    });

    return NextResponse.json({
      message: "If this email is registered, you'll receive a login link.",
    });
  } catch (error) {
    console.error("Admin auth send error:", error);
    return NextResponse.json(
      { error: "Failed to send login link" },
      { status: 500 }
    );
  }
}
