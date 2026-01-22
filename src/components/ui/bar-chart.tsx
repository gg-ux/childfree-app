"use client";

import { useEffect, useRef, useState } from "react";

interface BarData {
  label: string;
  value: number;
  color?: "forest" | "coral" | "marigold" | "muted";
}

interface BarChartProps {
  title?: string;
  data: BarData[];
  maxValue?: number;
  showPercentage?: boolean;
}

export function BarChart({ title, data, maxValue, showPercentage = true }: BarChartProps) {
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

  const max = maxValue || Math.max(...data.map((d) => d.value), 100);

  const colors = {
    forest: "#2F7255",
    coral: "#D4654A",
    marigold: "#D9A441",
    muted: "#9ca3af",
  };

  return (
    <div ref={ref} className="my-8 bg-[#f8f8f8] border border-[rgba(0,0,0,0.06)] rounded-2xl p-6 md:p-8">
      {title && (
        <p className="theme-body-sm text-muted mb-6">{title}</p>
      )}
      <div className="space-y-5">
        {data.map((item, index) => (
          <div key={item.label}>
            <div className="flex justify-between items-baseline mb-2">
              <span className="theme-caption text-muted">{item.label}</span>
              {showPercentage && (
                <span className="theme-caption text-muted">{item.value}%</span>
              )}
            </div>
            <div className="w-full h-1 bg-foreground/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: isVisible ? `${(item.value / max) * 100}%` : "0%",
                  backgroundColor: colors[item.color || "forest"],
                  transition: `width 0.8s ease-out ${0.2 + index * 0.15}s`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface ComparisonBarProps {
  title?: string;
  before: { label: string; value: number };
  after: { label: string; value: number };
  maxValue?: number;
}

export function ComparisonBar({ title, before, after, maxValue = 100 }: ComparisonBarProps) {
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
      {title && (
        <p className="theme-body-sm text-muted mb-6">{title}</p>
      )}
      <div className="space-y-4">
        {/* Before bar */}
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <span className="theme-caption text-muted">{before.label}</span>
            <span className="theme-caption text-muted">{before.value}%</span>
          </div>
          <div className="w-full h-1 bg-foreground/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-foreground/30"
              style={{
                width: isVisible ? `${(before.value / maxValue) * 100}%` : "0%",
                transition: "width 0.8s ease-out 0.2s",
              }}
            />
          </div>
        </div>

        {/* After bar */}
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <span className="theme-caption text-muted">{after.label}</span>
            <span className="theme-caption text-muted">{after.value}%</span>
          </div>
          <div className="w-full h-1 bg-foreground/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-forest"
              style={{
                width: isVisible ? `${(after.value / maxValue) * 100}%` : "0%",
                transition: "width 0.8s ease-out 0.35s",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
