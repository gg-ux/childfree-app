"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { Envelope, ArrowRight } from "@phosphor-icons/react";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  // Check if already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/check");
        const data = await res.json();

        if (data.authenticated) {
          if (data.user.onboardingStep < 5) {
            router.push("/onboarding");
          } else {
            router.push("/discover");
          }
        }
      } catch {
        // Not authenticated, stay on page
      }
    };

    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === "sending") return;

    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/auth/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("sent");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to send login link");
        setStatus("idle");
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("idle");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-[rgba(0,0,0,0.06)]">
        <div className="container-main h-16 flex items-center justify-between">
          <Link href="/">
            <Logo variant="full" size="sm" />
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 pt-16">
        <div className="w-full max-w-sm">
          {status === "sent" ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-forest/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Envelope size={32} className="text-forest" />
              </div>
              <h1 className="font-display text-2xl text-foreground mb-2">
                Check your email
              </h1>
              <p className="theme-body text-muted mb-6">
                We sent a magic link to <span className="text-foreground font-medium">{email}</span>
              </p>
              <p className="text-sm text-muted">
                Click the link in the email to sign in. The link expires in 15 minutes.
              </p>
              <button
                onClick={() => {
                  setStatus("idle");
                  setEmail("");
                }}
                className="mt-6 text-forest hover:underline text-sm"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <>
              <h1 className="font-display text-3xl text-foreground mb-2">
                Join Flourish
              </h1>
              <p className="theme-body text-muted mb-8">
                Connect with childfree adults who get it.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="sr-only">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 h-14 rounded-xl border border-border bg-background text-base focus:outline-none focus:border-forest transition-colors"
                    disabled={status === "sending"}
                    autoFocus
                  />
                </div>

                <Button
                  type="submit"
                  variant="accent"
                  className="w-full h-14 text-base gap-2"
                  disabled={status === "sending" || !email}
                >
                  {status === "sending" ? (
                    "Sending..."
                  ) : (
                    <>
                      Continue
                      <ArrowRight size={20} weight="bold" />
                    </>
                  )}
                </Button>

                {error && (
                  <p className="text-red-500 text-sm text-center">{error}</p>
                )}
              </form>

              <p className="mt-8 text-center text-sm text-muted">
                Already have an account?{" "}
                <Link href="/auth/signup" className="text-forest hover:underline">
                  Sign in
                </Link>
              </p>

              <p className="mt-6 text-center text-xs text-muted">
                By continuing, you agree to our{" "}
                <Link href="/terms" className="underline hover:text-foreground">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="underline hover:text-foreground">
                  Privacy Policy
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
