"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import testimonialsData from "@/data/testimonials.json";

interface TestimonialsData {
  enabled: boolean;
  heading: string;
  subheading: string;
  screenshots: string[];
}

const data = testimonialsData as TestimonialsData;

const AUTO_PLAY_INTERVAL = 3000; // 3 seconds

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev" | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = data.screenshots.length;

  // Intersection observer — only autoplay when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const next = useCallback(() => {
    setDirection("next");
    setCurrent(c => (c + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setDirection("prev");
    setCurrent(c => (c - 1 + total) % total);
  }, [total]);

  const goTo = useCallback((index: number) => {
    setDirection(index > current ? "next" : "prev");
    setCurrent(index);
  }, [current]);

  // Auto-play
  useEffect(() => {
    if (!inView || paused || total < 2) return;
    timerRef.current = setInterval(next, AUTO_PLAY_INTERVAL);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [inView, paused, next, total]);

  if (!data.enabled || total === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="relative bg-black py-24 px-4 overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-[#7f0000]/8 blur-[140px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header */}
        <div className={`text-center mb-14 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <p className="text-[#7f0000] text-[10px] font-bold tracking-[4px] uppercase mb-4">TESTIMONIALS</p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-3">
            {data.heading}
          </h2>
          <p className="text-[#555] text-base max-w-lg mx-auto">{data.subheading}</p>
        </div>

        {/* Slider */}
        <div
          className="relative flex items-center justify-center"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Prev button */}
          <button
            onClick={prev}
            className="absolute left-0 sm:left-2 z-20 w-10 h-10 rounded-full bg-black/60 border border-white/10 hover:border-white/30 flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 backdrop-blur-sm"
            aria-label="Previous"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z"/>
            </svg>
          </button>

          {/* Cards track */}
          <div className="w-full overflow-hidden px-12 sm:px-16">
            <div className="relative h-[520px] flex items-center justify-center">
              {/* Render all cards with absolute positioning for smooth transitions */}
              {data.screenshots.map((screenshot, idx) => {
                const offset = idx === current ? 0 : idx === (current - 1 + total) % total ? -1 : idx === (current + 1) % total ? 1 : null;
                if (offset === null) return null;
                
                const isCenter = offset === 0;
                
                return (
                  <div
                    key={idx}
                    onClick={() => !isCenter && goTo(idx)}
                    className={`absolute transition-all duration-700 ease-out cursor-pointer select-none will-change-transform rounded-2xl overflow-hidden border ${
                      isCenter
                        ? "w-[260px] sm:w-[300px] md:w-[340px] border-white/20 shadow-2xl shadow-[#7f0000]/20 scale-100 opacity-100 z-10"
                        : "w-[160px] sm:w-[200px] md:w-[240px] border-white/5 scale-[0.85] opacity-40 hover:opacity-60 hover:scale-90 z-0"
                    }`}
                    style={{ 
                      aspectRatio: "9/16", 
                      maxHeight: "520px",
                      transform: `translateX(${offset * 100}%) scale(${isCenter ? 1 : 0.85})`,
                      filter: isCenter ? "none" : "blur(2px)",
                    }}
                  >
                    <Image
                      src={screenshot}
                      alt={`Testimonial ${idx + 1}`}
                      fill
                      className="object-cover object-top"
                      draggable={false}
                      priority={Math.abs(offset) <= 1}
                    />
                    {/* Gradient overlay on side cards */}
                    {!isCenter && (
                      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
                    )}
                    {/* Red glow on center card */}
                    {isCenter && (
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute inset-0 rounded-2xl ring-1 ring-[#7f0000]/30" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Next button */}
          <button
            onClick={next}
            className="absolute right-0 sm:right-2 z-20 w-10 h-10 rounded-full bg-black/60 border border-white/10 hover:border-white/30 flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 backdrop-blur-sm"
            aria-label="Next"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
            </svg>
          </button>
        </div>

        {/* Dot indicators with progress bar */}
        {total > 1 && (
          <div className="mt-10">
            {/* Progress bar for current slide */}
            {!paused && inView && (
              <div className="max-w-xs mx-auto mb-4 h-0.5 bg-[#222] rounded-full overflow-hidden">
                <div 
                  key={current}
                  className="h-full bg-gradient-to-r from-[#7f0000] to-white"
                  style={{
                    animation: `progress ${AUTO_PLAY_INTERVAL}ms linear forwards`
                  }}
                />
              </div>
            )}
            
            {/* Dot navigation */}
            <div className="flex justify-center gap-2">
              {data.screenshots.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`rounded-full transition-all duration-500 ease-out ${
                    i === current 
                      ? "w-6 h-1.5 bg-gradient-to-r from-[#7f0000] to-white shadow-lg shadow-[#7f0000]/30" 
                      : "w-1.5 h-1.5 bg-[#333] hover:bg-[#555] hover:scale-125"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes progress {
            from { width: 0%; }
            to { width: 100%; }
          }
        `}</style>
      </div>
    </section>
  );
}