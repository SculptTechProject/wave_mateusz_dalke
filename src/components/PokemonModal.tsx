"use client";
import Image from "next/image";
import Modal from "@/components/Modal";
import { typeBg } from "@/utils/typeColor";
import { useFavorites } from "@/hooks/useFavorites";
import { fetchPokemon, type Pokemon } from "@/lib/pokeapi";
import { useQuery } from "@tanstack/react-query";

export default function PokemonModal({
  open,
  onClose,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  initial: Pokemon;
}) {
  const q = useQuery({
    queryKey: ["pokemon", initial.name],
    queryFn: () => fetchPokemon(initial.name),
    initialData: initial,
    staleTime: 1000 * 60 * 5,
  });

  const p = q.data!;
  const { ids, add, remove } = useFavorites();
  const fav = ids.includes(p.id);

  return (
    <Modal open={open} onClose={onClose} ariaLabel={`${p.name} details`}>
      <header className={`rounded-t-2xl p-4 ${typeBg(p.types)}`}>
        <div className="flex items-center gap-3">
          {p.sprite && (
            <Image
              src={p.sprite}
              alt={p.name}
              width={96}
              height={96}
              className="drop-shadow shrink-0"
            />
          )}
          <div>
            <h2 className="text-2xl font-bold capitalize">{p.name}</h2>
            <p className="text-white/80">#{String(p.id).padStart(4, "0")}</p>
            <div className="flex gap-2 mt-2">
              {p.types.map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 rounded-full text-sm bg-white/25 ring-1 ring-white/40"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={() => (fav ? remove(p.id) : add(p.id))}
            className={`ml-auto rounded-full px-3 py-1.5 text-sm font-medium ring-1 ring-white/20 ${
              fav
                ? "bg-rose-500 text-white"
                : "bg-white/10 text-white hover:bg-white/15"
            }`}
            aria-pressed={fav}
          >
            {fav ? "★ Ulubiony" : "☆ Dodaj do ulubionych"}
          </button>
        </div>
      </header>

      <div className="p-4">
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-white/60">ID</dt>
            <dd>#{p.id}</dd>
          </div>
          <div>
            <dt className="text-white/60">Typy</dt>
            <dd>{p.types.join(", ")}</dd>
          </div>
        </dl>

        <div className="flex justify-end gap-2 mt-4">
          <button
            className="rounded-md px-3 py-1.5 bg-white/10 ring-1 ring-white/20 hover:bg-white/15"
            onClick={onClose}
          >
            Zamknij
          </button>
        </div>
      </div>
    </Modal>
  );
}
