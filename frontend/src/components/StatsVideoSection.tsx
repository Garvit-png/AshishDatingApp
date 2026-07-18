"use client";

import { useEffect, useRef, useCallback } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

const stats = [
  { value: "4.9★", label: "Average Rating" },
  { value: "1L+", label: "Members Transformed" },
  { value: "95%", label: "Success Rate" },
  { value: "50+", label: "Countries Reached" },
];

export default function StatsVideoSection() {
  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const statsOverlayRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  const onScroll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      const section = sectionRef.current;
      const videoWrapper = videoWrapperRef.current;
      const statsOverlay = statsOverlayRef.current;
      if (!section || !videoWrapper || !statsOverlay) return;

      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrolled = -rect.top;
      const total = sectionHeight - windowHeight;
      const p = Math.min(Math.max(scrolled / total, 0), 1);

      const videoScale = 0.4 + p * 0.45;
      const borderRadius = Math.max(24 - p * 16, 8);
      const statsOpacity = Math.min(Math.max((p - 0.5) / 0.25, 0), 1);
      const statsVisible = p >= 0.5;

      videoWrapper.style.transform = `scale(${videoScale})`;
      videoWrapper.style.borderRadius = `${borderRadius}px`;
      statsOverlay.style.opacity = `${statsOpacity}`;
      statsOverlay.style.transform = `translateY(${statsVisible ? 0 : 20}px)`;
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
    <div ref={sectionRef} className="relative bg-black" style={{ height: isMobile ? "200vh" : "300vh" }}>
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">

        {/* Video + Stats overlay wrapper */}
        <div
          ref={videoWrapperRef}
          className="relative"
          style={{
            width: "85vw",
            maxWidth: 960,
            aspectRatio: "16/9",
            transform: "scale(0.4)",
            transformOrigin: "center center",
            borderRadius: "24px",
            overflow: "hidden",
            willChange: "transform",
            boxShadow: "0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.08)",
          }}
        >
          {/* Video */}
          <video
            src="/stats.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            className="w-full h-full object-cover"
            style={{ filter: "brightness(1.3)" }}
          />

          {/* Stats overlaid on video */}
          <div
            ref={statsOverlayRef}
            className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-8"
            style={{
              opacity: 0,
              transform: "translateY(20px)",
              willChange: "opacity, transform",
              transition: "opacity 0.4s ease, transform 0.4s ease",
            }}
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12 w-full justify-items-center">
              {stats.map((stat, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <span
                    className="font-black text-[#ff0000] leading-none drop-shadow-[0_0_20px_rgba(255,0,0,0.8)]"
                    style={{ fontSize: "clamp(2.8rem, 6.5vw, 5rem)" }}
                  >
                    {stat.value}
                  </span>
                  <span className="text-white/90 text-sm sm:text-lg font-medium tracking-widest uppercase text-center">
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
