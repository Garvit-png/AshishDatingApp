"use client";

import { useRef, useState } from "react";
import { useContent } from "@/content/ContentContext";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import LazyVideo from "./LazyVideo";
import CountUp from "./motion/CountUp";

export default function StatsVideoSection() {
  const { content, asset } = useContent();
  const { video, items } = content.stats;
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [counting, setCounting] = useState(false);

  const sectionRef = useScrollProgress<HTMLDivElement>((p) => {
    if (videoWrapperRef.current) {
      videoWrapperRef.current.style.transform = `scale(${0.4 + p * 0.6})`;
      videoWrapperRef.current.style.borderRadius = `${24 - p * 12}px`;
    }
    const statsOpacity = Math.min(Math.max((p - 0.45) / 0.25, 0), 1);
    if (statsRef.current) {
      statsRef.current.style.opacity = `${statsOpacity}`;
      statsRef.current.style.transform = `translateY(${(1 - statsOpacity) * 24}px)`;
    }
    if (statsOpacity > 0.2) setCounting(true);
  });

  return (
    <div ref={sectionRef} className="relative bg-black h-[200vh] md:h-[300vh]">
      <div className="sticky top-0 h-[100svh] flex items-center justify-center overflow-hidden">
        <div
          ref={videoWrapperRef}
          className="relative w-[92vw] md:w-[85vw] max-w-[1100px] aspect-[4/5] sm:aspect-video overflow-hidden will-change-transform"
          style={{ transform: "scale(0.4)", borderRadius: 24 }}
        >
          <LazyVideo src={asset(video)} autoPlay muted loop playsInline className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/45" />

          <div ref={statsRef} className="absolute inset-0 flex items-center justify-center px-6" style={{ opacity: 0 }}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-8 gap-x-4 sm:gap-12 w-full justify-items-center">
              {items.map((stat, i) => (
                <div key={i} className="flex flex-col items-center gap-1 text-center">
                  <span className="font-black text-accent leading-none tabular-nums drop-shadow-[0_0_24px_var(--accent-color)] text-[clamp(2.2rem,7vw,5rem)]">
                    <CountUp value={stat.value} start={counting} />
                  </span>
                  <span className="text-white/90 text-[10px] sm:text-sm lg:text-base font-semibold tracking-[0.2em] uppercase mt-2">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
