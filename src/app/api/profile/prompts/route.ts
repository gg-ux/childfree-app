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

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user?.profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { db } = await import("@/lib/db");
    const { promptType, answer, position } = await request.json();

    if (!promptType || !answer?.trim()) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Max 3 prompts
    const count = await db.prompt.count({ where: { profileId: user.profile.id } });
    if (count >= 3) {
      return NextResponse.json({ error: "Maximum 3 prompts allowed" }, { status: 400 });
    }

    const prompt = await db.prompt.create({
      data: {
        profileId: user.profile.id,
        promptType,
        answer: answer.trim(),
        position: position ?? count,
      },
    });

    return NextResponse.json({ prompt });
  } catch (error) {
    console.error("Prompt POST error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
