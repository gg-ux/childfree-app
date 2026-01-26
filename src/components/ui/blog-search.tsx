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
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
      />
      <input
        type="text"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Search articles..."
        className="w-full h-10 pl-10 pr-10 rounded-lg border border-border bg-background text-sm font-[450] text-foreground placeholder:text-muted/50 focus:outline-none focus:border-forest transition-colors duration-300"
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
          aria-label="Clear search"
        >
          <X size={16} weight="bold" />
        </button>
      )}
    </div>
  );
}
