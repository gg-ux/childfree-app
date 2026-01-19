"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  User,
  Heart,
  Users,
  MagnifyingGlass,
} from "@phosphor-icons/react";

const TOTAL_STEPS = 5;

// Connection type options based on research
const CONNECTION_TYPES = [
  {
    value: "DATING_SERIOUS",
    label: "Serious Dating",
    description: "Looking for a long-term childfree partner",
    icon: "heart",
  },
  {
    value: "DATING_CASUAL",
    label: "Casual Dating",
    description: "Open to dating without commitment pressure",
    icon: "heart",
  },
  {
    value: "DATING_OPEN",
    label: "Open to Either",
    description: "Let things develop naturally",
    icon: "heart",
  },
  {
    value: "FRIENDSHIP",
    label: "Friendship",
    description: "Platonic connections with childfree people",
    icon: "users",
  },
  {
    value: "ACTIVITY_PARTNERS",
    label: "Activity Partners",
    description: "Hiking, gym, events, travel companions",
    icon: "users",
  },
  {
    value: "COMMUNITY",
    label: "Local Community",
    description: "Connect with childfree folks nearby",
    icon: "users",
  },
];

const CHILDFREE_STATUSES = [
  {
    value: "CHOICE",
    label: "Childfree by choice",
    description: "I've chosen not to have children",
  },
  {
    value: "STERILIZED",
    label: "Childfree & sterilized",
    description: "I've had a permanent procedure",
  },
  {
    value: "CIRCUMSTANCE",
    label: "Childless by circumstance",
    description: "Due to life circumstances, not by choice",
  },
  {
    value: "PARENT_DONE",
    label: "Empty nester",
    description: "My children are grown and independent",
  },
];

