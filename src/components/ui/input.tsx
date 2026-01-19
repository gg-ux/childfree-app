import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="theme-caption block mb-2 text-muted">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "w-full bg-transparent",
            "border-0 border-b border-[rgba(0,0,0,0.12)]",
            "py-3 text-base",
            "placeholder:text-muted-light",
            "transition-all duration-300 ease-organic",
            "focus:outline-none focus:border-amethyst focus:border-opacity-100",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-rose focus:border-rose",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-2 text-[12px] text-rose">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
