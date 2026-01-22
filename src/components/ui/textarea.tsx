import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
  hint?: string;
  showCount?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, hint, showCount, maxLength, value, ...props }, ref) => {
    const charCount = typeof value === "string" ? value.length : 0;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-foreground mb-2">
            {label}
            {hint && <span className="text-muted font-medium"> ({hint})</span>}
          </label>
        )}
        <textarea
          className={cn(
            "w-full bg-background text-base transition-colors duration-300",
            "px-4 py-3 rounded-xl",
            "border border-border",
            "placeholder:text-muted/50",
            "focus:outline-none focus:border-forest",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "resize-none",
            error && "border-red-500 focus:border-red-500",
            className
          )}
          ref={ref}
          maxLength={maxLength}
          value={value}
          {...props}
        />
        <div className="flex justify-end mt-1">
          {showCount && maxLength && (
            <span className="text-xs text-muted">
              {charCount}/{maxLength}
            </span>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
