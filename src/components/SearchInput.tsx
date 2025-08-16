"use client";
import { useState } from "react";

export function SearchInput({
  onChangeQuery,
}: {
  onChangeQuery?: (q: string) => void;
}) {
  const [query, setQuery] = useState("");
  return (
    <div className="relative w-full">
      <input
        id="search"
        type="text"
        value={query}
        onChange={(e) => {
          const v = e.target.value;
          setQuery(v);
          onChangeQuery?.(v);
        }}
        placeholder="Search Pokémon..."
        className="w-full rounded-full bg-white/5 text-slate-100 placeholder:text-slate-400/70 border border-white/10 px-12 py-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,.05)] focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-transparent"
      />
      {query && (
        <button
          type="button"
          onClick={() => {
            setQuery("");
            onChangeQuery?.("");
          }}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-400 hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/60"
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
      <svg
        className="absolute w-5 h-5 -translate-y-1/2 pointer-events-none left-4 top-1/2 text-slate-400/70"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-3.8-3.8" />
      </svg>
    </div>
  );
}
