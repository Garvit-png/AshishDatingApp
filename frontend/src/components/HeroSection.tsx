"use client";

import Image from "next/image";
import Link from "next/link";
import { useIsMobile } from "@/hooks/useIsMobile";
import dynamic from "next/dynamic";

const Silk = dynamic(() => import("./Silk"), { ssr: false });

export default function HeroSection() {
  const isMobile = useIsMobile();

  return (
    <section className="relative min-h-screen bg-black overflow-hidden flex items-center pt-16">
      {/* Background — Silk on desktop, gradient on mobile */}
      {isMobile ? (
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a0000] via-black to-[#0d0000]" />
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background: "radial-gradient(ellipse at 30% 50%, #7f0000 0%, transparent 50%), radial-gradient(ellipse at 70% 30%, #330000 0%, transparent 50%)",
            }}
          />
        </div>
      ) : (
        <div className="absolute inset-0 z-0 opacity-100">
          <Silk speed={5} scale={1} color="#ff0000" noiseIntensity={1.5} rotation={0} />
        </div>
      )}

      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-transparent z-0 pointer-events-none" />

      <div className="relative z-10 w-full px-4 sm:px-8 lg:px-12 py-12 md:py-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">

          {/* LEFT — Text Content */}
          <div className="flex-1 w-full flex flex-col items-center lg:items-start text-center lg:text-left">

            {/* Main Headline */}
            <h1 className="text-[12vw] sm:text-[8vw] lg:text-[5.5vw] font-black text-white leading-[1.1] mb-4 md:mb-6 tracking-tighter w-full whitespace-nowrap flex flex-col gap-2 md:gap-4">
              <span className="block opacity-0 animate-slide-up" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
                Attract <span className="text-[#ff1a1a] animate-text-glow">Better.</span>
              </span>
              <span className="block opacity-0 animate-slide-up" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
                Date <span className="text-[#ff1a1a] animate-text-glow">Smarter.</span>
              </span>
              <span className="block opacity-0 animate-slide-up" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
                Build Lasting <span className="text-white">Love.</span>
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className="text-gray-300 font-light text-base sm:text-xl mb-8 md:mb-10 max-w-xl leading-relaxed opacity-0 animate-slide-up"
              style={{ animationDelay: "0.45s", animationFillMode: "forwards" }}
            >
              Join thousands of learners and take your career to the next level with our expert-led courses.
            </p>

            {/* CTA Button */}
            <div className="opacity-0 animate-slide-up" style={{ animationDelay: "0.55s", animationFillMode: "forwards" }}>
              <Link
                href="#courses"
                className="inline-flex items-center gap-2 bg-white/10 text-white font-medium px-6 py-3 md:px-8 md:py-4 rounded-full text-sm hover:bg-black hover:text-white hover:border-black transition-all duration-300 hover:scale-105 active:scale-95 border border-white/20"
              >
                Start Learning Now
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* RIGHT — Big Photo Card */}
          <div className="flex-1 flex justify-center lg:justify-end opacity-0 animate-slide-up" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
            <div className="relative w-[260px] sm:w-[380px] lg:w-[420px] h-[380px] sm:h-[540px] lg:h-[580px] rounded-3xl overflow-hidden shadow-2xl shadow-[#7f0000]/30 border border-white/10">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10 z-10 pointer-events-none" />
              <Image
                src="/ashish.jpeg"
                alt="Ashish Chhipa – Dating Coach"
                fill
                className="object-cover object-top"
                priority
              />
              {/* Bottom gradient on card */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/70 to-transparent z-10" />
              {/* Name tag on card */}
              <div className="absolute bottom-6 left-6 z-20">
                <p className="text-white font-bold text-xl sm:text-2xl leading-tight mb-1">Ashish Chhipa</p>
                <p className="text-[#ff1a1a] text-sm sm:text-base font-semibold tracking-wide">Dating Coach &amp; Mentor</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Scroll indicator - hidden on mobile */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex-col items-center gap-2 animate-bounce hidden md:flex">
        <div className="w-0.5 h-8 bg-white/30 rounded-full" />
        <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
      </div>

      {/* Bottom fade-to-black transition */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-black z-10 pointer-events-none" />
    </section>
  );
}
