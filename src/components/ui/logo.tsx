import * as React from "react";
import { cn } from "@/lib/utils/cn";

interface LogoProps extends React.SVGAttributes<SVGElement> {
  variant?: "full" | "icon";
  theme?: "light" | "dark";
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { full: { width: 156, height: 40 }, icon: { width: 40, height: 40 } },
  md: { full: { width: 190, height: 48 }, icon: { width: 48, height: 48 } },
  lg: { full: { width: 224, height: 58 }, icon: { width: 58, height: 58 } },
};

// 8-seed dandelion - seeds radiate at 45° intervals
const seedAngles = [0, 45, 90, 135, 180, 225, 270, 315];

const Logo = React.forwardRef<SVGSVGElement, LogoProps>(
  ({ variant = "full", theme = "light", size = "md", className, ...props }, ref) => {
    const dimensions = sizes[size][variant];

    const forestColor = theme === "light" ? "#2F7255" : "#4A8B6A";
    const textColor = theme === "light" ? "#1A1A1A" : "#FAFAFA";

    // Dandelion icon component (scaled down for better icon-to-text ratio)
    const DandelionIcon = ({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) => (
      <g transform={`translate(${cx}, ${cy}) scale(${scale})`}>
        {/* Center */}
        <circle cx="0" cy="0" r="5" fill={forestColor} />
        {/* 8 seeds */}
        {seedAngles.map((angle) => (
          <g key={angle} transform={`rotate(${angle} 0 0)`}>
            <line
              x1="0"
              y1="-5"
              x2="0"
              y2="-13"
              stroke={forestColor}
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <circle cx="0" cy="-16" r="4" fill={forestColor} />
          </g>
        ))}
      </g>
    );

    if (variant === "icon") {
      return (
        <svg
          ref={ref}
          width={dimensions.width}
          height={dimensions.height}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn("shrink-0", className)}
          {...props}
        >
          <DandelionIcon cx={20} cy={20} />
        </svg>
      );
    }

    // Full logo with wordmark - smaller icon, larger text, tighter spacing
    return (
      <svg
        ref={ref}
        width={dimensions.width}
        height={dimensions.height}
        viewBox="0 0 140 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        {...props}
      >
        {/* 8-seed dandelion icon - scaled to ~24px */}
        <DandelionIcon cx={15} cy={17} scale={0.6} />

        {/* Wordmark - larger relative to icon */}
        <text
          x="32"
          y="19"
          dominantBaseline="middle"
          fontFamily="Satoshi, -apple-system, sans-serif"
          fontSize="24"
          fontWeight="500"
          letterSpacing="-0.02em"
          fill={textColor}
        >
          flourish
        </text>
      </svg>
    );
  }
);

Logo.displayName = "Logo";

export { Logo };
