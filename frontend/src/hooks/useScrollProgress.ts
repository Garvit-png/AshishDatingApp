"use client";

import { useEffect, useRef } from "react";

/**
 * Calls `onProgress(p)` (0 → 1) while a tall "sticky" section scrolls past.
 * Measures with getBoundingClientRect every frame, so it stays correct even
 * when images above it load late or the window is resized.
 */
export function useScrollProgress<T extends HTMLElement>(onProgress: (p: number) => void) {
  const ref = useRef<T>(null);
  const cb = useRef(onProgress);
  useEffect(() => {
    cb.current = onProgress;
  });

  useEffect(() => {
    let raf = 0;
    let visible = true;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      cb.current(p);
    };
    const onScroll = () => {
      if (visible && !raf) raf = requestAnimationFrame(update);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) onScroll();
    });
    if (ref.current) io.observe(ref.current);
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return ref;
}
