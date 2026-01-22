"use client";

import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils/cn";

interface RangeSliderProps {
  min: number;
  max: number;
  minValue: number;
  maxValue: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
  step?: number;
  label?: string;
  className?: string;
}

export function RangeSlider({
  min,
  max,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  step = 1,
  label,
  className,
}: RangeSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<"min" | "max" | null>(null);

  const getPercentage = (value: number) => {
    return ((value - min) / (max - min)) * 100;
  };

  const getValueFromPosition = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return min;
      const rect = trackRef.current.getBoundingClientRect();
      const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const rawValue = min + percentage * (max - min);
      return Math.round(rawValue / step) * step;
    },
    [min, max, step]
  );

  const handleMouseDown = (thumb: "min" | "max") => (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(thumb);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newValue = getValueFromPosition(moveEvent.clientX);
      if (thumb === "min") {
        onMinChange(Math.min(newValue, maxValue - step));
      } else {
        onMaxChange(Math.max(newValue, minValue + step));
      }
    };

    const handleMouseUp = () => {
      setDragging(null);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStart = (thumb: "min" | "max") => (e: React.TouchEvent) => {
    setDragging(thumb);

    const handleTouchMove = (moveEvent: TouchEvent) => {
      const touch = moveEvent.touches[0];
      const newValue = getValueFromPosition(touch.clientX);
      if (thumb === "min") {
        onMinChange(Math.min(newValue, maxValue - step));
      } else {
        onMaxChange(Math.max(newValue, minValue + step));
      }
    };

    const handleTouchEnd = () => {
      setDragging(null);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };

    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
  };

  const minPercent = getPercentage(minValue);
  const maxPercent = getPercentage(maxValue);

  return (
    <div className={className}>
      {label && (
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-foreground">{label}</label>
          <span className="text-sm font-[450] text-muted">
            {minValue} – {maxValue}
          </span>
        </div>
      )}

      <div
        ref={trackRef}
        className="relative h-1 bg-border rounded-full cursor-pointer"
      >
        {/* Active range */}
        <div
          className="absolute h-full bg-forest rounded-full"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />

        {/* Min thumb */}
        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-background border-2 border-forest rounded-full cursor-grab shadow-sm transition-shadow",
            dragging === "min" && "cursor-grabbing shadow-md scale-110",
            "hover:shadow-md"
          )}
          style={{ left: `${minPercent}%` }}
          onMouseDown={handleMouseDown("min")}
          onTouchStart={handleTouchStart("min")}
          role="slider"
          aria-valuenow={minValue}
          aria-valuemin={min}
          aria-valuemax={maxValue - step}
          aria-label="Minimum age"
          tabIndex={0}
        />

        {/* Max thumb */}
        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-background border-2 border-forest rounded-full cursor-grab shadow-sm transition-shadow",
            dragging === "max" && "cursor-grabbing shadow-md scale-110",
            "hover:shadow-md"
          )}
          style={{ left: `${maxPercent}%` }}
          onMouseDown={handleMouseDown("max")}
          onTouchStart={handleTouchStart("max")}
          role="slider"
          aria-valuenow={maxValue}
          aria-valuemin={minValue + step}
          aria-valuemax={max}
          aria-label="Maximum age"
          tabIndex={0}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-2">
        <span className="text-xs font-[450] text-muted">{min}</span>
        <span className="text-xs font-[450] text-muted">{max}</span>
      </div>
    </div>
  );
}
