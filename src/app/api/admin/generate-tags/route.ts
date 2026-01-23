import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  // Check authentication
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("admin_session")?.value;

  if (!sessionToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { quote, platform } = await request.json();

    const prompt = platform === "pinterest"
      ? `Generate SEO-optimized content for a Pinterest pin featuring this quote: "${quote}"

The pin is for a community of adults who have intentionally chosen a childfree lifestyle and value self-determination, freedom, and intentional living.

Return a JSON object with:
1. "description": A compelling 2-3 sentence description for the pin (include the quote naturally)
2. "tags": An array of 8-12 relevant hashtags/keywords (without the # symbol) that will help this pin get discovered. Focus on:
   - Manifestation and affirmation related tags
   - Self-care and wellness tags
   - Lifestyle and intentional living tags
   - Aesthetic/visual tags that match Pinterest trends
   - Avoid anything directly about children/parenting

Example format:
{
  "description": "...",
  "tags": ["manifestation", "affirmations", "selfcare", ...]
}

Return ONLY the JSON object, no other text.`
      : `Generate SEO-optimized content for an Instagram post featuring this quote: "${quote}"

The post is for a community of adults who have intentionally chosen a childfree lifestyle and value self-determination, freedom, and intentional living.

Return a JSON object with:
1. "description": A short, engaging caption (1-2 sentences) that complements the quote
2. "tags": An array of 15-20 relevant hashtags (without the # symbol) for maximum reach. Include a mix of:
   - High-volume hashtags (100k+ posts)
   - Medium-volume niche hashtags
   - Manifestation and affirmation tags
   - Self-care and wellness tags
   - Lifestyle and intentional living tags
   - Aesthetic/visual tags
   - Avoid anything directly about children/parenting

Example format:
{
  "description": "...",
  "tags": ["manifestation", "dailyaffirmations", "selfcare", ...]
}

Return ONLY the JSON object, no other text.`;

    const message = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const responseText = message.content[0].type === "text"
      ? message.content[0].text.trim()
      : "{}";

    // Parse the JSON response
    const data = JSON.parse(responseText);

    return NextResponse.json({
      description: data.description || "",
      tags: data.tags || [],
    });
  } catch (error) {
    console.error("Tag generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate tags" },
      { status: 500 }
    );
  }
}
