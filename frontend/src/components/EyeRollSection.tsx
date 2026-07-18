"use client";

import { useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function EyeRollSection() {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  const onScroll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      const container = containerRef.current;
      const image = imageRef.current;
      const text = textRef.current;
      const indicator = indicatorRef.current;
      if (!container || !image || !text || !indicator) return;

      const rect = container.getBoundingClientRect();
      const containerH = container.offsetHeight;
      const windowH = window.innerHeight;

      const scrolled = -rect.top;
      const scrollable = containerH - windowH;
      const p = Math.max(0, Math.min(1, scrolled / scrollable));

      const scale = 0.2 + p * 0.65;
      image.style.transform = `scale(${scale}) translateZ(0)`;
      text.style.opacity = `${0.80 + p * 0.1}`;
      indicator.style.opacity = `${1 - p * 3}`;
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [onScroll]);

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: isMobile ? "200vh" : "300vh" }}>
      <div className="sticky top-0 w-full h-screen bg-black flex flex-col items-center justify-center overflow-hidden">

        {/* BIG RED BACKGROUND TEXT */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
          <span
            ref={textRef}
            className="font-black uppercase text-[#ff0000] leading-none tracking-tighter whitespace-nowrap"
            style={{ fontSize: isMobile ? "22vw" : "18vw", opacity: 0.8, willChange: "opacity" }}
          >
            DONT STOP
          </span>
        </div>

        {/* Eye Roll Photo — scales on scroll */}
        <div
          ref={imageRef}
          className="relative z-10"
          style={{
            transform: "scale(0.2)",
            willChange: "transform",
            width: "60vw",
            maxWidth: "700px",
          }}
        >
          <div className="relative overflow-hidden rounded-2xl">
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

        {/* Scroll indicator */}
        <div
          ref={indicatorRef}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
          style={{ willChange: "opacity" }}
        >
          <span className="text-white/50 uppercase tracking-[0.4em] text-xs font-light">scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent animate-bounce" />
        </div>
      </div>
    </div>
  );
}

