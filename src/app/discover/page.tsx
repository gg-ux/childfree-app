"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import {
  SignOut,
  MapPin,
  UserCircle,
  GearSix,
  ArrowSquareOut,
  Calendar,
  MagnifyingGlass,
  List,
  SquaresFour,
  SortAscending,
  SortDescending,
  Plus,
  Shuffle,
  Star,
  Baby,
  ForkKnife,
  Mountains,
  GameController,
  Barbell,
  MusicNotes,
  PaintBrush,
  PersonSimpleTaiChi,
  Heart,
  Users,
  BookOpen,
  Airplane,
} from "@phosphor-icons/react";
import { Loader } from "@/components/ui/loader";
import { CreateEventModal } from "./create-event";

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
    avatarUrl: string | null;
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
  tag: string | null;
  source?: "meetup" | "luma" | "ra" | "eventbrite" | "community";
}


const LOADING_MESSAGES = [
  "Scouting the best happy hours...",
  "Rounding up the fun stuff...",
  "Finding your people...",
  "No kids, just plans...",
  "Curating your social calendar...",
  "Hunting down the best hangs...",
  "Filtering out the boring stuff...",
  "Seeing what's poppin'...",
  "Consulting the fun committee...",
  "Gathering the good times...",
];

const TAG_ICONS: Record<string, React.ElementType> = {
  "Childfree": Baby,
  "Food & Drink": ForkKnife,
  "Outdoors": Mountains,
  "Games": GameController,
  "Fitness": Barbell,
  "Music": MusicNotes,
  "Arts": PaintBrush,
  "Dance": PersonSimpleTaiChi,
  "Singles": Heart,
  "Social": Users,
  "Books": BookOpen,
  "Travel": Airplane,
};

function TagIcon({ tag, size = 16, className = "" }: { tag: string | null; size?: number; className?: string }) {
  const Icon = (tag && TAG_ICONS[tag]) || Calendar;
  return <Icon size={size} weight="duotone" className={className} />;
}

function formatEventDate(dateTime: string): [string, string] {
  const date = new Date(dateTime);
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const h = date.getHours();
  const m = date.getMinutes();
  const ampm = h >= 12 ? "pm" : "am";
  const hour = h % 12 || 12;
  const timeStr = m ? `${hour}:${String(m).padStart(2, "0")} ${ampm}` : `${hour} ${ampm}`;

  if (date.toDateString() === now.toDateString()) {
    return ["TODAY", timeStr];
  }
  if (date.toDateString() === tomorrow.toDateString()) {
    return ["TOMORROW", timeStr];
  }

  const dayStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase();
  return [dayStr, timeStr];
}

