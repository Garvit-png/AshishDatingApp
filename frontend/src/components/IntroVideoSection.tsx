"use client";

import LazyVideo from "./LazyVideo";

export default function IntroVideoSection() {

  return (
    <section
      className="relative w-full h-screen overflow-hidden bg-black flex flex-col items-center justify-center"
      style={{ contain: "layout style paint", isolation: "isolate" }}
    >
      
      {/* Background — Video everywhere */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{ contain: "strict", isolation: "isolate" }}
      >
        <LazyVideo 
          autoPlay 
          muted 
          loop 
          playsInline
          className="absolute top-1/2 left-1/2 object-cover"
          style={{
            width: "100vh",
            height: "100vw",
            transform: "translate(-50%, -50%) rotate(90deg) translateZ(0)",
            willChange: "transform",
            backfaceVisibility: "hidden",
          }}
        >
          <source src="/shuru.mp4" type="video/mp4" />
        </LazyVideo>
        <div className="absolute inset-0 bg-black/60 z-10" />
      </div>

      {/* Main Content */}
      <div className="relative z-20 text-center w-full flex flex-col items-center justify-center h-full pt-16 px-4 md:px-6">
        <div className="opacity-0 animate-slide-up flex flex-col items-center w-full" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
          <span className="text-lg md:text-3xl font-light text-white uppercase tracking-[0.3em] mb-2 md:mb-4">
            Introducing
          </span>
          <h1 className="text-[12.5vw] md:text-[13vw] leading-[0.9] font-black text-[#ff1a1a] uppercase tracking-tighter animate-text-glow w-full">
            Ashish Chhipa
          </h1>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 opacity-0 animate-slide-up" style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}>
        <p className="text-white font-medium tracking-widest text-xs sm:text-sm uppercase">
          Scroll to Unlock Your Beast
        </p>
        <div className="animate-bounce mt-2">
          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-[#ff1a1a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}
