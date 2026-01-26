"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import {
  DownloadSimple,
  PaperPlaneTilt,
  ArrowClockwise,
  Check,
  SignOut,
  Envelope,
  Trash,
  ChartLine,
  ArrowSquareOut,
  TrendUp,
  TrendDown,
  Users,
  Eye,
  Timer,
  Sparkle,
  ClipboardText,
} from "@phosphor-icons/react";
import { Loader } from "@/components/ui/loader";
import { SocialExport } from "@/components/ui/social-export";
import { QuoteGenerator } from "@/components/ui/quote-generator";

interface WaitlistEntry {
  id: string;
  email: string;
  source: string | null;
  emailSent: boolean;
  emailSentAt: string | null;
  createdAt: string;
}

type FilterType = "all" | "sent" | "not_sent";

interface SurveyData {
  totalResponses: number;
  featurePriorities: { key: string; label: string; score: number; percentage: number }[];
  connectionTypes: { key: string; label: string; count: number; percentage: number }[];
  activities: { key: string; label: string; count: number; percentage: number }[];
  contributionTypes: { key: string; label: string; count: number; percentage: number }[];
  ageRanges: { range: string; count: number; percentage: number }[];
  countries: { country: string; count: number; percentage: number }[];
  communityVibeAvg: number | null;
  recentResponses: {
    id: string;
    createdAt: string;
    hardestPart: string | null;
    painPoints: string | null;
    idealFirstMonth: string | null;
    ageRange: string | null;
    country: string | null;
    region: string | null;
    email: string | null;
  }[];
}

