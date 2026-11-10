"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useContent } from "@/content/ContentContext";
import Reveal from "./motion/Reveal";

export default function TestimonialsSection() {
  const { content, asset } = useContent();
  const t = content.testimonials;
  const shots = t.screenshots;
  const total = shots.length;
  const interval = Math.max(1.5, t.autoplaySeconds) * 1000;

  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const dragX = useRef<number | null>(null);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.25 });
    if (sectionRef.current) io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total]);

  useEffect(() => {
    if (!inView || paused || total < 2) return;
    const id = setInterval(next, interval);
    return () => clearInterval(id);
  }, [inView, paused, next, total, interval, current]);

  if (total === 0) return null;
  const active = current % total;

  const offsetOf = (idx: number) => {
    let d = idx - active;
    if (d > total / 2) d -= total;
    if (d < -total / 2) d += total;
    return d;
  };

  return (
    <section id="testimonials" ref={sectionRef} className="relative bg-black py-20 sm:py-28 px-4 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-[#7f0000]/20 blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <Reveal as="p" className="text-accent text-[11px] font-bold tracking-[0.4em] uppercase mb-4">{t.eyebrow}</Reveal>
          <Reveal as="h2" delay={80} className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4">{t.heading}</Reveal>
          <Reveal as="p" delay={160} className="text-white/50 text-base sm:text-lg max-w-lg mx-auto">{t.subheading}</Reveal>
        </div>

        <div
          className="relative flex items-center justify-center select-none touch-pan-y"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onPointerDown={(e) => (dragX.current = e.clientX)}
          onPointerUp={(e) => {
            if (dragX.current === null) return;
            const dx = e.clientX - dragX.current;
            dragX.current = null;
            if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
          }}
        >
          <NavBtn onClick={prev} side="left" />

          <div className="relative w-full h-[440px] sm:h-[520px] flex items-center justify-center" style={{ perspective: 1200 }}>
            {shots.map((src, idx) => {
              const o = offsetOf(idx);
              if (Math.abs(o) > 2) return null;
              const center = o === 0;
              return (
                <button
                  key={src + idx}
                  onClick={() => !center && setCurrent(idx)}
                  aria-label={center ? `Testimonial ${idx + 1}` : `Show testimonial ${idx + 1}`}
                  className="absolute w-[230px] sm:w-[290px] md:w-[320px] aspect-[9/16] max-h-full rounded-3xl overflow-hidden border transition-all duration-700 ease-out-expo"
                  style={{
                    transform: `translateX(${o * 62}%) translateZ(${center ? 0 : -160 * Math.abs(o)}px) rotateY(${o * -18}deg)`,
                    opacity: center ? 1 : Math.abs(o) === 1 ? 0.45 : 0,
                    zIndex: 10 - Math.abs(o),
                    borderColor: center ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.05)",
                    boxShadow: center ? "0 30px 80px -20px color-mix(in srgb, var(--accent-color) 45%, transparent)" : "none",
                    filter: center ? "none" : "blur(1.5px) saturate(0.6)",
                  }}
                >
                  <Image src={asset(src)} alt="" fill sizes="(max-width: 640px) 230px, 320px" className="object-cover object-top pointer-events-none" draggable={false} />
                </button>
              );
            })}
          </div>

          <NavBtn onClick={next} side="right" />
        </div>

        {total > 1 && (
          <div className="mt-10 flex flex-col items-center gap-4">
            <div className="w-40 h-0.5 bg-white/10 rounded-full overflow-hidden">
              {inView && !paused && (
                <div key={active} className="h-full origin-left bg-accent" style={{ animation: `progress ${interval}ms linear forwards` }} />
              )}
            </div>
            <div className="flex justify-center gap-2">
              {shots.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${i === active ? "w-7 bg-accent" : "w-1.5 bg-white/20 hover:bg-white/40"}`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function NavBtn({ onClick, side }: { onClick: () => void; side: "left" | "right" }) {
  return (
    <button
      onClick={onClick}
      aria-label={side === "left" ? "Previous" : "Next"}
      className={`absolute ${side === "left" ? "left-0 sm:left-4" : "right-0 sm:right-4"} z-20 w-11 h-11 rounded-full bg-black/60 border border-white/15 hover:border-white/40 hover:bg-white hover:text-black grid place-items-center text-white transition-all hover:scale-110 active:scale-95 backdrop-blur`}
    >
      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
        <path d={side === "left" ? "M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z" : "M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"} />
      </svg>
    </button>
  );
}
