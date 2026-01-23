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
    const { analytics, waitlistCount, period } = await request.json();

    if (!analytics) {
      return NextResponse.json({ error: "No analytics data" }, { status: 400 });
    }

    const prompt = `You are an analytics assistant for Chosn, a dating and community app for childfree adults. Based on the following metrics, provide a brief, insightful summary (2-3 sentences max) highlighting what's notable or actionable. Be conversational and helpful, not robotic. Focus on what matters most.

Period: Last ${period} days

Metrics:
- Visitors: ${analytics.visitors} (${analytics.visitorsChange >= 0 ? "+" : ""}${analytics.visitorsChange}% vs previous period)
- Page Views: ${analytics.pageViews}
- Sessions: ${analytics.sessions}
- Bounce Rate: ${analytics.bounceRate}%
- Avg Session Duration: ${Math.floor(analytics.avgSessionDuration / 60)}m ${analytics.avgSessionDuration % 60}s
- Waitlist Signups: ${waitlistCount}
- Conversion Rate: ${analytics.visitors > 0 ? ((waitlistCount / analytics.visitors) * 100).toFixed(1) : 0}%

Top Pages: ${analytics.topPages?.map((p: { page: string; views: number }) => `${p.page} (${p.views})`).join(", ") || "No data"}

Traffic Sources: ${analytics.trafficSources?.map((s: { source: string; percentage: number }) => `${s.source} (${s.percentage}%)`).join(", ") || "No data"}

Provide a brief insight. Don't repeat the numbers - interpret them. If there's no data yet, acknowledge that and encourage patience.`;

    const message = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 200,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const insight = message.content[0].type === "text"
      ? message.content[0].text
      : "Unable to generate insight";

    return NextResponse.json({ insight });
  } catch (error) {
    console.error("Insights API error:", error);
    return NextResponse.json(
      { error: "Failed to generate insights" },
      { status: 500 }
    );
  }
}