export default function AdminPage() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginStatus, setLoginStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [filter, setFilter] = useState<FilterType>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sending, setSending] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");
  const [analyticsPeriod, setAnalyticsPeriod] = useState("7");
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);
  const [insightLoading, setInsightLoading] = useState(false);
  const [analytics, setAnalytics] = useState<{
    visitors: number;
    visitorsChange: number;
    sessions: number;
    pageViews: number;
    bounceRate: number;
    avgSessionDuration: number;
    topPages: { page: string; views: number }[];
    trafficSources: { source: string; sessions: number; percentage: number }[];
  } | null>(null);
  const [blogPosts, setBlogPosts] = useState<{ slug: string; title: string; image?: string }[]>([]);
  const [activeTab, setActiveTab] = useState<"dashboard" | "social" | "survey">("dashboard");
  const [surveyData, setSurveyData] = useState<SurveyData | null>(null);
  const [surveyLoading, setSurveyLoading] = useState(false);

  // Check if already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/admin/auth/check");
        const data = await res.json();

        if (data.authenticated) {
          setAuthenticated(true);
          setEmail(data.email);
          fetchEntries();
          fetchAnalytics();
          fetchBlogPosts();
          fetchSurveyData();
        }
      } catch {
        // Not authenticated
      } finally {
        setAuthChecking(false);
      }
    };

    checkAuth();
  }, []);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/waitlist");
      const data = await res.json();

      if (res.ok) {
        setEntries(data.entries);
        setError("");
      } else {
        if (res.status === 401) {
          setAuthenticated(false);
        }
        setError(data.error || "Failed to load");
      }
    } catch {
      setError("Failed to connect");
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async (period: string = analyticsPeriod) => {
    setAnalyticsLoading(true);
    setInsight(null); // Clear previous insight when refreshing
    try {
      const res = await fetch(`/api/admin/analytics?period=${period}`);
      const data = await res.json();

      if (res.ok) {
        setAnalytics(data);
      }
    } catch {
      console.error("Failed to fetch analytics");
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const fetchBlogPosts = async () => {
    try {
      const res = await fetch("/api/admin/posts");
      const data = await res.json();
      if (res.ok) {
        setBlogPosts(data.posts);
      }
    } catch {
      console.error("Failed to fetch blog posts");
    }
  };

  const fetchSurveyData = async () => {
    setSurveyLoading(true);
    try {
      const res = await fetch("/api/admin/survey");
      const data = await res.json();
      if (res.ok) {
        setSurveyData(data);
      }
    } catch {
      console.error("Failed to fetch survey data");
    } finally {
      setSurveyLoading(false);
    }
  };

  const fetchInsights = async () => {
    if (!analytics) return;

    setInsightLoading(true);
    try {
      const res = await fetch("/api/admin/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analytics,
          waitlistCount: entries.length,
          period: analyticsPeriod,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setInsight(data.insight);
      } else {
        setInsight(`Error: ${data.error || "Failed to generate insight"}`);
      }
    } catch (err) {
      console.error("Failed to fetch insights:", err);
      setInsight("Error: Failed to connect to insights API");
    } finally {
      setInsightLoading(false);
    }
  };

  const handleSendLoginLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) return;

    setLoginStatus("sending");

    try {
      await fetch("/api/admin/auth/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail }),
      });

      setLoginStatus("sent");
    } catch {
      setError("Failed to send login link");
      setLoginStatus("idle");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    setAuthenticated(false);
    setEntries([]);
  };

  const filteredEntries = entries.filter((e) => {
    if (filter === "sent") return e.emailSent;
    if (filter === "not_sent") return !e.emailSent;
    return true;
  });

  const sentCount = entries.filter((e) => e.emailSent).length;
  const notSentCount = entries.filter((e) => !e.emailSent).length;

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelected(newSelected);
  };

  const selectAll = () => {
    if (selected.size === filteredEntries.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filteredEntries.map((e) => e.id)));
    }
  };

  const sendEmails = async () => {
    if (selected.size === 0) return;

    setSending(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selected) }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setSelected(new Set());
        fetchEntries();
      } else {
        setMessage(data.error || "Failed to send");
      }
    } catch {
      setMessage("Failed to send emails");
    } finally {
      setSending(false);
    }
  };

  const deleteEntries = async () => {
    if (selected.size === 0) return;

    if (!confirm(`Delete ${selected.size} entry${selected.size !== 1 ? "ies" : ""}? This cannot be undone.`)) {
      return;
    }

    setDeleting(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/waitlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selected) }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        setSelected(new Set());
        fetchEntries();
      } else {
        setMessage(data.error || "Failed to delete");
      }
    } catch {
      setMessage("Failed to delete entries");
    } finally {
      setDeleting(false);
    }
  };

  const exportCSV = () => {
    const headers = ["Email", "Source", "Email Sent", "Sent At", "Signed Up"];
    const rows = entries.map((e) => [
      e.email,
      e.source || "website",
      e.emailSent ? "Yes" : "No",
      e.emailSentAt ? new Date(e.emailSentAt).toLocaleDateString() : "",
      new Date(e.createdAt).toLocaleDateString(),
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chosn-waitlist-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  // Loading state
  if (authChecking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader size="md" />
      </div>
    );
  }

  // Login page
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background">
        {/* Nav */}
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-[rgba(0,0,0,0.06)]">
          <div className="container-main h-16 flex items-center justify-between">
            <Link href="/">
              <Logo variant="full" size="md" />
            </Link>
          </div>
        </nav>

        <div className="pt-32 px-6 flex items-center justify-center">
          <div className="w-full max-w-sm">
            <h1 className="font-display text-2xl text-foreground mb-2">Admin Login</h1>
            <p className="theme-body text-muted mb-8">
              Enter your email to receive a login link.
            </p>

            {loginStatus === "sent" ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-forest/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Envelope size={24} className="text-forest" />
                </div>
                <p className="theme-body text-foreground font-medium">Check your email</p>
                <p className="theme-body-sm text-muted mt-1">
                  We sent a login link to {loginEmail}
                </p>
                <button
                  onClick={() => setLoginStatus("idle")}
                  className="theme-body-sm text-forest hover:underline mt-4"
                >
                  Use a different email
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendLoginLink} className="space-y-4">
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 h-12 rounded-lg border border-border bg-background theme-body text-foreground placeholder:text-muted focus:outline-none focus:border-forest transition-colors"
                  disabled={loginStatus === "sending"}
                />
                <Button
                  type="submit"
                  variant="accent"
                  size="lg"
                  className="w-full"
                  disabled={loginStatus === "sending" || !loginEmail}
                >
                  {loginStatus === "sending" ? "Sending..." : "Send login link"}
                </Button>
                {error && <p className="text-coral text-xs font-[450]">{error}</p>}
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-[rgba(0,0,0,0.06)]">
        <div className="container-main h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/">
              <Logo variant="full" size="md" />
            </Link>
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`theme-nav ${
                activeTab === "dashboard"
                  ? "text-foreground"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("social")}
              className={`theme-nav ${
                activeTab === "social"
                  ? "text-foreground"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Social
            </button>
            <button
              onClick={() => setActiveTab("survey")}
              className={`theme-nav ${
                activeTab === "survey"
                  ? "text-foreground"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Survey
            </button>
          </div>
          <div className="flex items-center gap-4">
            <span className="theme-body-sm text-muted hidden sm:block">{email}</span>
            <Button variant="secondary" size="md" onClick={handleLogout} className="gap-2">
              <SignOut size={16} weight="bold" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12">
        <div className="container-main">
          {activeTab === "dashboard" && (
          <>
          {/* AI Insight */}
          <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-forest/5 to-forest/10 border border-forest/20">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-forest/20 flex items-center justify-center flex-shrink-0">
                <Sparkle size={16} weight="fill" className="text-forest" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="theme-caption text-forest mb-1">AI Insight</p>
                {insightLoading ? (
                  <p className="theme-body-sm text-muted">Analyzing your data...</p>
                ) : insight ? (
                  <p className="theme-body-sm text-foreground">{insight}</p>
                ) : (
                  <p className="theme-body-sm text-muted">Get an AI-powered summary of your analytics.</p>
                )}
              </div>
              {!insightLoading && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={fetchInsights}
                  disabled={!analytics}
                  className="flex-shrink-0"
                >
                  {insight ? "Refresh" : "Get Insights"}
                </Button>
              )}
            </div>
          </div>

          {/* Analytics Section */}
          <div className="mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-display text-xl md:text-2xl text-foreground">
                  Analytics
                </h2>
                <p className="theme-body-sm text-muted mt-1">
                  Traffic and engagement metrics
                </p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={analyticsPeriod}
                  onChange={(e) => {
                    setAnalyticsPeriod(e.target.value);
                    fetchAnalytics(e.target.value);
                  }}
                  className="appearance-none h-8 px-4 pr-8 rounded-lg border border-[rgba(0,0,0,0.08)] bg-background text-[14px] font-button text-foreground focus:outline-none focus:border-forest cursor-pointer"
                >
                  <option value="7">Last 7 days</option>
                  <option value="14">Last 14 days</option>
                  <option value="30">Last 30 days</option>
                </select>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => fetchAnalytics()}
                  disabled={analyticsLoading}
                  className="gap-2"
                >
                  <ArrowClockwise size={14} weight="bold" className={analyticsLoading ? "animate-spin" : ""} />
                  Refresh
                </Button>
                <a
                  href="https://analytics.google.com/analytics/web/#/p521193053/reports/intelligenthome"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="secondary" size="sm" className="gap-2">
                    <ArrowSquareOut size={14} weight="bold" />
                    Open GA
                  </Button>
                </a>
              </div>
            </div>

            {analyticsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader size="md" />
              </div>
            ) : analytics ? (
              <>
                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Users size={16} className="text-muted" />
                      <span className="theme-caption text-muted">Visitors</span>
                    </div>
                    <p className="text-2xl font-display text-foreground">
                      {analytics.visitors.toLocaleString()}
                    </p>
                    <div className={`flex items-center gap-1 theme-secondary mt-1 ${
                      analytics.visitorsChange >= 0 ? "text-forest" : "text-coral"
                    }`}>
                      {analytics.visitorsChange >= 0 ? (
                        <TrendUp size={12} weight="bold" />
                      ) : (
                        <TrendDown size={12} weight="bold" />
                      )}
                      {Math.abs(analytics.visitorsChange)}% vs prev period
                    </div>
                  </div>

                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye size={16} className="text-muted" />
                      <span className="theme-caption text-muted">Page Views</span>
                    </div>
                    <p className="text-2xl font-display text-foreground">
                      {analytics.pageViews.toLocaleString()}
                    </p>
                    <p className="theme-secondary text-muted mt-1">
                      {analytics.sessions} sessions
                    </p>
                  </div>

                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <ChartLine size={16} className="text-muted" />
                      <span className="theme-caption text-muted">Bounce Rate</span>
                    </div>
                    <p className="text-2xl font-display text-foreground">
                      {analytics.bounceRate}%
                    </p>
                    <p className="theme-secondary text-muted mt-1">
                      {analytics.bounceRate < 50 ? "Good" : analytics.bounceRate < 70 ? "Average" : "High"}
                    </p>
                  </div>

                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Timer size={16} className="text-muted" />
                      <span className="theme-caption text-muted">Avg. Duration</span>
                    </div>
                    <p className="text-2xl font-display text-foreground">
                      {Math.floor(analytics.avgSessionDuration / 60)}:{String(analytics.avgSessionDuration % 60).padStart(2, "0")}
                    </p>
                    <p className="theme-secondary text-muted mt-1">minutes</p>
                  </div>
                </div>

                {/* Conversion Rate */}
                {entries.length > 0 && analytics.visitors > 0 && (
                  <div className="p-4 border border-border rounded-lg mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="theme-caption text-muted mb-2">Conversion Rate</p>
                        <p className="text-2xl font-display text-foreground">
                          {((entries.length / analytics.visitors) * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div className="text-right theme-secondary text-muted">
                        <p>{entries.length} signups</p>
                        <p>{analytics.visitors} visitors</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Top Pages & Traffic Sources */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-border rounded-lg">
                    <p className="theme-caption text-muted mb-4">Top Pages</p>
                    <div className="space-y-3">
                      {analytics.topPages.map((page, i) => (
                        <div key={page.page} className="flex items-center justify-between">
                          <span className="theme-body-sm text-foreground truncate max-w-[200px]">
                            {page.page === "/" ? "Home" : page.page}
                          </span>
                          <span className="theme-body-sm text-muted">{page.views}</span>
                        </div>
                      ))}
                      {analytics.topPages.length === 0 && (
                        <p className="theme-body-sm text-muted">No data yet</p>
                      )}
                    </div>
                  </div>

                  <div className="p-4 border border-border rounded-lg">
                    <p className="theme-caption text-muted mb-4">Traffic Sources</p>
                    <div className="space-y-3">
                      {analytics.trafficSources.map((source) => (
                        <div key={source.source}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="theme-body-sm text-foreground">{source.source}</span>
                            <span className="theme-body-sm text-muted">{source.percentage}%</span>
                          </div>
                          <div className="h-1 bg-foreground/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-forest rounded-full"
                              style={{ width: `${source.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                      {analytics.trafficSources.length === 0 && (
                        <p className="theme-body-sm text-muted">No data yet</p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 border border-border rounded-lg">
                <p className="theme-body-sm text-muted">Failed to load analytics</p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => fetchAnalytics()}
                  className="mt-4"
                >
                  Retry
                </Button>
              </div>
            )}
          </div>

          {/* Waitlist Section */}
          <div className="pt-12 border-t border-border">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-display text-xl md:text-2xl text-foreground">
                  Waitlist
                </h2>
                <p className="theme-body-sm text-muted mt-1">
                  {entries.length} total · {sentCount} invited · {notSentCount} pending
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={fetchEntries}
                  className="gap-2"
                >
                  <ArrowClockwise size={14} weight="bold" />
                  Refresh
                </Button>
                <Button variant="secondary" size="sm" onClick={exportCSV} className="gap-2">
                  <DownloadSimple size={14} weight="bold" />
                  Export
                </Button>
              </div>
            </div>

            {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {[
              { value: "all", label: "All" },
              { value: "sent", label: "Invited" },
              { value: "not_sent", label: "Not Invited" },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => {
                  setFilter(f.value as FilterType);
                  setSelected(new Set());
                }}
                className={`h-8 px-4 rounded-lg text-[14px] font-button transition-colors ${
                  filter === f.value
                    ? "bg-forest/10 text-forest border border-forest/20"
                    : "border border-[rgba(0,0,0,0.08)] text-foreground hover:bg-foreground/5"
                }`}
              >
                {f.label}
                {f.value === "sent" && ` (${sentCount})`}
                {f.value === "not_sent" && ` (${notSentCount})`}
              </button>
            ))}
          </div>

          {/* Actions bar */}
          {selected.size > 0 && (
            <div className="flex items-center gap-3 mb-6 p-4 border border-border rounded-lg">
              <span className="theme-body-sm text-muted">
                {selected.size} selected
              </span>
              <Button
                variant="default"
                size="sm"
                onClick={sendEmails}
                disabled={sending || deleting}
                className="gap-2"
              >
                <PaperPlaneTilt size={14} weight="bold" />
                {sending ? "Sending..." : "Send Invite"}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={deleteEntries}
                disabled={sending || deleting}
                className="gap-2"
              >
                <Trash size={14} weight="bold" />
                {deleting ? "Deleting..." : "Delete"}
              </Button>
              <button
                onClick={() => setSelected(new Set())}
                className="text-[14px] font-button text-muted hover:text-foreground transition-colors ml-auto"
              >
                Clear
              </button>
            </div>
          )}

          {/* Message */}
          {message && (
            <div className="mb-6 p-4 border border-forest/20 bg-forest/5 text-forest rounded-lg theme-body-sm">
              {message}
            </div>
          )}

          {/* Table */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader size="md" />
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="text-center py-16 border border-border rounded-lg">
              <p className="theme-body-sm text-muted">No entries found</p>
            </div>
          ) : (
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="w-10 px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selected.size === filteredEntries.length && filteredEntries.length > 0}
                        onChange={selectAll}
                        className="w-4 h-4 rounded border-border accent-forest"
                      />
                    </th>
                    <th className="text-left px-4 py-4 theme-caption text-muted">
                      Email
                    </th>
                    <th className="text-left px-4 py-4 theme-caption text-muted hidden md:table-cell">
                      Source
                    </th>
                    <th className="text-center px-4 py-4 theme-caption text-muted">
                      Invited
                    </th>
                    <th className="text-left px-4 py-4 theme-caption text-muted hidden sm:table-cell">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredEntries.map((entry) => (
                    <tr
                      key={entry.id}
                      className={`hover:bg-foreground/[0.02] ${
                        selected.has(entry.id) ? "bg-forest/5" : ""
                      }`}
                    >
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selected.has(entry.id)}
                          onChange={() => toggleSelect(entry.id)}
                          className="w-4 h-4 rounded border-border accent-forest"
                        />
                      </td>
                      <td className="px-4 py-4 theme-body-sm text-foreground">{entry.email}</td>
                      <td className="px-4 py-4 theme-body-sm text-muted hidden md:table-cell">
                        {entry.source || "website"}
                      </td>
                      <td className="px-4 py-4 text-center">
                        {entry.emailSent ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-forest/20 text-forest">
                            <Check size={14} weight="bold" />
                          </span>
                        ) : (
                          <span className="inline-block w-6 h-6 rounded-full bg-foreground/10" />
                        )}
                      </td>
                      <td className="px-4 py-4 theme-body-sm text-muted hidden sm:table-cell">
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          </div>
          </>
          )}

          {/* Social Media Tools */}
          {activeTab === "social" && (
            <>
              <SocialExport posts={blogPosts} />
              <QuoteGenerator />
            </>
          )}

          {/* Survey Results */}
          {activeTab === "survey" && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="font-display text-xl md:text-2xl text-foreground">
                    Survey Results
                  </h2>
                  <p className="theme-body-sm text-muted mt-1">
                    {surveyData?.totalResponses || 0} total responses
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={fetchSurveyData}
                  disabled={surveyLoading}
                  className="gap-2"
                >
                  <ArrowClockwise size={14} weight="bold" className={surveyLoading ? "animate-spin" : ""} />
                  Refresh
                </Button>
              </div>

              {surveyLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader size="md" />
                </div>
              ) : !surveyData || surveyData.totalResponses === 0 ? (
                <div className="text-center py-16 border border-border rounded-lg">
                  <ClipboardText size={48} className="text-muted mx-auto mb-4" />
                  <p className="theme-body text-foreground mb-2">No survey responses yet</p>
                  <p className="theme-body-sm text-muted">
                    Share the survey at <span className="font-medium">/survey</span> to start collecting feedback
                  </p>
                </div>
              ) : (
                <>
                  {/* Key Metrics Row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="p-4 border border-border rounded-lg">
                      <p className="theme-caption text-muted mb-2">Total Responses</p>
                      <p className="text-2xl font-display text-foreground">
                        {surveyData.totalResponses}
                      </p>
                    </div>
                    <div className="p-4 border border-border rounded-lg">
                      <p className="theme-caption text-muted mb-2">Top Feature Request</p>
                      <p className="text-lg font-display text-foreground">
                        {surveyData.featurePriorities[0]?.label || "-"}
                      </p>
                    </div>
                    <div className="p-4 border border-border rounded-lg">
                      <p className="theme-caption text-muted mb-2">Top Connection Type</p>
                      <p className="text-lg font-display text-foreground">
                        {surveyData.connectionTypes[0]?.label || "-"}
                      </p>
                    </div>
                    <div className="p-4 border border-border rounded-lg">
                      <p className="theme-caption text-muted mb-2">Community Vibe</p>
                      <p className="text-lg font-display text-foreground">
                        {surveyData.communityVibeAvg
                          ? `${surveyData.communityVibeAvg}/5`
                          : "-"}
                      </p>
                      <p className="theme-secondary text-muted">
                        {surveyData.communityVibeAvg && surveyData.communityVibeAvg <= 2
                          ? "Venting focus"
                          : surveyData.communityVibeAvg && surveyData.communityVibeAvg >= 4
                          ? "Celebration focus"
                          : surveyData.communityVibeAvg
                          ? "Balanced"
                          : ""}
                      </p>
                    </div>
                  </div>

                  {/* Charts Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Feature Priorities */}
                    <div className="p-4 border border-border rounded-lg">
                      <p className="theme-caption text-muted mb-4">Feature Priorities (Ranked)</p>
                      <div className="space-y-3">
                        {surveyData.featurePriorities.map((feature, i) => (
                          <div key={feature.key}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="theme-body-sm text-foreground flex items-center gap-2">
                                <span className="text-muted">#{i + 1}</span>
                                {feature.label}
                              </span>
                              <span className="theme-body-sm text-muted">{feature.percentage}%</span>
                            </div>
                            <div className="h-2 bg-foreground/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-forest rounded-full transition-all"
                                style={{ width: `${feature.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Connection Types */}
                    <div className="p-4 border border-border rounded-lg">
                      <p className="theme-caption text-muted mb-4">Connection Types Sought</p>
                      <div className="space-y-3">
                        {surveyData.connectionTypes.map((type) => (
                          <div key={type.key}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="theme-body-sm text-foreground">{type.label}</span>
                              <span className="theme-body-sm text-muted">{type.percentage}%</span>
                            </div>
                            <div className="h-2 bg-foreground/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-sage rounded-full transition-all"
                                style={{ width: `${type.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Activities */}
                    <div className="p-4 border border-border rounded-lg">
                      <p className="theme-caption text-muted mb-4">Interested Activities</p>
                      <div className="space-y-3">
                        {surveyData.activities.slice(0, 6).map((activity) => (
                          <div key={activity.key}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="theme-body-sm text-foreground">{activity.label}</span>
                              <span className="theme-body-sm text-muted">{activity.percentage}%</span>
                            </div>
                            <div className="h-2 bg-foreground/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gold rounded-full transition-all"
                                style={{ width: `${activity.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Contribution Types */}
                    <div className="p-4 border border-border rounded-lg">
                      <p className="theme-caption text-muted mb-4">How They Want to Contribute</p>
                      <div className="space-y-3">
                        {surveyData.contributionTypes.map((type) => (
                          <div key={type.key}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="theme-body-sm text-foreground">{type.label}</span>
                              <span className="theme-body-sm text-muted">{type.percentage}%</span>
                            </div>
                            <div className="h-2 bg-foreground/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-coral rounded-full transition-all"
                                style={{ width: `${type.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Demographics Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Age Ranges */}
                    <div className="p-4 border border-border rounded-lg">
                      <p className="theme-caption text-muted mb-4">Age Distribution</p>
                      <div className="flex items-end gap-2 h-32">
                        {surveyData.ageRanges.map((age) => (
                          <div key={age.range} className="flex-1 flex flex-col items-center">
                            <div
                              className="w-full bg-forest/80 rounded-t transition-all"
                              style={{ height: `${Math.max(age.percentage, 5)}%` }}
                            />
                            <p className="theme-secondary text-muted mt-2">{age.range}</p>
                            <p className="theme-secondary text-foreground">{age.percentage}%</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Top Countries */}
                    <div className="p-4 border border-border rounded-lg">
                      <p className="theme-caption text-muted mb-4">Top Locations</p>
                      <div className="space-y-2">
                        {surveyData.countries.slice(0, 5).map((loc) => (
                          <div key={loc.country} className="flex items-center justify-between">
                            <span className="theme-body-sm text-foreground">{loc.country}</span>
                            <span className="theme-body-sm text-muted">
                              {loc.count} ({loc.percentage}%)
                            </span>
                          </div>
                        ))}
                        {surveyData.countries.length === 0 && (
                          <p className="theme-body-sm text-muted">No location data yet</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Recent Open-Ended Responses */}
                  <div className="border-t border-border pt-8">
                    <h3 className="font-display text-lg text-foreground mb-4">Recent Responses</h3>
                    <div className="space-y-4">
                      {surveyData.recentResponses.filter(r => r.painPoints || r.idealFirstMonth || r.hardestPart).slice(0, 10).map((response) => (
                        <div key={response.id} className="p-4 border border-border rounded-lg">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="theme-secondary text-muted">
                              {new Date(response.createdAt).toLocaleDateString()}
                            </span>
                            {response.ageRange && (
                              <span className="px-2 py-0.5 bg-foreground/5 rounded text-xs text-muted">
                                {response.ageRange}
                              </span>
                            )}
                            {response.country && (
                              <span className="px-2 py-0.5 bg-foreground/5 rounded text-xs text-muted">
                                {response.country}
                              </span>
                            )}
                            {response.email && (
                              <span className="px-2 py-0.5 bg-forest/10 rounded text-xs text-forest">
                                Left email
                              </span>
                            )}
                          </div>
                          {response.hardestPart && (
                            <div className="mb-2">
                              <p className="theme-caption text-muted">Hardest Part</p>
                              <p className="theme-body-sm text-foreground">{response.hardestPart}</p>
                            </div>
                          )}
                          {response.painPoints && (
                            <div className="mb-2">
                              <p className="theme-caption text-muted">Pain Points</p>
                              <p className="theme-body-sm text-foreground">{response.painPoints}</p>
                            </div>
                          )}
                          {response.idealFirstMonth && (
                            <div>
                              <p className="theme-caption text-muted">Ideal First Month</p>
                              <p className="theme-body-sm text-foreground">{response.idealFirstMonth}</p>
                            </div>
                          )}
                        </div>
                      ))}
                      {surveyData.recentResponses.filter(r => r.painPoints || r.idealFirstMonth || r.hardestPart).length === 0 && (
                        <p className="theme-body-sm text-muted text-center py-8">
                          No open-ended responses yet
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}
