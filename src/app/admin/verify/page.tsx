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
        const res = await fetch("/api/admin/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          setTimeout(() => {
            router.push("/admin");
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
          <div className="w-8 h-8 border-2 border-forest border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted">Verifying your login...</p>
        </div>
      )}

      {status === "success" && (
        <div>
          <div className="w-12 h-12 bg-forest/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-forest" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-foreground font-medium">You&apos;re logged in!</p>
          <p className="text-muted text-sm mt-1">Redirecting to dashboard...</p>
        </div>
      )}

      {status === "error" && (
        <div>
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-foreground font-medium">Verification failed</p>
          <p className="text-muted text-sm mt-1">{error}</p>
          <Link
            href="/admin"
            className="inline-block mt-4 text-forest hover:underline text-sm"
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
      <div className="w-8 h-8 border-2 border-forest border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-muted">Loading...</p>
    </div>
  );
}

export default function AdminVerifyPage() {
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
