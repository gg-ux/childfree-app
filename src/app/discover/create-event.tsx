"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "@phosphor-icons/react";
import { Loader } from "@/components/ui/loader";
import Link from "next/link";

interface CreateEventModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  userCity?: string | null;
  isAuthenticated?: boolean;
}

export function CreateEventModal({ open, onClose, onCreated, userCity, isAuthenticated = true }: CreateEventModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState<"IN_PERSON" | "VIRTUAL">("IN_PERSON");
  const [locationCity, setLocationCity] = useState(userCity || "");
  const [locationAddress, setLocationAddress] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [maxAttendees, setMaxAttendees] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;

    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/events/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          eventType,
          locationCity: locationCity.trim() || null,
          locationAddress: locationAddress.trim() || null,
          startsAt,
          endsAt: endsAt || null,
          maxAttendees: maxAttendees || null,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setTitle("");
        setDescription("");
        setLocationAddress("");
        setStartsAt("");
        setEndsAt("");
        setMaxAttendees("");
        onCreated();
        onClose();
      } else {
        setError(data.error || "Failed to create event");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-3 h-10 rounded-lg border border-border bg-background theme-body-sm placeholder:text-muted/50 focus:outline-none focus:border-forest transition-colors";
  const labelClass = "theme-caption text-foreground mb-1 block";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-background rounded-2xl shadow-xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
          <h2 className="theme-heading text-base text-foreground">Create Event</h2>
          <button onClick={onClose} className="text-muted hover:text-foreground transition-colors">
            <X size={18} weight="bold" />
          </button>
        </div>

        {!isAuthenticated ? (
          <div className="p-6 text-center">
            <p className="theme-body text-foreground mb-2">Sign up to create events</p>
            <p className="theme-body-sm text-muted mb-5">
              Join Chosn to create and share childfree events with the community.
            </p>
            <Link href="/auth/signup">
              <Button variant="accent" size="lg" className="w-full">
                Sign Up
              </Button>
            </Link>
            <p className="theme-caption text-muted mt-3">
              Already have an account?{" "}
              <Link href="/auth/signup" className="text-forest hover:underline">Log in</Link>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3">
            <div>
              <label className={labelClass}>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Childfree Brunch Meetup"
                className={inputClass}
                maxLength={200}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell people what this event is about..."
                className="w-full px-3 py-2 rounded-lg border border-border bg-background theme-body-sm placeholder:text-muted/50 focus:outline-none focus:border-forest transition-colors resize-none"
                rows={2}
                maxLength={2000}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Type</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEventType("IN_PERSON")}
                  className={`flex-1 h-9 rounded-lg text-xs font-[600] transition-colors ${
                    eventType === "IN_PERSON"
                      ? "bg-forest text-white"
                      : "bg-foreground/5 text-muted hover:bg-foreground/10"
                  }`}
                >
                  In Person
                </button>
                <button
                  type="button"
                  onClick={() => setEventType("VIRTUAL")}
                  className={`flex-1 h-9 rounded-lg text-xs font-[600] transition-colors ${
                    eventType === "VIRTUAL"
                      ? "bg-forest text-white"
                      : "bg-foreground/5 text-muted hover:bg-foreground/10"
                  }`}
                >
                  Virtual
                </button>
              </div>
            </div>

            {eventType === "IN_PERSON" && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={labelClass}>City</label>
                  <input
                    type="text"
                    value={locationCity}
                    onChange={(e) => setLocationCity(e.target.value)}
                    placeholder="San Francisco"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Address (optional)</label>
                  <input
                    type="text"
                    value={locationAddress}
                    onChange={(e) => setLocationAddress(e.target.value)}
                    placeholder="123 Main St"
                    className={inputClass}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={labelClass}>Starts</label>
                <input
                  type="datetime-local"
                  value={startsAt}
                  onChange={(e) => setStartsAt(e.target.value)}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Ends (optional)</label>
                <input
                  type="datetime-local"
                  value={endsAt}
                  onChange={(e) => setEndsAt(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Max attendees (optional)</label>
              <input
                type="number"
                value={maxAttendees}
                onChange={(e) => setMaxAttendees(e.target.value)}
                placeholder="20"
                className={inputClass}
                min={1}
              />
            </div>

            {error && <p className="text-coral theme-body-sm">{error}</p>}

            <Button
              type="submit"
              variant="accent"
              size="default"
              disabled={saving || !title.trim() || !description.trim() || !startsAt}
              className="w-full"
            >
              {saving ? <Loader size="sm" /> : "Create Event"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
