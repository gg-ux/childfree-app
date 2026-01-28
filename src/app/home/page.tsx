"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import {
  UserCircle,
  GearSix,
  SignOut,
  ArrowRight,
  DeviceMobileCamera,
} from "@phosphor-icons/react";
import { Loader } from "@/components/ui/loader";

interface UserData {
  id: string;
  email: string;
  profile: {
    displayName: string;
    avatarUrl: string | null;
  } | null;
}

// Blog — multi-panel Bauhaus composition
function BlogArt() {
  return (
    <svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Top — forest */}
      <rect x="0" y="0" width="400" height="140" fill="#2F7255"/>
      {/* Bottom-left — marigold */}
      <rect x="0" y="140" width="200" height="100" fill="#D9A441"/>
      {/* Bottom-right — dark */}
      <rect x="200" y="140" width="200" height="100" fill="#19131D"/>
      {/* Large cream page shape — centered */}
      <rect x="100" y="30" width="200" height="170" fill="#F5F0E8"/>
      {/* Coral spine */}
      <rect x="195" y="30" width="10" height="170" fill="#D4654A"/>
      {/* Abstract text lines — left page */}
      <g stroke="#2F7255" strokeWidth="4" strokeLinecap="round" opacity="0.25">
        <line x1="125" y1="70" x2="175" y2="70"/>
        <line x1="125" y1="90" x2="165" y2="90"/>
        <line x1="125" y1="110" x2="170" y2="110"/>
        <line x1="125" y1="130" x2="160" y2="130"/>
        <line x1="125" y1="150" x2="172" y2="150"/>
      </g>
      {/* Abstract text lines — right page */}
      <g stroke="#2F7255" strokeWidth="4" strokeLinecap="round" opacity="0.25">
        <line x1="225" y1="70" x2="275" y2="70"/>
        <line x1="225" y1="90" x2="268" y2="90"/>
        <line x1="225" y1="110" x2="272" y2="110"/>
        <line x1="225" y1="130" x2="260" y2="130"/>
        <line x1="225" y1="150" x2="270" y2="150"/>
      </g>
      {/* Coral quarter-circle — top-left */}
      <path d="M0 0 L0 70 A70 70 0 0 0 70 0 Z" fill="#D4654A"/>
      {/* Dot grid — bottom-right */}
      <g fill="#F5F0E8" opacity="0.3">
        <circle cx="330" cy="170" r="3"/><circle cx="346" cy="170" r="3"/><circle cx="362" cy="170" r="3"/><circle cx="378" cy="170" r="3"/>
        <circle cx="330" cy="186" r="3"/><circle cx="346" cy="186" r="3"/><circle cx="362" cy="186" r="3"/><circle cx="378" cy="186" r="3"/>
        <circle cx="330" cy="202" r="3"/><circle cx="346" cy="202" r="3"/><circle cx="362" cy="202" r="3"/><circle cx="378" cy="202" r="3"/>
      </g>
    </svg>
  );
}

// Events — bold geometric calendar panels
function EventsArt() {
  return (
    <svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Top strip — marigold */}
      <rect x="0" y="0" width="400" height="70" fill="#D9A441"/>
      {/* Bottom — coral */}
      <rect x="0" y="70" width="400" height="170" fill="#D4654A"/>
      {/* Dark block — bottom left */}
      <rect x="0" y="150" width="140" height="90" fill="#19131D"/>
      {/* Large white calendar slab */}
      <rect x="90" y="30" width="220" height="180" fill="#F5F0E8"/>
      {/* Green header */}
      <rect x="90" y="30" width="220" height="45" fill="#2F7255"/>
      {/* Hook details */}
      <rect x="140" y="18" width="10" height="28" rx="5" fill="#19131D"/>
      <rect x="250" y="18" width="10" height="28" rx="5" fill="#19131D"/>
      {/* Day grid — bold circles */}
      <g fill="#D4654A">
        <circle cx="130" cy="105" r="8"/><circle cx="165" cy="105" r="8"/><circle cx="200" cy="105" r="8"/><circle cx="235" cy="105" r="8"/><circle cx="270" cy="105" r="8"/>
        <circle cx="130" cy="140" r="8"/><circle cx="165" cy="140" r="8"/>
        <circle cx="235" cy="140" r="8"/><circle cx="270" cy="140" r="8"/>
        <circle cx="130" cy="175" r="8"/><circle cx="165" cy="175" r="8"/><circle cx="200" cy="175" r="8"/><circle cx="235" cy="175" r="8"/><circle cx="270" cy="175" r="8"/>
      </g>
      {/* Highlighted day — large marigold */}
      <circle cx="200" cy="140" r="16" fill="#D9A441"/>
      {/* Accent triangle */}
      <polygon points="370,0 400,0 400,40" fill="#2F7255"/>
    </svg>
  );
}

