import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MANIFESTATION_PROMPT = `Generate a single powerful manifestation affirmation for a social media graphic. The audience is adults who have intentionally chosen a childfree lifestyle and value self-determination.

REQUIREMENTS:
- Written in first person ("I am", "I choose", "I trust", "My life is") OR as a powerful statement
- Present tense, as if it's already true
- 4-12 words maximum
- Feels like a personal mantra you'd repeat to yourself
- Themes: freedom, self-trust, intentional living, abundance, peace, wholeness, choosing yourself, honoring your path, designing your life, chosen family, legacy through impact, community

STYLE EXAMPLES (don't copy, match the energy):

Warm/Inspirational (most common):
- "My success is inevitable"
- "Everything I want wants me more"
- "I choose myself"
- "I honor my truth"
- "I am always in the right place at the right time"
- "I am moving into new levels of abundance"
- "It is safe to receive everything I desire"
- "I trust my path completely"
- "My life unfolds exactly as it should"
- "I am surrounded by my chosen family"
- "I am taken care of by my chosen family"
- "Legacy isn't bloodline. It's impact."
- "Family isn't blood. It's who shows up."
- "My people chose me back"
- "I am whole exactly as I am"
- "My life is full and complete"

Edgy/Assertive (occasionally):
- "I do not owe anyone children."
- "Society's expectations are not my obligations."
- "I owe no one an explanation."
- "My life is not up for debate."
- "My body, my choice. Always."

Generate warm/inspirational 80% of the time, edgy/assertive 20%.

AVOID:
- Generic or overused phrases
- Bitter or angry tone (edgy is confident, not resentful)
- Questions or conditional statements
- Being too wordy

Return ONLY the affirmation text. No quotation marks or explanation.`;

// Curated, verified statistics with sources
const VERIFIED_STATS = [
  {
    quote: "About 1 in 5 U.S. adults ages 50 and older are childless",
    source: "Pew Research 2021"
  },
  {
    quote: "44% of non-parents ages 18-49 say it's unlikely they will ever have children",
    source: "Pew Research 2021"
  },
  {
    quote: "The share of adults under 50 without children has grown from 37% to 47% since 2012",
    source: "Pew Research 2023"
  },
  {
    quote: "56% of childless adults under 50 say they simply don't want children",
    source: "Pew Research 2021"
  },
  {
    quote: "Childless adults report spending more time on hobbies, rest, and social activities",
    source: "Pew Research 2023"
  },
  {
    quote: "The average cost of raising a child to 18 is $310,605",
    source: "Brookings Institution 2024"
  },
  {
    quote: "Women without children earn approximately 10-15% more than mothers over their careers",
    source: "Census Bureau Data"
  },
  {
    quote: "Among adults 50+, childless adults are just as likely to report being happy",
    source: "Pew Research 2021"
  },
  {
    quote: "1 in 4 adults who've never had children say they do not ever expect to",
    source: "Pew Research 2018"
  },
  {
    quote: "The U.S. birth rate has declined 23% since 2007",
    source: "CDC National Vital Statistics"
  },
  {
    quote: "Childfree adults volunteer and donate to charity at similar rates as parents",
    source: "Pew Research 2023"
  },
  {
    quote: "Having one fewer child reduces carbon footprint by 58 tons of CO2 per year",
    source: "Environmental Research Letters"
  },
  {
    quote: "Adults without children report higher relationship satisfaction with their partners",
    source: "Journal of Marriage and Family"
  },
  {
    quote: "The percentage of women ages 15-44 who have never had children rose from 28% to 44%",
    source: "Census Bureau 2018"
  },
  {
    quote: "Childless adults are more likely to have close friendships outside the home",
    source: "American Sociological Review"
  }
];

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

    // For data type, randomly select from verified statistics
    if (quoteType === "data") {
      const randomStat = VERIFIED_STATS[Math.floor(Math.random() * VERIFIED_STATS.length)];
      return NextResponse.json({
        quote: randomStat.quote,
        source: randomStat.source,
      });
    }

    // For manifestation type, use AI generation
    const message = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 50,
      messages: [
        {
          role: "user",
          content: MANIFESTATION_PROMPT,
        },
      ],
    });

    const responseText = message.content[0].type === "text"
      ? message.content[0].text.trim()
      : "";

    // Return manifestation quote
    return NextResponse.json({
      quote: responseText || "Living life on my own terms.",
    });
  } catch (error) {
    console.error("Quote generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate quote" },
      { status: 500 }
    );
  }
}
