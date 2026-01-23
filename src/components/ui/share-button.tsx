"use client";

import { useState } from "react";
import { ShareNetwork, Link, Check } from "@phosphor-icons/react";

interface ShareButtonProps {
  title: string;
  url?: string;
}

export function ShareButton({ title, url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
      "_blank"
    );
  };

  const shareToLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      "_blank"
    );
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: shareUrl });
      } catch {
        // User cancelled or share failed, fall back to dropdown
        setIsOpen(!isOpen);
      }
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleNativeShare}
        className="inline-flex items-center gap-2 h-8 px-3 rounded-lg border border-[rgba(0,0,0,0.08)] text-[14px] font-button text-muted hover:text-foreground hover:bg-foreground/5 transition-colors"
        aria-label="Share this article"
      >
        <ShareNetwork size={16} weight="bold" />
        Share
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 py-2 bg-background border border-border rounded-lg shadow-lg z-50">
            <button
              onClick={() => {
                shareToTwitter();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-[14px] font-button text-foreground hover:bg-foreground/5 transition-colors"
            >
              Share on X
            </button>
            <button
              onClick={() => {
                shareToLinkedIn();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-[14px] font-button text-foreground hover:bg-foreground/5 transition-colors"
            >
              Share on LinkedIn
            </button>
            <button
              onClick={() => {
                handleCopy();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-[14px] font-button text-foreground hover:bg-foreground/5 transition-colors inline-flex items-center gap-2"
            >
              {copied ? (
                <>
                  <Check size={14} weight="bold" className="text-forest" />
                  Copied!
                </>
              ) : (
                <>
                  <Link size={14} weight="bold" />
                  Copy link
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
