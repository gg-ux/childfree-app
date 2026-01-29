"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { UserCircle, GearSix, SignOut } from "@phosphor-icons/react";

interface UserData {
  id: string;
  email: string;
  profile: {
    displayName: string;
    avatarUrl: string | null;
  } | null;
}

export function AuthNav() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [checked, setChecked] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/auth/check")
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated) setUser(data.user);
        setChecked(true);
      })
      .catch(() => setChecked(true));
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  if (!checked) {
    // Render a minimal placeholder nav to avoid layout shift
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-[rgba(0,0,0,0.06)]">
        <div className="container-main h-16 flex items-center justify-between">
          <Link href="/">
            <Logo variant="full" size="md" />
          </Link>
          <div className="w-20" />
        </div>
      </nav>
    );
  }

  if (user) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 frosted border-b border-border">
        <div className="container-main h-16 flex items-center justify-between">
          <Link href="/home">
            <Logo variant="full" size="sm" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <span className="theme-secondary hidden sm:block">
                  {user.profile?.displayName || user.email}
                </span>
                {user.profile?.avatarUrl ? (
                  <img
                    src={user.profile.avatarUrl}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-forest/20 flex items-center justify-center">
                    <span className="text-forest text-xs font-[600]">
                      {(user.profile?.displayName || user.email)[0].toUpperCase()}
                    </span>
                  </div>
                )}
              </button>
              {showMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-background rounded-xl border border-border shadow-lg overflow-hidden z-50">
                  <Link
                    href="/profile"
                    onClick={() => setShowMenu(false)}
                    className="flex items-center gap-3 px-4 py-2.5 theme-body-sm text-foreground hover:bg-foreground/5 transition-colors"
                  >
                    <UserCircle size={18} weight="duotone" />
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setShowMenu(false)}
                    className="flex items-center gap-3 px-4 py-2.5 theme-body-sm text-foreground hover:bg-foreground/5 transition-colors"
                  >
                    <GearSix size={18} weight="duotone" />
                    Settings
                  </Link>
                  <div className="border-t border-border" />
                  <button
                    onClick={() => { setShowMenu(false); handleLogout(); }}
                    className="flex items-center gap-3 px-4 py-2.5 theme-body-sm text-foreground hover:bg-foreground/5 transition-colors w-full text-left"
                  >
                    <SignOut size={18} weight="duotone" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // Not authenticated — public nav
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-[rgba(0,0,0,0.06)]">
      <div className="container-main h-16 flex items-center justify-between">
        <Link href="/">
          <Logo variant="full" size="md" />
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/blog"
            className="text-[15px] text-muted hover:text-foreground transition-colors"
            style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 450 }}
          >
            Blog
          </Link>
          <Button asChild variant="accent" size="md">
            <Link href="/sign-up">Join waitlist</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
