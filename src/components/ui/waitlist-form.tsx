"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface WaitlistFormProps {
  source?: string;
  className?: string;
}

export function WaitlistForm({ source = "website", className }: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    setStatus("loading");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message);
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className={`text-center ${className}`}>
        <p className="text-forest font-medium">{message}</p>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-md ${className}`}>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          disabled={status === "loading"}
          className="w-full sm:flex-1 px-4 h-14 rounded-xl border border-border bg-background text-base font-[450] placeholder:text-muted/50 focus:outline-none focus:border-forest transition-colors duration-300 disabled:opacity-50"
        />
        <Button
          type="submit"
          variant="accent"
          className="w-full sm:w-auto h-14 shrink-0"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Joining..." : "Join the waitlist"}
        </Button>
      </form>
      {status === "error" && (
        <p className="text-red-500 text-sm font-[450] mt-2">{message}</p>
      )}
    </div>
  );
}
