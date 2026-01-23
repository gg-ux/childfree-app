import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MANIFESTATION_PROMPT = `Generate a single powerful manifestation affirmation for a social media graphic. The audience is adults who have intentionally chosen a childfree lifestyle and value self-determination.

REQUIREMENTS:
- Written in first person ("I am", "I choose", "I trust", "My life is")
- Present tense, as if it's already true
- 5-15 words maximum
- Feels like a personal mantra you'd repeat to yourself
- Themes: freedom, self-trust, intentional living, abundance, peace, wholeness, choosing yourself, honoring your path, designing your life

STYLE EXAMPLES (don't copy, match the energy):
- "My success is inevitable"
- "Everything I want wants me more"
- "I choose myself / I honor my truth / I honor my worth"
- "I am always in the right place at the right time"
- "I am moving into new levels of abundance"
- "It is safe to receive everything I desire"
- "I trust my path completely"
- "My life unfolds exactly as it should"

AVOID:
- Generic or overused phrases
- Anything defensive or bitter
- Direct mentions of children or parenting
- Questions or conditional statements

Return ONLY the affirmation text. No quotation marks or explanation.`;

const DATA_PROMPT = `Generate a single compelling data point or statistic about childfree adults for a social media graphic. The audience is adults who have intentionally chosen a childfree lifestyle.

REQUIREMENTS:
- Must be a real, verifiable statistic or data point from reputable sources (Pew Research, Census Bureau, academic studies, etc.)
- Format as a short, impactful statement (10-20 words max)
- Should feel empowering, validating, or thought-provoking
- Can include: demographics, financial data, life satisfaction, career stats, relationship data, environmental impact

EXAMPLE FORMATS:
- "1 in 5 adults will never have children - and that number is growing"
- "Childfree adults report 20% higher life satisfaction on average"
- "Women without children earn 10-15% more than mothers over their careers"
- "44% of non-parents ages 18-49 say they're unlikely to ever have children"
- "Childfree couples save an average of $300,000 over their lifetime"

REQUIREMENTS:
- Use real data (don't make up statistics)
- Keep it positive/neutral, not defensive
- No judgmental comparisons to parents
- Focus on the childfree experience, not criticizing parenthood

Return ONLY the data statement. No quotation marks, citations, or explanation.`;

export async function POST(request: Request) {
  // Check authentication
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("admin_session")?.value;

  if (!sessionToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get quote type from request body
    const body = await request.json().catch(() => ({}));
    const quoteType = body.type || "manifestation";

    const prompt = quoteType === "data" ? DATA_PROMPT : MANIFESTATION_PROMPT;
    const maxTokens = quoteType === "data" ? 100 : 50;

    const message = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: maxTokens,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const quote = message.content[0].type === "text"
      ? message.content[0].text.trim()
      : quoteType === "data"
        ? "1 in 5 adults will never have children."
        : "Living life on my own terms.";

    return NextResponse.json({ quote });
  } catch (error) {
    console.error("Quote generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate quote" },
      { status: 500 }
    );
  }
}
