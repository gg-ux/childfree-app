import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get("title") || "Chosn";
  const description = searchParams.get("description") || "";
  const author = searchParams.get("author") || "Chosn Team";
  const tags = (searchParams.get("tags") || "").split(",").filter(Boolean);

  let fontData: ArrayBuffer | null = null;
  try {
    const fontRes = await fetch(
      "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYAZ9hiJ-Ek-_EeA.woff2"
    );
    if (fontRes.ok) fontData = await fontRes.arrayBuffer();
  } catch {}

  const tagElements = tags.map((tag, i) => ({
    tag: tag.trim(),
    key: i,
  }));

  const element = (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "60px 64px",
        backgroundColor: "#FFFFFF",
      }}
    >
      <div style={{ display: "flex", gap: "10px" }}>
        {tagElements.map((t) => (
          <div
            key={t.key}
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "#2F7255",
              backgroundColor: "rgba(47, 114, 85, 0.1)",
              padding: "6px 16px",
              borderRadius: "100px",
              letterSpacing: "0.5px",
              textTransform: "uppercase" as const,
            }}
          >
            {t.tag}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px", flex: 1, justifyContent: "center" }}>
        <div
          style={{
            fontSize: title.length > 40 ? 48 : 56,
            fontWeight: 700,
            color: "#111111",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
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
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "2px solid #E5E5E5",
          paddingTop: "24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
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
            letterSpacing: "-0.01em",
          }}
        >
          chosn
        </div>
      </div>
    </div>
  );

  const options: { width: number; height: number; fonts?: { name: string; data: ArrayBuffer; style: "normal"; weight: 700 }[] } = {
    width: 1200,
    height: 630,
  };

  if (fontData) {
    options.fonts = [
      {
        name: "Inter",
        data: fontData,
        style: "normal",
        weight: 700,
      },
    ];
  }

  return new ImageResponse(element, options);
}
