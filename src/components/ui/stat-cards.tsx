"use client";

import { useEffect, useRef, useState } from "react";

interface StatCardsProps {
  proportion?: {
    value: number;
    total: number;
    label: string;
  };
  bigNumber?: {
    value: string;
    label: string;
  };
}

export function StatCards({ proportion, bigNumber }: StatCardsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8"
    >
      {/* Proportion Card */}
      {proportion && (
        <div className="bg-[#f8f8f8] border border-[rgba(0,0,0,0.06)] rounded-2xl p-8 flex flex-col justify-center items-center min-h-[160px]">
          <span
            className="block theme-stat text-3xl md:text-4xl text-foreground mb-2"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 0.4s ease-out 0.1s, transform 0.4s ease-out 0.1s",
            }}
          >
            {proportion.value} in {proportion.total}
          </span>
          <p className="theme-caption text-muted text-center">
            {proportion.label}
          </p>
        </div>
      )}

      {/* Big Number Card */}
      {bigNumber && (
        <div className="bg-[#f8f8f8] border border-[rgba(0,0,0,0.06)] rounded-2xl p-8 flex flex-col justify-center items-center min-h-[160px]">
          <span
            className="block theme-stat text-3xl md:text-4xl text-foreground mb-2"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 0.4s ease-out 0.2s, transform 0.4s ease-out 0.2s",
            }}
          >
            {bigNumber.value}
          </span>
          <p className="theme-caption text-muted text-center">
            {bigNumber.label}
          </p>
        </div>
      )}
    </div>
  );
}