export default function DiscoverPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<MeetupEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState("");
  const [loadingMsg, setLoadingMsg] = useState(0);

  // Location state
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [zipInput, setZipInput] = useState("");
  const [locationSaving, setLocationSaving] = useState(false);
  const [locationCity, setLocationCity] = useState<string | null>(null);
  const [locationLat, setLocationLat] = useState<number | null>(null);
  const [locationLng, setLocationLng] = useState<number | null>(null);

  // Typeahead
  const [suggestions, setSuggestions] = useState<{ display: string; city: string; lat: number; lng: number }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const US_CITIES: { display: string; city: string; lat: number; lng: number }[] = useMemo(() => [
    { display: "New York, NY", city: "New York", lat: 40.71, lng: -74.01 },
    { display: "Los Angeles, CA", city: "Los Angeles", lat: 34.05, lng: -118.24 },
    { display: "Chicago, IL", city: "Chicago", lat: 41.88, lng: -87.63 },
    { display: "Houston, TX", city: "Houston", lat: 29.76, lng: -95.37 },
    { display: "Phoenix, AZ", city: "Phoenix", lat: 33.45, lng: -112.07 },
    { display: "Philadelphia, PA", city: "Philadelphia", lat: 39.95, lng: -75.17 },
    { display: "San Antonio, TX", city: "San Antonio", lat: 29.42, lng: -98.49 },
    { display: "San Diego, CA", city: "San Diego", lat: 32.72, lng: -117.16 },
    { display: "Dallas, TX", city: "Dallas", lat: 32.78, lng: -96.80 },
    { display: "Austin, TX", city: "Austin", lat: 30.27, lng: -97.74 },
    { display: "San Francisco, CA", city: "San Francisco", lat: 37.77, lng: -122.42 },
    { display: "Seattle, WA", city: "Seattle", lat: 47.61, lng: -122.33 },
    { display: "Denver, CO", city: "Denver", lat: 39.74, lng: -104.99 },
    { display: "Washington, DC", city: "Washington", lat: 38.91, lng: -77.04 },
    { display: "Nashville, TN", city: "Nashville", lat: 36.16, lng: -86.78 },
    { display: "Boston, MA", city: "Boston", lat: 42.36, lng: -71.06 },
    { display: "Atlanta, GA", city: "Atlanta", lat: 33.75, lng: -84.39 },
    { display: "Miami, FL", city: "Miami", lat: 25.76, lng: -80.19 },
    { display: "Portland, OR", city: "Portland", lat: 45.52, lng: -122.68 },
    { display: "Las Vegas, NV", city: "Las Vegas", lat: 36.17, lng: -115.14 },
    { display: "Minneapolis, MN", city: "Minneapolis", lat: 44.98, lng: -93.27 },
    { display: "Detroit, MI", city: "Detroit", lat: 42.33, lng: -83.05 },
    { display: "Tampa, FL", city: "Tampa", lat: 27.95, lng: -82.46 },
    { display: "Orlando, FL", city: "Orlando", lat: 28.54, lng: -81.38 },
    { display: "New Orleans, LA", city: "New Orleans", lat: 29.95, lng: -90.07 },
    { display: "Charlotte, NC", city: "Charlotte", lat: 35.23, lng: -80.84 },
    { display: "San Jose, CA", city: "San Jose", lat: 37.34, lng: -121.89 },
    { display: "Columbus, OH", city: "Columbus", lat: 39.96, lng: -82.99 },
    { display: "Indianapolis, IN", city: "Indianapolis", lat: 39.77, lng: -86.16 },
    { display: "Salt Lake City, UT", city: "Salt Lake City", lat: 40.76, lng: -111.89 },
    { display: "Kansas City, MO", city: "Kansas City", lat: 39.10, lng: -94.58 },
    { display: "Raleigh, NC", city: "Raleigh", lat: 35.78, lng: -78.64 },
    { display: "Pittsburgh, PA", city: "Pittsburgh", lat: 40.44, lng: -79.99 },
    { display: "Cincinnati, OH", city: "Cincinnati", lat: 39.10, lng: -84.51 },
    { display: "Sacramento, CA", city: "Sacramento", lat: 38.58, lng: -121.49 },
    { display: "St. Louis, MO", city: "St. Louis", lat: 38.63, lng: -90.20 },
    { display: "Milwaukee, WI", city: "Milwaukee", lat: 43.04, lng: -87.91 },
    { display: "Baltimore, MD", city: "Baltimore", lat: 39.29, lng: -76.61 },
    { display: "Richmond, VA", city: "Richmond", lat: 37.54, lng: -77.44 },
    { display: "Honolulu, HI", city: "Honolulu", lat: 21.31, lng: -157.86 },
  ], []);

  const fetchSuggestions = useCallback((query: string) => {
    if (query.length < 2 || /^\d+$/.test(query.trim())) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const q = query.toLowerCase().trim();
    const results = US_CITIES.filter((c) =>
      c.city.toLowerCase().startsWith(q) || c.display.toLowerCase().startsWith(q)
    ).slice(0, 5);
    setSuggestions(results);
    setShowSuggestions(results.length > 0);
  }, [US_CITIES]);

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(e.target as Node)) {
        setShowAvatarMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Filter & view state
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const avatarMenuRef = useRef<HTMLDivElement>(null);
  const [featuredIndex, setFeaturedIndex] = useState(0);

  const fetchEvents = useCallback(async (lat: number, lng: number) => {
    setEventsLoading(true);
    setEventsError("");
    setEvents([]);
    try {
      const res = await fetch(`/api/events?lat=${lat}&lng=${lng}`);
      const data = await res.json();
      if (res.ok) {
        setEvents(data.events || []);
        setFeaturedIndex(Math.floor(Math.random() * (data.events?.length || 1)));
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

  // Cycle loading messages
  useEffect(() => {
    if (!eventsLoading) return;
    setLoadingMsg(Math.floor(Math.random() * LOADING_MESSAGES.length));
    const interval = setInterval(() => {
      setLoadingMsg((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [eventsLoading]);

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

  const handleSelectSuggestion = async (suggestion: { city: string; lat: number; lng: number }) => {
    setShowSuggestions(false);
    setSuggestions([]);
    setZipInput("");
    setLocationCity(suggestion.city);
    setLocationLat(suggestion.lat);
    setLocationLng(suggestion.lng);
    setShowLocationInput(false);

    // Save to profile
    try {
      await fetch("/api/location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zip: suggestion.city }),
      });
    } catch {
      // Location already set locally, profile save is best-effort
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
      <nav className="fixed top-0 left-0 right-0 z-50 frosted border-b border-border">
        <div className="container-main h-16 flex items-center justify-between">
          <Link href="/home">
            <Logo variant="full" size="sm" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="relative" ref={suggestionsRef}>
              <button
                onClick={() => setShowLocationInput(!showLocationInput)}
                className="flex items-center gap-1.5 theme-body-sm text-muted hover:text-foreground transition-colors duration-200"
              >
                <MapPin size={16} weight="fill" className="text-forest" />
                <span className="hidden sm:inline">
                  {locationCity || "Set location"}
                </span>
              </button>
              {showLocationInput && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-background rounded-xl border border-border shadow-lg z-50 p-3">
                  <form onSubmit={handleSetLocation} className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={zipInput}
                        onChange={(e) => {
                          setZipInput(e.target.value);
                          fetchSuggestions(e.target.value);
                        }}
                        placeholder="City or zip code"
                        className="w-full px-3 h-9 rounded-lg border border-border bg-background theme-body-sm placeholder:text-muted/50 focus:outline-none focus:border-forest transition-colors"
                        maxLength={100}
                        autoFocus
                      />
                      {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 overflow-hidden">
                          {suggestions.map((s, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => handleSelectSuggestion(s)}
                              className="w-full text-left px-3 py-2 theme-body-sm text-foreground hover:bg-forest/10 transition-colors border-b border-border/50 last:border-b-0"
                            >
                              {s.display}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button
                      type="submit"
                      variant="accent"
                      size="sm"
                      disabled={locationSaving || !zipInput.trim()}
                      className="h-9 px-4"
                    >
                      {locationSaving ? "..." : "Go"}
                    </Button>
                  </form>
                </div>
              )}
            </div>
            <div className="w-px h-4 bg-border hidden sm:block" />
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
      <div className="pt-28 md:pt-36 pb-16 px-6">
        <div className="max-w-5xl mx-auto">


          {/* No location set — prompt */}
          {!locationCity && !showLocationInput && (
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-5">
                <MapPin size={32} weight="duotone" className="text-forest" />
              </div>
              <h1 className="theme-heading text-fluid-h3 text-foreground mb-3">
                Welcome, {user.profile?.displayName}
              </h1>
              <p className="theme-body-sm text-muted max-w-md mx-auto mb-6">
                Set your location to discover childfree events and meetups near you.
              </p>
              <form onSubmit={handleSetLocation} className="flex gap-2 max-w-xs mx-auto">
                <div className="relative flex-1" ref={!showLocationInput ? suggestionsRef : undefined}>
                  <input
                    type="text"
                    value={zipInput}
                    onChange={(e) => {
                      setZipInput(e.target.value);
                      fetchSuggestions(e.target.value);
                    }}
                    placeholder="City or zip code"
                    className="w-full px-4 h-12 rounded-xl border border-border bg-background theme-body placeholder:text-muted/50 focus:outline-none focus:border-forest transition-colors"
                    maxLength={100}
                  />
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-xl shadow-lg z-50 overflow-hidden">
                      {suggestions.map((s, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleSelectSuggestion(s)}
                          className="w-full text-left px-4 py-2.5 theme-body-sm text-foreground hover:bg-forest/10 transition-colors border-b border-border/50 last:border-b-0"
                        >
                          {s.display}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
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
          {locationCity && (() => {
            // Derive available tags from events
            const availableTags = Array.from(new Set(events.map((e) => e.tag).filter(Boolean) as string[]));
            // Put Childfree first if present
            availableTags.sort((a, b) => (a === "Childfree" ? -1 : b === "Childfree" ? 1 : 0));

            // Client-side filtering & sorting
            const filteredEvents = events
              .filter((e) => {
                if (activeTag && e.tag !== activeTag) return false;
                if (searchQuery) {
                  const q = searchQuery.toLowerCase();
                  const text = `${e.title} ${e.groupName} ${e.venueName || ""} ${e.venueCity || ""}`.toLowerCase();
                  if (!text.includes(q)) return false;
                }
                return true;
              })
              .sort((a, b) => {
                const diff = new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime();
                return sortOrder === "asc" ? diff : -diff;
              });

            const hasFilters = !!activeTag || !!searchQuery;

            return (
              <>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="font-display text-fluid-h1 text-foreground leading-[0.9] tracking-tight">
                      Events
                    </h1>
                  </div>
                  <Button
                    variant="accent"
                    size="sm"
                    onClick={() => setShowCreateModal(true)}
                    className="shrink-0 gap-1.5"
                  >
                    <Plus size={16} weight="bold" />
                    <span className="hidden sm:inline">Create Event</span>
                  </Button>
                </div>

                {/* Featured event spotlight */}
                {!eventsLoading && filteredEvents.length > 0 && (() => {
                  // Prioritize childfree events for featured spotlight
                  const childfreeEvents = filteredEvents.filter((e) => e.tag === "Childfree");
                  const featuredPool = childfreeEvents.length > 0 ? childfreeEvents : filteredEvents;
                  const featured = featuredPool[featuredIndex % featuredPool.length];
                  return (
                    <div className="mb-6 relative overflow-hidden rounded-2xl border border-border bg-white">
                      <div className="flex flex-col sm:flex-row">
                        {featured.imageUrl ? (
                          <div className="sm:w-64 h-40 sm:h-auto bg-foreground/5 overflow-hidden shrink-0">
                            <img src={featured.imageUrl} alt={featured.title} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="sm:w-64 h-40 sm:h-auto bg-forest/10 flex items-center justify-center shrink-0">
                            <TagIcon tag={featured.tag} size={40} className="text-forest/40" />
                          </div>
                        )}
                        <div className="flex-1 p-5">
                          <div className="flex items-center gap-2 mb-2">
                            <Star size={14} weight="fill" className="text-marigold" />
                            <span className="theme-caption text-marigold normal-case">Featured</span>
                            {featured.source && (
                              <span className="theme-caption normal-case text-muted/50">
                                via {featured.source === "meetup" ? "Meetup" : featured.source === "luma" ? "Lu.ma" : featured.source === "ra" ? "RA" : featured.source === "eventbrite" ? "Eventbrite" : "Community"}
                              </span>
                            )}
                          </div>
                          <h3 className="theme-heading text-lg text-foreground mb-1">{featured.title}</h3>
                          {(() => { const [day, time] = formatEventDate(featured.dateTime); return (
                            <p className="theme-caption text-forest normal-case mb-2">{day} · {time}</p>
                          ); })()}
                          <p className="theme-secondary text-xs">
                            {[featured.groupName, featured.venueName, featured.venueCity].filter(Boolean).join(" · ")}
                          </p>
                          {featured.description && (
                            <p className="theme-secondary text-xs mt-2 line-clamp-2">{featured.description}</p>
                          )}
                        </div>
                        <div className="absolute top-3 right-3 flex gap-1.5">
                          <button
                            onClick={(e) => { e.preventDefault(); setFeaturedIndex(Math.floor(Math.random() * featuredPool.length)); }}
                            className="w-8 h-8 rounded-full bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center transition-colors"
                            title="Shuffle featured event"
                          >
                            <Shuffle size={14} className="text-muted" />
                          </button>
                          {featured.eventUrl && (
                            <a
                              href={featured.eventUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-8 h-8 rounded-full bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center transition-colors"
                            >
                              <ArrowSquareOut size={14} className="text-muted" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Search bar + view toggle */}
                {!eventsLoading && events.length > 0 && (
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative flex-1">
                      <MagnifyingGlass size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted/50" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search events..."
                        className="w-full pl-10 pr-4 h-10 rounded-xl border border-border bg-white theme-body-sm placeholder:text-muted/50 focus:outline-none focus:border-forest transition-colors"
                      />
                    </div>
                    <button
                      onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                      className="shrink-0 flex items-center gap-1 px-2.5 h-10 rounded-lg border border-border theme-body-sm text-muted hover:text-foreground transition-colors"
                      title={sortOrder === "asc" ? "Soonest first" : "Latest first"}
                    >
                      {sortOrder === "asc" ? <SortAscending size={18} /> : <SortDescending size={18} />}
                      <span className="hidden sm:inline">{sortOrder === "asc" ? "Soonest" : "Latest"}</span>
                    </button>
                    <div className="flex items-center border border-border rounded-lg overflow-hidden">
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 transition-colors ${viewMode === "list" ? "bg-forest/10 text-forest" : "text-muted hover:text-foreground"}`}
                        title="List view"
                      >
                        <List size={18} weight={viewMode === "list" ? "bold" : "regular"} />
                      </button>
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 transition-colors ${viewMode === "grid" ? "bg-forest/10 text-forest" : "text-muted hover:text-foreground"}`}
                        title="Grid view"
                      >
                        <SquaresFour size={18} weight={viewMode === "grid" ? "bold" : "regular"} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Tag filter bar */}
                {!eventsLoading && availableTags.length > 0 && (
                  <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
                    <button
                      onClick={() => setActiveTag(null)}
                      className={`shrink-0 text-xs font-[600] px-3 py-1.5 rounded-full transition-colors ${
                        !activeTag
                          ? "bg-foreground text-white"
                          : "bg-foreground/5 text-muted hover:bg-foreground/10"
                      }`}
                    >
                      All
                    </button>
                    {availableTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                        className={`shrink-0 text-xs font-[600] px-3 py-1.5 rounded-full transition-colors ${
                          activeTag === tag
                            ? tag === "Childfree"
                              ? "bg-forest text-white"
                              : "bg-foreground text-white"
                            : tag === "Childfree"
                              ? "bg-forest/10 text-forest hover:bg-forest/20"
                              : "bg-foreground/5 text-muted hover:bg-foreground/10"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                )}

                {eventsLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader size="lg" />
                    <p className="theme-body-sm text-muted animate-pulse">{LOADING_MESSAGES[loadingMsg]}</p>
                  </div>
                ) : eventsError ? (
                  <div className="text-center py-16">
                    <p className="theme-secondary mb-4">{eventsError}</p>
                    <Button variant="secondary" size="sm" onClick={() => fetchEvents(locationLat!, locationLng!)}>
                      Try again
                    </Button>
                  </div>
                ) : events.length === 0 ? (
                  <div className="text-center py-16 bg-foreground/[0.02] rounded-2xl border border-border">
                    <Calendar size={40} className="text-muted/40 mx-auto mb-4" />
                    <h3 className="theme-heading text-lg text-foreground mb-2">
                      No events found nearby
                    </h3>
                    <p className="theme-secondary max-w-sm mx-auto mb-4">
                      We couldn&apos;t find events near {locationCity} right now.
                      Try a different location.
                    </p>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setShowLocationInput(true)}
                    >
                      Change location
                    </Button>
                  </div>
                ) : filteredEvents.length === 0 && hasFilters ? (
                  <div className="text-center py-16">
                    <p className="theme-secondary mb-4">No events match your filters</p>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => { setActiveTag(null); setSearchQuery(""); }}
                    >
                      Clear filters
                    </Button>
                  </div>
                ) : viewMode === "list" ? (
                  /* List view */
                  <div className="border border-border rounded-2xl overflow-hidden bg-white divide-y divide-border">
                    {filteredEvents.map((event) => (
                      <a
                        key={event.id}
                        href={event.eventUrl || undefined}
                        target={event.eventUrl ? "_blank" : undefined}
                        rel={event.eventUrl ? "noopener noreferrer" : undefined}
                        className="group flex items-center gap-3 px-4 py-3 hover:bg-foreground/[0.02] transition-colors"
                      >
                        {/* Thumbnail */}
                        <div className="shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-foreground/5">
                          {event.imageUrl ? (
                            <img src={event.imageUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-forest/10 flex items-center justify-center">
                              <TagIcon tag={event.tag} size={20} className="text-forest/40" />
                            </div>
                          )}
                        </div>
                        <div className="shrink-0 w-20 text-center">
                          {(() => { const [day, time] = formatEventDate(event.dateTime); return (
                            <>
                              <p className="theme-caption text-forest normal-case text-[11px] font-semibold">{day}</p>
                              <p className="theme-caption text-forest/70 normal-case text-[11px]">{time}</p>
                            </>
                          ); })()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="theme-body-sm text-foreground font-[600] leading-snug group-hover:text-forest transition-colors duration-200 truncate">
                            {event.title}
                          </h3>
                          <p className="theme-secondary text-xs mt-0.5 truncate">
                            {[event.groupName, event.venueName, event.venueCity].filter(Boolean).join(" · ")}
                          </p>
                        </div>
                        <div className="shrink-0 flex items-center gap-2">
                          {event.tag && (
                            <span className={`hidden sm:inline text-[10px] font-[600] px-2 py-0.5 rounded-full ${
                              event.tag === "Childfree"
                                ? "bg-forest/10 text-forest"
                                : "bg-foreground/5 text-muted"
                            }`}>
                              {event.tag}
                            </span>
                          )}
                          {event.source && event.source !== "meetup" && (
                            <span className="hidden sm:inline text-[10px] font-[500] text-muted/50">
                              {event.source === "luma" ? "Lu.ma" : event.source === "ra" ? "RA" : event.source === "eventbrite" ? "Eventbrite" : "Community"}
                            </span>
                          )}
                          {event.eventUrl && <ArrowSquareOut size={14} className="text-muted/40" />}
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  /* Grid view */
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredEvents.map((event) => (
                      <a
                        key={event.id}
                        href={event.eventUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group bg-white border border-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
                      >
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
                            <TagIcon tag={event.tag} size={32} className="text-forest/40" />
                          </div>
                        )}

                        <div className="p-4">
                          <div className="flex items-center gap-2 mb-1.5">
                            {(() => { const [day, time] = formatEventDate(event.dateTime); return (
                              <p className="theme-caption text-forest normal-case">{day} · {time}</p>
                            ); })()}
                            {event.tag && (
                              <span className={`theme-caption normal-case px-2 py-0.5 rounded-full ${
                                event.tag === "Childfree"
                                  ? "bg-forest/10 text-forest"
                                  : "bg-foreground/5 text-muted"
                              }`}>
                                {event.tag}
                              </span>
                            )}
                          </div>
                          <h3 className="theme-body-sm font-[600] text-foreground leading-snug mb-2 line-clamp-2 group-hover:text-forest transition-colors duration-200">
                            {event.title}
                          </h3>
                          {(event.venueName || event.venueCity) && (
                            <p className="theme-secondary text-xs line-clamp-1">
                              {[event.venueName, event.venueCity].filter(Boolean).join(" · ")}
                            </p>
                          )}
                          <div className="flex items-center gap-1.5 mt-3 theme-secondary text-xs opacity-60">
                            <span>{event.groupName}</span>
                            {event.source && event.source !== "meetup" && (
                              <span className="text-[10px] font-[500] px-1.5 py-0.5 rounded bg-foreground/5">
                                {event.source === "luma" ? "Lu.ma" : event.source === "ra" ? "RA" : event.source === "eventbrite" ? "Eventbrite" : "Community"}
                              </span>
                            )}
                            {event.eventUrl && <ArrowSquareOut size={12} />}
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                )}

              </>
            );
          })()}
        </div>
      </div>

      <CreateEventModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={() => {
          if (locationLat && locationLng) fetchEvents(locationLat, locationLng);
        }}
        userCity={locationCity}
        isAuthenticated={!!user}
      />
    </div>
  );
}
