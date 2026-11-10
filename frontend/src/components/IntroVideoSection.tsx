"use client";

import { useEffect, useRef } from "react";
import { useContent } from "@/content/ContentContext";

export default function IntroVideoSection() {
  const { content, asset } = useContent();
  const { eyebrow, name, scrollHint, video } = content.intro;
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // Pause when off-screen to save battery / CPU
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()));
    io.observe(v);

    // Gentle parallax: text drifts up & fades as you scroll away
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const p = Math.min(1, window.scrollY / window.innerHeight);
        if (contentRef.current) {
          contentRef.current.style.transform = `translate3d(0, ${p * -80}px, 0) scale(${1 - p * 0.08})`;
          contentRef.current.style.opacity = `${1 - p * 1.2}`;
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const words = name.trim().split(/\s+/);
  const offsets = words.map((_, i) => words.slice(0, i).join("").length + i);

  return (
    <section className="relative w-full h-[100svh] overflow-hidden bg-black flex flex-col items-center justify-center isolate">
      <div className="absolute inset-0 pointer-events-none" style={{ contain: "strict" }}>
        <video
          ref={videoRef}
          key={video}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute top-1/2 left-1/2 object-cover"
          style={{
            width: "100svh",
            height: "100vw",
            transform: "translate(-50%, -50%) rotate(90deg)",
          }}
        >
          <source src={asset(video)} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.85)_100%)]" />
      </div>

      <div ref={contentRef} className="relative z-20 text-center w-full flex flex-col items-center justify-center h-full pt-16 px-4 md:px-6 will-change-transform">
        <span className="animate-slide-up text-sm sm:text-lg md:text-3xl font-light text-white uppercase tracking-[0.4em] mb-3 md:mb-5" style={{ animationDelay: "0.1s" }}>
          {eyebrow}
        </span>
        <h1 aria-label={name} className="text-[12.5vw] md:text-[12vw] leading-[0.9] font-black text-accent uppercase tracking-tighter animate-text-glow w-full">
          {/* Letters animate one by one, but a word never breaks in the middle */}
          {words.map((word, w) => (
            <span key={w} aria-hidden className="inline-block whitespace-nowrap">
              {Array.from(word).map((ch, i) => (
                <span key={i} className="inline-block animate-slide-up" style={{ animationDelay: `${0.25 + (offsets[w] + i) * 0.045}s` }}>
                  {ch}
                </span>
              ))}
              {w < words.length - 1 && <span className="inline-block w-[0.22em]" />}
            </span>
          ))}
        </h1>
      </div>

      <div className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 animate-slide-up" style={{ animationDelay: "1s" }}>
        <p className="text-white/90 font-medium tracking-[0.25em] text-[10px] sm:text-sm uppercase text-center px-4">{scrollHint}</p>
        <div className="w-6 h-10 rounded-full border-2 border-white/40 flex justify-center pt-2">
          <span className="w-1 h-2 rounded-full bg-accent animate-bounce" />
        </div>
      </div>
    </section>
  );
}
