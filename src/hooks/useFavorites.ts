import { useEffect, useState } from "react";

const KEY = "favorites";

export function useFavorites() {
  const [ids, setIds] = useState<number[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(KEY);
    if (raw) {
      try {
        setIds(JSON.parse(raw));
      } catch {
        setIds([]);
      }
    }
    setReady(true);
  }, []);

  const add = (id: number) => {
    setIds((prev) => {
      const next = prev.includes(id) ? prev : [...prev, id];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  };

  const remove = (id: number) => {
    setIds((prev) => {
      const next = prev.filter((x) => x !== id);
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  };

  return { ids, add, remove, ready };
}
