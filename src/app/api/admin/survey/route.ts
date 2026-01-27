import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const CONNECTION_LABELS: Record<string, string> = {
  dating: "Dating",
  friendships: "Friendships",
  community: "Community",
};

const CONTRIBUTION_LABELS: Record<string, string> = {
  beta_tester: "Beta tester",
  event_organizer: "Event organizer",
  moderator: "Moderator",
  just_member: "Just a member",
};

export async function GET() {
  const cookieStore = await cookies();

  // Check admin authentication
  const sessionToken = cookieStore.get("admin_session")?.value;
  if (!sessionToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get all survey responses
    const responses = await db.surveyResponse.findMany({
      orderBy: { createdAt: "desc" },
    });

    const totalResponses = responses.length;

    if (totalResponses === 0) {
      return NextResponse.json({
        totalResponses: 0,
        connectionRankings: { first: [], second: [], third: [] },
        likertAverages: {
          localDating: null,
          localFriendships: null,
          globalCommunity: null,
        },
        contributionTypes: [],
        ageRanges: [],
        locations: [],
        recentResponses: [],
      });
    }

    // Calculate connection rankings (#1, #2, #3 choices)
    const firstChoice: Record<string, number> = {};
    const secondChoice: Record<string, number> = {};
    const thirdChoice: Record<string, number> = {};

    responses.forEach((r) => {
      if (r.connectionTypes.length >= 1) {
        const first = r.connectionTypes[0];
        firstChoice[first] = (firstChoice[first] || 0) + 1;
      }
      if (r.connectionTypes.length >= 2) {
        const second = r.connectionTypes[1];
        secondChoice[second] = (secondChoice[second] || 0) + 1;
      }
      if (r.connectionTypes.length >= 3) {
        const third = r.connectionTypes[2];
        thirdChoice[third] = (thirdChoice[third] || 0) + 1;
      }
    });

    const formatRankings = (counts: Record<string, number>) =>
      Object.entries(counts)
        .map(([key, count]) => ({
          key,
          label: CONNECTION_LABELS[key] || key,
          count,
          percentage: Math.round((count / totalResponses) * 100),
        }))
        .sort((a, b) => b.count - a.count);

    const connectionRankings = {
      first: formatRankings(firstChoice),
      second: formatRankings(secondChoice),
      third: formatRankings(thirdChoice),
    };

    // Calculate Likert score averages
    const likertDating = responses.filter((r) => r.likertLocalDating !== null);
    const likertFriendships = responses.filter((r) => r.likertLocalFriendships !== null);
    const likertCommunity = responses.filter((r) => r.likertGlobalCommunity !== null);

    const likertAverages = {
      localDating:
        likertDating.length > 0
          ? Math.round(
              (likertDating.reduce((sum, r) => sum + (r.likertLocalDating || 0), 0) /
                likertDating.length) *
                10
            ) / 10
          : null,
      localFriendships:
        likertFriendships.length > 0
          ? Math.round(
              (likertFriendships.reduce((sum, r) => sum + (r.likertLocalFriendships || 0), 0) /
                likertFriendships.length) *
                10
            ) / 10
          : null,
      globalCommunity:
        likertCommunity.length > 0
          ? Math.round(
              (likertCommunity.reduce((sum, r) => sum + (r.likertGlobalCommunity || 0), 0) /
                likertCommunity.length) *
                10
            ) / 10
          : null,
    };

    // Count contribution types
    const contributionCounts: Record<string, number> = {};
    responses.forEach((r) => {
      r.contributionTypes.forEach((type) => {
        contributionCounts[type] = (contributionCounts[type] || 0) + 1;
      });
    });
    const contributionTypes = Object.entries(contributionCounts)
      .map(([key, count]) => ({
        key,
        label: CONTRIBUTION_LABELS[key] || key,
        count,
        percentage: Math.round((count / totalResponses) * 100),
      }))
      .sort((a, b) => b.count - a.count);

    // Count age ranges
    const ageCounts: Record<string, number> = {};
    responses.forEach((r) => {
      if (r.ageRange) {
        ageCounts[r.ageRange] = (ageCounts[r.ageRange] || 0) + 1;
      }
    });
    const ageRanges = Object.entries(ageCounts)
      .map(([range, count]) => ({
        range,
        count,
        percentage: Math.round((count / totalResponses) * 100),
      }))
      .sort((a, b) => {
        // Sort by age range order
        const order = ["18-24", "25-34", "35-44", "45-54", "55+"];
        return order.indexOf(a.range) - order.indexOf(b.range);
      });

    // Count locations (combining country and region/city)
    const locationCounts: Record<string, number> = {};
    responses.forEach((r) => {
      if (r.region && r.country) {
        // Use region (city or ZIP) if available
        const location = `${r.region}, ${r.country === "United States" ? "US" : r.country}`;
        locationCounts[location] = (locationCounts[location] || 0) + 1;
      } else if (r.country) {
        locationCounts[r.country] = (locationCounts[r.country] || 0) + 1;
      }
    });
    const locations = Object.entries(locationCounts)
      .map(([location, count]) => ({
        location,
        count,
        percentage: Math.round((count / totalResponses) * 100),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15); // Top 15 locations

    // Get recent responses
    const recentResponses = responses.slice(0, 20).map((r) => ({
      id: r.id,
      createdAt: r.createdAt.toISOString(),
      connectionRanking: r.connectionTypes,
      likertScores: {
        localDating: r.likertLocalDating,
        localFriendships: r.likertLocalFriendships,
        globalCommunity: r.likertGlobalCommunity,
      },
      ageRange: r.ageRange,
      country: r.country,
      region: r.region,
      contributionTypes: r.contributionTypes,
      email: r.email,
    }));

    return NextResponse.json({
      totalResponses,
      connectionRankings,
      likertAverages,
      contributionTypes,
      ageRanges,
      locations,
      recentResponses,
    });
  } catch (error) {
    console.error("Survey results fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch survey results" },
      { status: 500 }
    );
  }
}
