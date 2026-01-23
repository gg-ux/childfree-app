import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

const propertyId = process.env.GA_PROPERTY_ID;

// Initialize the Analytics Data API client
const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GA_CLIENT_EMAIL,
    private_key: process.env.GA_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
});

export async function GET(request: Request) {
  // Check authentication
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("admin_session")?.value;

  if (!sessionToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") || "7"; // days

  try {
    // Get basic metrics
    const [metricsResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: `${period}daysAgo`,
          endDate: "today",
        },
      ],
      metrics: [
        { name: "activeUsers" },
        { name: "sessions" },
        { name: "screenPageViews" },
        { name: "bounceRate" },
        { name: "averageSessionDuration" },
      ],
    });

    // Get previous period for comparison
    const [prevMetricsResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: `${parseInt(period) * 2}daysAgo`,
          endDate: `${parseInt(period) + 1}daysAgo`,
        },
      ],
      metrics: [
        { name: "activeUsers" },
        { name: "sessions" },
        { name: "screenPageViews" },
      ],
    });

    // Get top pages
    const [pagesResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: `${period}daysAgo`,
          endDate: "today",
        },
      ],
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }],
      orderBys: [
        {
          metric: { metricName: "screenPageViews" },
          desc: true,
        },
      ],
      limit: 5,
    });

    // Get traffic sources
    const [sourcesResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: `${period}daysAgo`,
          endDate: "today",
        },
      ],
      dimensions: [{ name: "sessionDefaultChannelGroup" }],
      metrics: [{ name: "sessions" }],
      orderBys: [
        {
          metric: { metricName: "sessions" },
          desc: true,
        },
      ],
      limit: 5,
    });

    // Parse metrics
    const currentMetrics = metricsResponse.rows?.[0]?.metricValues || [];
    const prevMetrics = prevMetricsResponse.rows?.[0]?.metricValues || [];

    const visitors = parseInt(currentMetrics[0]?.value || "0");
    const prevVisitors = parseInt(prevMetrics[0]?.value || "0");
    const sessions = parseInt(currentMetrics[1]?.value || "0");
    const pageViews = parseInt(currentMetrics[2]?.value || "0");
    const bounceRate = parseFloat(currentMetrics[3]?.value || "0") * 100;
    const avgSessionDuration = parseFloat(currentMetrics[4]?.value || "0");

    // Calculate changes
    const visitorsChange = prevVisitors > 0
      ? ((visitors - prevVisitors) / prevVisitors) * 100
      : 0;

    // Parse top pages
    const topPages = pagesResponse.rows?.map((row) => ({
      page: row.dimensionValues?.[0]?.value || "",
      views: parseInt(row.metricValues?.[0]?.value || "0"),
    })) || [];

    // Parse traffic sources
    const totalSessions = sourcesResponse.rows?.reduce(
      (sum, row) => sum + parseInt(row.metricValues?.[0]?.value || "0"),
      0
    ) || 1;

    const trafficSources = sourcesResponse.rows?.map((row) => ({
      source: row.dimensionValues?.[0]?.value || "",
      sessions: parseInt(row.metricValues?.[0]?.value || "0"),
      percentage: Math.round(
        (parseInt(row.metricValues?.[0]?.value || "0") / totalSessions) * 100
      ),
    })) || [];

    return NextResponse.json({
      visitors,
      visitorsChange: Math.round(visitorsChange),
      sessions,
      pageViews,
      bounceRate: Math.round(bounceRate),
      avgSessionDuration: Math.round(avgSessionDuration),
      topPages,
      trafficSources,
    });
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