// Interest Groups — network nodes, multi-panel
function GroupsArt() {
  return (
    <svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Left — marigold */}
      <rect x="0" y="0" width="180" height="240" fill="#D9A441"/>
      {/* Right — forest */}
      <rect x="180" y="0" width="220" height="240" fill="#2F7255"/>
      {/* Dark strip bottom */}
      <rect x="0" y="190" width="180" height="50" fill="#19131D"/>
      {/* Connection lines — thick */}
      <g stroke="#F5F0E8" strokeWidth="6">
        <line x1="90" y1="70" x2="200" y2="120"/>
        <line x1="200" y1="120" x2="320" y2="65"/>
        <line x1="200" y1="120" x2="110" y2="170"/>
        <line x1="200" y1="120" x2="310" y2="185"/>
        <line x1="110" y1="170" x2="310" y2="185"/>
        <line x1="90" y1="70" x2="320" y2="65"/>
      </g>
      {/* Nodes */}
      <circle cx="90" cy="70" r="24" fill="#F5F0E8"/>
      <circle cx="90" cy="70" r="10" fill="#19131D"/>
      <circle cx="320" cy="65" r="24" fill="#F5F0E8"/>
      <circle cx="320" cy="65" r="10" fill="#D4654A"/>
      <circle cx="110" cy="170" r="24" fill="#F5F0E8"/>
      <circle cx="110" cy="170" r="10" fill="#D9A441"/>
      <circle cx="310" cy="185" r="24" fill="#F5F0E8"/>
      <circle cx="310" cy="185" r="10" fill="#19131D"/>
      {/* Center — largest */}
      <circle cx="200" cy="120" r="34" fill="#D4654A"/>
      <circle cx="200" cy="120" r="16" fill="#F5F0E8"/>
      {/* Accent */}
      <rect x="350" y="0" width="50" height="30" fill="#D4654A"/>
    </svg>
  );
}

// Dating — two figures reaching, Venn overlap
function DatingArt() {
  return (
    <svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Left — coral */}
      <rect x="0" y="0" width="200" height="240" fill="#D4654A"/>
      {/* Right — dark */}
      <rect x="200" y="0" width="200" height="240" fill="#19131D"/>
      {/* Marigold strip top-right */}
      <rect x="300" y="0" width="100" height="60" fill="#D9A441"/>
      {/* Forest block bottom-left */}
      <rect x="0" y="180" width="120" height="60" fill="#2F7255"/>
      {/* Two overlapping circles — Venn */}
      <circle cx="165" cy="120" r="70" fill="#F5F0E8"/>
      <circle cx="235" cy="120" r="70" fill="#F5F0E8"/>
      {/* Overlap — marigold */}
      <clipPath id="dating-clip">
        <circle cx="165" cy="120" r="70"/>
      </clipPath>
      <circle cx="235" cy="120" r="70" fill="#D9A441" clipPath="url(#dating-clip)"/>
      {/* Inner circles */}
      <circle cx="140" cy="120" r="18" fill="#D4654A"/>
      <circle cx="260" cy="120" r="18" fill="#19131D"/>
      {/* Dot accent */}
      <g fill="#F5F0E8" opacity="0.4">
        <circle cx="340" cy="180" r="4"/><circle cx="358" cy="180" r="4"/><circle cx="376" cy="180" r="4"/>
        <circle cx="340" cy="198" r="4"/><circle cx="358" cy="198" r="4"/><circle cx="376" cy="198" r="4"/>
      </g>
    </svg>
  );
}


