"use client";

import * as React from "react";
import { useEffect, useState, useRef } from "react";

interface TextDecodeProps {
  text: string;
  className?: string;
  speed?: number;
  iterations?: number;
  characters?: string;
  trigger?: "mount" | "inView";
  delay?: number;
}

const defaultCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";

export function TextDecode({
  text,
  className,
  speed = 30,
  iterations = 3,
  characters = defaultCharacters,
  trigger = "inView",
  delay = 0,
}: TextDecodeProps) {
  const [displayText, setDisplayText] = useState(text);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  const animate = React.useCallback(() => {
    let currentIteration = 0;
    const totalIterations = text.length * iterations;

    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            // Keep spaces as spaces
            if (char === " ") return " ";

            // Characters that have been "decoded"
            if (index < currentIteration / iterations) {
              return char;
            }

            // Random character for undecoded positions
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join("")
      );

      currentIteration++;

      if (currentIteration > totalIterations) {
        clearInterval(interval);
        setDisplayText(text);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, iterations, characters]);

  useEffect(() => {
    if (trigger === "mount" && !hasAnimated) {
      const timeout = setTimeout(() => {
        setHasAnimated(true);
        animate();
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [trigger, hasAnimated, animate, delay]);

  useEffect(() => {
    if (trigger !== "inView" || hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            setTimeout(() => {
              animate();
            }, delay);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [trigger, hasAnimated, animate, delay]);

  return (
    <span ref={ref} className={className}>
      {displayText}
    </span>
  );
}
