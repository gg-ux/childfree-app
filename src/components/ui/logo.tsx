import * as React from "react";
import { cn } from "@/lib/utils/cn";

interface LogoProps extends React.SVGAttributes<SVGElement> {
  variant?: "full" | "icon";
  theme?: "light" | "dark";
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { full: { width: 140, height: 36 }, icon: { width: 32, height: 32 } },
  md: { full: { width: 150, height: 38 }, icon: { width: 36, height: 36 } },
  lg: { full: { width: 190, height: 50 }, icon: { width: 48, height: 48 } },
};

const Logo = React.forwardRef<SVGSVGElement, LogoProps>(
  ({ variant = "full", theme = "light", size = "md", className, ...props }, ref) => {
    const dimensions = sizes[size][variant];
    const textColor = theme === "light" ? "#1A1A1A" : "#FAFAFA";

    // Sparkle leaves icon - 4 leaf petals
    const SparkleIcon = ({ scale = 1, x = 0, y = 0 }: { scale?: number; x?: number; y?: number }) => (
      <g transform={`translate(${x}, ${y}) scale(${scale})`}>
        <path d="M48.9854 0C48.9854 0 49.4863 15.5 49.4858 21C47.9858 29 40.7474 37.498 40.7474 37.498C40.7474 37.498 39.7474 36.998 35.9089 29.5C30.7851 19.4912 48.9854 0 48.9854 0Z" fill="#2F7255"/>
        <path d="M48.9854 0C48.9854 0 49.0127 15.5 49.0132 21C50.5132 29 57.7516 37.498 57.7516 37.498C57.7516 37.498 58.7516 36.998 62.5901 29.5C67.7139 19.4912 48.9854 0 48.9854 0Z" fill="#54AF88"/>
        <path d="M0 48.4922C0 48.4922 15.5 47.9912 21 47.9917C29 49.4917 37.498 56.7301 37.498 56.7301C37.498 56.7301 36.998 57.7301 29.5 61.5686C19.4912 66.6924 0 48.4922 0 48.4922Z" fill="#2F7255"/>
        <path d="M0 48.4922C0 48.4922 15.5 48.4648 21 48.4643C29 46.9643 37.498 39.7259 37.498 39.7259C37.498 39.7259 36.998 38.7259 29.5 34.8874C19.4912 29.7636 0 48.4922 0 48.4922Z" fill="#54AF88"/>
        <path d="M49.4922 97.498C49.4922 97.498 48.9912 81.998 48.9917 76.498C50.4917 68.498 57.7301 60 57.7301 60C57.7301 60 58.7301 60.5 62.5686 67.998C67.6924 78.0069 49.4922 97.498 49.4922 97.498Z" fill="#2F7255"/>
        <path d="M49.4922 97.498C49.4922 97.498 49.4648 81.998 49.4643 76.498C47.9643 68.498 40.7259 60 40.7259 60C40.7259 60 39.7259 60.5 35.8874 67.998C30.7636 78.0069 49.4922 97.498 49.4922 97.498Z" fill="#54AF88"/>
        <path d="M97.498 48.9854C97.498 48.9854 81.998 49.4863 76.498 49.4858C68.498 47.9858 60 40.7474 60 40.7474C60 40.7474 60.5 39.7474 67.998 35.9089C78.0069 30.7851 97.498 48.9854 97.498 48.9854Z" fill="#2F7255"/>
        <path d="M97.498 48.9854C97.498 48.9854 81.998 49.0127 76.498 49.0132C68.498 50.5132 60 57.7516 60 57.7516C60 57.7516 60.5 58.7516 67.998 62.5901C78.0069 67.7139 97.498 48.9854 97.498 48.9854Z" fill="#54AF88"/>
      </g>
    );

    if (variant === "icon") {
      return (
        <svg
          ref={ref}
          width={dimensions.width}
          height={dimensions.height}
          viewBox="0 0 98 98"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn("shrink-0", className)}
          {...props}
        >
          <SparkleIcon />
        </svg>
      );
    }

    // Full logo with wordmark
    return (
      <svg
        ref={ref}
        width={dimensions.width}
        height={dimensions.height}
        viewBox="0 0 170 42"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0", className)}
        {...props}
      >
        {/* Sparkle icon - scaled to fit */}
        <SparkleIcon scale={0.36} x={2} y={2} />

        {/* Wordmark */}
        <text
          x="44"
          y="23"
          dominantBaseline="middle"
          fontFamily="Satoshi, -apple-system, sans-serif"
          fontSize="30"
          fontWeight="700"
          letterSpacing="-0.01em"
          fill={textColor}
        >
          chosn
        </text>
      </svg>
    );
  }
);

Logo.displayName = "Logo";

export { Logo };
