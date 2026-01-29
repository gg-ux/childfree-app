"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import {
  UserCircle,
  GearSix,
  SignOut,
  PencilSimple,
  Plus,
  X,
  MapPin,
  CalendarBlank,
  Camera,
  Star,
  Heart,
  Users,
  MagnifyingGlass,
  HandHeart,
  PawPrint,
  Info,
  DotsThreeVertical,
  FishSimple,
  Sparkle,
  Brain,
  ForkKnife,
  Wine,
  Cigarette,
  Leaf,
  Briefcase,
  ArrowsClockwise,
  Trash,
  Moon,
  GraduationCap,
  ArrowLeft,
  ArrowRight,
} from "@phosphor-icons/react";
import { Loader } from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import {
  INTERESTS,
  MUSIC_GENRES,
  VALUES,
  WORK_STYLE_OPTIONS,
  SLEEP_STYLE_OPTIONS,
  EDUCATION_OPTIONS,
  PETS_OPTIONS,
  DIET_OPTIONS,
  DRINKING_OPTIONS,
  SMOKING_OPTIONS,
  CANNABIS_OPTIONS,
  PROMPTS,
  PRONOUNS_OPTIONS,
  IDENTITY_TAG_OPTIONS,
  LOOKING_FOR_OPTIONS,
  PET_PARENT_OPTIONS,
  MBTI_OPTIONS,
  PHOTO_CAPTIONS,
} from "@/lib/constants/profile-options";

// Types
interface Photo {
  id: string;
  url: string;
  position: number;
  caption: string | null;
}

interface PromptData {
  id: string;
  promptType: string;
  answer: string;
  position: number;
}

interface ProfileData {
  id: string;
  displayName: string;
  birthdate: string;
  gender: string;
  bio: string | null;
  childfreeStatus: string;
  relationshipStatus: string;
  seeking: string[];
  interests: string[];
  musicGenres: string[];
  values: string[];
  pronouns: string | null;
  identityTags: string[];
  petTypes: string[];
  zodiacSign: string | null;
  mbtiType: string | null;
  pets: string | null;
  diet: string | null;
  drinking: string | null;
  smoking: string | null;
  cannabis: string | null;
  workStyle: string | null;
  sleepStyle: string | null;
  education: string | null;
  jobTitle: string | null;
  anthem: string | null;
  locationCity: string | null;
  photos: Photo[];
  prompts: PromptData[];
  email: string;
}

interface EventAttended {
  id: string;
  title: string;
  startsAt: string;
  locationCity: string | null;
  eventType: string;
}

