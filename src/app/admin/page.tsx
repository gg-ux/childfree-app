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
} from "@phosphor-icons/react";

interface WaitlistEntry {
  id: string;
  email: string;
  source: string | null;
  emailSent: boolean;
  emailSentAt: string | null;
  createdAt: string;
}

type FilterType = "all" | "sent" | "not_sent";

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
  const [message, setMessage] = useState("");

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
        <div className="w-8 h-8 border-2 border-forest border-t-transparent rounded-full animate-spin" />
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
              <Logo variant="full" size="sm" />
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
                <p className="text-foreground font-medium">Check your email</p>
                <p className="text-muted text-sm mt-1">
                  We sent a login link to {loginEmail}
                </p>
                <button
                  onClick={() => setLoginStatus("idle")}
                  className="text-forest hover:underline text-sm mt-4"
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
                  className="w-full px-4 h-12 rounded-lg border border-border bg-background text-base focus:outline-none focus:border-forest"
                  disabled={loginStatus === "sending"}
                />
                <Button
                  type="submit"
                  variant="accent"
                  className="w-full h-12"
                  disabled={loginStatus === "sending" || !loginEmail}
                >
                  {loginStatus === "sending" ? "Sending..." : "Send login link"}
                </Button>
                {error && <p className="text-red-500 text-sm">{error}</p>}
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
          <Link href="/">
            <Logo variant="full" size="sm" />
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted hidden sm:block">{email}</span>
            <Button variant="secondary" size="sm" onClick={handleLogout} className="gap-2">
              <SignOut size={16} weight="bold" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-6 md:px-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="font-display text-2xl md:text-3xl text-foreground">
                Waitlist Dashboard
              </h1>
              <p className="theme-body text-muted mt-1">
                {entries.length} total · {sentCount} emails sent · {notSentCount} pending
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={fetchEntries}
                className="gap-2"
              >
                <ArrowClockwise size={16} weight="bold" />
                Refresh
              </Button>
              <Button variant="secondary" onClick={exportCSV} className="gap-2">
                <DownloadSimple size={16} weight="bold" />
                Export
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="theme-caption text-muted">Filter:</span>
            {[
              { value: "all", label: "All" },
              { value: "sent", label: "Sent" },
              { value: "not_sent", label: "Not Sent" },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => {
                  setFilter(f.value as FilterType);
                  setSelected(new Set());
                }}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                  filter === f.value
                    ? "bg-forest text-white"
                    : "bg-foreground/5 text-foreground hover:bg-foreground/10"
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
            <div className="flex items-center gap-4 mb-4 p-3 bg-forest/10 rounded-lg">
              <span className="text-sm text-foreground">
                {selected.size} selected
              </span>
              <Button
                variant="accent"
                size="sm"
                onClick={sendEmails}
                disabled={sending}
                className="gap-2"
              >
                <PaperPlaneTilt size={16} weight="bold" />
                {sending ? "Sending..." : "Send Email"}
              </Button>
              <button
                onClick={() => setSelected(new Set())}
                className="text-sm text-muted hover:text-foreground"
              >
                Clear selection
              </button>
            </div>
          )}

          {/* Message */}
          {message && (
            <div className="mb-4 p-3 bg-forest/10 text-forest rounded-lg text-sm">
              {message}
            </div>
          )}

          {/* Table */}
          {loading ? (
            <p className="text-muted">Loading...</p>
          ) : filteredEntries.length === 0 ? (
            <div className="text-center py-16 border border-border rounded-lg">
              <p className="text-muted">No entries found</p>
            </div>
          ) : (
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-foreground/5">
                  <tr>
                    <th className="w-10 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.size === filteredEntries.length && filteredEntries.length > 0}
                        onChange={selectAll}
                        className="w-4 h-4 rounded border-border"
                      />
                    </th>
                    <th className="text-left px-4 py-3 theme-caption text-muted">
                      Email
                    </th>
                    <th className="text-left px-4 py-3 theme-caption text-muted hidden md:table-cell">
                      Source
                    </th>
                    <th className="text-center px-4 py-3 theme-caption text-muted">
                      Sent
                    </th>
                    <th className="text-left px-4 py-3 theme-caption text-muted hidden sm:table-cell">
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
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selected.has(entry.id)}
                          onChange={() => toggleSelect(entry.id)}
                          className="w-4 h-4 rounded border-border"
                        />
                      </td>
                      <td className="px-4 py-3 text-foreground">{entry.email}</td>
                      <td className="px-4 py-3 text-muted hidden md:table-cell">
                        {entry.source || "website"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {entry.emailSent ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-forest/20 text-forest">
                            <Check size={14} weight="bold" />
                          </span>
                        ) : (
                          <span className="inline-block w-6 h-6 rounded-full bg-foreground/10" />
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted hidden sm:table-cell">
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
