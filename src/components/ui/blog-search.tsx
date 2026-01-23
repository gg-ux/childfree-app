"use client";

import { useState } from "react";
import { MagnifyingGlass, X } from "@phosphor-icons/react";

interface BlogSearchProps {
  onSearch: (query: string) => void;
}

export function BlogSearch({ onSearch }: BlogSearchProps) {
  const [query, setQuery] = useState("");

  const handleChange = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div className="relative">
      <MagnifyingGlass
        size={20}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
      />
      <input
        type="text"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Search articles..."
        className="w-full h-14 pl-12 pr-12 rounded-xl border border-border bg-background text-base font-[450] text-foreground placeholder:text-muted/50 focus:outline-none focus:border-forest transition-colors duration-300"
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
          aria-label="Clear search"
        >
          <X size={18} weight="bold" />
        </button>
      )}
    </div>
  );
}
