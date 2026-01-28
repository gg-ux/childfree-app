"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import {
  UserCircle,
  GearSix,
  SignOut,
  Envelope,
  Lock,
  ShieldCheck,
  Bell,
  Trash,
  Globe,
  UsersThree,
  Eye,
  EyeSlash,
  CaretRight,
  Warning,
  Heart,
  MapPin,
  Users,
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

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const avatarMenuRef = useRef<HTMLDivElement>(null);

  // Settings states
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteText, setDeleteText] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Preference states
  const [ageMin, setAgeMin] = useState(18);
  const [ageMax, setAgeMax] = useState(99);
  const [distanceMax, setDistanceMax] = useState(50);
  const [genderPreferences, setGenderPreferences] = useState<string[]>([]);
  const [prefsSaving, setPrefsSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/auth/check");
        const data = await res.json();
        if (!data.authenticated) { router.push("/auth/signup"); return; }
        setUser(data.user);
        // Fetch profile preferences
        try {
          const profileRes = await fetch("/api/profile");
          const profileData = await profileRes.json();
          if (profileData.profile) {
            setAgeMin(profileData.profile.ageMin ?? 18);
            setAgeMax(profileData.profile.ageMax ?? 99);
            setDistanceMax(profileData.profile.distanceMax ?? 50);
            setGenderPreferences(profileData.profile.genderPreferences ?? []);
          }
        } catch {};
      } catch { router.push("/auth/signup"); }
      finally { setLoading(false); }
    }
    load();
  }, [router]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(e.target as Node)) setShowAvatarMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  const savePref = async (fields: Record<string, unknown>) => {
    setPrefsSaving(true);
    try {
      await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
    } catch {} finally { setPrefsSaving(false); }
  };

  const GENDER_OPTIONS = [
    { value: "Woman", label: "Women" },
    { value: "Man", label: "Men" },
    { value: "Non-binary", label: "Non-binary" },
    { value: "Other", label: "Other" },
  ];

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-8">
      <h2 className="theme-heading text-sm text-foreground mb-3">{title}</h2>
      <div className="rounded-2xl border border-border divide-y divide-border overflow-hidden">
        {children}
      </div>
    </div>
  );

  const Row = ({ icon: Icon, label, value, onClick, destructive }: {
    icon: typeof Envelope;
    label: string;
    value?: string | React.ReactNode;
    onClick?: () => void;
    destructive?: boolean;
  }) => (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors ${
        onClick ? "hover:bg-foreground/[0.02]" : ""
      } ${destructive ? "text-coral" : "text-foreground"}`}
    >
      <Icon size={20} weight="duotone" className={destructive ? "text-coral" : "text-muted"} />
      <div className="flex-1 min-w-0">
        <p className={`theme-body-sm ${destructive ? "text-coral" : "text-foreground"}`}>{label}</p>
      </div>
      {value && (
        <span className="theme-body-sm text-muted shrink-0">{value}</span>
      )}
      {onClick && !value && (
        <CaretRight size={16} className="text-muted shrink-0" />
      )}
    </button>
  );

  const Toggle = ({ icon: Icon, label, description, checked, onChange }: {
    icon: typeof Bell;
    label: string;
    description?: string;
    checked: boolean;
    onChange: (v: boolean) => void;
  }) => (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <Icon size={20} weight="duotone" className="text-muted shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="theme-body-sm text-foreground">{label}</p>
        {description && <p className="theme-body-sm text-muted text-xs mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors ${checked ? "bg-forest" : "bg-foreground/15"}`}
      >
        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${checked ? "left-[22px]" : "left-0.5"}`} />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 frosted border-b border-border">
        <div className="container-main h-16 flex items-center justify-between">
          <Link href="/home"><Logo variant="full" size="sm" /></Link>
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

      {/* Content */}
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-lg mx-auto">
          <h1 className="font-display text-2xl text-foreground leading-tight mb-1">Settings</h1>
          <p className="theme-body-sm text-muted mb-8">Manage your account and preferences</p>

          {/* Account */}
          <Section title="Account">
            <Row icon={Envelope} label="Email" value={user.email} />
            <Row icon={Lock} label="Password" value="••••••••" onClick={() => {}} />
            <Row icon={ShieldCheck} label="Two-factor authentication" value={
              <span className="theme-caption text-muted px-2 py-0.5 rounded-full bg-foreground/5">Off</span>
            } onClick={() => {}} />
          </Section>

          {/* Privacy */}
          <Section title="Privacy">
            <Toggle
              icon={Eye}
              label="Profile visibility"
              description="Make your profile visible to other members"
              checked={true}
              onChange={() => {}}
            />
            <Toggle
              icon={EyeSlash}
              label="Show activity status"
              description="Let others see when you were last active"
              checked={true}
              onChange={() => {}}
            />
          </Section>

          {/* Notifications */}
          <Section title="Notifications">
            <Toggle
              icon={Bell}
              label="Email notifications"
              description="Receive updates about matches, messages, and events"
              checked={emailNotifs}
              onChange={setEmailNotifs}
            />
          </Section>

          {/* Match Preferences */}
          <Section title="Match Preferences">
            <div className="px-4 py-3.5">
              <div className="flex items-center gap-3 mb-3">
                <Heart size={20} weight="duotone" className="text-muted shrink-0" />
                <p className="theme-body-sm text-foreground">Age range</p>
                <span className="theme-body-sm text-muted ml-auto">{ageMin} – {ageMax}</span>
              </div>
              <div className="flex items-center gap-3 ml-8">
                <input type="range" min={18} max={99} value={ageMin} onChange={(e) => { const v = Number(e.target.value); if (v <= ageMax) setAgeMin(v); }} onPointerUp={(e) => savePref({ ageMin: Number((e.target as HTMLInputElement).value) })} className="flex-1 accent-forest" />
                <input type="range" min={18} max={99} value={ageMax} onChange={(e) => { const v = Number(e.target.value); if (v >= ageMin) setAgeMax(v); }} onPointerUp={(e) => savePref({ ageMax: Number((e.target as HTMLInputElement).value) })} className="flex-1 accent-forest" />
              </div>
            </div>
            <div className="px-4 py-3.5">
              <div className="flex items-center gap-3 mb-3">
                <MapPin size={20} weight="duotone" className="text-muted shrink-0" />
                <p className="theme-body-sm text-foreground">Maximum distance</p>
                <span className="theme-body-sm text-muted ml-auto">{distanceMax} mi</span>
              </div>
              <div className="ml-8">
                <input type="range" min={5} max={200} step={5} value={distanceMax} onChange={(e) => setDistanceMax(Number(e.target.value))} onPointerUp={(e) => savePref({ distanceMax: Number((e.target as HTMLInputElement).value) })} className="w-full accent-forest" />
              </div>
            </div>
            <div className="px-4 py-3.5">
              <div className="flex items-center gap-3 mb-3">
                <Users size={20} weight="duotone" className="text-muted shrink-0" />
                <p className="theme-body-sm text-foreground">Show me</p>
              </div>
              <div className="flex flex-wrap gap-2 ml-8">
                {GENDER_OPTIONS.map((g) => (
                  <button
                    key={g.value}
                    onClick={() => {
                      const next = genderPreferences.includes(g.value)
                        ? genderPreferences.filter((v) => v !== g.value)
                        : [...genderPreferences, g.value];
                      setGenderPreferences(next);
                      savePref({ genderPreferences: next });
                    }}
                    className={`px-3 py-1.5 rounded-full theme-body-sm transition-colors ${genderPreferences.includes(g.value) ? "bg-forest text-white" : "bg-foreground/5 text-foreground hover:bg-foreground/10"}`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>
          </Section>

          {/* Language & Region */}
          <Section title="Language & Region">
            <Row icon={Globe} label="Language" value="English" onClick={() => {}} />
            <Row icon={Globe} label="Region" value="United States" onClick={() => {}} />
          </Section>

          {/* Groups */}
          <Section title="Groups">
            <div className="px-4 py-4">
              <div className="flex items-center gap-3 mb-2">
                <UsersThree size={20} weight="duotone" className="text-muted" />
                <p className="theme-body-sm text-foreground">Interest Groups</p>
                <span className="theme-caption text-white px-2 py-0.5 rounded-full bg-forest/80 ml-auto">Coming Soon</span>
              </div>
              <p className="theme-body-sm text-muted text-xs ml-8">Manage group memberships and notification preferences here once groups launch.</p>
            </div>
          </Section>

          {/* Danger zone */}
          <Section title="Account Actions">
            <Row icon={SignOut} label="Log out" onClick={handleLogout} />
            <Row
              icon={Trash}
              label="Delete account"
              destructive
              onClick={() => setShowDeleteConfirm(true)}
            />
          </Section>

          <p className="theme-caption text-muted text-center mt-4">
            Chosn v1.0 &middot; <Link href="/privacy" className="hover:underline">Privacy</Link> &middot; <Link href="/terms" className="hover:underline">Terms</Link>
          </p>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative w-full sm:max-w-md bg-background rounded-t-2xl sm:rounded-2xl shadow-xl border border-border overflow-hidden">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-coral/10 flex items-center justify-center mb-4">
                <Warning size={24} weight="duotone" className="text-coral" />
              </div>
              <h2 className="theme-heading text-lg text-foreground mb-2">Delete your account?</h2>
              <p className="theme-body-sm text-muted mb-4">
                This action is permanent and cannot be undone. All your data, photos, matches, and messages will be permanently deleted.
              </p>
              <div className="mb-4">
                <label className="theme-caption text-foreground mb-1 block">
                  Type <span className="font-bold">DELETE</span> to confirm
                </label>
                <input
                  type="text"
                  value={deleteText}
                  onChange={(e) => setDeleteText(e.target.value)}
                  placeholder="DELETE"
                  className="w-full px-3 h-10 rounded-lg border border-border bg-background theme-body-sm focus:outline-none focus:border-coral transition-colors"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setShowDeleteConfirm(false); setDeleteText(""); }}
                  className="flex-1 h-10 rounded-lg border border-border theme-body-sm font-[600] text-foreground hover:bg-foreground/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (deleteText !== "DELETE") return;
                    setDeleting(true);
                    try {
                      await fetch("/api/account", { method: "DELETE" });
                      router.push("/");
                    } catch { setDeleting(false); }
                  }}
                  disabled={deleteText !== "DELETE" || deleting}
                  className="flex-1 h-10 rounded-lg bg-coral text-white theme-body-sm font-[600] hover:bg-coral/90 transition-colors disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Delete Account"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
