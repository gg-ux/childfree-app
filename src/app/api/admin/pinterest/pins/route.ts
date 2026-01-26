import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

interface CreatePinRequest {
  boardId: string;
  title?: string;
  description?: string;
  link?: string;
  altText?: string;
  imageBase64: string; // Base64 encoded image (without data URL prefix)
}

interface PinterestPinResponse {
  id: string;
  link: string;
  title: string;
  description: string;
  created_at: string;
  board_id: string;
  media: {
    media_type: string;
    images?: Record<string, { url: string; width: number; height: number }>;
  };
}

export async function POST(request: Request) {
  const cookieStore = await cookies();

  // Check admin authentication
  const sessionToken = cookieStore.get("admin_session")?.value;
  if (!sessionToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check for direct access token from env (preferred) or cookie
  const accessToken = process.env.PINTEREST_ACCESS_TOKEN || cookieStore.get("pinterest_access_token")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { error: "Pinterest not connected", needsReauth: true },
      { status: 401 }
    );
  }

  try {
    const body: CreatePinRequest = await request.json();

    if (!body.boardId) {
      return NextResponse.json(
        { error: "Board ID is required" },
        { status: 400 }
      );
    }

    if (!body.imageBase64) {
      return NextResponse.json(
        { error: "Image is required" },
        { status: 400 }
      );
    }

    // Build the Pinterest API request
    const pinData: Record<string, unknown> = {
      board_id: body.boardId,
      media_source: {
        source_type: "image_base64",
        content_type: "image/png",
        data: body.imageBase64,
      },
    };

    if (body.title) {
      pinData.title = body.title.substring(0, 100); // Max 100 chars
    }

    if (body.description) {
      pinData.description = body.description.substring(0, 800); // Max 800 chars
    }

    if (body.link) {
      pinData.link = body.link.substring(0, 2048); // Max 2048 chars
    }

    if (body.altText) {
      pinData.alt_text = body.altText.substring(0, 500); // Max 500 chars
    }

    // Create the pin
    const response = await fetch("https://api.pinterest.com/v5/pins", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pinData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Pinterest create pin error:", response.status, errorData);

      if (response.status === 401) {
        return NextResponse.json(
          { error: "Pinterest token expired", needsReauth: true },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { error: errorData.message || "Failed to create pin" },
        { status: response.status }
      );
    }

    const pin: PinterestPinResponse = await response.json();

    return NextResponse.json({
      success: true,
      pin: {
        id: pin.id,
        title: pin.title,
        link: pin.link,
        createdAt: pin.created_at,
      },
    });
  } catch (error) {
    console.error("Pinterest create pin error:", error);
    return NextResponse.json(
      { error: "Failed to create pin" },
      { status: 500 }
    );
  }
}
