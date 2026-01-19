import * as React from "react";
import { cn } from "@/lib/utils/cn";

interface FrostedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const FrostedCard = React.forwardRef<HTMLDivElement, FrostedCardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "group relative rounded-2xl overflow-hidden",
          "backdrop-blur-md",
          "bg-white/60",
          "border border-[rgba(0,0,0,0.06)]",
          "shadow-sm",
          "transition-all duration-500",
          "hover:bg-white/80",
          "hover:border-[rgba(0,0,0,0.1)]",
          "hover:shadow-lg",
          "hover:-translate-y-1",
          className
        )}
        style={{
          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        }}
        {...props}
      >
        {/* Grain texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Content */}
        <div className="relative z-10">{children}</div>
      </div>
    );
  }
);
FrostedCard.displayName = "FrostedCard";

export { FrostedCard };
