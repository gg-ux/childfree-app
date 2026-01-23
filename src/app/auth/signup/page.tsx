"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { Loader } from "@/components/ui/loader";
import {
  Envelope,
  ArrowRight,
  GoogleLogo,
  AppleLogo,
} from "@phosphor-icons/react";

const ERROR_MESSAGES: Record<string, string> = {
  oauth_not_configured: "Social login is not available yet. Please use email.",
  token_exchange_failed: "Sign in failed. Please try again.",
  user_info_failed: "Couldn't get your info. Please try again.",
  no_email: "No email found. Please use email sign in.",
  oauth_failed: "Sign in failed. Please try again.",
  access_denied: "Access was denied. Please try again.",
};

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check for OAuth errors in URL
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      setError(ERROR_MESSAGES[errorParam] || "Sign in failed. Please try again.");
      // Clear the error from URL
      window.history.replaceState({}, "", "/auth/signup");
    }
  }, [searchParams]);

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
      } finally {
        setCheckingAuth(false);
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

  const handleGoogleSignIn = () => {
    window.location.href = "/api/auth/google";
  };

  const handleAppleSignIn = () => {
    window.location.href = "/api/auth/apple";
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-[rgba(0,0,0,0.06)]">
        <div className="container-main h-16 flex items-center justify-between">
          <Link href="/">
            <Logo variant="full" size="md" />
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex pt-16">
        {/* Left side - Image (hidden on mobile) */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <Image
            src="/assets/onboarding/date.png"
            alt="Couple on a date"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Right side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">
          {status === "sent" ? (
            <div className="text-center">
              <div className="w-20 h-20 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Envelope size={40} weight="duotone" className="text-forest" />
              </div>
              <h1 className="font-display text-2xl text-foreground mb-3">
                Check your email
              </h1>
              <p className="theme-body text-muted mb-2">
                We sent a magic link to
              </p>
              <p className="text-foreground font-medium mb-6">{email}</p>
              <p className="text-sm text-muted">
                Click the link in the email to sign in.
                <br />
                The link expires in 15 minutes.
              </p>
              <button
                onClick={() => {
                  setStatus("idle");
                  setEmail("");
                }}
                className="mt-8 text-forest hover:underline text-sm font-medium"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="font-display text-3xl md:text-4xl text-foreground mb-3 tracking-tight">
                  Join Chosn
                </h1>
                <p className="theme-body text-muted text-lg">
                  Connect with childfree adults who get it.
                </p>
              </div>

              {/* Social sign in buttons */}
              <div className="space-y-3 mb-6">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleGoogleSignIn}
                  className="w-full"
                >
                  <GoogleLogo size={22} weight="bold" />
                  Continue with Google
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleAppleSignIn}
                  className="w-full"
                >
                  <AppleLogo size={22} weight="fill" />
                  Continue with Apple
                </Button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-border" />
                <span className="text-sm text-muted">or</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Email form */}
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
                    className="w-full px-4 h-14 rounded-xl border border-border bg-background text-base font-[450] placeholder:text-muted/50 focus:outline-none focus:border-forest transition-colors duration-300"
                    disabled={status === "sending"}
                  />
                </div>

                <Button
                  type="submit"
                  variant="accent"
                  size="lg"
                  className="w-full"
                  disabled={status === "sending" || !email}
                >
                  {status === "sending" ? (
                    "Sending..."
                  ) : (
                    <>
                      Continue with email
                      <ArrowRight size={20} weight="bold" />
                    </>
                  )}
                </Button>

                {error && (
                  <p className="text-coral text-xs font-[450] text-center">{error}</p>
                )}
              </form>

              <p className="mt-8 text-center text-xs text-muted leading-relaxed">
                By continuing, you agree to our{" "}
                <Link href="/terms" className="underline hover:text-foreground">
                  Terms of Service
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
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader size="lg" />
        </div>
      }
    >
      <SignupContent />
    </Suspense>
  );
}
