"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const benefits = [
  "Approach any woman with zero hesitation",
  "Text conversations that build real attraction",
  "Read her psychology before she says a word",
  "Turn rejections into unshakeable confidence",
  "Land dates consistently — not just occasionally",
  "Build an identity women are naturally drawn to",
];

const avatarColors = ["#5a0000", "#3a0000", "#2a0000", "#4a0010", "#3a0020"];
const avatarInitials = ["R", "A", "S", "K", "M"];

export default function CoursesHero({ onScrollToCourses }: { onScrollToCourses: () => void }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      ref={ref}
      className="relative w-full min-h-screen bg-[#8B0000] overflow-x-hidden flex flex-col"
      style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
    >
      {/* ── Ambient overlays ── */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 0% 0%, rgba(0,0,0,0.35) 0%, transparent 60%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 100% 40% at 50% 100%, rgba(0,0,0,0.4) 0%, transparent 70%)" }} />
      </div>

      {/* ── Back button ── */}
      <div className="relative z-20 px-4 sm:px-10 lg:px-16 pt-5">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold transition-all duration-200 hover:gap-3"
          style={{ color: "rgba(255,220,220,0.85)" }}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          Back to Home
        </Link>
      </div>

      {/* ── Main content: stacks vertically on mobile, side-by-side on lg ── */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row items-stretch max-w-[1440px] mx-auto w-full px-4 sm:px-10 lg:px-16 pt-6 pb-8 lg:pt-2 lg:pb-0">

        {/* ════ LEFT SIDE ════ */}
        <div className="flex-none lg:w-[45%] flex flex-col justify-start py-4 lg:py-16 pr-0 lg:pr-12">

          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 self-start mb-5"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            <span
              className="text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full border"
              style={{
                color: "#fff",
                borderColor: "rgba(255,255,255,0.4)",
                background: "rgba(255,255,255,0.1)",
              }}
            >
              ✦ Limited Seats Available
            </span>
          </div>

          {/* Heading — no whitespace-nowrap on mobile, only lg+ */}
          <h1
            className="font-black text-white leading-[1.12] tracking-tight mb-5
              text-[1.75rem] sm:text-[2.2rem] lg:text-[2.8rem] xl:text-[3.2rem]
              lg:whitespace-nowrap"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.65s ease, transform 0.65s ease",
              transitionDelay: "80ms",
              textShadow: "0 2px 12px rgba(0,0,0,0.4)",
            }}
          >
            Build <span style={{ color: "#000", textShadow: "none" }}>Standards.</span>
            <br />
            Create <span style={{ color: "#000", textShadow: "none" }}>Attraction.</span>
            <br />
            Date With <span style={{ color: "#000", textShadow: "none" }}>Confidence.</span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-sm sm:text-base italic mb-6 leading-relaxed max-w-md"
            style={{
              color: "rgba(255,220,220,0.85)",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.65s ease, transform 0.65s ease",
              transitionDelay: "160ms",
            }}
          >
            The exact playbooks and courses that took men from awkward to magnetic — without fake pickup tactics.
          </p>

          {/* Benefits list */}
          <div
            className="mb-7 flex flex-col"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.65s ease, transform 0.65s ease",
              transitionDelay: "240ms",
            }}
          >
            {benefits.map((benefit, i) => (
              <div key={i}>
                <div className="flex items-center gap-3 py-2.5">
                  <span
                    className="flex-none w-5 h-5 rounded-full flex items-center justify-center"
                    style={{
                      background: "rgba(255,255,255,0.15)",
                      border: "1px solid rgba(255,255,255,0.4)",
                    }}
                  >
                    <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="text-white text-sm font-medium leading-snug" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>
                    {benefit}
                  </span>
                </div>
                {i < benefits.length - 1 && (
                  <div className="h-px" style={{ background: "rgba(255,255,255,0.12)" }} />
                )}
              </div>
            ))}
          </div>

          {/* CTA row */}
          <div
            className="flex flex-wrap items-center gap-3 mb-6"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.65s ease, transform 0.65s ease",
              transitionDelay: "340ms",
            }}
          >
            <button
              onClick={onScrollToCourses}
              className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white overflow-hidden w-full sm:w-auto justify-center"
              style={{
                background: "#000",
                border: "1px solid rgba(0,0,0,0.3)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
                transition: "box-shadow 0.25s ease, transform 0.2s ease",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 32px rgba(0,0,0,0.6)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.4)";
              }}
            >
              Explore All Courses
              <svg viewBox="0 0 16 16" className="w-4 h-4 fill-current transition-transform duration-200 group-hover:translate-x-0.5">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </button>

            <button
              className="group inline-flex items-center gap-2.5 text-sm font-semibold transition-colors duration-200"
              style={{ color: "rgba(255,220,220,0.9)" }}
            >
              <span
                className="w-9 h-9 rounded-full flex items-center justify-center pl-0.5"
                style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.25)" }}
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-white">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              Watch free preview
            </button>
          </div>

          {/* Social proof */}
          <div
            className="flex items-center gap-3"
            style={{
              opacity: visible ? 1 : 0,
              transition: "opacity 0.65s ease",
              transitionDelay: "420ms",
            }}
          >
            <div className="flex items-center">
              {avatarInitials.map((initial, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
                  style={{
                    background: avatarColors[i],
                    border: "2px solid rgba(255,255,255,0.3)",
                    marginLeft: i === 0 ? 0 : -10,
                    zIndex: avatarInitials.length - i,
                    position: "relative",
                  }}
                >
                  {initial}
                </div>
              ))}
            </div>
            <div>
              <p className="text-white text-sm font-semibold leading-tight" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}>
                1000+ Daily Hustlers
              </p>
              <p className="text-[10px]" style={{ color: "rgba(255,200,200,0.7)" }}>already enrolled</p>
            </div>
          </div>
        </div>

        {/* ════ RIGHT SIDE ════ */}
        <div
          className="flex-1 flex flex-col items-center justify-center relative pt-6 lg:pt-0"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
            transitionDelay: "200ms",
          }}
        >
          {/* Quote ABOVE portrait */}
          <div
            className="w-full text-center pb-4 relative z-10 px-4"
            style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif" }}
          >
            <div className="flex items-center justify-center gap-4 mb-3">
              <div className="h-px flex-1 max-w-[60px]" style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.5))" }} />
              <span className="text-[10px] font-bold tracking-[0.3em]" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-inter), Inter, sans-serif" }}>✦</span>
              <div className="h-px flex-1 max-w-[60px]" style={{ background: "linear-gradient(to left, transparent, rgba(255,255,255,0.5))" }} />
            </div>
            <p
              className="text-white text-xl sm:text-2xl lg:text-[2rem] font-light tracking-[0.06em] leading-snug"
              style={{ textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}
            >
              Stop Chasing.
            </p>
            <p
              className="text-2xl sm:text-3xl lg:text-[2.4rem] font-semibold tracking-[0.04em] mt-1"
              style={{ color: "#fff", textShadow: "0 0 24px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.4)" }}
            >
              Be The One To Be Chased.
            </p>
          </div>

          {/* Portrait */}
          <div className="relative flex items-center justify-center w-full">
            <div
              className="absolute inset-0 pointer-events-none z-0"
              style={{ background: "radial-gradient(ellipse 70% 80% at 50% 50%, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 50%, transparent 75%)" }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/bewho.jpg"
              alt="Ashish Chhipa"
              className="relative z-10 h-auto object-contain select-none
                w-[75vw] max-w-[300px]
                sm:w-[60vw] sm:max-w-[380px]
                lg:w-full lg:max-w-[480px]"
              style={{
                userSelect: "none",
                WebkitUserDrag: "none",
                borderRadius: "24px",
                filter: "drop-shadow(0 0 32px rgba(0,0,0,0.8)) drop-shadow(0 0 64px rgba(0,0,0,0.5))",
              } as React.CSSProperties}
              draggable={false}
            />
          </div>

          {/* Quote BELOW portrait */}
          <div
            className="w-full text-center pt-2 pb-6 relative z-10 px-4"
            style={{ fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif" }}
          >
            <div className="flex items-center justify-center gap-4 mt-2">
              <div className="h-px flex-1 max-w-[60px]" style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.4))" }} />
              <span className="text-xs italic font-medium tracking-widest" style={{ color: "rgba(255,220,220,0.75)" }}>
                — Ashish Chhipa
              </span>
              <div className="h-px flex-1 max-w-[60px]" style={{ background: "linear-gradient(to left, transparent, rgba(255,255,255,0.4))" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom border */}
      <div className="relative z-10 w-full h-px" style={{ background: "rgba(0,0,0,0.3)" }} />
    </section>
  );
}
