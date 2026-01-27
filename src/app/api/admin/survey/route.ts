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
        const order = ["18-24", "25-34", "35-44", "45-54", "55+"];
        return order.indexOf(a.range) - order.indexOf(b.range);
      });

    // Count locations
    const locationCounts: Record<string, number> = {};
    responses.forEach((r) => {
      if (r.region && r.country) {
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
      .slice(0, 15);

    // Get recent responses
    const recentResponses = responses.slice(0, 20).map((r) => ({
      id: r.id,
      createdAt: r.createdAt.toISOString(),
      connectionRanking: r.connectionTypes,
      ageRange: r.ageRange,
      country: r.country,
      region: r.region,
      contributionTypes: r.contributionTypes,
      email: r.email,
    }));

    return NextResponse.json({
      totalResponses,
      connectionRankings,
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
