"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { CaretDown, Check } from "@phosphor-icons/react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}

export function Select({
  value,
  onChange,
  options,
  placeholder = "Select...",
  className = "",
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [typeahead, setTypeahead] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typeaheadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll highlighted item into view
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll("li");
      items[highlightedIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex, isOpen]);

  // Reset highlighted index when opening
  useEffect(() => {
    if (isOpen) {
      const currentIndex = options.findIndex((opt) => opt.value === value);
      setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0);
    }
  }, [isOpen, options, value]);

  // Typeahead search
  const handleTypeahead = useCallback((char: string) => {
    // Clear previous timeout
    if (typeaheadTimeoutRef.current) {
      clearTimeout(typeaheadTimeoutRef.current);
    }

    const newTypeahead = typeahead + char.toLowerCase();
    setTypeahead(newTypeahead);

    // Find matching option
    const matchIndex = options.findIndex((opt) =>
      opt.label.toLowerCase().startsWith(newTypeahead)
    );

    if (matchIndex >= 0) {
      setHighlightedIndex(matchIndex);
      if (!isOpen) {
        // If closed, directly select the option
        onChange(options[matchIndex].value);
      }
    }

    // Reset typeahead after 1 second of no typing
    typeaheadTimeoutRef.current = setTimeout(() => {
      setTypeahead("");
    }, 1000);
  }, [typeahead, options, isOpen, onChange]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typeaheadTimeoutRef.current) {
        clearTimeout(typeaheadTimeoutRef.current);
      }
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle typeahead for letters and numbers
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      }
      handleTypeahead(e.key);
      return;
    }

    if (!isOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "Escape":
        setIsOpen(false);
        break;
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < options.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0) {
          onChange(options[highlightedIndex].value);
          setIsOpen(false);
        }
        break;
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={`w-full px-4 h-14 rounded-xl border bg-background text-left flex items-center justify-between transition-colors ${
          isOpen
            ? "border-forest"
            : "border-border hover:border-forest/50"
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={selectedOption ? "text-foreground" : "text-muted"}>
          {selectedOption?.label || placeholder}
        </span>
        <CaretDown
          size={16}
          className={`text-muted transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <ul
          ref={listRef}
          role="listbox"
          className="absolute z-50 w-full mt-2 py-2 bg-background border border-border rounded-xl shadow-lg max-h-60 overflow-auto"
          style={{
            animation: "fadeIn 0.15s ease-out",
          }}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
              className={`px-4 py-2.5 cursor-pointer flex items-center justify-between transition-colors ${
                highlightedIndex === index
                  ? "bg-forest/10"
                  : ""
              } ${
                option.value === value
                  ? "text-forest font-medium"
                  : "text-foreground"
              }`}
            >
              {option.label}
              {option.value === value && (
                <Check size={16} className="text-forest" />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
