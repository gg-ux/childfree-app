import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function getAuthUser(request: NextRequest) {
  const { db } = await import("@/lib/db");
  const sessionToken = request.cookies.get("user_session")?.value;
  if (!sessionToken) return null;

  const session = await db.userSession.findUnique({
    where: { token: sessionToken },
    include: { user: { include: { profile: true } } },
  });

  if (!session || new Date() > session.expiresAt) return null;
  return session.user;
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser(request);
    if (!user?.profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { db } = await import("@/lib/db");
    const { promptType, answer } = await request.json();

    const existing = await db.prompt.findUnique({ where: { id } });
    if (!existing || existing.profileId !== user.profile.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await db.prompt.update({
      where: { id },
      data: {
        ...(promptType && { promptType }),
        ...(answer && { answer: answer.trim() }),
      },
    });

    return NextResponse.json({ prompt: updated });
  } catch (error) {
    console.error("Prompt PATCH error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
