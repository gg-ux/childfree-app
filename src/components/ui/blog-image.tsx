"use client";

import { useEffect, useRef, useState } from "react";

interface BlogImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function BlogImage({ src, alt, className }: BlogImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const isSvg = src.endsWith(".svg");

  useEffect(() => {
    if (!isSvg) return;

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
          svg.style.width = "100%";
          svg.style.height = "100%";
          // Start paused
          svg.pauseAnimations();
          setIsLoaded(true);
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
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [src, alt, isSvg]);

  if (!isSvg) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: "100%",
        height: "100%",
        opacity: isLoaded ? 1 : 0,
        transition: "opacity 0.2s ease-in-out"
      }}
    />
  );
}
