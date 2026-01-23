import { NextRequest, NextResponse } from "next/server";

type TransformMode = "crop-center" | "crop-left" | "crop-right" | "scale-fit" | "stretch";

export async function POST(request: NextRequest) {
  try {
    const { svgContent, mode = "crop-center" } = await request.json() as {
      svgContent: string;
      mode: TransformMode;
    };

    if (!svgContent) {
      return NextResponse.json({ error: "SVG content required" }, { status: 400 });
    }

    // Parse original dimensions
    const widthMatch = svgContent.match(/width="(\d+)"/);
    const heightMatch = svgContent.match(/height="(\d+)"/);
    const origWidth = widthMatch ? parseInt(widthMatch[1]) : 1200;
    const origHeight = heightMatch ? parseInt(heightMatch[1]) : 800;

    const targetSize = 800;
    let svgOutput: string;

    // Extract inner content
    const innerContent = svgContent.replace(/<svg[^>]*>/, "").replace(/<\/svg>/, "");

    // Get background color for padding
    const bgColorMatch = svgContent.match(/<rect[^>]*fill="(#[A-Fa-f0-9]{6})"/);
    const bgColor = bgColorMatch ? bgColorMatch[1] : "#2F7255";

    switch (mode) {
      case "crop-left": {
        // Crop from left edge (show left 800px)
        svgOutput = `<svg viewBox="0 0 ${targetSize} ${origHeight}" style="width:100%;height:100%" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${innerContent}
</svg>`;
        break;
      }

      case "crop-right": {
        // Crop from right edge (show right 800px)
        const xOffset = origWidth - targetSize;
        svgOutput = `<svg viewBox="${xOffset} 0 ${targetSize} ${origHeight}" style="width:100%;height:100%" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${innerContent}
</svg>`;
        break;
      }

      case "crop-center": {
        // Center crop
        const xOffset = (origWidth - targetSize) / 2;
        svgOutput = `<svg viewBox="${xOffset} 0 ${targetSize} ${origHeight}" style="width:100%;height:100%" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${innerContent}
</svg>`;
        break;
      }

      case "scale-fit": {
        // Uniform scale to fit, with padding
        const scale = targetSize / origWidth;
        const scaledHeight = origHeight * scale;
        const yPadding = (targetSize - scaledHeight) / 2;

        svgOutput = `<svg viewBox="0 0 ${targetSize} ${targetSize}" style="width:100%;height:100%" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="${targetSize}" height="${targetSize}" fill="${bgColor}"/>
  <g transform="translate(0, ${yPadding}) scale(${scale})">
    ${innerContent}
  </g>
</svg>`;
        break;
      }

      case "stretch": {
        // Non-uniform scale to fill (may distort)
        const scaleX = targetSize / origWidth;
        const scaleY = targetSize / origHeight;

        svgOutput = `<svg viewBox="0 0 ${targetSize} ${targetSize}" style="width:100%;height:100%" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g transform="scale(${scaleX}, ${scaleY})">
    ${innerContent}
  </g>
</svg>`;
        break;
      }

      default:
        return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
    }

    return NextResponse.json({ svg: svgOutput });
  } catch (error) {
    console.error("Recompose error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to recompose SVG" },
      { status: 500 }
    );
  }
}
