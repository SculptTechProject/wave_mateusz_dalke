"use client";

export const TYPES = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
] as const;

export type TypeName = (typeof TYPES)[number];

export type TypePillsProps = {
  selected: TypeName[];
  onToggle: (type: TypeName) => void;
  className?: string;
};

const BASE =
  "px-3 py-1.5 rounded-full text-sm font-medium transition-colors text-white shadow-sm ring-1 ring-inset ring-white/10 hover:brightness-110 focus:outline-none";
const SELECTED = "ring-2 ring-white/80 ring-offset-2 ring-offset-slate-900";

const TYPE_BG: Record<TypeName, string> = {
  normal: "bg-type-normal",
  fire: "bg-type-fire",
  water: "bg-type-water",
  electric: "bg-type-electric",
  grass: "bg-type-grass",
  ice: "bg-type-ice",
  fighting: "bg-type-fighting",
  poison: "bg-type-poison",
  ground: "bg-type-ground",
  flying: "bg-type-flying",
  psychic: "bg-type-psychic",
  bug: "bg-type-bug",
  rock: "bg-type-rock",
  ghost: "bg-type-ghost",
  dragon: "bg-type-dragon",
  dark: "bg-type-dark",
  steel: "bg-type-steel",
  fairy: "bg-type-fairy",
};

export default function TypePills({
  selected,
  onToggle,
  className,
}: TypePillsProps) {
  return (
    <nav
      aria-label="Type filters"
      className={
        (className ? className + " " : "") +
        "flex flex-wrap justify-center gap-2 mt-4"
      }
    >
      {TYPES.map((t) => {
        const isOn = selected.includes(t);
        const label = t.charAt(0).toUpperCase() + t.slice(1);
        return (
          <button
            key={t}
            type="button"
            aria-pressed={isOn}
            onClick={() => onToggle(t)}
            title={label}
            className={[BASE, TYPE_BG[t], isOn ? SELECTED : ""].join(" ")}
          >
            {label}
          </button>
        );
      })}
    </nav>
  );
}