// Helpers
function getAge(birthdate: string) {
  const today = new Date();
  const birth = new Date(birthdate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function getZodiac(birthdate: string) {
  const d = new Date(birthdate);
  const month = d.getUTCMonth() + 1;
  const day = d.getUTCDate();
  const signs = [
    { sign: "Capricorn", end: [1, 19] },
    { sign: "Aquarius", end: [2, 18] },
    { sign: "Pisces", end: [3, 20] },
    { sign: "Aries", end: [4, 19] },
    { sign: "Taurus", end: [5, 20] },
    { sign: "Gemini", end: [6, 20] },
    { sign: "Cancer", end: [7, 22] },
    { sign: "Leo", end: [8, 22] },
    { sign: "Virgo", end: [9, 22] },
    { sign: "Libra", end: [10, 22] },
    { sign: "Scorpio", end: [11, 21] },
    { sign: "Sagittarius", end: [12, 21] },
  ];
  for (const { sign, end } of signs) {
    if (month < end[0] || (month === end[0] && day <= end[1])) return sign;
  }
  return "Capricorn";
}

function getLabel(options: { value: string; label: string }[], value: string | null) {
  if (!value) return null;
  return options.find((o) => o.value === value)?.label || value;
}

function getAnthemEmbed(url: string | null): { type: "spotify" | "youtube"; embedUrl: string } | null {
  if (!url) return null;
  // Spotify
  const spotify = url.match(/open\.spotify\.com\/track\/([a-zA-Z0-9]+)/);
  if (spotify) return { type: "spotify", embedUrl: `https://open.spotify.com/embed/track/${spotify[1]}?theme=0` };
  // YouTube - various URL formats
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/);
  if (yt) return { type: "youtube", embedUrl: `https://www.youtube.com/embed/${yt[1]}` };
  return null;
}

const RELATIONSHIP_OPTIONS = [
  { value: "SINGLE", label: "Single" },
  { value: "RELATIONSHIP", label: "In a relationship" },
  { value: "COMPLICATED", label: "It's complicated" },
  { value: "ENM", label: "ENM" },
  { value: "POLYAMOROUS", label: "Polyamorous" },
  { value: "OPEN", label: "Open relationship" },
];

// Helper to derive pet parent label from selected pet values + gender
function getPetParentLabel(pets: string[], gender: string): string | null {
  if (!pets || pets.length === 0) return null;
  const suffix = gender === "Female" ? "mom" : gender === "Male" ? "dad" : "parent";
  const labels = pets.map((p) => PET_PARENT_OPTIONS.find((o) => o.value === p)?.label || p);
  if (labels.length === 1) return `${labels[0]} ${suffix}`;
  if (labels.length === 2) return `${labels[0]} & ${labels[1]} ${suffix}`;
  return `${labels.slice(0, -1).join(", ")} & ${labels[labels.length - 1]} ${suffix}`;
}

function computeCompletion(profile: ProfileData) {
  let score = 0;
  if (profile.photos.length > 0) score += 20;
  if (profile.prompts.length > 0) score += 30;
  if (profile.interests.length > 0) score += 10;
  const aboutFields = [profile.diet, profile.drinking, profile.smoking, profile.cannabis, profile.workStyle].filter(Boolean);
  if (aboutFields.length >= 3) score += 15;
  if (profile.musicGenres.length > 0) score += 10;
  if (profile.values.length > 0) score += 15;
  return score;
}

function getNudge(profile: ProfileData) {
  if (profile.photos.length === 0) return "Add a photo to make your profile stand out";
  if (profile.prompts.length === 0) return "Add a prompt to spark conversation";
  if (profile.interests.length === 0) return "Add interests so people can find you";
  const aboutFields = [profile.zodiacSign, profile.diet, profile.drinking, profile.smoking, profile.cannabis, profile.workStyle].filter(Boolean);
  if (aboutFields.length < 3) return "Fill out your About Me details";
  if (profile.values.length === 0) return "Share your values";
  if (profile.musicGenres.length === 0) return "Add your music taste";
  return null;
}

// Edit modal
function EditModal({ title, open, onClose, children }: { title: string; open: boolean; onClose: () => void; children: React.ReactNode }) {
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    if (open) requestAnimationFrame(() => setVisible(true));
    else setVisible(false);
  }, [open]);
  if (!open) return null;
  return (
    <div className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 transition-opacity duration-200 ${visible ? "opacity-100" : "opacity-0"}`}>
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full sm:max-w-md bg-background rounded-t-2xl sm:rounded-2xl shadow-xl border border-border overflow-hidden max-h-[85vh] flex flex-col transition-transform duration-300 ease-out ${visible ? "translate-y-0" : "translate-y-8 sm:translate-y-4"}`}>
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border shrink-0">
          <h2 className="theme-heading text-sm text-foreground">{title}</h2>
          <button onClick={onClose} className="text-muted hover:text-foreground transition-colors">
            <X size={18} weight="bold" />
          </button>
        </div>
        <div className="overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [events, setEvents] = useState<EventAttended[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  // Online status — placeholder until backend wiring
  // const [isOnline, setIsOnline] = useState(true);
  const [animatedCompletion, setAnimatedCompletion] = useState(0);
  const [mobilePhotoIndex, setMobilePhotoIndex] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const touchStartY = useRef<number | null>(null);
  const avatarMenuRef = useRef<HTMLDivElement>(null);

  // Edit states
  const [editSection, setEditSection] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editJobTitle, setEditJobTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [editInterests, setEditInterests] = useState<string[]>([]);
  const [editMusic, setEditMusic] = useState<string[]>([]);
  const [editValues, setEditValues] = useState<string[]>([]);
  const [editSeeking, setEditSeeking] = useState<string[]>([]);
  const [editPronouns, setEditPronouns] = useState("");
  const [editTags, setEditTags] = useState<{ looking: string[]; identity: string[]; pet: string[]; relationship: string }>({ looking: [], identity: [], pet: [], relationship: "" });
  const [showIdentityInfo, setShowIdentityInfo] = useState(false);
  const [editAnthem, setEditAnthem] = useState("");
  const [photoMenuId, setPhotoMenuId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const photoMenuRef = useRef<HTMLDivElement>(null);
  const [editPromptType, setEditPromptType] = useState("");
  const [editPromptAnswer, setEditPromptAnswer] = useState("");
  const [editPromptId, setEditPromptId] = useState<string | null>(null);
  const [captionPhotoId, setCaptionPhotoId] = useState<string | null>(null);
  const [customCaption, setCustomCaption] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const authRes = await fetch("/api/auth/check");
        const authData = await authRes.json();
        if (!authData.authenticated) { router.push("/auth/signup"); return; }
        const profileRes = await fetch("/api/profile");
        const profileData = await profileRes.json();
        if (profileRes.ok) {
          setProfile(profileData.profile);
          setEvents(profileData.eventsAttended || []);
        }
      } catch { router.push("/auth/signup"); }
      finally { setLoading(false); }
    }
    load();
  }, [router]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(e.target as Node)) setShowAvatarMenu(false);
      if (photoMenuRef.current && !photoMenuRef.current.contains(e.target as Node)) setPhotoMenuId(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const showToast = useCallback((message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  }, []);

  const saveField = useCallback(async (data: Record<string, unknown>) => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const result = await res.json();
      if (res.ok && result.profile) {
        setProfile((prev) => prev ? { ...prev, ...result.profile, email: prev.email } : prev);
        showToast("Saved", "success");
      } else {
        showToast("Something went wrong", "error");
      }
    } catch {
      showToast("Something went wrong", "error");
    }
    finally { setSaving(false); }
  }, [showToast]);

  const handleLogout = async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("position", String(profile.photos.length));
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const profileRes = await fetch("/api/profile");
        const data = await profileRes.json();
        if (profileRes.ok) setProfile((prev) => prev ? { ...prev, photos: data.profile.photos } : prev);
      }
    } catch { /* silent */ }
  };

  const handleSaveCaption = async (photoId: string, caption: string | null) => {
    try {
      const res = await fetch("/api/profile/photos/caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoId, caption }),
      });
      if (res.ok) {
        setProfile((prev) => prev ? {
          ...prev,
          photos: prev.photos.map((p) => p.id === photoId ? { ...p, caption } : p)
        } : prev);
        showToast("Caption saved", "success");
      }
    } catch { /* silent */ }
    setCaptionPhotoId(null);
    setPhotoMenuId(null);
  };

  const handleSetFeatured = async (photoId: string) => {
    if (!profile) return;
    try {
      // Swap positions: move selected photo to position 0, shift others
      const reordered = [...profile.photos];
      const idx = reordered.findIndex((p) => p.id === photoId);
      if (idx <= 0) return;
      const [photo] = reordered.splice(idx, 1);
      reordered.unshift(photo);
      // Update positions on server
      await fetch("/api/profile/photos/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: reordered.map((p) => p.id) }),
      });
      setProfile((prev) => prev ? { ...prev, photos: reordered.map((p, i) => ({ ...p, position: i })) } : prev);
    } catch { /* silent */ }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!profile) return;
    try {
      const res = await fetch("/api/profile/photos/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoId }),
      });
      if (res.ok) {
        setProfile((prev) => prev ? { ...prev, photos: prev.photos.filter((p) => p.id !== photoId) } : prev);
      }
    } catch { /* silent */ }
    setPhotoMenuId(null);
  };

  const replacePhotoInputRef = useRef<HTMLInputElement>(null);
  const [replacePhotoId, setReplacePhotoId] = useState<string | null>(null);

  const handleReplacePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile || !replacePhotoId) return;
    // Delete old, upload new at same position
    const oldPhoto = profile.photos.find((p) => p.id === replacePhotoId);
    if (!oldPhoto) return;
    try {
      await fetch("/api/profile/photos/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoId: replacePhotoId }),
      });
      const formData = new FormData();
      formData.append("file", file);
      formData.append("position", String(oldPhoto.position));
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const profileRes = await fetch("/api/profile");
        const data = await profileRes.json();
        if (profileRes.ok) setProfile((prev) => prev ? { ...prev, photos: data.profile.photos } : prev);
      }
    } catch { /* silent */ }
    setReplacePhotoId(null);
    setPhotoMenuId(null);
    e.target.value = "";
  };

  const completion = profile ? computeCompletion(profile) : 0;
  const nudge = profile ? getNudge(profile) : null;
  const age = profile ? getAge(profile.birthdate) : 0;

  // Animate completion bar on change
  useEffect(() => {
    const timer = setTimeout(() => setAnimatedCompletion(completion), 100);
    return () => clearTimeout(timer);
  }, [completion]);

  // Auto-rotate photos every 4 seconds (desktop view mode only)
  useEffect(() => {
    if (!autoRotate || isEditMode || !profile || profile.photos.length <= 1) return;
    const interval = setInterval(() => {
      setMobilePhotoIndex((prev) => (prev + 1) % profile.photos.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [autoRotate, isEditMode, profile]);

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  const openEdit = (section: string) => {
    if (!isEditMode) return;
    setEditSection(section);
    if (section === "basics") { setEditName(profile.displayName); setEditCity(profile.locationCity || ""); setEditPronouns(profile.pronouns || ""); setEditJobTitle(profile.jobTitle || ""); }
    if (section === "interests") setEditInterests([...profile.interests]);
    if (section === "music") setEditMusic([...profile.musicGenres]);
    if (section === "values") setEditValues([...profile.values]);
    if (section === "seeking") setEditSeeking([...profile.seeking]);
    if (section === "tags") {
      setEditTags({
        looking: [...profile.seeking],
        identity: [...(profile.identityTags || [])],
        pet: [...(profile.petTypes || [])],
        relationship: profile.relationshipStatus || "",
      });
    }
  };

  const editBtn = (_section: string) => null;

  const sectionHeader = (label: string, section: string) => (
    <div
      className={`mb-3 ${isEditMode ? "cursor-pointer" : ""}`}
      onClick={() => isEditMode && openEdit(section)}
    >
      <h2 className={`theme-heading text-sm text-foreground inline-flex items-center gap-1.5 ${isEditMode ? "hover:text-forest transition-colors" : ""}`}>
        {label}
        {isEditMode && <PencilSimple size={12} weight="bold" className="text-muted" />}
      </h2>
    </div>
  );

  const chipToggle = (value: string, list: string[], setList: (v: string[]) => void, max = 5) => {
    if (list.includes(value)) setList(list.filter((v) => v !== value));
    else if (list.length < max) setList([...list, value]);
  };

  // Chip style matching mockup cards: neutral bg, same color, icon + text
  const chipClass = "text-sm px-3 py-1.5 rounded-full border border-border text-muted font-button font-[500] inline-flex items-center gap-1.5";

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 frosted border-b border-border">
        <div className="container-main h-16 flex items-center justify-between">
          <Link href="/home"><Logo variant="full" size="sm" /></Link>
          <div className="flex items-center gap-3">
            <div className="relative" ref={avatarMenuRef}>
              <button onClick={() => setShowAvatarMenu(!showAvatarMenu)} className="hover:opacity-80 transition-opacity focus:outline-none">
                {profile.photos[0]?.url ? (
                  <img src={profile.photos[0].url} alt="" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-forest/20 flex items-center justify-center">
                    <span className="text-forest text-xs font-[600]">{profile.displayName[0].toUpperCase()}</span>
                  </div>
                )}
              </button>
              {showAvatarMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-background rounded-xl border border-border shadow-lg overflow-hidden z-50">
                  <div className="flex items-center gap-3.5 px-4 py-4 border-b border-border">
                    {profile.photos[0]?.url ? (
                      <img src={profile.photos[0].url} alt="" className="w-12 h-12 rounded-full object-cover aspect-square" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-forest/20 flex items-center justify-center aspect-square">
                        <span className="text-forest text-base font-[600]">{profile.displayName[0].toUpperCase()}</span>
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-lg text-foreground leading-tight">{profile.displayName}</p>
                      <span className="mt-1 text-xs font-button flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-border">
                        <span className="w-2 h-2 rounded-full bg-forest" />
                        <span className="text-forest">Online</span>
                      </span>
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

      {/* Content */}
      <div className="pt-24 pb-24 lg:pb-0 px-4 lg:h-screen lg:overflow-hidden">
        <div className="max-w-5xl mx-auto">

          {/* Completion bar — edit mode only */}
          {isEditMode && completion < 100 && (
            <div className="mb-6 max-w-lg lg:max-w-none">
              <div className="flex items-center justify-between mb-1.5">
                <span className="theme-caption text-muted">{completion}% complete</span>
              </div>
              <div className="h-[4px] bg-foreground/5 rounded-full overflow-hidden">
                <div className="h-full bg-forest rounded-full transition-all duration-700 ease-out" style={{ width: `${animatedCompletion}%` }} />
              </div>
              {nudge && <p className="theme-body-sm text-muted mt-2">{nudge}</p>}
            </div>
          )}

          {/* Two-column layout on desktop — independently scrollable */}
          <div className="lg:grid lg:grid-cols-[1fr_1fr] lg:gap-10 lg:h-[calc(100vh-7rem)] lg:overflow-hidden">

            {/* LEFT COLUMN — Photos */}
            <div className="mb-8 lg:mb-0 lg:overflow-y-auto lg:pr-2 scrollbar-hide">
              {profile.photos.length > 0 ? (
                <div>
                  {isEditMode ? (
                    <>
                      {/* Edit mode: featured + thumbnail upload grid */}
                      <div className="aspect-square rounded-2xl overflow-hidden bg-foreground/5 relative">
                        <img src={profile.photos[0].url} alt="" className="w-full h-full object-cover" />
                        <div className="absolute top-2.5 right-2.5" ref={photoMenuId === profile.photos[0].id ? photoMenuRef : undefined}>
                          <button
                            onClick={() => setPhotoMenuId(photoMenuId === profile.photos[0].id ? null : profile.photos[0].id)}
                            className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors"
                          >
                            <DotsThreeVertical size={18} weight="bold" className="text-white" />
                          </button>
                          {photoMenuId === profile.photos[0].id && (
                            <div className="absolute right-0 top-full mt-1 w-44 bg-background rounded-xl border border-border shadow-lg overflow-hidden z-10">
                              <button onClick={() => { setCaptionPhotoId(profile.photos[0].id); setPhotoMenuId(null); }} className="flex items-center gap-2 px-3 py-1.5 theme-body-sm text-foreground hover:bg-foreground/5 transition-colors w-full text-left"><PencilSimple size={16} weight="duotone" /> Caption</button>
                              <button onClick={() => { setReplacePhotoId(profile.photos[0].id); replacePhotoInputRef.current?.click(); }} className="flex items-center gap-2 px-3 py-1.5 theme-body-sm text-foreground hover:bg-foreground/5 transition-colors w-full text-left"><ArrowsClockwise size={16} weight="duotone" /> Replace</button>
                              <button onClick={() => handleDeletePhoto(profile.photos[0].id)} className="flex items-center gap-2 px-3 py-1.5 theme-body-sm text-red-500 hover:bg-foreground/5 transition-colors w-full text-left"><Trash size={16} weight="duotone" /> Remove</button>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-5 gap-1.5 mt-1.5">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="aspect-square rounded-lg border border-dashed border-foreground/15 bg-foreground/[0.03] relative">
                            {profile.photos[i] ? (
                              <div ref={photoMenuId === profile.photos[i].id ? photoMenuRef : undefined} className="w-full h-full">
                                <img src={profile.photos[i].url} alt="" className="w-full h-full object-cover rounded-lg" />
                                <button
                                  onClick={() => setPhotoMenuId(photoMenuId === profile.photos[i].id ? null : profile.photos[i].id)}
                                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors z-10"
                                >
                                  <DotsThreeVertical size={14} weight="bold" className="text-white" />
                                </button>
                                {photoMenuId === profile.photos[i].id && (
                                  <div className={`absolute top-8 w-44 bg-background rounded-xl border border-border shadow-lg overflow-hidden z-50 ${i <= 2 ? "left-0" : "right-0"}`}>
                                    <button onClick={() => { handleSetFeatured(profile.photos[i].id); setPhotoMenuId(null); }} className="flex items-center gap-2 px-3 py-1.5 theme-body-sm text-foreground hover:bg-foreground/5 transition-colors w-full text-left"><Star size={16} weight="duotone" /> Feature</button>
                                    <button onClick={() => { setCaptionPhotoId(profile.photos[i].id); setPhotoMenuId(null); }} className="flex items-center gap-2 px-3 py-1.5 theme-body-sm text-foreground hover:bg-foreground/5 transition-colors w-full text-left"><PencilSimple size={16} weight="duotone" /> Caption</button>
                                    <button onClick={() => { setReplacePhotoId(profile.photos[i].id); replacePhotoInputRef.current?.click(); }} className="flex items-center gap-2 px-3 py-1.5 theme-body-sm text-foreground hover:bg-foreground/5 transition-colors w-full text-left"><ArrowsClockwise size={16} weight="duotone" /> Replace</button>
                                    <button onClick={() => handleDeletePhoto(profile.photos[i].id)} className="flex items-center gap-2 px-3 py-1.5 theme-body-sm text-red-500 hover:bg-foreground/5 transition-colors w-full text-left"><Trash size={16} weight="duotone" /> Remove</button>
                                  </div>
                                )}
                              </div>
                            ) : profile.photos.length < 6 ? (
                              <label className="w-full h-full flex items-center justify-center cursor-pointer hover:bg-foreground/[0.06] transition-colors">
                                <Plus size={18} className="text-muted/60" />
                                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                              </label>
                            ) : (
                              <div className="w-full h-full" />
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Small screens (single col): vertical carousel with swipe + scroll */}
                      <div
                        className="lg:hidden aspect-square rounded-2xl overflow-hidden bg-foreground/5 relative"
                        onTouchStart={(e) => { touchStartY.current = e.touches[0].clientY; }}
                        onTouchEnd={(e) => {
                          if (touchStartY.current === null) return;
                          const diff = touchStartY.current - e.changedTouches[0].clientY;
                          if (Math.abs(diff) > 50) {
                            setMobilePhotoIndex((prev) =>
                              diff > 0
                                ? Math.min(prev + 1, profile.photos.length - 1)
                                : Math.max(prev - 1, 0)
                            );
                          }
                          touchStartY.current = null;
                        }}
                        onWheel={(e) => {
                          if (profile.photos.length <= 1) return;
                          if (Math.abs(e.deltaY) < 10) return;
                          e.stopPropagation();
                          setMobilePhotoIndex((prev) =>
                            e.deltaY > 0
                              ? Math.min(prev + 1, profile.photos.length - 1)
                              : Math.max(prev - 1, 0)
                          );
                        }}
                      >
                        <div
                          className="flex flex-col h-full transition-transform duration-300 ease-out"
                          style={{ transform: `translateY(-${mobilePhotoIndex * 100}%)` }}
                        >
                          {profile.photos.map((photo) => (
                            <div key={photo.id} className="w-full h-full shrink-0">
                              <img src={photo.url} alt="" className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                        {profile.photos.length > 1 && (
                          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex flex-col gap-1.5">
                            {profile.photos.map((_, i) => (
                              <button
                                key={i}
                                onClick={() => setMobilePhotoIndex(i)}
                                className={`w-1.5 rounded-full transition-all ${i === mobilePhotoIndex ? "bg-white h-4" : "bg-white/40 h-1.5"}`}
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Desktop (2-col): main image + responsive thumbnails */}
                      <div className="hidden lg:block">
                        {/* Main image */}
                        <div className="aspect-square rounded-2xl overflow-hidden bg-foreground/5 mb-2 relative">
                          <img
                            key={mobilePhotoIndex}
                            src={profile.photos[mobilePhotoIndex]?.url || profile.photos[0]?.url}
                            alt=""
                            className="w-full h-full object-cover animate-in fade-in duration-500"
                          />
                          {/* Caption overlay */}
                          {profile.photos[mobilePhotoIndex]?.caption && (
                            <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white text-sm font-medium px-3 py-1.5 rounded-full max-w-[80%] truncate">
                              {PHOTO_CAPTIONS.find((c) => c.value === profile.photos[mobilePhotoIndex].caption)?.label || profile.photos[mobilePhotoIndex].caption}
                            </div>
                          )}
                          {/* Photo counter */}
                          {profile.photos.length > 1 && (
                            <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
                              {mobilePhotoIndex + 1} / {profile.photos.length}
                            </div>
                          )}
                        </div>
                        {/* Responsive thumbnails - scale based on count */}
                        {profile.photos.length > 1 && (
                          <div className="flex gap-2 p-1 -m-1">
                            {profile.photos.map((photo, idx) => (
                              <button
                                key={photo.id}
                                onClick={() => { setMobilePhotoIndex(idx); setAutoRotate(false); }}
                                className={`flex-1 aspect-square rounded-lg overflow-hidden bg-foreground/5 transition-all ${
                                  idx === mobilePhotoIndex
                                    ? "ring-2 ring-forest ring-offset-2"
                                    : "opacity-60 hover:opacity-100"
                                }`}
                              >
                                <img src={photo.url} alt="" className="w-full h-full object-cover" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ) : isEditMode ? (
                <label className="aspect-square rounded-2xl border-2 border-dashed border-border bg-foreground/[0.02] flex items-center justify-center cursor-pointer hover:border-forest/30 transition-colors">
                  <div className="text-center">
                    <Camera size={32} className="text-muted mx-auto mb-2" weight="duotone" />
                    <p className="theme-body-sm text-muted">Add your first photo</p>
                  </div>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              ) : (
                <div className="aspect-square rounded-2xl bg-foreground/5 flex items-center justify-center">
                  <Camera size={48} className="text-muted/30" weight="duotone" />
                </div>
              )}

            </div>

            {/* RIGHT COLUMN — Profile details */}
            <div className="lg:overflow-y-auto lg:pl-2 lg:pr-1 lg:pb-16 scrollbar-hide">
              {/* Name + Edit button */}
              <div className="flex items-start justify-between mb-1">
                <div
                  className={isEditMode ? "cursor-pointer" : ""}
                  onClick={() => isEditMode && openEdit("basics")}
                >
                  <h1 className={`font-display text-2xl text-foreground leading-tight inline-flex items-center gap-2 flex-wrap ${isEditMode ? "hover:text-forest transition-colors" : ""}`}>
                    {profile.displayName}, {age}
                    {profile.pronouns && <span className="text-muted font-button text-base font-[500]">({profile.pronouns})</span>}
                    {isEditMode && <PencilSimple size={12} weight="bold" className="text-muted" />}
                  </h1>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
                    {profile.locationCity && (
                      <p className="theme-body-sm text-muted flex items-center gap-1">
                        <MapPin size={14} weight="bold" /> {profile.locationCity}
                      </p>
                    )}
                    {(profile.jobTitle || isEditMode) && (
                      <p className="theme-body-sm text-muted flex items-center gap-1">
                        <Briefcase size={14} weight="bold" /> {profile.jobTitle || <span className="text-muted/40">Add job title</span>}
                      </p>
                    )}
                  </div>
                </div>
                <div className="hidden lg:flex items-center gap-2 shrink-0">
                  {isEditMode ? (
                    <>
                      <Button onClick={() => setIsEditMode(false)} variant="ghost" size="sm">
                        Cancel
                      </Button>
                      <Button onClick={() => setIsEditMode(false)} variant="default" size="sm">
                        Save Changes
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditMode(true)} variant="default" size="sm">
                      <PencilSimple size={14} weight="bold" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>

              {/* Tags */}
              {(() => {
                const allTags: { icon: typeof Heart; label: string; key: string }[] = [];
                // Relationship status
                const relLabel = RELATIONSHIP_OPTIONS.find((o) => o.value === profile.relationshipStatus)?.label;
                if (relLabel) allTags.push({ icon: Heart, label: relLabel, key: `rel-${profile.relationshipStatus}` });
                // Looking for
                profile.seeking.forEach((s) => {
                  const opt = LOOKING_FOR_OPTIONS.find((o) => o.value === s);
                  if (opt) allTags.push({ icon: MagnifyingGlass, label: opt.label, key: `seek-${s}` });
                });
                // Identity tags
                (profile.identityTags || []).forEach((t) => {
                  const opt = IDENTITY_TAG_OPTIONS.find((o) => o.value === t);
                  if (opt) allTags.push({ icon: Star, label: opt.label, key: `id-${t}` });
                });
                // Pet parent
                const petTypes = profile.petTypes || [];
                const petLabel = getPetParentLabel(petTypes, profile.gender);
                const petIcon = petTypes.length === 1 && petTypes[0] === "fish" ? FishSimple : PawPrint;
                if (petLabel) allTags.push({ icon: petIcon, label: petLabel, key: "pet" });

                const hasTags = allTags.length > 0;
                if (!isEditMode && !hasTags) return null;

                return (
                  <div className="mt-4 mb-6">
                    {isEditMode && sectionHeader("Tags", "tags")}
                    {hasTags ? (
                      <div className={`flex flex-wrap gap-2 ${isEditMode ? "cursor-pointer" : ""}`} onClick={() => isEditMode && openEdit("tags")}>
                        {allTags.slice(0, 4).map((tag) => (
                          <span key={tag.key} className={chipClass}>
                            <tag.icon size={14} weight="bold" />
                            {tag.label}
                          </span>
                        ))}
                      </div>
                    ) : isEditMode ? (
                      <button onClick={() => openEdit("tags")} className="theme-body-sm text-muted hover:text-forest transition-colors">+ Add tags</button>
                    ) : null}
                  </div>
                );
              })()}


              {/* Prompts */}
              <div className="mb-6 space-y-3">
                {profile.prompts.map((prompt) => {
                  const promptDef = PROMPTS.find((p) => p.value === prompt.promptType);
                  return (
                    <div
                      key={prompt.id}
                      className={`rounded-2xl border border-border p-4 ${isEditMode ? "cursor-pointer hover:border-forest/30 transition-colors" : ""}`}
                      onClick={() => isEditMode && (() => {
                        setEditSection("prompt");
                        setEditPromptId(prompt.id);
                        setEditPromptType(prompt.promptType);
                        setEditPromptAnswer(prompt.answer);
                      })()}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="theme-caption text-forest mb-1">{promptDef?.text || prompt.promptType}</p>
                          <p className="theme-body-sm text-foreground">{prompt.answer}</p>
                        </div>
                        {isEditMode && (
                          <span className="text-muted shrink-0 ml-2">
                            <PencilSimple size={14} weight="bold" />
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
                {isEditMode && profile.prompts.length < 3 && (
                  <button
                    onClick={() => { setEditSection("prompt"); setEditPromptId(null); setEditPromptType(""); setEditPromptAnswer(""); }}
                    className="w-full rounded-2xl border-2 border-dashed border-border py-4 text-center theme-body-sm text-muted hover:border-forest/30 hover:text-forest transition-colors"
                  >
                    + Add a prompt
                  </button>
                )}
                {!isEditMode && profile.prompts.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-border/60 p-4 text-center">
                    <p className="theme-caption text-muted/50 italic">The best part about being childfree is...</p>
                  </div>
                )}
              </div>

              {/* About Me details */}
              {(isEditMode || profile.birthdate || profile.mbtiType || profile.diet || profile.drinking || profile.smoking || profile.cannabis || profile.sleepStyle || profile.education) && (
              <div className="mb-6">
                <h2 className="theme-heading text-sm text-foreground mb-3">About Me</h2>
                {isEditMode ? (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center justify-between px-3 py-2.5 rounded-xl border border-border bg-foreground/[0.02] opacity-70">
                      <span className="theme-caption text-muted inline-flex items-center gap-1.5"><Sparkle size={14} weight="bold" /> Zodiac</span>
                      <span className="theme-body-sm text-muted">{getZodiac(profile.birthdate)}</span>
                    </div>
                    {[
                      { label: "MBTI", icon: Brain, value: profile.mbtiType, options: MBTI_OPTIONS, field: "mbtiType" },
                      { label: "Diet", icon: ForkKnife, value: profile.diet, options: DIET_OPTIONS, field: "diet" },
                      { label: "Drinking", icon: Wine, value: profile.drinking, options: DRINKING_OPTIONS, field: "drinking" },
                      { label: "Smoking", icon: Cigarette, value: profile.smoking, options: SMOKING_OPTIONS, field: "smoking" },
                      { label: "Cannabis", icon: Leaf, value: profile.cannabis, options: CANNABIS_OPTIONS, field: "cannabis" },
                      { label: "Sleep", icon: Moon, value: profile.sleepStyle, options: SLEEP_STYLE_OPTIONS, field: "sleepStyle" },
                      { label: "Education", icon: GraduationCap, value: profile.education, options: EDUCATION_OPTIONS, field: "education" },
                    ].map((item) => (
                      <button
                        key={item.field}
                        onClick={() => setEditSection(`about-${item.field}`)}
                        className="flex items-center justify-between px-3 py-2.5 rounded-xl border border-border hover:border-forest/30 transition-colors text-left"
                      >
                        <span className="theme-caption text-muted inline-flex items-center gap-1.5"><item.icon size={14} weight="bold" /> {item.label}</span>
                        <span className="theme-body-sm text-foreground">
                          {getLabel(item.options, item.value) || <span className="text-muted">+</span>}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-x-4 gap-y-1.5">
                    {[
                      { icon: Sparkle, value: getZodiac(profile.birthdate) },
                      { icon: Brain, value: profile.mbtiType },
                      { icon: ForkKnife, value: getLabel(DIET_OPTIONS, profile.diet) },
                      { icon: Wine, value: profile.drinking ? getLabel(DRINKING_OPTIONS, profile.drinking) : null },
                      { icon: Cigarette, value: profile.smoking ? getLabel(SMOKING_OPTIONS, profile.smoking) : null },
                      { icon: Leaf, value: profile.cannabis ? getLabel(CANNABIS_OPTIONS, profile.cannabis) : null },
                      { icon: Moon, value: getLabel(SLEEP_STYLE_OPTIONS, profile.sleepStyle) },
                      { icon: GraduationCap, value: getLabel(EDUCATION_OPTIONS, profile.education) },
                    ].filter((item) => item.value).map((item, idx) => (
                      <span key={idx} className="theme-body-sm text-foreground flex items-center gap-1.5">
                        <item.icon size={14} weight="bold" className="text-muted" />
                        {item.value}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              )}

              {/* Interests */}
              {(isEditMode || profile.interests.length > 0) && (
              <div className="mb-6">
                {sectionHeader("Interests", "interests")}
                {profile.interests.length > 0 ? (
                  <div className={`flex flex-wrap gap-2 ${isEditMode ? "cursor-pointer" : ""}`} onClick={() => isEditMode && openEdit("interests")}>
                    {profile.interests.map((v) => (
                      <span key={v} className={chipClass}>
                        {INTERESTS.find((i) => i.value === v)?.label || v}
                      </span>
                    ))}
                  </div>
                ) : (
                  <button onClick={() => openEdit("interests")} className="theme-body-sm text-muted hover:text-forest transition-colors">+ Add interests</button>
                )}
              </div>
              )}

              {/* Music */}
              {(isEditMode || profile.musicGenres.length > 0) && (
              <div className="mb-6">
                {sectionHeader("Music", "music")}
                {profile.musicGenres.length > 0 ? (
                  <div className={`flex flex-wrap gap-2 ${isEditMode ? "cursor-pointer" : ""}`} onClick={() => isEditMode && openEdit("music")}>
                    {profile.musicGenres.map((v) => (
                      <span key={v} className={chipClass}>
                        {MUSIC_GENRES.find((m) => m.value === v)?.label || v}
                      </span>
                    ))}
                  </div>
                ) : (
                  <button onClick={() => openEdit("music")} className="theme-body-sm text-muted hover:text-forest transition-colors">+ Add music taste</button>
                )}
              </div>
              )}

              {/* Anthem */}
              {(isEditMode || profile.anthem) && (
              <div className="mb-6">
                {isEditMode ? (
                  <div
                    className="cursor-pointer"
                    onClick={() => { setEditAnthem(profile.anthem || ""); setEditSection("anthem"); }}
                  >
                    <h2 className="theme-heading text-sm text-foreground mb-3 inline-flex items-center gap-1.5 hover:text-forest transition-colors">
                      Anthem
                      <PencilSimple size={12} weight="bold" className="text-muted" />
                    </h2>
                  </div>
                ) : (
                  <h2 className="theme-heading text-sm text-foreground mb-3">Anthem</h2>
                )}
                {(() => {
                  const embed = getAnthemEmbed(profile.anthem);
                  if (embed) {
                    return (
                      <div className="rounded-xl overflow-hidden">
                        <iframe
                          src={embed.embedUrl}
                          width="100%"
                          height={embed.type === "spotify" ? 80 : 152}
                          frameBorder="0"
                          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                          loading="lazy"
                          className="rounded-xl"
                        />
                      </div>
                    );
                  }
                  if (isEditMode) {
                    return (
                      <button
                        onClick={() => { setEditAnthem(""); setEditSection("anthem"); }}
                        className="theme-body-sm text-muted hover:text-forest transition-colors"
                      >
                        + Add your anthem
                      </button>
                    );
                  }
                  return null;
                })()}
              </div>
              )}

              {/* Values */}
              {(isEditMode || profile.values.length > 0) && (
              <div className="mb-6">
                {sectionHeader("Values", "values")}
                {profile.values.length > 0 ? (
                  <div className={`flex flex-wrap gap-2 ${isEditMode ? "cursor-pointer" : ""}`} onClick={() => isEditMode && openEdit("values")}>
                    {profile.values.map((v) => (
                      <span key={v} className={chipClass}>
                        {VALUES.find((val) => val.value === v)?.label || v}
                      </span>
                    ))}
                  </div>
                ) : (
                  <button onClick={() => openEdit("values")} className="theme-body-sm text-muted hover:text-forest transition-colors">+ Add values</button>
                )}
              </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Hidden input for replacing photos */}
      <input type="file" accept="image/*" ref={replacePhotoInputRef} onChange={handleReplacePhoto} className="hidden" />

      {/* ===== Edit Modals ===== */}

      {/* Basics */}
      <EditModal title="Edit Basics" open={editSection === "basics"} onClose={() => setEditSection(null)}>
        <div className="space-y-3">
          <div>
            <label className="theme-caption text-foreground mb-1 block">Display name</label>
            <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full px-3 h-10 rounded-lg border border-border bg-background theme-body-sm focus:outline-none focus:border-forest transition-colors" />
          </div>
          <div>
            <label className="theme-caption text-foreground mb-1 block">City</label>
            <input type="text" value={editCity} onChange={(e) => setEditCity(e.target.value)} className="w-full px-3 h-10 rounded-lg border border-border bg-background theme-body-sm focus:outline-none focus:border-forest transition-colors" />
          </div>
          <div>
            <label className="theme-caption text-foreground mb-1 block">Job title</label>
            <input type="text" value={editJobTitle} onChange={(e) => setEditJobTitle(e.target.value)} placeholder="e.g. Product Designer" className="w-full px-3 h-10 rounded-lg border border-border bg-background theme-body-sm focus:outline-none focus:border-forest transition-colors" />
          </div>
          <div>
            <label className="theme-caption text-foreground mb-1 block">Pronouns</label>
            <select value={editPronouns} onChange={(e) => setEditPronouns(e.target.value)} className="w-full px-3 h-10 rounded-lg border border-border bg-background theme-body-sm focus:outline-none focus:border-forest transition-colors">
              <option value="">Select...</option>
              {PRONOUNS_OPTIONS.map((p) => (<option key={p.value} value={p.value}>{p.label}</option>))}
            </select>
          </div>
          <button onClick={async () => { await saveField({ displayName: editName.trim(), locationCity: editCity.trim() || null, jobTitle: editJobTitle.trim() || null, pronouns: editPronouns || null }); setEditSection(null); }} disabled={saving || !editName.trim()} className="w-full h-10 rounded-lg bg-forest text-white theme-body-sm font-[600] hover:bg-forest-light transition-colors disabled:opacity-50">
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </EditModal>


      {/* Tags modal */}
      <EditModal title="Edit Tags" open={editSection === "tags"} onClose={() => setEditSection(null)}>
        {(() => {
          const totalSelected = editTags.looking.length + editTags.identity.length + (editTags.pet.length > 0 ? 1 : 0);
          const atMax = totalSelected >= 4;
          return (
            <div>
              <p className="theme-caption text-muted mb-4">{totalSelected}/4 selected</p>

              {/* Relationship status */}
              <h3 className="theme-caption text-foreground font-[600] mb-2 flex items-center gap-1.5">
                <Heart size={14} weight="bold" /> Relationship status
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {RELATIONSHIP_OPTIONS.map((opt) => {
                  const selected = editTags.relationship === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setEditTags({ ...editTags, relationship: selected ? "" : opt.value })}
                      className={`px-3 py-1.5 rounded-full theme-body-sm transition-colors ${selected ? "bg-forest text-white" : "bg-foreground/5 text-foreground hover:bg-foreground/10"}`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>

              {/* Looking for */}
              <h3 className="theme-caption text-foreground font-[600] mb-2 flex items-center gap-1.5">
                <MagnifyingGlass size={14} weight="bold" /> Looking for
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {LOOKING_FOR_OPTIONS.map((opt) => {
                  const selected = editTags.looking.includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      onClick={() => {
                        if (selected) setEditTags({ ...editTags, looking: editTags.looking.filter((v) => v !== opt.value) });
                        else if (!atMax) setEditTags({ ...editTags, looking: [...editTags.looking, opt.value] });
                      }}
                      disabled={!selected && atMax}
                      className={`px-3 py-1.5 rounded-full theme-body-sm transition-colors ${selected ? "bg-forest text-white" : "bg-foreground/5 text-foreground hover:bg-foreground/10"} disabled:opacity-40`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>

              {/* Identity */}
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="theme-caption text-foreground font-[600] flex items-center gap-1.5">
                    <Star size={14} weight="bold" /> Identity
                  </h3>
                  <button
                    onClick={() => setShowIdentityInfo((v) => !v)}
                    className="text-muted hover:text-foreground transition-colors flex items-center gap-1 theme-caption"
                  >
                    <Info size={14} weight="fill" />
                    <span>Info</span>
                  </button>
                </div>
                {showIdentityInfo && (
                  <div className="absolute z-10 top-7 right-0 bg-background border border-border rounded-xl shadow-lg p-3">
                    <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1">
                      {IDENTITY_TAG_OPTIONS.map((opt) => (
                        <div key={opt.value} className="contents">
                          <span className="theme-caption font-[600] text-foreground">{opt.label}</span>
                          <span className="theme-caption text-muted whitespace-nowrap normal-case">{opt.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {IDENTITY_TAG_OPTIONS.map((opt) => {
                  const selected = editTags.identity.includes(opt.value);
                  // DINK/SINK are mutually exclusive; PANK/PUNK are mutually exclusive
                  const incomeGroup = ["DINK", "SINK"];
                  const roleGroup = ["PANK", "PUNK"];
                  const getConflict = (v: string) => incomeGroup.includes(v) ? incomeGroup : roleGroup.includes(v) ? roleGroup : [];
                  return (
                    <button
                      key={opt.value}
                      onClick={() => {
                        if (selected) {
                          setEditTags({ ...editTags, identity: editTags.identity.filter((v) => v !== opt.value) });
                        } else {
                          // Remove conflicting value from same group, then add
                          const conflict = getConflict(opt.value);
                          const filtered = editTags.identity.filter((v) => !conflict.includes(v));
                          const newCount = filtered.length + 1 + editTags.looking.length + (editTags.pet.length > 0 ? 1 : 0);
                          if (newCount <= 4) setEditTags({ ...editTags, identity: [...filtered, opt.value] });
                        }
                      }}
                      disabled={!selected && atMax}
                      className={`px-3 py-1.5 rounded-full theme-body-sm transition-colors ${selected ? "bg-forest text-white" : "bg-foreground/5 text-foreground hover:bg-foreground/10"} disabled:opacity-40`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>

              {/* Pet parent (multi-select animals, counts as 1 tag) */}
              <h3 className="theme-caption text-foreground font-[600] mb-2 flex items-center gap-1.5">
                <PawPrint size={14} weight="bold" /> Pet parent
              </h3>
              <div className="flex flex-wrap gap-2 mb-5">
                {PET_PARENT_OPTIONS.map((opt) => {
                  const selected = editTags.pet.includes(opt.value);
                  // Disable if at max AND no pets selected yet (adding first pet would use a slot)
                  const disabled = !selected && atMax && editTags.pet.length === 0;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => {
                        if (selected) setEditTags({ ...editTags, pet: editTags.pet.filter((v) => v !== opt.value) });
                        else setEditTags({ ...editTags, pet: [...editTags.pet, opt.value] });
                      }}
                      disabled={disabled}
                      className={`px-3 py-1.5 rounded-full theme-body-sm transition-colors ${selected ? "bg-forest text-white" : "bg-foreground/5 text-foreground hover:bg-foreground/10"} disabled:opacity-40`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={async () => {
                  const tagData: Record<string, unknown> = {
                    seeking: editTags.looking,
                    identityTags: editTags.identity,
                    petTypes: editTags.pet,
                  };
                  if (editTags.relationship) tagData.relationshipStatus = editTags.relationship;
                  await saveField(tagData);
                  setEditSection(null);
                }}
                disabled={saving}
                className="w-full h-10 rounded-lg bg-forest text-white theme-body-sm font-[600] hover:bg-forest-light transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          );
        })()}
      </EditModal>

      {/* Interests */}
      <EditModal title="Interests" open={editSection === "interests"} onClose={() => setEditSection(null)}>
        <p className="theme-caption text-muted mb-3">Select up to 5</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {INTERESTS.map((i) => (
            <button key={i.value} onClick={() => chipToggle(i.value, editInterests, setEditInterests)}
              className={`px-3 py-1.5 rounded-full theme-body-sm transition-colors ${editInterests.includes(i.value) ? "bg-forest text-white" : "bg-foreground/5 text-foreground hover:bg-foreground/10"}`}>
              {i.label}
            </button>
          ))}
        </div>
        <button onClick={async () => { await saveField({ interests: editInterests }); setEditSection(null); }} disabled={saving} className="w-full h-10 rounded-lg bg-forest text-white theme-body-sm font-[600] hover:bg-forest-light transition-colors disabled:opacity-50">
          {saving ? "Saving..." : "Save"}
        </button>
      </EditModal>

      {/* Music */}
      <EditModal title="Music Taste" open={editSection === "music"} onClose={() => setEditSection(null)}>
        <p className="theme-caption text-muted mb-3">Select up to 5</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {MUSIC_GENRES.map((m) => (
            <button key={m.value} onClick={() => chipToggle(m.value, editMusic, setEditMusic)}
              className={`px-3 py-1.5 rounded-full theme-body-sm transition-colors ${editMusic.includes(m.value) ? "bg-forest text-white" : "bg-foreground/5 text-foreground hover:bg-foreground/10"}`}>
              {m.label}
            </button>
          ))}
        </div>
        <button onClick={async () => { await saveField({ musicGenres: editMusic }); setEditSection(null); }} disabled={saving} className="w-full h-10 rounded-lg bg-forest text-white theme-body-sm font-[600] hover:bg-forest-light transition-colors disabled:opacity-50">
          {saving ? "Saving..." : "Save"}
        </button>
      </EditModal>

      {/* Anthem */}
      <EditModal title="Anthem" open={editSection === "anthem"} onClose={() => setEditSection(null)}>
        <div className="space-y-3">
          <div>
            <label className="theme-caption text-foreground mb-1 block">Spotify song link</label>
            <input
              type="text"
              value={editAnthem}
              onChange={(e) => setEditAnthem(e.target.value)}
              placeholder="Paste a Spotify or YouTube link..."
              className="w-full px-3 h-10 rounded-lg border border-border bg-background theme-body-sm focus:outline-none focus:border-forest transition-colors"
            />
            <p className="theme-caption text-muted mt-1.5">Share a song from Spotify or a YouTube music video.</p>
          </div>
          <button
            onClick={async () => {
              const url = editAnthem.trim();
              const embed = getAnthemEmbed(url);
              await saveField({ anthem: embed ? url : null });
              setEditSection(null);
            }}
            disabled={saving}
            className="w-full h-10 rounded-lg bg-forest text-white theme-body-sm font-[600] hover:bg-forest-light transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          {profile.anthem && (
            <button
              onClick={async () => { await saveField({ anthem: null }); setEditSection(null); }}
              className="w-full h-10 rounded-lg border border-red-200 theme-body-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              Remove anthem
            </button>
          )}
        </div>
      </EditModal>

      {/* Values */}
      <EditModal title="Values" open={editSection === "values"} onClose={() => setEditSection(null)}>
        <p className="theme-caption text-muted mb-3">Select up to 5</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {VALUES.map((v) => (
            <button key={v.value} onClick={() => chipToggle(v.value, editValues, setEditValues)}
              className={`px-3 py-1.5 rounded-full theme-body-sm transition-colors ${editValues.includes(v.value) ? "bg-forest text-white" : "bg-foreground/5 text-foreground hover:bg-foreground/10"}`}>
              {v.label}
            </button>
          ))}
        </div>
        <button onClick={async () => { await saveField({ values: editValues }); setEditSection(null); }} disabled={saving} className="w-full h-10 rounded-lg bg-forest text-white theme-body-sm font-[600] hover:bg-forest-light transition-colors disabled:opacity-50">
          {saving ? "Saving..." : "Save"}
        </button>
      </EditModal>

      {/* Prompt edit */}
      <EditModal title={editPromptId ? "Edit Prompt" : "Add Prompt"} open={editSection === "prompt"} onClose={() => setEditSection(null)}>
        <div className="space-y-3">
          <div>
            <label className="theme-caption text-foreground mb-1 block">Choose a prompt</label>
            <select value={editPromptType} onChange={(e) => setEditPromptType(e.target.value)} className="w-full px-4 pr-10 h-10 rounded-lg border border-border bg-background theme-body-sm focus:outline-none focus:border-forest transition-colors">
              <option value="">Select...</option>
              {PROMPTS.map((p) => (<option key={p.value} value={p.value}>{p.text}</option>))}
            </select>
          </div>
          <div>
            <label className="theme-caption text-foreground mb-1 block">Your answer</label>
            <textarea value={editPromptAnswer} onChange={(e) => setEditPromptAnswer(e.target.value)} placeholder="Your answer..." className="w-full px-3 py-2 rounded-lg border border-border bg-background theme-body-sm focus:outline-none focus:border-forest transition-colors resize-none" rows={3} maxLength={300} />
            <span className="theme-caption text-muted">{editPromptAnswer.length}/300</span>
          </div>
          <button
            onClick={async () => {
              if (!editPromptType || !editPromptAnswer.trim()) return;
              const method = editPromptId ? "PATCH" : "POST";
              const url = editPromptId ? `/api/profile/prompts/${editPromptId}` : "/api/profile/prompts";
              await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ promptType: editPromptType, answer: editPromptAnswer.trim(), position: profile.prompts.length }) });
              const res = await fetch("/api/profile");
              const data = await res.json();
              if (res.ok) setProfile((prev) => prev ? { ...prev, prompts: data.profile.prompts } : prev);
              setEditSection(null);
            }}
            disabled={saving || !editPromptType || !editPromptAnswer.trim()}
            className="w-full h-10 rounded-lg bg-forest text-white theme-body-sm font-[600] hover:bg-forest-light transition-colors disabled:opacity-50"
          >
            {editPromptId ? "Update" : "Add"} Prompt
          </button>
        </div>
      </EditModal>

      {/* Caption selection modal */}
      <EditModal title="Add Caption" open={!!captionPhotoId} onClose={() => { setCaptionPhotoId(null); setCustomCaption(""); }}>
        {(() => {
          const currentCaption = profile.photos.find((p) => p.id === captionPhotoId)?.caption;
          const isCustom = currentCaption && !PHOTO_CAPTIONS.find((c) => c.value === currentCaption);
          return (
            <div className="space-y-2">
              {PHOTO_CAPTIONS.map((caption) => {
                const selected = currentCaption === caption.value;
                return (
                  <button
                    key={caption.value}
                    onClick={() => handleSaveCaption(captionPhotoId!, caption.value)}
                    className={`w-full px-4 py-3 rounded-xl border text-left theme-body-sm transition-colors ${
                      selected
                        ? "border-forest bg-forest/10 text-forest"
                        : "border-border text-foreground hover:bg-foreground/5"
                    }`}
                  >
                    {caption.label}
                  </button>
                );
              })}
              {/* Custom caption */}
              <div className="pt-2 border-t border-border mt-3">
                <p className="theme-caption text-muted mb-2">Or write your own</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customCaption || (isCustom ? currentCaption : "")}
                    onChange={(e) => setCustomCaption(e.target.value)}
                    placeholder="Your caption..."
                    maxLength={30}
                    className="flex-1 px-3 h-10 rounded-lg border border-border bg-background theme-body-sm focus:outline-none focus:border-forest transition-colors"
                  />
                  <button
                    onClick={() => {
                      if (customCaption.trim()) {
                        handleSaveCaption(captionPhotoId!, customCaption.trim());
                        setCustomCaption("");
                      }
                    }}
                    disabled={!customCaption.trim()}
                    className="px-4 h-10 rounded-lg bg-forest text-white theme-body-sm font-[600] hover:bg-forest-light transition-colors disabled:opacity-50"
                  >
                    Save
                  </button>
                </div>
              </div>
              {currentCaption && (
                <button
                  onClick={() => handleSaveCaption(captionPhotoId!, null)}
                  className="w-full px-4 py-3 rounded-xl border border-red-200 text-left theme-body-sm text-red-500 hover:bg-red-50 transition-colors mt-2"
                >
                  Remove caption
                </button>
              )}
            </div>
          );
        })()}
      </EditModal>

      {/* About Me single-select modals */}
      {[
        { field: "mbtiType", title: "MBTI", options: MBTI_OPTIONS },
        { field: "diet", title: "Diet", options: DIET_OPTIONS },
        { field: "drinking", title: "Drinking", options: DRINKING_OPTIONS },
        { field: "smoking", title: "Smoking", options: SMOKING_OPTIONS },
        { field: "cannabis", title: "Cannabis", options: CANNABIS_OPTIONS },
        { field: "sleepStyle", title: "Sleep Style", options: SLEEP_STYLE_OPTIONS },
        { field: "education", title: "Education", options: EDUCATION_OPTIONS },
      ].map(({ field, title, options }) => (
        <EditModal key={field} title={title} open={editSection === `about-${field}`} onClose={() => setEditSection(null)}>
          <div className="flex flex-wrap gap-2">
            {options.map((opt) => (
              <button key={opt.value} onClick={async () => { const newVal = profile[field as keyof ProfileData] === opt.value ? null : opt.value; await saveField({ [field]: newVal }); setEditSection(null); }}
                className={`px-4 py-2.5 rounded-xl border theme-body-sm transition-colors ${profile[field as keyof ProfileData] === opt.value ? "border-forest bg-forest/10 text-forest" : "border-border text-foreground hover:bg-foreground/5"}`}>
                {opt.label}
              </button>
            ))}
            {profile[field as keyof ProfileData] && (
              <button onClick={async () => { await saveField({ [field]: null }); setEditSection(null); }}
                className="px-4 py-2.5 rounded-xl border border-red-200 theme-body-sm text-red-500 hover:bg-red-50 transition-colors">
                Clear
              </button>
            )}
          </div>
        </EditModal>
      ))}

      {/* Toast */}
      {toast && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-[60] px-4 py-2.5 rounded-full shadow-lg theme-body-sm font-[500] transition-all animate-in fade-in slide-in-from-top-2 duration-300 ${toast.type === "success" ? "bg-forest text-white" : "bg-red-500 text-white"}`}>
          {toast.message}
        </div>
      )}

      {/* Mobile sticky bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border px-4 py-3 bg-background/95 backdrop-blur-md">
        {isEditMode ? (
          <div className="flex items-center gap-2">
            <Button onClick={() => setIsEditMode(false)} variant="secondary" size="default" className="flex-1">
              Cancel
            </Button>
            <Button onClick={() => setIsEditMode(false)} variant="default" size="default" className="flex-1">
              Save Changes
            </Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditMode(true)} variant="default" size="default" className="w-full">
            <PencilSimple size={14} weight="bold" />
            Edit Profile
          </Button>
        )}
      </div>
    </div>
  );
}
