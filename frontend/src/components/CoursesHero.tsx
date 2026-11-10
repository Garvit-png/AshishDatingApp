"use client";

import Link from "next/link";
import Image from "next/image";
import { useContent } from "@/content/ContentContext";

const avatarColors = ["#5a0000", "#3a0000", "#2a0000", "#4a0010", "#3a0020"];
const avatarInitials = ["R", "A", "S", "K", "M"];

function In({ delay, children, className = "" }: { delay: number; children: React.ReactNode; className?: string }) {
  return (
    <div className={`animate-slide-up ${className}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export default function CoursesHero({ onScrollToCourses }: { onScrollToCourses: () => void }) {
  const { content, asset } = useContent();
  const c = content.coursesPage;

  return (
    <section className="relative w-full min-h-[100svh] bg-[#8B0000] overflow-hidden flex flex-col">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_0%_0%,rgba(0,0,0,0.4)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_40%_at_50%_100%,rgba(0,0,0,0.45)_0%,transparent_70%)]" />
        <div className="absolute -right-40 top-1/4 w-[600px] h-[600px] rounded-full bg-black/30 blur-[120px] animate-float" />
      </div>

      <div className="relative z-20 px-5 sm:px-10 lg:px-16 pt-5">
        <Link href="/" className="group inline-flex items-center gap-2 text-sm font-semibold text-[rgba(255,220,220,0.85)] hover:text-white transition-colors">
          <span className="transition-transform group-hover:-translate-x-1">←</span> Back to Home
        </Link>
      </div>

      <div className="relative z-10 flex-1 flex flex-col lg:flex-row items-stretch max-w-[1440px] mx-auto w-full px-5 sm:px-10 lg:px-16 pt-6 pb-10 lg:pt-2 lg:pb-0">
        <div className="lg:w-[48%] flex flex-col justify-center py-4 lg:py-16 lg:pr-12">
          <In delay={0}>
            <span className="inline-block text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full border border-white/40 bg-white/10 text-white mb-5">
              {c.badge}
            </span>
          </In>

          <h1 className="font-black text-white leading-[1.08] tracking-tight mb-5 text-[2rem] sm:text-[2.6rem] lg:text-[3rem] xl:text-[3.4rem] [text-shadow:0_2px_12px_rgba(0,0,0,0.4)]">
            {c.headingLines.map((l, i) => (
              <In key={i} delay={80 + i * 90}>
                {l.lead} <span className="text-black [text-shadow:none]">{l.highlight}</span>
              </In>
            ))}
          </h1>

          <In delay={380}>
            <p className="text-sm sm:text-base italic mb-6 leading-relaxed max-w-md text-[rgba(255,220,220,0.9)]">{c.subtitle}</p>
          </In>

          <ul className="mb-8 flex flex-col">
            {c.benefits.map((benefit, i) => (
              <li key={i} className="animate-slide-up flex items-center gap-3 py-2.5 border-b border-white/10 last:border-0" style={{ animationDelay: `${440 + i * 60}ms` }}>
                  <span className="flex-none w-5 h-5 rounded-full grid place-items-center bg-white/15 border border-white/40">
                    <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="text-white text-sm font-medium leading-snug">{benefit}</span>
              </li>
            ))}
          </ul>

          <In delay={500 + c.benefits.length * 60} className="flex flex-col sm:flex-row sm:items-center gap-5">
            <button
              onClick={onScrollToCourses}
              className="btn-shine group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full font-bold text-sm text-white bg-black shadow-[0_8px_30px_rgba(0,0,0,0.45)] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.6)] transition-all"
            >
              {c.ctaText}
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="flex">
                {avatarInitials.map((initial, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full grid place-items-center text-[11px] font-bold text-white border-2 border-white/30 relative"
                    style={{ background: avatarColors[i], marginLeft: i === 0 ? 0 : -10, zIndex: 5 - i }}
                  >
                    {initial}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-white text-sm font-semibold leading-tight">{c.socialProofTitle}</p>
                <p className="text-[10px] text-[rgba(255,200,200,0.75)]">{c.socialProofSubtitle}</p>
              </div>
            </div>
          </In>
        </div>

        <In delay={200} className="flex-1 flex flex-col items-center justify-center relative pt-10 lg:pt-0">
          <div className="w-full text-center pb-4 px-4 font-serif">
            <p className="text-white text-xl sm:text-2xl lg:text-[2rem] font-light tracking-[0.06em] [text-shadow:0_2px_8px_rgba(0,0,0,0.4)]">{c.quoteTop}</p>
            <p className="text-2xl sm:text-3xl lg:text-[2.4rem] font-semibold tracking-[0.04em] mt-1 text-white [text-shadow:0_0_24px_rgba(0,0,0,0.5)]">{c.quoteMain}</p>
          </div>
          <div className="relative w-[75vw] max-w-[300px] sm:max-w-[380px] lg:max-w-[460px] aspect-[4/5]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_50%_50%,rgba(0,0,0,0.6)_0%,transparent_75%)]" />
            <Image
              src={asset(c.portrait)}
              alt={c.quoteAuthor}
              fill
              sizes="(max-width: 640px) 75vw, 460px"
              preload
              className="object-cover rounded-3xl drop-shadow-[0_0_40px_rgba(0,0,0,0.8)] select-none"
              draggable={false}
            />
          </div>
          <p className="pt-4 pb-6 text-xs italic font-medium tracking-widest text-[rgba(255,220,220,0.75)] font-serif">{c.quoteAuthor}</p>
        </In>
      </div>
    </section>
  );
}
