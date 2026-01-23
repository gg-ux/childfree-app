"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { SignOut, User, Heart, Users, Calendar } from "@phosphor-icons/react";
import { Loader } from "@/components/ui/loader";

interface UserData {
  id: string;
  email: string;
  status: string;
  onboardingStep: number;
  hasProfile: boolean;
  profile: {
    displayName: string;
    isVerified: boolean;
  } | null;
}

export default function DiscoverPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/check");
        const data = await res.json();

        if (!data.authenticated) {
          router.push("/auth/signup");
          return;
        }

        if (data.user.onboardingStep < 4) {
          router.push("/onboarding");
          return;
        }

        setUser(data.user);
      } catch {
        router.push("/auth/signup");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-[rgba(0,0,0,0.06)]">
        <div className="container-main h-16 flex items-center justify-between">
          <Link href="/discover">
            <Logo variant="full" size="sm" />
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted hidden sm:block">
              {user.profile?.displayName || user.email}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
            >
              <SignOut size={16} weight="bold" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-display text-3xl md:text-4xl text-foreground mb-3">
              Welcome, {user.profile?.displayName}!
            </h1>
            <p className="theme-body text-muted max-w-md mx-auto">
              Your profile is set up. This is where you&apos;ll discover other
              childfree people in your area.
            </p>
          </div>

          {/* Coming soon cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-foreground/[0.02] border border-border rounded-2xl p-6 text-center">
              <div className="w-14 h-14 bg-forest/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart size={28} className="text-forest" />
              </div>
              <h3 className="font-display text-lg text-foreground mb-2">
                Find Connections
              </h3>
              <p className="text-sm text-muted">
                Browse profiles and connect with childfree people who share your
                interests.
              </p>
              <span className="inline-block mt-4 px-3 py-1 bg-forest/10 text-forest text-xs font-medium rounded-full">
                Coming Soon
              </span>
            </div>

            <div className="bg-foreground/[0.02] border border-border rounded-2xl p-6 text-center">
              <div className="w-14 h-14 bg-coral/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={28} className="text-coral" />
              </div>
              <h3 className="font-display text-lg text-foreground mb-2">
                Join Groups
              </h3>
              <p className="text-sm text-muted">
                Find local childfree groups and communities to join.
              </p>
              <span className="inline-block mt-4 px-3 py-1 bg-coral/10 text-coral text-xs font-medium rounded-full">
                Coming Soon
              </span>
            </div>

            <div className="bg-foreground/[0.02] border border-border rounded-2xl p-6 text-center">
              <div className="w-14 h-14 bg-marigold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar size={28} className="text-marigold" />
              </div>
              <h3 className="font-display text-lg text-foreground mb-2">
                Attend Events
              </h3>
              <p className="text-sm text-muted">
                Discover childfree meetups and events happening near you.
              </p>
              <span className="inline-block mt-4 px-3 py-1 bg-marigold/10 text-marigold text-xs font-medium rounded-full">
                Coming Soon
              </span>
            </div>
          </div>

          {/* Profile card */}
          <div className="mt-12 bg-foreground/[0.02] border border-border rounded-2xl p-6 max-w-md mx-auto">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-forest/20 rounded-full flex items-center justify-center">
                <User size={32} className="text-forest" />
              </div>
              <div>
                <h3 className="font-display text-lg text-foreground">
                  {user.profile?.displayName}
                </h3>
                <p className="text-sm text-muted">{user.email}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <Link
                href="/profile/edit"
                className="text-forest hover:underline text-sm"
              >
                Edit your profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
