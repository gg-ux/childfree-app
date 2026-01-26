import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

interface PinterestBoard {
  id: string;
  name: string;
  description: string;
  privacy: "PUBLIC" | "PROTECTED" | "SECRET";
  pin_count: number;
  media?: {
    image_cover_url?: string;
  };
}

interface PinterestBoardsResponse {
  items: PinterestBoard[];
  bookmark?: string;
}

export async function GET() {
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
      { error: "Pinterest not connected" },
      { status: 401 }
    );
  }

  try {
    // Fetch all boards (paginated if needed)
    let allBoards: PinterestBoard[] = [];
    let bookmark: string | undefined;

    do {
      const url = new URL("https://api.pinterest.com/v5/boards");
      url.searchParams.set("page_size", "100");
      if (bookmark) {
        url.searchParams.set("bookmark", bookmark);
      }

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          return NextResponse.json(
            { error: "Pinterest token expired", needsReauth: true },
            { status: 401 }
          );
        }
        throw new Error(`Pinterest API error: ${response.status}`);
      }

      const data: PinterestBoardsResponse = await response.json();
      allBoards = [...allBoards, ...data.items];
      bookmark = data.bookmark;
    } while (bookmark);

    // Transform to simpler format
    const boards = allBoards.map((board) => ({
      id: board.id,
      name: board.name,
      description: board.description,
      privacy: board.privacy,
      pinCount: board.pin_count,
      coverImage: board.media?.image_cover_url,
    }));

    return NextResponse.json({ boards });
  } catch (error) {
    console.error("Pinterest boards fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch boards" },
      { status: 500 }
    );
  }
}
