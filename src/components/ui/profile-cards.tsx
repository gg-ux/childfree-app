"use client";

import { useState } from "react";
import { MagnifyingGlass, Heart, Dog } from "@phosphor-icons/react";

export function ProfileCards() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const getZIndex = (cardId: string) => {
    if (hoveredCard === null) {
      // Default state: Camille in front
      return cardId === "camille" ? 20 : 10;
    }
    // When hovering, hovered card comes to front
    return hoveredCard === cardId ? 20 : 10;
  };

  const getScale = (cardId: string) => {
    if (hoveredCard === null) {
      return 1;
    }
    // Camille doesn't grow on hover, only shrinks when others are hovered
    if (cardId === "camille") {
      return hoveredCard === "camille" ? 1 : 0.85;
    }
    if (hoveredCard === cardId) {
      // Hovered card grows to match Camille's size
      return 1.08;
    }
    // Other cards stay at 1 (only Camille recedes)
    return 1;
  };

  return (
    <div className="relative h-[280px] md:h-[400px] lg:h-[500px] order-1 lg:order-2 mb-8 md:mb-12 lg:mb-0">
      {/* Card 1 - Left (behind) - Mika */}
      <div
        className="absolute top-16 md:top-24 left-0 md:left-[15%] lg:left-4 w-36 md:w-52 bg-white rounded-2xl shadow-lg border border-border overflow-hidden -rotate-6 hover:rotate-0 transition-all duration-500 cursor-pointer"
        style={{ zIndex: getZIndex("mika"), transform: `scale(${getScale("mika")})` }}
        onMouseEnter={() => setHoveredCard("mika")}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <div className="aspect-[3/4] bg-gradient-to-br from-coral/20 to-coral/5 overflow-hidden">
          <img
            src="/assets/home/girl02.webp"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-2 md:p-3">
          <p className="font-medium text-foreground text-xs md:text-sm">Mika, 24</p>
          <p className="text-[10px] md:text-xs text-muted mb-1 md:mb-2">3 miles away</p>
          <div className="flex flex-wrap gap-1">
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-foreground/8 text-foreground/70 font-semibold inline-flex items-center gap-1">
              <MagnifyingGlass size={10} weight="bold" />
              Adventure buddy
            </span>
          </div>
        </div>
      </div>

      {/* Card 2 - Right (behind) - Christopher */}
      <div
        className="absolute top-16 md:top-24 right-0 md:right-[15%] lg:right-4 w-36 md:w-52 bg-white rounded-2xl shadow-lg border border-border overflow-hidden rotate-6 hover:rotate-0 transition-all duration-500 cursor-pointer"
        style={{ zIndex: getZIndex("christopher"), transform: `scale(${getScale("christopher")})` }}
        onMouseEnter={() => setHoveredCard("christopher")}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <div className="aspect-[3/4] bg-gradient-to-br from-marigold/20 to-marigold/5 overflow-hidden">
          <img
            src="/assets/home/guy-dog.webp"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-2 md:p-3">
          <p className="font-medium text-foreground text-xs md:text-sm">Christopher, 48</p>
          <p className="text-[10px] md:text-xs text-muted mb-1 md:mb-2">8 miles away</p>
          <div className="flex flex-wrap gap-1">
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-foreground/8 text-foreground/70 font-semibold inline-flex items-center gap-1">
              <MagnifyingGlass size={10} weight="bold" />
              Friends
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-foreground/8 text-foreground/70 font-semibold inline-flex items-center gap-1">
              <Dog size={10} weight="fill" />
              Dog dad
            </span>
          </div>
        </div>
      </div>

      {/* Card 3 - Main (front) - Camille */}
      <div
        className="absolute top-4 md:top-12 left-1/2 -translate-x-1/2 w-40 md:w-56 bg-white rounded-2xl shadow-xl border border-border overflow-hidden transition-all duration-500 cursor-pointer"
        style={{ zIndex: getZIndex("camille"), transform: `scale(${getScale("camille")})` }}
        onMouseEnter={() => setHoveredCard("camille")}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <div className="aspect-[3/4] bg-gradient-to-br from-forest/20 to-forest/5 overflow-hidden">
          <img
            src="/assets/home/girl01.webp"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-3 md:p-4">
          <p className="font-medium text-foreground text-sm md:text-base">Camille, 32</p>
          <p className="text-xs md:text-sm text-muted mb-1 md:mb-2">5 miles away</p>
          <div className="flex flex-wrap gap-1.5">
            <span className="text-[12px] px-2 py-0.5 rounded-full bg-foreground/8 text-foreground/70 font-semibold inline-flex items-center gap-1">
              <MagnifyingGlass size={11} weight="bold" />
              Life partner
            </span>
            <span className="text-[12px] px-2 py-0.5 rounded-full bg-foreground/8 text-foreground/70 font-semibold inline-flex items-center gap-1">
              <Heart size={11} weight="bold" />
              DINK
            </span>
          </div>
        </div>
      </div>

      {/* Connection lines - subtle */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20 hidden md:block" viewBox="0 0 400 500">
        <path d="M200 100 Q 100 200 80 280" stroke="#2F7255" strokeWidth="2" fill="none" strokeDasharray="4 4" />
        <path d="M200 100 Q 300 200 320 280" stroke="#2F7255" strokeWidth="2" fill="none" strokeDasharray="4 4" />
      </svg>
    </div>
  );
}
