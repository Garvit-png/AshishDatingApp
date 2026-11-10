"use client";

import { useEffect, useState } from "react";

/** Animates the number inside text like "95%", "1L+", "4.9★" when `start` becomes true. */
export default function CountUp({ value, start = true, duration = 1600 }: { value: string; start?: boolean; duration?: number }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!start) return;
    const t0 = performance.now();
    let raf = requestAnimationFrame(function tick(now) {
      const k = Math.min(1, (now - t0) / duration);
      setProgress(1 - Math.pow(1 - k, 4));
      if (k < 1) raf = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [start, duration]);

  const match = value.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
  if (!match || progress >= 1) return <>{value}</>;
  const [, pre, num, post] = match;
  const decimals = num.includes(".") ? num.split(".")[1].length : 0;
  return <>{`${pre}${(parseFloat(num) * progress).toFixed(decimals)}${post}`}</>;
}
