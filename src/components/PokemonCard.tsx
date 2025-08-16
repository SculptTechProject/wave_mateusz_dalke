import Image from "next/image";
import { typeBg } from "@/utils/typeColor";
import type { Pokemon } from "@/lib/pokeapi";

export default function PokemonCard({
  p,
  onClick,
}: {
  p: Pokemon;
  onClick?: (p: Pokemon) => void;
}) {
  return (
    <article
      onClick={() => onClick?.(p)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick?.(p)}
      className={`min-h-[160px] cursor-pointer rounded-2xl p-4 text-white ring-1 ring-white/10 shadow ${typeBg(
        p.types
      )} focus:outline-none focus:ring-2 focus:ring-amber-400/60`}
    >
      {p.sprite && (
        <Image
          src={p.sprite}
          alt={p.name}
          width={72}
          height={72}
          className="drop-shadow shrink-0"
        />
      )}
      <div>
        <h3 className="text-lg font-semibold capitalize">{p.name}</h3>
        <p className="text-white/80">#{String(p.id).padStart(4, "0")}</p>
      </div>
      <div className="flex gap-2 mt-3">
        {p.types.map((t) => (
          <span
            key={t}
            className="px-2 py-0.5 rounded-full text-sm bg-white/20 ring-1 ring-white/30"
          >
            {t}
          </span>
        ))}
      </div>
    </article>
  );
}
