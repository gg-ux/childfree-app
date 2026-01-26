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

The pin is for Chosn (chosn.co), a community for childfree adults who value self-determination, freedom, and intentional living.

Return a JSON object with:
1. "title": Use the quote itself as the title, cleaned up if needed (max 100 chars). Keep it simple and direct.
2. "description": A 1-2 sentence description that:
   - Provides brief context or extends the quote's message
   - Feels warm and authentic, not salesy
   - MUST end with exactly: "Discover our childfree community at chosn.co"
3. "tags": An array of 8-10 Pinterest topic suggestions (these are typed into Pinterest's topic picker, so use common phrases that likely exist):
   - Use broad, established Pinterest categories like: "quotes", "inspirational quotes", "daily affirmations", "self care", "personal development", "mindfulness", "motivation", "positive quotes", "life quotes", "self love", "wellness", "mental health", "self improvement"
   - Avoid overly specific or niche terms that may not exist as Pinterest topics

Example format:
{
  "title": "Legacy isn't bloodline. It's impact.",
  "description": "Your choices matter more than you know. Discover our childfree community at chosn.co",
  "tags": ["quotes", "inspirational quotes", "self care", ...]
}

Return ONLY the JSON object, no other text.`
      : `Generate SEO-optimized content for an Instagram post featuring this quote: "${quote}"

The post is for Chosn (chosn.co), a community for adults who value self-determination, freedom, and intentional living.

Return a JSON object with:
1. "title": Use the quote itself (for alt text/accessibility)
2. "description": A short, engaging caption (1-2 sentences) that:
   - Complements the quote with context or reflection
   - Feels authentic and conversational
   - Optionally ends with "Link in bio" or similar CTA
3. "tags": An array of 15-20 relevant hashtags (without the # symbol) for maximum reach:
   - ALWAYS include 2-3 childfree tags: childfree, childfreebychoice, childfreelifestyle, childfreeliving, childfreeandthriving, dinklife
   - High-volume hashtags (100k+ posts)
   - Medium-volume niche hashtags
   - Manifestation and affirmation tags
   - Self-care and wellness tags
   - Lifestyle and intentional living tags
   - Aesthetic/visual tags

Example format:
{
  "title": "I trust my path completely",
  "description": "A daily reminder that you're exactly where you need to be. Trust the process.",
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

    // Extract JSON from response (handle cases where AI adds extra text)
    let data = { title: "", description: "", tags: [] };
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        data = JSON.parse(jsonMatch[0]);
      }
    } catch {
      console.error("Failed to parse tags JSON:", responseText);
    }

    return NextResponse.json({
      title: data.title || "",
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
