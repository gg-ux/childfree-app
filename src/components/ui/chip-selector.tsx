"use client";

import { cn } from "@/lib/utils/cn";

interface ChipOption {
  value: string;
  label: string;
}

interface ChipSelectorProps {
  options: ChipOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  max?: number;
  label?: string;
  hint?: string;
  className?: string;
}

export function ChipSelector({
  options,
  selected,
  onChange,
  max,
  label,
  hint,
  className,
}: ChipSelectorProps) {
  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else if (!max || selected.length < max) {
      onChange([...selected, value]);
    }
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-3">
          {label}
          {hint && <span className="text-muted font-normal"> ({hint})</span>}
        </label>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option.value);
          const isDisabled = !isSelected && !!max && selected.length >= max;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => !isDisabled && toggleOption(option.value)}
              disabled={isDisabled}
              className={cn(
                "px-4 py-2 rounded-full border text-sm transition-all",
                isSelected
                  ? "border-forest bg-forest/10 text-forest"
                  : "border-border hover:border-forest/50 text-foreground",
                isDisabled && "opacity-40 cursor-not-allowed hover:border-border"
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      {max && (
        <p className="text-xs text-muted mt-2">
          {selected.length}/{max} selected
        </p>
      )}
    </div>
  );
}