const GENDERS = [
  { value: "woman", label: "Woman" },
  { value: "man", label: "Man" },
  { value: "nonbinary", label: "Non-binary" },
  { value: "other", label: "Other" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  // Form state
  const [displayName, setDisplayName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("");
  const [childfreeStatus, setChildfreeStatus] = useState("");
  const [seeking, setSeeking] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [genderPreferences, setGenderPreferences] = useState<string[]>([]);
  const [ageMin, setAgeMin] = useState(21);
  const [ageMax, setAgeMax] = useState(55);
  const [locationCity, setLocationCity] = useState("");

  // Check auth and load existing data
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/check");
        const data = await res.json();

        if (!data.authenticated) {
          router.push("/auth/signup");
          return;
        }

        // Load existing onboarding state
        const onboardingRes = await fetch("/api/onboarding");
        const onboardingData = await onboardingRes.json();

        if (onboardingData.step >= 5) {
          router.push("/discover");
          return;
        }

        // Resume from where they left off
        if (onboardingData.step > 0) {
          setStep(onboardingData.step + 1);
        }

        // Pre-fill existing data
        if (onboardingData.profile) {
          const p = onboardingData.profile;
          if (p.displayName) setDisplayName(p.displayName);
          if (p.birthdate) setBirthdate(new Date(p.birthdate).toISOString().split("T")[0]);
          if (p.gender) setGender(p.gender);
          if (p.childfreeStatus) setChildfreeStatus(p.childfreeStatus);
          if (p.seeking) setSeeking(p.seeking);
          if (p.bio) setBio(p.bio);
          if (p.genderPreferences) setGenderPreferences(p.genderPreferences);
          if (p.ageMin) setAgeMin(p.ageMin);
          if (p.ageMax) setAgeMax(p.ageMax);
          if (p.locationCity) setLocationCity(p.locationCity);
        }
      } catch {
        router.push("/auth/signup");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const saveStep = async (stepNumber: number, data: Record<string, unknown>) => {
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: stepNumber, data }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save");
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleNext = async () => {
    let success = false;

    switch (step) {
      case 1:
        if (!displayName || !birthdate || !gender) {
          setError("Please fill in all fields");
          return;
        }
        // Validate age (18+)
        const age = new Date().getFullYear() - new Date(birthdate).getFullYear();
        if (age < 18) {
          setError("You must be 18 or older");
          return;
        }
        success = await saveStep(1, { displayName, birthdate, gender });
        break;

      case 2:
        if (!childfreeStatus) {
          setError("Please select your childfree status");
          return;
        }
        success = await saveStep(2, { childfreeStatus });
        break;

      case 3:
        if (seeking.length === 0) {
          setError("Please select at least one connection type");
          return;
        }
        success = await saveStep(3, { seeking });
        break;

      case 4:
        success = await saveStep(4, {
          bio,
          genderPreferences,
          ageMin,
          ageMax,
          locationCity,
        });
        break;

      case 5:
        success = await saveStep(5, {});
        if (success) {
          router.push("/discover");
          return;
        }
        break;
    }

    if (success && step < TOTAL_STEPS) {
      setStep(step + 1);
      setError("");
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setError("");
    }
  };

  const toggleSeeking = (value: string) => {
    setSeeking((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  const toggleGenderPref = (value: string) => {
    setGenderPreferences((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-forest border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-[rgba(0,0,0,0.06)]">
        <div className="container-main h-16 flex items-center justify-between">
          <Link href="/">
            <Logo variant="full" size="sm" />
          </Link>
          <span className="text-sm text-muted">
            Step {step} of {TOTAL_STEPS}
          </span>
        </div>
      </header>

      {/* Progress bar */}
      <div className="fixed top-16 left-0 right-0 h-1 bg-foreground/10 z-40">
        <div
          className="h-full bg-forest transition-all duration-300"
          style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 pt-24 pb-32 px-6">
        <div className="max-w-lg mx-auto">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="animate-fadeIn">
              <div className="w-14 h-14 bg-forest/20 rounded-full flex items-center justify-center mb-6">
                <User size={28} className="text-forest" />
              </div>
              <h1 className="font-display text-2xl md:text-3xl text-foreground mb-2">
                Let&apos;s get to know you
              </h1>
              <p className="theme-body text-muted mb-8">
                This helps us personalize your experience.
              </p>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    First name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="How should we call you?"
                    className="w-full px-4 h-14 rounded-xl border border-border bg-background text-base focus:outline-none focus:border-forest transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Birthday
                  </label>
                  <input
                    type="date"
                    value={birthdate}
                    onChange={(e) => setBirthdate(e.target.value)}
                    className="w-full px-4 h-14 rounded-xl border border-border bg-background text-base focus:outline-none focus:border-forest transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    I am a...
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {GENDERS.map((g) => (
                      <button
                        key={g.value}
                        onClick={() => setGender(g.value)}
                        className={`px-4 py-3 rounded-xl border text-left transition-all ${
                          gender === g.value
                            ? "border-forest bg-forest/10 text-forest"
                            : "border-border hover:border-forest/50"
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Childfree Status */}
          {step === 2 && (
            <div className="animate-fadeIn">
              <div className="w-14 h-14 bg-forest/20 rounded-full flex items-center justify-center mb-6">
                <Check size={28} className="text-forest" />
              </div>
              <h1 className="font-display text-2xl md:text-3xl text-foreground mb-2">
                Your childfree journey
              </h1>
              <p className="theme-body text-muted mb-8">
                We&apos;re all here for different reasons. Which describes you?
              </p>

              <div className="space-y-3">
                {CHILDFREE_STATUSES.map((status) => (
                  <button
                    key={status.value}
                    onClick={() => setChildfreeStatus(status.value)}
                    className={`w-full px-5 py-4 rounded-xl border text-left transition-all ${
                      childfreeStatus === status.value
                        ? "border-forest bg-forest/10"
                        : "border-border hover:border-forest/50"
                    }`}
                  >
                    <span
                      className={`block font-medium ${
                        childfreeStatus === status.value
                          ? "text-forest"
                          : "text-foreground"
                      }`}
                    >
                      {status.label}
                    </span>
                    <span className="block text-sm text-muted mt-0.5">
                      {status.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Looking For */}
          {step === 3 && (
            <div className="animate-fadeIn">
              <div className="w-14 h-14 bg-forest/20 rounded-full flex items-center justify-center mb-6">
                <MagnifyingGlass size={28} className="text-forest" />
              </div>
              <h1 className="font-display text-2xl md:text-3xl text-foreground mb-2">
                What are you looking for?
              </h1>
              <p className="theme-body text-muted mb-8">
                Select all that apply. You can always change this later.
              </p>

              <div className="space-y-3">
                {CONNECTION_TYPES.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => toggleSeeking(type.value)}
                    className={`w-full px-5 py-4 rounded-xl border text-left transition-all flex items-start gap-4 ${
                      seeking.includes(type.value)
                        ? "border-forest bg-forest/10"
                        : "border-border hover:border-forest/50"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        seeking.includes(type.value)
                          ? "border-forest bg-forest"
                          : "border-border"
                      }`}
                    >
                      {seeking.includes(type.value) && (
                        <Check size={14} weight="bold" className="text-white" />
                      )}
                    </div>
                    <div>
                      <span
                        className={`block font-medium ${
                          seeking.includes(type.value)
                            ? "text-forest"
                            : "text-foreground"
                        }`}
                      >
                        {type.label}
                      </span>
                      <span className="block text-sm text-muted mt-0.5">
                        {type.description}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Bio & Preferences */}
          {step === 4 && (
            <div className="animate-fadeIn">
              <div className="w-14 h-14 bg-forest/20 rounded-full flex items-center justify-center mb-6">
                <Heart size={28} className="text-forest" />
              </div>
              <h1 className="font-display text-2xl md:text-3xl text-foreground mb-2">
                A bit more about you
              </h1>
              <p className="theme-body text-muted mb-8">
                These are optional but help others find you.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Bio{" "}
                    <span className="text-muted font-normal">(optional)</span>
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Share a bit about yourself..."
                    rows={3}
                    maxLength={500}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-base focus:outline-none focus:border-forest transition-colors resize-none"
                  />
                  <span className="text-xs text-muted mt-1 block text-right">
                    {bio.length}/500
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Interested in
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {GENDERS.map((g) => (
                      <button
                        key={g.value}
                        onClick={() => toggleGenderPref(g.value)}
                        className={`px-4 py-2 rounded-full border text-sm transition-all ${
                          genderPreferences.includes(g.value)
                            ? "border-forest bg-forest/10 text-forest"
                            : "border-border hover:border-forest/50"
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Age range
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      value={ageMin}
                      onChange={(e) =>
                        setAgeMin(Math.max(18, parseInt(e.target.value) || 18))
                      }
                      min={18}
                      max={99}
                      className="w-20 px-3 h-12 rounded-lg border border-border bg-background text-center focus:outline-none focus:border-forest"
                    />
                    <span className="text-muted">to</span>
                    <input
                      type="number"
                      value={ageMax}
                      onChange={(e) =>
                        setAgeMax(Math.min(99, parseInt(e.target.value) || 99))
                      }
                      min={18}
                      max={99}
                      className="w-20 px-3 h-12 rounded-lg border border-border bg-background text-center focus:outline-none focus:border-forest"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    City{" "}
                    <span className="text-muted font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={locationCity}
                    onChange={(e) => setLocationCity(e.target.value)}
                    placeholder="e.g. San Francisco"
                    className="w-full px-4 h-14 rounded-xl border border-border bg-background text-base focus:outline-none focus:border-forest transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Complete */}
          {step === 5 && (
            <div className="animate-fadeIn text-center py-8">
              <div className="w-20 h-20 bg-forest/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users size={40} className="text-forest" />
              </div>
              <h1 className="font-display text-2xl md:text-3xl text-foreground mb-3">
                You&apos;re all set, {displayName}!
              </h1>
              <p className="theme-body text-muted mb-8 max-w-sm mx-auto">
                Welcome to Flourish. Your profile is ready. Let&apos;s find your
                people.
              </p>

              <div className="bg-foreground/5 rounded-2xl p-6 text-left max-w-sm mx-auto">
                <h3 className="font-medium text-foreground mb-3">
                  Your profile summary
                </h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-muted">Name:</span>{" "}
                    <span className="text-foreground">{displayName}</span>
                  </p>
                  <p>
                    <span className="text-muted">Status:</span>{" "}
                    <span className="text-foreground">
                      {CHILDFREE_STATUSES.find(
                        (s) => s.value === childfreeStatus
                      )?.label || childfreeStatus}
                    </span>
                  </p>
                  <p>
                    <span className="text-muted">Looking for:</span>{" "}
                    <span className="text-foreground">
                      {seeking
                        .map(
                          (s) =>
                            CONNECTION_TYPES.find((t) => t.value === s)?.label
                        )
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
          )}
        </div>
      </div>

      {/* Footer navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-6 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-4">
          {step > 1 ? (
            <Button
              variant="secondary"
              onClick={handleBack}
              disabled={saving}
              className="gap-2"
            >
              <ArrowLeft size={18} weight="bold" />
              Back
            </Button>
          ) : (
            <div />
          )}

          <Button
            variant="accent"
            onClick={handleNext}
            disabled={saving}
            className="gap-2 min-w-[120px]"
          >
            {saving ? (
              "Saving..."
            ) : step === TOTAL_STEPS ? (
              "Start exploring"
            ) : (
              <>
                Continue
                <ArrowRight size={18} weight="bold" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
