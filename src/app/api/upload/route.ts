import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { uploadToR2 } from "@/lib/r2";
import { v4 as uuidv4 } from "uuid";

export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];

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
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const position = formData.get("position") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: JPG, PNG, WebP, HEIC" },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB" },
        { status: 400 }
      );
    }

    // Convert to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Process with Sharp - convert to WebP and resize
    const processedImage = await sharp(buffer)
      .resize(1200, 1600, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 85 })
      .toBuffer();

    // Generate unique filename
    const filename = `${user.id}/${uuidv4()}.webp`;

    // Upload to R2
    const url = await uploadToR2(filename, processedImage, "image/webp");

    // Save photo to database
    const { db } = await import("@/lib/db");

    // Get user's profile
    const profile = await db.profile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 400 });
    }

    // Create photo record
    const photo = await db.photo.create({
      data: {
        profileId: profile.id,
        url,
        position: position ? parseInt(position, 10) : 0,
      },
    });

    return NextResponse.json({
      success: true,
      photo: {
        id: photo.id,
        url: photo.url,
        position: photo.position,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to upload photo", details: errorMessage },
      { status: 500 }
    );
  }
}
