"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setError("No token provided");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (res.ok) {
          setStatus("success");

          // Redirect based on onboarding status
          setTimeout(() => {
            if (data.needsOnboarding) {
              router.push("/onboarding");
            } else {
              router.push("/discover");
            }
          }, 1500);
        } else {
          setStatus("error");
          setError(data.error || "Verification failed");
        }
      } catch {
        setStatus("error");
        setError("Something went wrong");
      }
    };

    verify();
  }, [searchParams, router]);

  return (
    <>
      {status === "verifying" && (
        <div>
          <div className="w-10 h-10 border-2 border-forest border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted">Signing you in...</p>
        </div>
      )}

      {status === "success" && (
        <div>
          <div className="w-14 h-14 bg-forest/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-7 h-7 text-forest"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="text-foreground font-medium text-lg">Welcome!</p>
          <p className="text-muted text-sm mt-1">Setting up your account...</p>
        </div>
      )}

      {status === "error" && (
        <div>
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-7 h-7 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <p className="text-foreground font-medium">Verification failed</p>
          <p className="text-muted text-sm mt-1">{error}</p>
          <Link
            href="/auth/signup"
            className="inline-block mt-6 text-forest hover:underline"
          >
            Try again
          </Link>
        </div>
      )}
    </>
  );
}

function LoadingState() {
  return (
    <div>
      <div className="w-10 h-10 border-2 border-forest border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-muted">Loading...</p>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-sm text-center">
        <div className="mb-8">
          <Logo variant="full" size="sm" />
        </div>
        <Suspense fallback={<LoadingState />}>
          <VerifyContent />
        </Suspense>
      </div>
    </div>
  );
}
