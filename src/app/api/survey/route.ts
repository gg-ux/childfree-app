import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const CONNECTION_LABELS: Record<string, string> = {
  dating: "Dating",
  friendships: "Friendships",
  community: "Community",
  local_meetups: "Local meetups",
  online_support: "Online support",
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      // New simplified survey fields
      connectionRanking,
      likertScores,
      // Shared fields
      contributionTypes,
      ageRange,
      country,
      region,
      email,
      // Legacy fields (for backwards compatibility)
      hardestPart,
      connectionTypes: legacyConnectionTypes,
      featurePriorities,
      painPoints,
      activities,
      communityVibe,
      idealFirstMonth,
      completionTime,
    } = body;

    // Create survey response
    await db.surveyResponse.create({
      data: {
        // Use new ranking if provided, otherwise fall back to legacy
        connectionTypes: connectionRanking || legacyConnectionTypes || [],
        // New Likert scores
        likertLocalDating: likertScores?.local_dating || null,
        likertLocalFriendships: likertScores?.local_friendships || null,
        likertGlobalCommunity: likertScores?.global_community || null,
        // Shared fields
        contributionTypes: contributionTypes || [],
        ageRange,
        country,
        region,
        email,
        // Legacy fields
        hardestPart,
        featurePriorities: featurePriorities || [],
        painPoints,
        activities: activities || [],
        communityVibe,
        idealFirstMonth,
        completionTime,
      },
    });

    // If email provided, also add to waitlist
    if (email) {
      try {
        await db.waitlistEntry.upsert({
          where: { email },
          update: { source: "survey" },
          create: { email, source: "survey" },
        });
      } catch {
        // Ignore duplicate email errors
      }
    }

    // Get aggregate results to show user
    const totalResponses = await db.surveyResponse.count();

    // Get all responses for aggregate calculation
    const allResponses = await db.surveyResponse.findMany({
      select: { connectionTypes: true },
    });

    // Count #1 rankings (first item in connectionTypes array = top choice)
    const topChoiceVotes: Record<string, number> = {};
    allResponses.forEach((r) => {
      if (r.connectionTypes.length > 0) {
        const topChoice = r.connectionTypes[0];
        topChoiceVotes[topChoice] = (topChoiceVotes[topChoice] || 0) + 1;
      }
    });

    const topConnectionId = Object.entries(topChoiceVotes).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0];
    const topConnection = CONNECTION_LABELS[topConnectionId] || "Dating";

    return NextResponse.json({
      success: true,
      aggregateResults: {
        totalResponses,
        topConnection,
      },
    });
  } catch (error) {
    console.error("Survey submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit survey" },
      { status: 500 }
    );
  }
}
