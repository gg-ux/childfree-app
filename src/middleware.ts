import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(self)"
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );

  // Rate limiting for API routes (simple in-memory, per-IP)
  if (request.nextUrl.pathname.startsWith("/api/")) {
    // Skip CORS check for OAuth callback redirects
    const isOAuthCallback = request.nextUrl.pathname.startsWith("/api/auth/google/callback");
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");

    // Block requests from unexpected origins (basic CORS)
    if (origin && !isOAuthCallback) {
      const allowedOrigins = [
        `https://${host}`,
        `http://${host}`,
        "https://www.chosn.co",
        "https://chosn.co",
      ];
      if (process.env.NODE_ENV === "development") {
        allowedOrigins.push("http://localhost:3000");
      }
      if (!allowedOrigins.includes(origin)) {
        return new NextResponse("Forbidden", { status: 403 });
      }
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      response.headers.set("Access-Control-Allow-Headers", "Content-Type");
    }
  }

  // Fire-and-forget page visit logging (skip API, static, and asset paths)
  const pathname = request.nextUrl.pathname;
  if (
    !pathname.startsWith("/api/") &&
    !pathname.startsWith("/_next/") &&
    !pathname.includes(".")
  ) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    // Skip localhost in production
    if (ip === "::1" || ip === "127.0.0.1") return response;

    const isAdmin = !!request.cookies.get("admin_session")?.value;
    const cityRaw = request.headers.get("x-vercel-ip-city");
    const city = cityRaw ? decodeURIComponent(cityRaw) : null;
    const country = request.headers.get("x-vercel-ip-country") || null;
    const referrer = request.headers.get("referer") || null;
    const origin = request.nextUrl.origin;

    fetch(`${origin}/api/internal/log-visit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-secret": process.env.INTERNAL_API_SECRET || "",
      },
      body: JSON.stringify({ ip, path: pathname, isAdmin, city, country, referrer }),
    }).catch(() => {});
  }

  return response;
}

export const config = {
  matcher: [
    // Match all paths except static files and _next
    "/((?!_next/static|_next/image|favicon.ico|assets/|api/og).*)",
  ],
};
