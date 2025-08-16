export type PokeListItem = { name: string; url: string };
export type PokeList = { results: PokeListItem[]; next: string | null };

export type PokeType =
  | "normal"
  | "fire"
  | "water"
  | "electric"
  | "grass"
  | "ice"
  | "fighting"
  | "poison"
  | "ground"
  | "flying"
  | "psychic"
  | "bug"
  | "rock"
  | "ghost"
  | "dragon"
  | "dark"
  | "steel"
  | "fairy";

export type Pokemon = {
  id: number;
  name: string;
  sprite: string;
  types: PokeType[];
};

const API = "https://pokeapi.co/api/v2";

export async function fetchList(limit = 24, offset = 0): Promise<PokeList> {
  const r = await fetch(`${API}/pokemon?limit=${limit}&offset=${offset}`);
  if (!r.ok) throw new Error("List fetch failed");
  return r.json();
}

export async function fetchPokemon(name: string): Promise<Pokemon> {
  const r = await fetch(`${API}/pokemon/${name}`);
  if (!r.ok) throw new Error("Pokemon fetch failed");
  const j = await r.json();
  return {
    id: j.id,
    name: j.name,
    sprite:
      j.sprites.other["official-artwork"].front_default ??
      j.sprites.front_default,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    types: j.types.map((t: any) => t.type.name),
  };
}

export async function fetchNamesByTypes(types: PokeType[]): Promise<string[]> {
  if (!types.length) return [];

  // Pobierz listę nazw dla każdego typu
  const lists = await Promise.all(
    types.map(async (t) => {
      const r = await fetch(`${API}/type/${t}`);
      if (!r.ok) throw new Error(`Type fetch failed: ${t}`);
      const j = await r.json();
      // j.pokemon: [{ pokemon: { name, url }, slot }]
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return j.pokemon.map((p: any) => p.pokemon.name as string);
    })
  );

  // AND logic (przecięcie wielu typów)
  const [first, ...rest] = lists;
  const set = new Set(first);
  for (const arr of rest) {
    for (const name of Array.from(set)) {
      if (!arr.includes(name)) set.delete(name);
    }
  }

  // Stabilna kolejność
  return Array.from(set).sort();
}
