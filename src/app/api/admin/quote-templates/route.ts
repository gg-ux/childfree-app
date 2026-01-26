import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Force dynamic to avoid build-time initialization
export const dynamic = "force-dynamic";

// GET - Load all saved templates
export async function GET() {
  // Check authentication
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("admin_session")?.value;

  if (!sessionToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { db } = await import("@/lib/db");
    const templates = await db.savedQuoteTemplate.findMany({
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ templates });
  } catch (error) {
    console.error("Failed to load templates:", error);
    return NextResponse.json(
      { error: "Failed to load templates" },
      { status: 500 }
    );
  }
}

// POST - Save a new template
export async function POST(request: Request) {
  // Check authentication
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("admin_session")?.value;

  if (!sessionToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { db } = await import("@/lib/db");
    const body = await request.json();
    const { name, bg, text, accent, accent2, layout, elements } = body;

    const template = await db.savedQuoteTemplate.create({
      data: {
        name: name || "Saved Template",
        bg,
        text,
        accent,
        accent2,
        layout,
        elements: elements || null,
      },
    });

    return NextResponse.json({ template });
  } catch (error) {
    console.error("Failed to save template:", error);
    return NextResponse.json(
      { error: "Failed to save template" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a template
export async function DELETE(request: Request) {
  // Check authentication
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("admin_session")?.value;

  if (!sessionToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { db } = await import("@/lib/db");
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Template ID required" }, { status: 400 });
    }

    await db.savedQuoteTemplate.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete template:", error);
    return NextResponse.json(
      { error: "Failed to delete template" },
      { status: 500 }
    );
  }
}