const WIDGETS = [
  {
    title: "Blog",
    description: "Stories and resources for the childfree life.",
    art: BlogArt,
    href: "/blog",
    active: true,
  },
  {
    title: "Events & Meetups",
    description: "Discover childfree-friendly events near you.",
    art: EventsArt,
    href: "/discover",
    active: true,
  },
  {
    title: "Interest Groups",
    description: "Join online communities around shared hobbies and interests.",
    art: GroupsArt,
    href: null,
    active: false,
  },
  {
    title: "Local Matching",
    description: "Meet childfree people near you for dating and friendship.",
    art: DatingArt,
    href: null,
    active: false,
  },
];

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const avatarMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/check");
        const data = await res.json();
        if (!data.authenticated) {
          router.push("/auth/signup");
          return;
        }
        setUser(data.user);
      } catch {
        router.push("/auth/signup");
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(e.target as Node)) {
        setShowAvatarMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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
      <nav className="fixed top-0 left-0 right-0 z-50 frosted border-b border-border">
        <div className="container-main h-16 flex items-center justify-between">
          <Link href="/home">
            <Logo variant="full" size="sm" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="relative" ref={avatarMenuRef}>
              <button onClick={() => setShowAvatarMenu(!showAvatarMenu)} className="hover:opacity-80 transition-opacity focus:outline-none">
                {user.profile?.avatarUrl ? (
                  <img src={user.profile.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover aspect-square" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-forest/20 flex items-center justify-center aspect-square">
                    <span className="text-forest text-xs font-[600]">{(user.profile?.displayName || user.email)[0].toUpperCase()}</span>
                  </div>
                )}
              </button>
              {showAvatarMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-background rounded-xl border border-border shadow-lg overflow-hidden z-50">
                  <div className="flex items-center gap-3.5 px-4 py-4 border-b border-border">
                    {user.profile?.avatarUrl ? (
                      <img src={user.profile.avatarUrl} alt="" className="w-12 h-12 rounded-full object-cover aspect-square" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-forest/20 flex items-center justify-center aspect-square">
                        <span className="text-forest text-base font-[600]">{(user.profile?.displayName || user.email)[0].toUpperCase()}</span>
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-display text-lg text-foreground leading-tight">{user.profile?.displayName || user.email}</p>
                      <p className="text-xs text-forest font-button flex items-center gap-1 mt-1">
                        <span className="w-2 h-2 rounded-full bg-forest" />
                        Online
                      </p>
                    </div>
                  </div>
                  <Link href="/profile" onClick={() => setShowAvatarMenu(false)} className="flex items-center gap-3 px-4 py-2.5 theme-body-sm text-foreground hover:bg-foreground/5 transition-colors">
                    <UserCircle size={18} weight="duotone" /> Profile
                  </Link>
                  <Link href="/settings" onClick={() => setShowAvatarMenu(false)} className="flex items-center gap-3 px-4 py-2.5 theme-body-sm text-foreground hover:bg-foreground/5 transition-colors">
                    <GearSix size={18} weight="duotone" /> Settings
                  </Link>
                  <div className="border-t border-border" />
                  <button onClick={() => { setShowAvatarMenu(false); handleLogout(); }} className="flex items-center gap-3 px-4 py-2.5 theme-body-sm text-foreground hover:bg-foreground/5 transition-colors w-full text-left">
                    <SignOut size={18} weight="duotone" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="pt-28 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-fluid-h2 text-foreground leading-[0.9] tracking-tight mb-2">
            Welcome back{user.profile?.displayName ? `, ${user.profile.displayName}` : ""}
          </h1>
          <p className="theme-body text-muted mb-10">
            Your childfree home base
          </p>

          {/* Mobile app toast */}
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-forest/10 border border-forest/20 mb-8">
            <DeviceMobileCamera size={18} weight="duotone" className="text-forest shrink-0" />
            <p className="theme-body-sm text-forest">
              A native iOS and Android app is currently in development. Stay tuned for updates.
            </p>
          </div>

          {/* Widget grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {WIDGETS.map((widget) => {
              const content = (
                <div
                  key={widget.title}
                  className={`rounded-2xl border border-border bg-background overflow-hidden transition-all duration-300 ${
                    widget.active
                      ? "hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                      : ""
                  }`}
                >
                  {/* Bauhaus illustration */}
                  <div className="aspect-[5/3] overflow-hidden relative">
                    <div className={!widget.active ? "grayscale" : ""}>
                      <widget.art />
                    </div>
                    {!widget.active && (
                      <span className="absolute top-3 right-3 theme-caption text-white px-2.5 py-1 rounded-full bg-forest/80 backdrop-blur-sm whitespace-nowrap">
                        Coming Soon
                      </span>
                    )}
                  </div>
                  {/* Text content */}
                  <div className="p-5">
                    <div className="mb-1">
                      <p className="font-medium text-foreground">{widget.title}</p>
                    </div>
                    <p className="theme-body-sm text-muted">{widget.description}</p>
                    {widget.active && (
                      <span className="inline-flex items-center gap-1 theme-body-sm text-forest mt-3">
                        Explore <ArrowRight size={14} weight="bold" />
                      </span>
                    )}
                  </div>
                </div>
              );

              if (widget.active && widget.href) {
                return (
                  <Link key={widget.title} href={widget.href} className="block">
                    {content}
                  </Link>
                );
              }
              return <div key={widget.title}>{content}</div>;
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
