import { useInfiniteQuery, useQueries } from "@tanstack/react-query";
import {
  fetchList,
  fetchPokemon,
  fetchNamesByTypes,
  type Pokemon,
  type PokeType,
} from "@/lib/pokeapi";

const API = "https://pokeapi.co/api/v2";

export function usePokemonInfinite(q: string, types: PokeType[]) {
  return useInfiniteQuery({
    queryKey: ["pokemon-list", { q, types: [...types].sort() }],
    queryFn: async ({ pageParam = 0 }) => {
      const offset = Number(pageParam) || 0;

      // Search po nazwie, pojedynczy wynik
      if (q && q.trim()) {
        const name = q.trim().toLowerCase();
        return {
          results: [{ name, url: `${API}/pokemon/${name}` }],
          next: null as string | null,
          nextOffset: null as number | null,
        };
      }

      // Filtry typów klientowe stronicowanie po 24
      if (types.length > 0) {
        const names = await fetchNamesByTypes(types);
        const pageSize = 24;
        const slice = names.slice(offset, offset + pageSize);

        return {
          results: slice.map((name) => ({
            name,
            url: `${API}/pokemon/${name}`,
          })),
          next: null as string | null,
          nextOffset:
            offset + pageSize < names.length ? offset + pageSize : null,
        };
      }

      // Bez filtrów
      return fetchList(24, offset);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getNextPageParam: (last: any) => {
      // Tryb z filtrami albo search
      if (typeof last?.nextOffset === "number") return last.nextOffset;

      // Tryb bez filtrów PokeAPI zwraca URL
      const nextUrl = last?.next as string | null;
      if (!nextUrl) return undefined;
      const url = new URL(nextUrl);
      return Number(url.searchParams.get("offset") ?? 0);
    },
    initialPageParam: 0,
  });
}

/** Batch detali (bez łamania zasad hooków) */
export function usePageDetails(names: string[]) {
  return useQueries({
    queries: names.map((name) => ({
      queryKey: ["pokemon", name],
      queryFn: () => fetchPokemon(name),
      staleTime: 1000 * 60 * 5,
      retry: false, // jak wpiszesz złą nazwę → nie zapętlaj prób
    })),
  });
}

/** Lokalny filtr */
export function filterPokemon(
  list: Pokemon[],
  q: string,
  selected: PokeType[]
) {
  const qq = q.trim().toLowerCase();
  return list.filter(
    (p) =>
      (qq ? p.name.includes(qq) : true) &&
      (selected.length ? selected.every((t) => p.types.includes(t)) : true)
  );
}
