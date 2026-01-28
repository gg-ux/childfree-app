import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function getAuthUser(request: NextRequest) {
  const { db } = await import("@/lib/db");
  const sessionToken = request.cookies.get("user_session")?.value;
  if (!sessionToken) return null;

  const session = await db.userSession.findUnique({
    where: { token: sessionToken },
    include: { user: true },
  });

  if (!session || new Date() > session.expiresAt) return null;
  return session.user;
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { db } = await import("@/lib/db");

    const favorites = await db.blogFavorite.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      slugs: favorites.map((f) => f.slug),
    });
  } catch (error) {
    console.error("Blog favorites GET error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { db } = await import("@/lib/db");
    const { slug } = await request.json();

    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    }

    // Toggle: delete if exists, create if not
    const existing = await db.blogFavorite.findUnique({
      where: { userId_slug: { userId: user.id, slug } },
    });

    if (existing) {
      await db.blogFavorite.delete({ where: { id: existing.id } });
      return NextResponse.json({ favorited: false });
    } else {
      await db.blogFavorite.create({
        data: { userId: user.id, slug },
      });
      return NextResponse.json({ favorited: true });
    }
  } catch (error) {
    console.error("Blog favorites POST error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
