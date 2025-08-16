"use client";
import { useEffect, useRef } from "react";

export function useInfiniteScroll(
  onHitBottom: () => Promise<unknown> | unknown,
  canLoad: boolean,
  waitMs = 2000 // mozna zmienic ile czekac do przejscia na kolejna strone
) {
  const ref = useRef<HTMLDivElement | null>(null);
  const lockRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        // nie rób nic jeśli nie widać, nie wolno ładować albo już w toku
        if (!entry.isIntersecting || !canLoad || lockRef.current) return;

        lockRef.current = true;

        // opóźnienie
        if (timerRef.current) window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(async () => {
          try {
            await onHitBottom();
          } finally {
            // krótki cooldown żeby nie odpaliło 2x z tej samej klatki
            setTimeout(() => (lockRef.current = false), 200);
          }
        }, waitMs) as unknown as number;
      },
      { root: null, rootMargin: "500px 0px", threshold: 0.01 } // prefetch wcześniej
    );

    io.observe(el);
    return () => {
      io.disconnect();
      if (timerRef.current) window.clearTimeout(timerRef.current);
      lockRef.current = false;
    };
  }, [canLoad, onHitBottom, waitMs]);

  return ref;
}
