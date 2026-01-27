"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import {
  SignOut,
  MapPin,
  ArrowSquareOut,
  Calendar,
  MagnifyingGlass,
  UsersThree,
  BookOpen,
  Compass,
  AirplaneTilt,
  ArrowRight,
} from "@phosphor-icons/react";
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
    locationCity: string | null;
    locationLat: number | null;
    locationLng: number | null;
  } | null;
}

interface MeetupEvent {
  id: string;
  title: string;
  dateTime: string;
  eventUrl: string;
  groupName: string;
  venueName: string | null;
  venueCity: string | null;
  venueState: string | null;
  imageUrl: string | null;
  description: string | null;
}

const COMMUNITY_LINKS = [
  {
    name: "We Are Childfree",
    url: "https://wearechildfree.com/",
    description: "Community hangouts, book clubs, and online events",
    icon: UsersThree,
  },
  {
    name: "No Kidding!",
    url: "http://www.nokidding.net/",
    description: "Social club with chapters across the US and Canada",
    icon: Compass,
  },
  {
    name: "r/childfree",
    url: "https://www.reddit.com/r/childfree/",
    description: "1.5M+ member community on Reddit",
    icon: BookOpen,
  },
  {
    name: "CF Travel Groups",
    url: "https://www.eventbrite.com/o/childfree-travel-groups-80229592223",
    description: "Group trips to adults-only destinations",
    icon: AirplaneTilt,
  },
];

function formatEventDate(dateTime: string) {
  const date = new Date(dateTime);
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const timeStr = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  if (date.toDateString() === now.toDateString()) {
    return `Today · ${timeStr}`;
  }
  if (date.toDateString() === tomorrow.toDateString()) {
    return `Tomorrow · ${timeStr}`;
  }

  const dayStr = date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  return `${dayStr} · ${timeStr}`;
}

