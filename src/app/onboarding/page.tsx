"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ChipSelector } from "@/components/ui/chip-selector";
import { PromptPicker } from "@/components/ui/prompt-picker";
import {
  INTERESTS,
  MUSIC_GENRES,
  PETS_OPTIONS,
  DIET_OPTIONS,
  DRINKING_OPTIONS,
  VALUES,
  PROMPTS,
} from "@/lib/constants/profile-options";
import {
  ArrowRight,
  ArrowLeft,
  Heart,
  Users,
  Backpack,
  GlobeHemisphereWest,
} from "@phosphor-icons/react";

const TOTAL_STEPS = 4;

// Connection type options
const CONNECTION_TYPES = [
  {
    value: "DATING",
    label: "Dating",
    description: "Find a childfree partner",
    icon: Heart,
  },
  {
    value: "FRIENDSHIP",
    label: "Friendship",
    description: "Platonic connections with childfree people",
    icon: Users,
  },
  {
    value: "ACTIVITY_PARTNERS",
    label: "Activity Partners",
    description: "Hiking, gym, events, travel companions",
    icon: Backpack,
  },
  {
    value: "COMMUNITY",
    label: "Community",
    description: "Connect with childfree folks everywhere",
    icon: GlobeHemisphereWest,
  },
];


const GENDERS = [
  { value: "woman", label: "Woman" },
  { value: "man", label: "Man" },
  { value: "nonbinary", label: "Non-binary" },
  { value: "other", label: "Other" },
];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const MONTH_OPTIONS = MONTHS.map((month, i) => ({
  value: String(i + 1).padStart(2, "0"),
  label: month,
}));

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 82 }, (_, i) => currentYear - 18 - i); // 18-99 years old
const YEAR_OPTIONS = YEARS.map((year) => ({
  value: String(year),
  label: String(year),
}));

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const DAY_OPTIONS = DAYS.map((day) => ({
  value: String(day).padStart(2, "0"),
  label: String(day),
}));

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  // Form state
  const [displayName, setDisplayName] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [gender, setGender] = useState("");
  const [seeking, setSeeking] = useState<string[]>([]);

  // Step 3: Profile content
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [promptAnswer, setPromptAnswer] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [musicGenres, setMusicGenres] = useState<string[]>([]);
  const [pets, setPets] = useState("");
  const [diet, setDiet] = useState("");
  const [drinking, setDrinking] = useState("");
  const [values, setValues] = useState<string[]>([]);

  // Step 3: Preferences (kept from before)
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

        if (onboardingData.step >= 4) {
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
          if (p.birthdate) {
            const d = new Date(p.birthdate);
            setBirthMonth(String(d.getMonth() + 1).padStart(2, "0"));
            setBirthDay(String(d.getDate()).padStart(2, "0"));
            setBirthYear(String(d.getFullYear()));
          }
          if (p.gender) setGender(p.gender);
                    if (p.seeking) setSeeking(p.seeking);
          if (p.interests) setInterests(p.interests);
          if (p.musicGenres) setMusicGenres(p.musicGenres);
          if (p.pets) setPets(p.pets);
          if (p.diet) setDiet(p.diet);
          if (p.drinking) setDrinking(p.drinking);
          if (p.values) setValues(p.values);
          if (p.genderPreferences) setGenderPreferences(p.genderPreferences);
          if (p.ageMin) setAgeMin(p.ageMin);
          if (p.ageMax) setAgeMax(p.ageMax);
          if (p.locationCity) setLocationCity(p.locationCity);
          // Load prompt if exists
          if (p.prompts && p.prompts.length > 0) {
            setSelectedPrompt(p.prompts[0].promptType);
            setPromptAnswer(p.prompts[0].answer);
          }
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
        if (!displayName || !birthMonth || !birthDay || !birthYear || !gender) {
          setError("Please fill in all fields");
          return;
        }
        // Construct birthdate and validate age (18+)
        const birthdate = `${birthYear}-${birthMonth}-${birthDay}`;
        const age = new Date().getFullYear() - parseInt(birthYear);
        if (age < 18) {
          setError("You must be 18 or older");
          return;
        }
        success = await saveStep(1, { displayName, birthdate, gender });
        break;

      case 2:
        if (seeking.length === 0) {
          setError("Please select at least one connection type");
          return;
        }
        success = await saveStep(2, { seeking });
        break;

      case 3:
        if (!selectedPrompt || promptAnswer.length < 10) {
          setError("Please answer a prompt (at least 10 characters)");
          return;
        }
        success = await saveStep(3, {
          prompt: { type: selectedPrompt, answer: promptAnswer },
          interests,
          musicGenres,
          pets: pets || null,
          diet: diet || null,
          drinking: drinking || null,
          values,
          genderPreferences,
          ageMin,
          ageMax,
          locationCity,
        });
        break;

      case 4:
        success = await saveStep(4, {});
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

  // Check if current step is valid for enabling Continue button
  const isStepValid = () => {
    switch (step) {
      case 1:
        return displayName && birthMonth && birthDay && birthYear && gender;
      case 2:
        return seeking.length > 0;
      case 3:
        // Prompt is required, others optional
        return selectedPrompt && promptAnswer.length >= 10;
      case 4:
        return true; // Completion
      default:
        return false;
    }
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
          <span className="text-sm text-muted font-medium">
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
              <h1 className="font-display text-2xl md:text-3xl text-foreground mb-2">
                Hey there, nice to meet you
              </h1>
              <p className="theme-body text-muted mb-8">
                Tell us a little about yourself
              </p>

              <div className="space-y-5">
                <Input
                  label="Display name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="What should we call you?"
                />

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Birthday
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <Select
                      value={birthMonth}
                      onChange={setBirthMonth}
                      options={MONTH_OPTIONS}
                      placeholder="Month"
                    />
                    <Select
                      value={birthDay}
                      onChange={setBirthDay}
                      options={DAY_OPTIONS}
                      placeholder="Day"
                    />
                    <Select
                      value={birthYear}
                      onChange={setBirthYear}
                      options={YEAR_OPTIONS}
                      placeholder="Year"
                    />
                  </div>
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
          {/* Step 2: Looking For */}
          {step === 2 && (
            <div className="animate-fadeIn">
              <h1 className="font-display text-2xl md:text-3xl text-foreground mb-2">
                What are you looking for?
              </h1>
              <p className="theme-body text-muted mb-8">
                Select all that apply — you can always change this later
              </p>

              <div className="space-y-3">
                {CONNECTION_TYPES.map((type) => {
                  const Icon = type.icon;
                  const isSelected = seeking.includes(type.value);
                  return (
                    <button
                      key={type.value}
                      onClick={() => toggleSeeking(type.value)}
                      className={`w-full px-5 py-4 rounded-xl border text-left transition-all flex items-center gap-4 ${
                        isSelected
                          ? "border-forest bg-forest/10"
                          : "border-border hover:border-forest/50"
                      }`}
                    >
                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isSelected ? "bg-forest/20" : "bg-foreground/5"
                        }`}
                      >
                        <Icon
                          size={22}
                          weight="duotone"
                          className={isSelected ? "text-forest" : "text-muted"}
                        />
                      </div>
                      <div>
                        <span
                          className={`block text-lg font-semibold ${
                            isSelected ? "text-forest" : "text-foreground"
                          }`}
                        >
                          {type.label}
                        </span>
                        <span className="block text-base text-muted mt-0.5">
                          {type.description}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Profile Content */}
          {step === 3 && (
            <div className="animate-fadeIn">
              <h1 className="font-display text-2xl md:text-3xl text-foreground mb-2">
                A bit more about you
              </h1>
              <p className="theme-body text-muted mb-8">
                Help others get to know you better
              </p>

              <div className="space-y-8">
                {/* Profile Prompt (Required) */}
                <PromptPicker
                  label="Profile prompt"
                  required
                  prompts={PROMPTS}
                  selectedPrompt={selectedPrompt}
                  answer={promptAnswer}
                  onPromptChange={setSelectedPrompt}
                  onAnswerChange={setPromptAnswer}
                />

                {/* Interests */}
                <ChipSelector
                  label="Interests"
                  hint="select up to 10"
                  options={INTERESTS}
                  selected={interests}
                  onChange={setInterests}
                  max={10}
                />

                {/* Music */}
                <ChipSelector
                  label="Music"
                  hint="optional"
                  options={MUSIC_GENRES}
                  selected={musicGenres}
                  onChange={setMusicGenres}
                  max={5}
                />

                {/* Lifestyle */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Lifestyle <span className="text-muted font-normal">(optional)</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <Select
                      value={pets}
                      onChange={setPets}
                      options={PETS_OPTIONS}
                      placeholder="Pets"
                    />
                    <Select
                      value={diet}
                      onChange={setDiet}
                      options={DIET_OPTIONS}
                      placeholder="Diet"
                    />
                    <Select
                      value={drinking}
                      onChange={setDrinking}
                      options={DRINKING_OPTIONS}
                      placeholder="Drinking"
                    />
                  </div>
                </div>

                {/* Values */}
                <ChipSelector
                  label="Values"
                  hint="optional"
                  options={VALUES}
                  selected={values}
                  onChange={setValues}
                  max={5}
                />

                {/* Preferences Section */}
                <div className="pt-4 border-t border-border">
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    Preferences
                  </h2>

                  <div className="space-y-6">
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
                          className="w-20 px-3 h-14 rounded-xl border border-border bg-background text-center text-base focus:outline-none focus:border-forest transition-colors"
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
                          className="w-20 px-3 h-14 rounded-xl border border-border bg-background text-center text-base focus:outline-none focus:border-forest transition-colors"
                        />
                      </div>
                    </div>

                    <Input
                      label="City"
                      hint="optional"
                      value={locationCity}
                      onChange={(e) => setLocationCity(e.target.value)}
                      placeholder="e.g. San Francisco"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Complete */}
          {step === 4 && (
            <div className="animate-fadeIn text-center py-8">
              <h1 className="font-display text-2xl md:text-3xl text-foreground mb-3">
                You&apos;re all set, {displayName}!
              </h1>
              <p className="theme-body text-muted mb-8 max-w-sm mx-auto">
                Welcome to Flourish — your profile is ready, let&apos;s find your
                people
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
              <ArrowLeft size={16} />
              Back
            </Button>
          ) : (
            <div />
          )}

          <Button
            variant="accent"
            onClick={handleNext}
            disabled={saving || !isStepValid()}
            className="gap-2 min-w-[120px]"
          >
            {saving ? (
              "Saving..."
            ) : step === TOTAL_STEPS ? (
              "Start exploring"
            ) : (
              <>
                Continue
                <ArrowRight size={16} />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
