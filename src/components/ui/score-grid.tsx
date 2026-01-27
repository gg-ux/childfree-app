"use client";

import { useEffect, useRef, useState } from "react";

interface ScoreItem {
  label: string;
  value: number;
}

interface ScoreGridProps {
  data: ScoreItem[];
}

function CircleScore({ label, value, isVisible, delay }: ScoreItem & { isVisible: boolean; delay: number }) {
  const size = 64;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(0,0,0,0.06)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#2F7255"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={isVisible ? offset : circumference}
          style={{
            transition: `stroke-dashoffset 0.8s ease-out ${delay}s`,
          }}
        />
        <text
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-foreground rotate-90 origin-center"
          style={{ fontSize: "15px", fontWeight: 600 }}
        >
          {value}
        </text>
      </svg>
      <span className="theme-caption text-muted text-center leading-tight">{label}</span>
    </div>
  );
}

export function ScoreGrid({ data }: ScoreGridProps) {
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
    <div ref={ref} className="my-8 bg-[#f8f8f8] border border-[rgba(0,0,0,0.06)] rounded-2xl p-6 md:p-8">
      <div className="grid grid-cols-3 gap-6">
        {data.map((item, index) => (
          <CircleScore
            key={item.label}
            label={item.label}
            value={item.value}
            isVisible={isVisible}
            delay={0.1 + index * 0.1}
          />
        ))}
      </div>
    </div>
  );
}
