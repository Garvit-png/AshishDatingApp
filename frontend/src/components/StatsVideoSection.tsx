"use client";

import { useEffect, useRef, useCallback } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import LazyVideo from "./LazyVideo";

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
  const layoutRef = useRef({ offsetTop: 0, height: 0, windowH: 0 });

  useEffect(() => {
    const updateLayout = () => {
      if (sectionRef.current) {
        layoutRef.current = {
          offsetTop: sectionRef.current.offsetTop,
          height: sectionRef.current.offsetHeight,
          windowH: window.innerHeight,
        };
      }
    };
    
    // Slight delay to ensure DOM is fully laid out
    const timeout = setTimeout(updateLayout, 100);
    window.addEventListener("resize", updateLayout);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", updateLayout);
    };
  }, []);
  const onScroll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      const section = sectionRef.current;
      const videoWrapper = videoWrapperRef.current;
      const statsOverlay = statsOverlayRef.current;
      if (!section || !videoWrapper || !statsOverlay) return;

      const { offsetTop, height, windowH } = layoutRef.current;
      if (height === 0) return;

      const scrolled = window.scrollY - offsetTop;
      const total = height - windowH;
      const p = Math.min(Math.max(scrolled / total, 0), 1);

      const videoScale = 0.4 + p * 0.45;
      const statsOpacity = Math.min(Math.max((p - 0.5) / 0.25, 0), 1);
      const statsVisible = p >= 0.5;

      // GPU accelerated properties only (transform and opacity)
      videoWrapper.style.transform = `scale(${videoScale}) translateZ(0)`;
      statsOverlay.style.opacity = `${statsOpacity}`;
      statsOverlay.style.transform = `translateY(${statsVisible ? 0 : 20}px) translateZ(0)`;
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
            // Removed heavy box-shadow that causes repaints during scale
          }}
        >
          {/* Brightness Overlay (Hardware Accelerated instead of CSS filter on video) */}
          <div className="absolute inset-0 bg-white/10 z-10 pointer-events-none mix-blend-overlay" />
          
          {/* Video */}
          <LazyVideo
            src="/stats.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-12 w-full justify-items-center">
              {stats.map((stat, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <span
                    className="font-black text-[#ff0000] leading-none drop-shadow-[0_0_20px_rgba(255,0,0,0.8)]"
                    style={{ fontSize: "clamp(2rem, 5vw, 5rem)" }}
                  >
                    {stat.value}
                  </span>
                  <span className="text-white/90 text-xs sm:text-lg font-medium tracking-widest uppercase text-center mt-2 sm:mt-0">
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
