"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Sparkle, MapPin, PencilSimple, CaretUp, CaretDown } from "@phosphor-icons/react";

const CONNECTION_TYPES = [
  { id: "dating", label: "Dating", description: "Find a childfree partner" },
  { id: "friendships", label: "Friendships", description: "Meet childfree friends" },
  { id: "community", label: "Community", description: "Join childfree discussions" },
];

// Ranking item component with arrow controls
function RankingItem({
  rank,
  label,
  description,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: {
  rank: number;
  label: string;
  description: string;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  return (
    <div className="w-full p-4 rounded-xl border-2 border-forest bg-forest/5">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-forest text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
          {rank}
        </div>
        <div className="flex-1 min-w-0">
          <span className="font-medium text-foreground block">{label}</span>
          <span className="text-sm text-muted">{description}</span>
        </div>
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={isFirst}
            className={`p-1 rounded transition-colors ${
              isFirst
                ? "text-muted/30 cursor-not-allowed"
                : "text-muted hover:text-forest hover:bg-forest/10"
            }`}
            aria-label="Move up"
          >
            <CaretUp size={20} weight="bold" />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={isLast}
            className={`p-1 rounded transition-colors ${
              isLast
                ? "text-muted/30 cursor-not-allowed"
                : "text-muted hover:text-forest hover:bg-forest/10"
            }`}
            aria-label="Move down"
          >
            <CaretDown size={20} weight="bold" />
          </button>
        </div>
      </div>
    </div>
  );
}

const LIKERT_QUESTIONS = [
  { id: "local_dating", question: "Matches you with childfree singles in your area" },
  { id: "local_friendships", question: "Helps you find childfree friends nearby" },
  { id: "global_community", question: "Connects you with childfree people worldwide" },
];

const INVOLVEMENT = [
  { id: "just_member", label: "Just a member" },
  { id: "beta_tester", label: "Beta tester" },
  { id: "event_organizer", label: "Event organizer" },
  { id: "moderator", label: "Community moderator" },
];

const AGE_RANGES = ["18-24", "25-34", "35-44", "45-54", "55+"];

const COUNTRIES = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
  "Other",
];

const US_CITIES = [
  "Los Angeles",
  "New York",
  "San Francisco",
  "San Diego",
  "Seattle",
  "Portland",
  "Denver",
  "Austin",
  "Chicago",
  "Miami",
  "Other",
];

export default function SurveyPage() {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [results, setResults] = useState<{
    totalResponses: number;
    topFeature: string;
    topConnection: string;
  } | null>(null);

  // Form state - initialize with default order
  const [ranking, setRanking] = useState<string[]>(["dating", "friendships", "community"]);
  const [likertScores, setLikertScores] = useState<Record<string, number>>({});
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [showInternational, setShowInternational] = useState(false);
  const [zipLookup, setZipLookup] = useState<{ city: string; state: string } | null>(null);
  const [isLookingUpZip, setIsLookingUpZip] = useState(false);
  const [ageRange, setAgeRange] = useState("");
  const [involvement, setInvolvement] = useState<string[]>([]);
  const [email, setEmail] = useState("");

  // Geolocation state
  const [detectedLocation, setDetectedLocation] = useState<{
    city: string | null;
    region: string | null;
    country: string | null;
  } | null>(null);
  const [locationConfirmed, setLocationConfirmed] = useState(false);
  const [showLocationEdit, setShowLocationEdit] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  // Fetch geolocation on mount
  useEffect(() => {
    async function fetchLocation() {
      try {
        const res = await fetch("/api/geolocation");
        const data = await res.json();
        setDetectedLocation(data);
      } catch (error) {
        console.error("Failed to detect location:", error);
      } finally {
        setIsLoadingLocation(false);
      }
    }
    fetchLocation();
  }, []);

  // Look up ZIP code when 5 digits entered
  const lookupZipCode = async (zip: string) => {
    if (zip.length !== 5) return;

    setIsLookingUpZip(true);
    try {
      const res = await fetch(`https://api.zippopotam.us/us/${zip}`);
      if (res.ok) {
        const data = await res.json();
        if (data.places && data.places.length > 0) {
          const cityName = data.places[0]["place name"];
          const stateName = data.places[0]["state abbreviation"];
          setZipLookup({ city: cityName, state: stateName });
          // Auto-set the location
          setCountry("United States");
          setCity(`${cityName}, ${stateName}`);
          setShowLocationEdit(false);
        }
      }
    } catch (error) {
      console.error("ZIP lookup failed:", error);
    } finally {
      setIsLookingUpZip(false);
    }
  };

  // Auto-confirm detected location on load
  useEffect(() => {
    if (detectedLocation?.city && !locationConfirmed && !showLocationEdit) {
      confirmDetectedLocation();
    }
  }, [detectedLocation]);

  const totalSteps = 5;
  const progress = ((step + 1) / totalSteps) * 100;

  const moveItem = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= ranking.length) return;
    const newRanking = [...ranking];
    [newRanking[index], newRanking[newIndex]] = [newRanking[newIndex], newRanking[index]];
    setRanking(newRanking);
  };

  const toggleInvolvement = (id: string) => {
    if (involvement.includes(id)) {
      setInvolvement(involvement.filter((i) => i !== id));
    } else {
      setInvolvement([...involvement, id]);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 0: return true; // Always ranked with defaults
      case 1: return Object.keys(likertScores).length === 3;
      case 2: return !!country || !!city;
      case 3: return !!ageRange && involvement.length > 0;
      case 4: return true; // Email is optional
      default: return true;
    }
  };

  const confirmDetectedLocation = () => {
    if (detectedLocation) {
      // Map country code to full name
      const countryMap: Record<string, string> = {
        US: "United States",
        CA: "Canada",
        GB: "United Kingdom",
        AU: "Australia",
        DE: "Germany",
      };
      const countryName = countryMap[detectedLocation.country || ""] || "Other";
      setCountry(countryName);
      setCity(detectedLocation.city || "");
      setLocationConfirmed(true);
    }
  };

  const getLocationDisplay = () => {
    if (!detectedLocation?.city && !detectedLocation?.region) {
      return null;
    }
    const parts = [];
    if (detectedLocation.city) parts.push(detectedLocation.city);
    if (detectedLocation.region) parts.push(detectedLocation.region);
    return parts.join(", ");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          connectionRanking: ranking,
          likertScores,
          country: country || (zipcode ? "United States" : null),
          region: city || zipcode || null,
          ageRange,
          contributionTypes: involvement,
          email: email || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResults(data.aggregateResults);
        setIsComplete(true);
      }
    } catch (error) {
      console.error("Survey submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-display text-foreground mb-2">
                What type of childfree connection interests you most?
              </h2>
              <p className="text-muted theme-body-sm">Use arrows to arrange from most to least important</p>
            </div>
            <div className="space-y-3">
              {ranking.map((id, index) => {
                const item = CONNECTION_TYPES.find((t) => t.id === id)!;
                return (
                  <RankingItem
                    key={id}
                    rank={index + 1}
                    label={item.label}
                    description={item.description}
                    onMoveUp={() => moveItem(index, "up")}
                    onMoveDown={() => moveItem(index, "down")}
                    isFirst={index === 0}
                    isLast={index === ranking.length - 1}
                  />
                );
              })}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-display text-foreground mb-2">
                How likely would you use an app that...
              </h2>
              <p className="text-muted theme-body-sm">Rate each on a scale of 1-5</p>
            </div>
            <div className="space-y-6">
              {LIKERT_QUESTIONS.map((item) => (
                <div key={item.id} className="space-y-3">
                  <p className="text-foreground font-medium">{item.question}</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((score) => (
                      <button
                        key={score}
                        onClick={() => setLikertScores({ ...likertScores, [item.id]: score })}
                        className={`flex-1 h-12 rounded-xl border-2 font-semibold transition-all ${
                          likertScores[item.id] === score
                            ? "border-forest bg-forest text-white"
                            : "border-border text-foreground hover:border-forest/50"
                        }`}
                      >
                        {score}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-muted">
                    <span>Not likely</span>
                    <span>Very likely</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 2:
        const locationDisplay = getLocationDisplay();
        // Determine what location to show (auto-detected, ZIP lookup, or manual)
        const displayedLocation = zipLookup
          ? `${zipLookup.city}, ${zipLookup.state}`
          : city || locationDisplay;
        const hasLocation = !showLocationEdit && (displayedLocation || country);

        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-display text-foreground mb-2">
                Where are you located?
              </h2>
              <p className="text-muted theme-body-sm">Helps us build community near you. Collected anonymously.</p>
            </div>

            {isLoadingLocation ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-forest border-t-transparent rounded-full animate-spin" />
              </div>
            ) : hasLocation && !showLocationEdit ? (
              // Show confirmed location with Change link
              <div className="flex items-center justify-between p-4 rounded-xl border border-border">
                <div className="flex items-center gap-3">
                  <MapPin size={20} className="text-forest" />
                  <span className="text-foreground font-medium">{displayedLocation || country}</span>
                </div>
                <button
                  onClick={() => {
                    setShowLocationEdit(true);
                    setZipLookup(null);
                    setZipcode("");
                  }}
                  className="text-sm text-forest hover:underline"
                >
                  Change
                </button>
              </div>
            ) : (
              // Show input for location
              <div className="space-y-4">
                {!showInternational ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">ZIP Code</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={5}
                        value={zipcode}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          setZipcode(value);
                          if (value.length === 5) {
                            lookupZipCode(value);
                          }
                        }}
                        placeholder="e.g. 90210"
                        className="w-full h-12 px-4 rounded-xl border-2 border-border bg-background text-foreground placeholder:text-muted focus:outline-none focus:border-forest transition-colors text-lg tracking-wider"
                      />
                    </div>
                    {isLookingUpZip && (
                      <div className="flex items-center gap-2 text-muted">
                        <div className="w-4 h-4 border-2 border-forest border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm">Looking up location...</span>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowInternational(true)}
                      className="text-sm text-forest hover:underline"
                    >
                      Not in the US?
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Country</label>
                      <select
                        value={country}
                        onChange={(e) => {
                          setCountry(e.target.value);
                          setCity("");
                          setZipcode("");
                        }}
                        className="w-full h-12 px-4 rounded-xl border-2 border-border bg-background text-foreground focus:outline-none focus:border-forest transition-colors appearance-none cursor-pointer"
                      >
                        <option value="">Select country</option>
                        {COUNTRIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowInternational(false);
                        setCountry("");
                      }}
                      className="text-sm text-forest hover:underline"
                    >
                      I'm in the US
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-display text-foreground mb-2">
                  What's your age range?
                </h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {AGE_RANGES.map((age) => (
                  <button
                    key={age}
                    onClick={() => setAgeRange(age)}
                    className={`px-6 py-3 rounded-full border-2 font-medium transition-all ${
                      ageRange === age
                        ? "border-forest bg-forest text-white"
                        : "border-border text-foreground hover:border-forest/50"
                    }`}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-8 space-y-6">
              <div>
                <h2 className="text-2xl font-display text-foreground mb-2">
                  How would you like to be involved?
                </h2>
                <p className="text-muted theme-body-sm">Select all that apply</p>
              </div>
              <div className="space-y-3">
                {INVOLVEMENT.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleInvolvement(item.id)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      involvement.includes(item.id)
                        ? "border-forest bg-forest/5"
                        : "border-border hover:border-forest/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">{item.label}</span>
                      {involvement.includes(item.id) && (
                        <Check size={20} weight="bold" className="text-forest" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-display text-foreground mb-2">
                Want early access?
              </h2>
              <p className="text-muted theme-body-sm">Optional - we'll notify you when we launch</p>
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full h-14 px-4 rounded-xl border-2 border-border bg-background text-foreground placeholder:text-muted focus:outline-none focus:border-forest transition-colors text-lg"
            />
            <p className="text-sm text-muted">
              No spam, ever. Just launch updates.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-background">
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-[rgba(0,0,0,0.06)]">
          <div className="container-main h-16 flex items-center">
            <Link href="/">
              <Logo variant="full" size="md" />
            </Link>
          </div>
        </nav>

        <main className="pt-24 pb-12 px-6">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkle size={32} weight="fill" className="text-forest" />
            </div>
            <h1 className="text-3xl font-display text-foreground mb-4">
              You're in!
            </h1>
            <p className="text-muted theme-body mb-8">
              Thanks for helping shape Chosn. We'll be in touch soon.
            </p>

            {results && (
              <div className="bg-foreground/[0.02] border border-border rounded-2xl p-6 mb-8 text-left">
                <p className="text-sm font-medium text-muted mb-4">So far...</p>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-foreground">People signed up</span>
                    <span className="font-semibold text-forest">{results.totalResponses}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground">Top interest</span>
                    <span className="font-semibold text-forest">{results.topConnection}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/">
                <Button variant="accent">Back to Chosn</Button>
              </Link>
              <Button
                variant="secondary"
                onClick={() => {
                  const text = "Just signed up for Chosn - a new community for childfree people.";
                  const url = "https://www.chosn.co";
                  window.open(
                    `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
                    "_blank"
                  );
                }}
              >
                Share on X
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-[rgba(0,0,0,0.06)]">
        <div className="container-main h-16 flex items-center justify-between">
          <Link href="/">
            <Logo variant="full" size="md" />
          </Link>
          <span className="text-sm text-muted">
            {step + 1} of {totalSteps}
          </span>
        </div>
      </nav>

      {/* Progress bar */}
      <div className="fixed top-16 left-0 right-0 h-1 bg-border z-40">
        <div
          className="h-full bg-forest transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <main className="pt-28 pb-12 px-6">
        <div className="max-w-md mx-auto">
          {renderStep()}

          <div className="flex justify-between mt-10">
            <Button
              variant="ghost"
              onClick={() => setStep(step - 1)}
              disabled={step === 0}
              className={step === 0 ? "invisible" : ""}
            >
              Back
            </Button>

            {step < totalSteps - 1 ? (
              <Button
                variant="accent"
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="gap-2"
              >
                Continue
                <ArrowRight size={16} weight="bold" />
              </Button>
            ) : (
              <Button
                variant="accent"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="gap-2"
              >
                {isSubmitting ? "Submitting..." : "Done"}
                <Check size={16} weight="bold" />
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
