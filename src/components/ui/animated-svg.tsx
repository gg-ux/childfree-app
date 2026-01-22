"use client";

import { useEffect, useRef } from "react";

interface AnimatedSvgProps {
  src: string;
  alt: string;
  className?: string;
}

export function AnimatedSvg({ src, alt, className }: AnimatedSvgProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Load SVG inline so we can control animations
    fetch(src)
      .then((res) => res.text())
      .then((svgText) => {
        container.innerHTML = svgText;
        const svg = container.querySelector("svg");
        if (svg) {
          svg.setAttribute("role", "img");
          svg.setAttribute("aria-label", alt);
          // Start paused
          svg.pauseAnimations();
        }
      });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const svg = container.querySelector("svg");
          if (!svg) return;

          if (entry.isIntersecting) {
            svg.unpauseAnimations();
          } else {
            svg.pauseAnimations();
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% visible
        rootMargin: "50px", // Start slightly before entering viewport
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [src, alt]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: "100%", height: "auto" }}
    />
  );
}
