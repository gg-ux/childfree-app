import * as React from "react";
import { cn } from "@/lib/utils/cn";

interface LogoProps extends React.SVGAttributes<SVGElement> {
  variant?: "full" | "icon";
  theme?: "light" | "dark";
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { full: { width: 140, height: 36 }, icon: { width: 32, height: 32 } },
  md: { full: { width: 160, height: 42 }, icon: { width: 40, height: 40 } },
  lg: { full: { width: 190, height: 50 }, icon: { width: 48, height: 48 } },
};

const Logo = React.forwardRef<SVGSVGElement, LogoProps>(
  ({ variant = "full", theme = "light", size = "md", className, ...props }, ref) => {
    const dimensions = sizes[size][variant];
    const textColor = theme === "light" ? "#1A1A1A" : "#FAFAFA";

    // Sparkle icon - 4-pointed star with brand colors
    const SparkleIcon = ({ scale = 1, x = 0, y = 0 }: { scale?: number; x?: number; y?: number }) => (
      <g transform={`translate(${x}, ${y}) scale(${scale})`}>
        <path d="M51 0C51 0 58.8307 23.9252 70 34.5C80.2101 44.1667 102 51 102 51H51V0Z" fill="#417057"/>
        <path d="M51 0C51 0 43.1693 23.9252 32 34.5C21.7899 44.1667 0 51 0 51H51V0Z" fill="#419161"/>
        <path d="M51 102C51 102 58.8307 78.0748 70 67.5C80.2101 57.8333 102 51 102 51H51V102Z" fill="#E0763D"/>
        <path d="M51 102C51 102 43.1693 78.0748 32 67.5C21.7899 57.8333 0 51 0 51H51V102Z" fill="#F5AA3D"/>
      </g>
    );

    if (variant === "icon") {
      return (
        <svg
          ref={ref}
          width={dimensions.width}
          height={dimensions.height}
          viewBox="0 0 102 102"
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
        <SparkleIcon scale={0.30} x={5} y={5} />

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
