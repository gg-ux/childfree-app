import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const title = searchParams.get("title") || "Chosn";
    const description = searchParams.get("description") || "";
    const author = searchParams.get("author") || "Chosn Team";
    const tags = (searchParams.get("tags") || "").split(",").filter(Boolean);

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 60,
            backgroundColor: "white",
            fontFamily: "sans-serif",
          }}
        >
          <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
            {tags.map((tag, i) => (
              <div
                key={i}
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#2F7255",
                  backgroundColor: "#EDF5F0",
                  padding: "6px 16px",
                  borderRadius: 100,
                  textTransform: "uppercase" as const,
                }}
              >
                {tag.trim()}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1, justifyContent: "center" }}>
            <div
              style={{
                fontSize: title.length > 40 ? 48 : 56,
                fontWeight: 700,
                color: "#111111",
                lineHeight: 1.15,
              }}
            >
              {title}
            </div>
            {description ? (
              <div
                style={{
                  fontSize: 22,
                  color: "#666666",
                  lineHeight: 1.4,
                }}
              >
                {description.length > 120 ? description.slice(0, 120) + "..." : description}
              </div>
            ) : null}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: "2px solid #E5E5E5",
              paddingTop: 24,
            }}
          >
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "#2F7255",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: 18,
                  fontWeight: 700,
                }}
              >
                C
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#111111" }}>
                  {author}
                </div>
                <div style={{ fontSize: 14, color: "#999999" }}>
                  chosn.co
                </div>
              </div>
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: "#2F7255",
              }}
            >
              chosn
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          "Cache-Control": "public, max-age=86400, s-maxage=86400",
          "Content-Type": "image/png",
        },
      }
    );
  } catch (e) {
    return new Response(`OG image generation failed: ${e instanceof Error ? e.message : "unknown error"}`, {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
