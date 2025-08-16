"use client";
import Link from "next/link";
import Image from "next/image";
import pokeball from "@/images/poke-ball.png";
import { SearchInput } from "@/components/SearchInput";
import TypePills, { TypeName } from "@/components/TypePills";
import PokemonCard from "@/components/PokemonCard";
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import {
  usePokemonInfinite,
  usePageDetails,
  filterPokemon,
} from "@/hooks/usePokemon";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import PokemonModal from "@/components/PokemonModal";
import type { Pokemon } from "@/lib/pokeapi";

export default function Home() {
  const [selectedTypes, setSelectedTypes] = useState<TypeName[]>([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<Pokemon | null>(null);

  const toggleType = (t: TypeName) =>
    setSelectedTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );

  const listQ = usePokemonInfinite(query, selectedTypes);

  const currentNames = useMemo(() => {
    const pages = listQ.data?.pages ?? [];
    const last = pages[pages.length - 1];
    return last?.results?.map((r: { name: string }) => r.name) ?? [];
  }, [listQ.data]);

  const detailQs = usePageDetails(currentNames);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const detailsReady = detailQs.map((q) => q.data).filter(Boolean) as any[];

  const visible = useMemo(
    () => filterPokemon(detailsReady, query, selectedTypes),
    [detailsReady, query, selectedTypes]
  );

  const canLoad = Boolean(listQ.hasNextPage && !listQ.isFetchingNextPage);
  const hitBottom = useCallback(() => listQ.fetchNextPage(), [listQ]);
  const sentinelRef = useInfiniteScroll(hitBottom, canLoad);

  const topRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [query, selectedTypes]);

  return (
    <div>
      <header className="flex flex-row items-center justify-center gap-2 mt-10">
        <Image src={pokeball} alt="Pokéball" priority width={40} height={40} />
        <h1 className="text-4xl sm:text-2xl font-extrabold bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-500 bg-clip-text text-transparent bg-[length:200%_200%] animate-gradient-x">
          Pokémon Explorer
        </h1>
      </header>

      <div className="flex justify-center mt-4">
        <Link
          href="/favorites"
          className="rounded-full px-4 py-1.5 text-sm bg-white/10 ring-1 ring-white/20 text-white hover:bg-white/15"
        >
          ★ Ulubione
        </Link>
      </div>

      <section className="px-4 mt-8">
        <div className="relative max-w-4xl mx-auto" ref={topRef}>
          <SearchInput onChangeQuery={setQuery} />
          <TypePills selected={selectedTypes} onToggle={toggleType} />

          {/* GRID */}
          <div
            className="grid grid-cols-1 gap-4 mt-6 sm:grid-cols-2 lg:grid-cols-3"
            style={{ overflowAnchor: "none" }}
          >
            {visible.map((p) => (
              <PokemonCard
                key={p.id}
                p={p}
                onClick={(pp) => {
                  setCurrent(pp);
                  setOpen(true);
                }}
              />
            ))}

            {detailQs.some((q) => q.isLoading) &&
              Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={`sk-${i}`}
                  className="h-32 rounded-2xl bg-white/5 animate-pulse"
                  style={{ overflowAnchor: "none" }}
                />
              ))}
          </div>

          {current && (
            <PokemonModal
              open={open}
              onClose={() => setOpen(false)}
              initial={current}
            />
          )}

          {!detailQs.some((q) => q.isLoading) && visible.length === 0 && (
            <p className="mt-6 text-center text-white/60">
              Nic nie znaleziono dla tych filtrów.
            </p>
          )}

          <div ref={sentinelRef} className="h-10" />

          <div className="mt-4 text-sm text-center text-white/60">
            {listQ.isFetchingNextPage && "Ładowanie..."}
            {!listQ.hasNextPage && "To już wszystko! :)"}
          </div>
        </div>
      </section>
    </div>
  );
}
