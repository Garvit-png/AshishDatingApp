"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { value: "4.9★", label: "Average Rating" },
  { value: "1L+", label: "Members Transformed" },
  { value: "95%", label: "Success Rate" },
  { value: "50+", label: "Countries Reached" },
];

export default function StatsVideoSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrolled = -rect.top;
      const total = sectionHeight - windowHeight;
      const p = Math.min(Math.max(scrolled / total, 0), 1);
      setProgress(p);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Video scale: starts at 0.4, grows to 0.85 max
  const videoScale = 0.4 + progress * 0.45;

  // Border radius: starts at 24px, shrinks slightly as video grows
  const borderRadius = Math.max(24 - progress * 16, 8);

  // Stats fade in after 50% scroll progress
  const statsOpacity = Math.min(Math.max((progress - 0.5) / 0.25, 0), 1);
  const statsVisible = progress >= 0.5;

  return (
    <div ref={sectionRef} className="relative bg-black" style={{ height: "300vh" }}>
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">

        {/* Video + Stats overlay wrapper */}
        <div
          className="relative will-change-transform"
          style={{
            width: "85vw",
            maxWidth: 960,
            aspectRatio: "16/9",
            transform: `scale(${videoScale})`,
            transformOrigin: "center center",
            transition: "transform 0.05s linear",
            borderRadius: `${borderRadius}px`,
            overflow: "hidden",
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
            className="w-full h-full object-cover"
            style={{ filter: "brightness(1.3)" }}
          />

          {/* Stats overlaid on video — centered */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-8"
            style={{
              opacity: statsOpacity,
              transform: `translateY(${statsVisible ? 0 : 20}px)`,
              transition: "opacity 0.4s ease, transform 0.4s ease",
            }}
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12 w-full justify-items-center">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-1"
                  style={{
                    opacity: statsOpacity,
                    transform: `translateY(${statsVisible ? 0 : 16}px)`,
                    transition: `opacity 0.5s ease ${i * 80}ms, transform 0.5s ease ${i * 80}ms`,
                  }}
                >
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

        {/* Scroll hint */}
        {progress < 0.05 && (
          <p className="absolute bottom-8 text-white/30 text-xs tracking-widest uppercase animate-bounce">
            scroll
          </p>
        )}
      </div>
    </div>
  );
}
