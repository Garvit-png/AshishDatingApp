"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function EyeRollSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.2);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const containerH = container.offsetHeight;
      const windowH = window.innerHeight;

      // scrolled distance inside the sticky container
      // When rect.top === 0, progress = 0. When we've scrolled containerH - windowH, progress = 1
      const scrolled = -rect.top;
      const scrollable = containerH - windowH;
      const p = Math.max(0, Math.min(1, scrolled / scrollable));

      setProgress(p);
      // Scale from 0.2 to 0.85
      setScale(0.2 + p * 0.65);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    /* Tall scroll container — 300vh gives room for the animation */
    <div ref={containerRef} className="relative w-full" style={{ height: "300vh" }}>
      {/* Sticky panel that pins in place while user scrolls */}
      <div className="sticky top-0 w-full h-screen bg-black flex flex-col items-center justify-center overflow-hidden">

        {/* BIG RED BACKGROUND TEXT */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
          <span
            className="font-black uppercase text-[#ff2222] leading-none tracking-tighter whitespace-nowrap"
            style={{ fontSize: "18vw", opacity: 0.15 + progress * 0.1 }}
          >
            DONT STOP
          </span>
        </div>

        {/* Eye Roll Photo — scales on scroll */}
        <div
          className="relative z-10"
          style={{
            transform: `scale(${scale})`,
            transition: "transform 0.08s linear",
            width: "60vw",
            maxWidth: "700px",
          }}
        >
          <div className="relative overflow-hidden rounded-2xl shadow-2xl shadow-[#ff1a1a]/30">
            <Image
              src="/eyeroll.webp"
              alt="Eye Roll"
              width={700}
              height={700}
              className="object-contain w-full h-auto block"
              priority
            />
          </div>
        </div>

        {/* Scroll indicator — fades out as you scroll */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
          style={{ opacity: 1 - progress * 3 }}
        >
          <span className="text-white/50 uppercase tracking-[0.4em] text-xs font-light">scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent animate-bounce" />
        </div>
      </div>
    </div>
  );
}