export default function DiscoverPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<MeetupEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState("");

  // Location state
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [zipInput, setZipInput] = useState("");
  const [locationSaving, setLocationSaving] = useState(false);
  const [locationCity, setLocationCity] = useState<string | null>(null);
  const [locationLat, setLocationLat] = useState<number | null>(null);
  const [locationLng, setLocationLng] = useState<number | null>(null);

  const fetchEvents = useCallback(async (lat: number, lng: number) => {
    setEventsLoading(true);
    setEventsError("");
    try {
      const res = await fetch(`/api/events?lat=${lat}&lng=${lng}`);
      const data = await res.json();
      if (res.ok) {
        setEvents(data.events || []);
      } else {
        setEventsError(data.error || "Failed to load events");
      }
    } catch {
      setEventsError("Failed to load events");
    } finally {
      setEventsLoading(false);
    }
  }, []);

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

        // Set location from profile
        if (data.user.profile?.locationCity) {
          setLocationCity(data.user.profile.locationCity);
          setLocationLat(data.user.profile.locationLat);
          setLocationLng(data.user.profile.locationLng);
        }
      } catch {
        router.push("/auth/signup");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Fetch events when location is set
  useEffect(() => {
    if (locationLat && locationLng) {
      fetchEvents(locationLat, locationLng);
    }
  }, [locationLat, locationLng, fetchEvents]);

  const handleSetLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!zipInput.trim() || locationSaving) return;

    setLocationSaving(true);
    try {
      const res = await fetch("/api/location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zip: zipInput.trim() }),
      });
      const data = await res.json();

      if (res.ok) {
        setLocationCity(data.city);
        setLocationLat(data.lat);
        setLocationLng(data.lng);
        setShowLocationInput(false);
        setZipInput("");
      } else {
        setEventsError(data.error || "Invalid zip code");
      }
    } catch {
      setEventsError("Failed to update location");
    } finally {
      setLocationSaving(false);
    }
  };

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
            {/* Location button */}
            <button
              onClick={() => setShowLocationInput(!showLocationInput)}
              className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
            >
              <MapPin size={16} weight="fill" className="text-forest" />
              <span className="hidden sm:inline">
                {locationCity || "Set location"}
              </span>
            </button>
            <div className="w-px h-4 bg-border hidden sm:block" />
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
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto">

          {/* Location input (dropdown) */}
          {showLocationInput && (
            <div className="mb-8 max-w-sm mx-auto">
              <form onSubmit={handleSetLocation} className="flex gap-2">
                <input
                  type="text"
                  value={zipInput}
                  onChange={(e) => setZipInput(e.target.value)}
                  placeholder="Enter zip code"
                  className="flex-1 px-4 h-11 rounded-xl border border-border bg-background text-sm font-[450] placeholder:text-muted/50 focus:outline-none focus:border-forest transition-colors"
                  maxLength={10}
                  autoFocus
                />
                <Button
                  type="submit"
                  variant="accent"
                  size="sm"
                  disabled={locationSaving || !zipInput.trim()}
                  className="h-11 px-5"
                >
                  {locationSaving ? "..." : "Update"}
                </Button>
              </form>
            </div>
          )}

          {/* No location set — prompt */}
          {!locationCity && !showLocationInput && (
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-5">
                <MapPin size={32} weight="duotone" className="text-forest" />
              </div>
              <h1 className="font-display text-2xl md:text-3xl text-foreground mb-3">
                Welcome, {user.profile?.displayName}
              </h1>
              <p className="theme-body text-muted max-w-md mx-auto mb-6">
                Set your location to discover childfree events and meetups near you.
              </p>
              <form onSubmit={handleSetLocation} className="flex gap-2 max-w-xs mx-auto">
                <input
                  type="text"
                  value={zipInput}
                  onChange={(e) => setZipInput(e.target.value)}
                  placeholder="Enter zip code"
                  className="flex-1 px-4 h-12 rounded-xl border border-border bg-background text-base font-[450] placeholder:text-muted/50 focus:outline-none focus:border-forest transition-colors"
                  maxLength={10}
                />
                <Button
                  type="submit"
                  variant="accent"
                  size="lg"
                  disabled={locationSaving || !zipInput.trim()}
                >
                  {locationSaving ? (
                    <Loader size="sm" />
                  ) : (
                    <MagnifyingGlass size={20} weight="bold" />
                  )}
                </Button>
              </form>
              {eventsError && (
                <p className="text-coral text-sm mt-3">{eventsError}</p>
              )}
            </div>
          )}

          {/* Events section — only show when location is set */}
          {locationCity && (
            <>
              <div className="mb-8">
                <h1 className="font-display text-2xl md:text-3xl text-foreground mb-1">
                  Childfree events near you
                </h1>
                <p className="text-sm text-muted">
                  Meetups and gatherings in and around {locationCity}
                </p>
              </div>

              {eventsLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader size="lg" />
                </div>
              ) : eventsError ? (
                <div className="text-center py-16">
                  <p className="text-muted mb-4">{eventsError}</p>
                  <Button variant="secondary" size="sm" onClick={() => fetchEvents(locationLat!, locationLng!)}>
                    Try again
                  </Button>
                </div>
              ) : events.length === 0 ? (
                <div className="text-center py-16 bg-foreground/[0.02] rounded-2xl border border-border">
                  <Calendar size={40} className="text-muted/40 mx-auto mb-4" />
                  <h3 className="font-display text-lg text-foreground mb-2">
                    No events found nearby
                  </h3>
                  <p className="text-sm text-muted max-w-sm mx-auto mb-4">
                    We couldn&apos;t find childfree events near {locationCity} right now.
                    Check the communities below or try a different location.
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowLocationInput(true)}
                  >
                    Change location
                  </Button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {events.map((event) => (
                    <a
                      key={event.id}
                      href={event.eventUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group bg-white border border-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
                    >
                      {/* Event image */}
                      {event.imageUrl ? (
                        <div className="aspect-[16/9] bg-foreground/5 overflow-hidden">
                          <img
                            src={event.imageUrl}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="aspect-[16/9] bg-forest/10 flex items-center justify-center">
                          <Calendar size={32} className="text-forest/40" />
                        </div>
                      )}

                      <div className="p-4">
                        <p className="text-xs font-[500] text-forest mb-1.5">
                          {formatEventDate(event.dateTime)}
                        </p>
                        <h3 className="font-[600] text-foreground text-sm leading-snug mb-2 line-clamp-2 group-hover:text-forest transition-colors">
                          {event.title}
                        </h3>
                        {(event.venueName || event.venueCity) && (
                          <p className="text-xs text-muted line-clamp-1">
                            {[event.venueName, event.venueCity].filter(Boolean).join(" · ")}
                          </p>
                        )}
                        <div className="flex items-center gap-1 mt-3 text-xs text-muted/60">
                          <span>{event.groupName}</span>
                          <ArrowSquareOut size={12} />
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}

              {/* Communities section */}
              <div className="mt-16">
                <h2 className="font-display text-lg text-foreground mb-5">
                  Childfree communities
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {COMMUNITY_LINKS.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-forest/30 hover:bg-forest/[0.02] transition-all group"
                    >
                      <div className="w-10 h-10 bg-foreground/5 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-forest/10 transition-colors">
                        <link.icon size={20} className="text-muted group-hover:text-forest transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-[600] text-foreground group-hover:text-forest transition-colors">
                          {link.name}
                        </h3>
                        <p className="text-xs text-muted line-clamp-1">{link.description}</p>
                      </div>
                      <ArrowRight size={16} className="text-muted/40 group-hover:text-forest transition-colors flex-shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Communities section when no location */}
          {!locationCity && (
            <div className="mt-12">
              <h2 className="font-display text-lg text-foreground mb-5">
                Childfree communities
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {COMMUNITY_LINKS.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl border border-border hover:border-forest/30 hover:bg-forest/[0.02] transition-all group"
                  >
                    <div className="w-10 h-10 bg-foreground/5 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-forest/10 transition-colors">
                      <link.icon size={20} className="text-muted group-hover:text-forest transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-[600] text-foreground group-hover:text-forest transition-colors">
                        {link.name}
                      </h3>
                      <p className="text-xs text-muted line-clamp-1">{link.description}</p>
                    </div>
                    <ArrowRight size={16} className="text-muted/40 group-hover:text-forest transition-colors flex-shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
