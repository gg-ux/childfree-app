"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { PromptPicker } from "@/components/ui/prompt-picker";
import { PhotoUpload } from "@/components/ui/photo-upload";
import { PROMPTS } from "@/lib/constants/profile-options";
import {
  ArrowRight,
  ArrowLeft,
  Heart,
  Users,
  Backpack,
  GlobeHemisphereWest,
} from "@phosphor-icons/react";
import { Loader } from "@/components/ui/loader";

const TOTAL_STEPS = 5;

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
  const [userEmail, setUserEmail] = useState("");

  // Form state
  const [displayName, setDisplayName] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [gender, setGender] = useState("");
  const [seeking, setSeeking] = useState<string[]>([]);

  // Step 3: Profile prompt
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [promptAnswer, setPromptAnswer] = useState("");

  // Step 4: Photos
  const [photos, setPhotos] = useState<{ id?: string; url: string; position: number }[]>([]);

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

        if (data.user?.email) setUserEmail(data.user.email);

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
          if (p.birthdate) {
            const d = new Date(p.birthdate);
            setBirthMonth(String(d.getMonth() + 1).padStart(2, "0"));
            setBirthDay(String(d.getDate()).padStart(2, "0"));
            setBirthYear(String(d.getFullYear()));
          }
          if (p.gender) setGender(p.gender);
          if (p.seeking) setSeeking(p.seeking);
          // Load prompt if exists
          if (p.prompts && p.prompts.length > 0) {
            setSelectedPrompt(p.prompts[0].promptType);
            setPromptAnswer(p.prompts[0].answer);
          }
          // Load photos if exist
          if (p.photos && p.photos.length > 0) {
            setPhotos(p.photos);
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
        });
        break;

      case 4:
        // Photos step - require at least one photo unless skipping
        if (photos.length === 0) {
          setError("Please upload at least one photo");
          return;
        }
        success = await saveStep(4, {});
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

  const handleSkip = async () => {
    // Skip current step and go to next
    const success = await saveStep(step, {});
    if (success) {
      setStep(step + 1);
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

  // Check if current step is valid for enabling Continue button
  const isStepValid = () => {
    switch (step) {
      case 1:
        return displayName && birthMonth && birthDay && birthYear && gender;
      case 2:
        return seeking.length > 0;
      case 3:
        return selectedPrompt && promptAnswer.length >= 10;
      case 4:
        return photos.length > 0;
      case 5:
        return true; // Completion
      default:
        return false;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader size="lg" />
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
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted font-[450]">
              Step {step} of {TOTAL_STEPS}
            </span>
            {userEmail && (
              <span className="text-xs text-muted/60 hidden sm:inline">
                {userEmail}
              </span>
            )}
          </div>
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
                        className={`px-4 py-3 rounded-xl border text-left font-[450] transition-all ${
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
                Select all that apply. You can always change this later
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
                        <span className="block text-base font-[450] text-muted mt-0.5">
                          {type.description}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Profile Prompt */}
          {step === 3 && (
            <div className="animate-fadeIn">
              <h1 className="font-display text-2xl md:text-3xl text-foreground mb-2">
                One more thing
              </h1>
              <p className="theme-body text-muted mb-8">
                Answer a prompt to help others get to know you
              </p>

              <PromptPicker
                prompts={PROMPTS}
                selectedPrompt={selectedPrompt}
                answer={promptAnswer}
                onPromptChange={setSelectedPrompt}
                onAnswerChange={setPromptAnswer}
              />
            </div>
          )}

          {/* Step 4: Photo */}
          {step === 4 && (
            <div className="animate-fadeIn">
              <h1 className="font-display text-2xl md:text-3xl text-foreground mb-2">
                Add a profile photo
              </h1>
              <p className="theme-body text-muted mb-8">
                A photo helps others see who they're connecting with
              </p>

              <PhotoUpload
                photos={photos}
                onChange={setPhotos}
                maxPhotos={1}
              />
            </div>
          )}

          {/* Step 5: Complete */}
          {step === 5 && (
            <div className="animate-fadeIn py-8">
              <div className="text-center mb-8">
                <h1 className="font-display text-2xl md:text-3xl text-foreground mb-3">
                  You&apos;re all set, {displayName}!
                </h1>
              </div>

              <div className="max-w-[280px] mx-auto bg-white rounded-2xl shadow-lg border border-border overflow-hidden">
                {/* Photo */}
                {photos.length > 0 ? (
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <img
                      src={photos[0].url}
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
                    {/* Name + age overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-display text-xl tracking-tight">
                        {displayName}{birthYear ? `, ${new Date().getFullYear() - parseInt(birthYear)}` : ""}
                      </h3>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-[3/4] bg-foreground/5 flex items-end p-4">
                    <h3 className="font-display text-xl text-foreground tracking-tight">
                      {displayName}{birthYear ? `, ${new Date().getFullYear() - parseInt(birthYear)}` : ""}
                    </h3>
                  </div>
                )}

                {/* Bottom info */}
                <div className="p-4 space-y-3">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {seeking.map((s) => {
                      const label = CONNECTION_TYPES.find((t) => t.value === s)?.label;
                      return label ? (
                        <span key={s} className="text-xs font-[500] text-muted bg-foreground/5 px-3 py-1.5 rounded-full">
                          {label}
                        </span>
                      ) : null;
                    })}
                  </div>

                  {/* Prompt */}
                  {selectedPrompt && promptAnswer && (
                    <div className="pt-2 border-t border-border/50">
                      <p className="text-xs text-muted mb-1">
                        {PROMPTS.find((p) => p.value === selectedPrompt)?.text || selectedPrompt}
                      </p>
                      <p className="text-sm font-[500] text-foreground">{promptAnswer}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm font-[450] mt-4 text-center">{error}</p>
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

          <div className="flex items-center gap-3">
            {step === 3 && (
              <Button
                variant="ghost"
                onClick={handleSkip}
                disabled={saving}
              >
                Skip for now
              </Button>
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
    </div>
  );
}
