import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  hint?: string;
  variant?: "underline" | "boxed";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, hint, variant = "boxed", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-foreground mb-2">
            {label}
            {hint && <span className="text-muted font-normal"> ({hint})</span>}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "w-full bg-background text-base transition-colors duration-300",
            "placeholder:text-muted/50",
            "focus:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-50",
            variant === "underline" && [
              "border-0 border-b border-border",
              "py-3 px-0",
              "focus:border-forest",
            ],
            variant === "boxed" && [
              "px-4 h-14 rounded-xl",
              "border border-border",
              "focus:border-forest",
            ],
            error && "border-red-500 focus:border-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
