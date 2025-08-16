"use client";
import Link from "next/link";
import { useState } from "react";
import PokemonCard from "@/components/PokemonCard";
import PokemonModal from "@/components/PokemonModal";
import { useFavorites } from "@/hooks/useFavorites";
import { usePageDetails } from "@/hooks/usePokemon";
import type { Pokemon } from "@/lib/pokeapi";

export default function FavoritesPage() {
  const { ids, ready } = useFavorites();
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<Pokemon | null>(null);

  // pobieramy detale dokładnie w kolejności z localStorage
  const qs = usePageDetails(ids.map(String));
  const list = qs.map((q) => q.data).filter(Boolean) as Pokemon[];
  const isLoading = ids.length > 0 && qs.some((q) => q.isLoading);

  if (!ready) {
    return (
      <p className="mt-10 text-center text-white/60">Ładowanie ulubionych...</p>
    );
  }

  return (
    <div className="max-w-4xl px-4 pt-8 mx-auto">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">★ Ulubione</h1>
        <Link
          href="/"
          className="rounded-lg px-3 py-1.5 bg-white/10 ring-1 ring-white/20 text-white hover:bg-white/15"
        >
          ← Wróć
        </Link>
      </header>

      <div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        style={{ overflowAnchor: "none" }}
      >
        {list.map((p) => (
          <PokemonCard
            key={p.id}
            p={p}
            onClick={(pp) => {
              setCurrent(pp);
              setOpen(true);
            }}
          />
        ))}

        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={`sk-${i}`}
              className="h-32 rounded-2xl bg-white/5 animate-pulse"
              style={{ overflowAnchor: "none" }}
            />
          ))}
      </div>

      {ids.length === 0 && (
        <p className="mt-10 text-center text-white/60">
          Nie masz jeszcze ulubionych. Wejdź na stronę główną i dodaj z modala.
        </p>
      )}

      {current && (
        <PokemonModal
          open={open}
          onClose={() => setOpen(false)}
          initial={current}
        />
      )}
    </div>
  );
}
