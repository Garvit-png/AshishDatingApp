"use client";

import { useRef } from "react";
import Image from "next/image";
import { useContent } from "@/content/ContentContext";
import SmartLink from "./SmartLink";
import Silk from "./Silk";
import Reveal from "./motion/Reveal";

export default function HeroSection() {
  const { content, asset } = useContent();
  const hero = content.hero;
  const cardRef = useRef<HTMLDivElement>(null);

  // Subtle 3D tilt on the photo (mouse only)
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    cardRef.current.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale(1.02)`;
  };
  const onLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = "";
  };

  const lines = [[hero.line1, hero.line2, hero.line3].filter(Boolean).join(" ")]

  return (
    <section id="about" className="relative min-h-[100svh] bg-black overflow-hidden flex items-center pt-20">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#1a0000] via-black to-[#0d0000]">
        <Silk color="#ff0000" speed={5} noiseIntensity={1.5} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/10 z-0 pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-12 md:py-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
          <div className="flex-1 w-full flex flex-col items-center lg:items-start text-center lg:text-left">
            <h2 className="text-[7.5vw] sm:text-[8vw] lg:text-[5.2vw] xl:text-[4.25rem] font-black text-white leading-[1.02] mb-5 md:mb-7 tracking-tighter whitespace-nowrap w-full">
              {lines.map((line, i) => (
                <span key={i} className="block overflow-hidden pb-[0.08em]">
                  <Reveal as="span" variant="up" delay={i * 120} className={`block ${i === 1 ? "text-gradient" : ""}`}>
                    {line}
                  </Reveal>
                </span>
              ))}
            </h2>

            <Reveal as="p" delay={380} className="text-white/70 font-light text-base sm:text-xl mb-8 md:mb-10 max-w-xl leading-relaxed">
              {hero.subtitle}
            </Reveal>

            <Reveal delay={480}>
              <SmartLink
                href={hero.ctaLink}
                className="btn-shine group inline-flex items-center gap-3 bg-white text-black font-bold px-7 py-4 rounded-full text-sm sm:text-base hover:scale-105 active:scale-95 transition-transform duration-300 shadow-[0_10px_40px_-10px_rgba(255,255,255,0.5)]"
              >
                {hero.ctaText}
                <span className="w-7 h-7 rounded-full bg-black text-white grid place-items-center group-hover:translate-x-1 transition-transform">→</span>
              </SmartLink>
            </Reveal>
          </div>

          <Reveal variant="zoom" delay={150} className="flex-1 flex justify-center lg:justify-end">
            <div onPointerMove={onMove} onPointerLeave={onLeave} className="relative">
              <div className="absolute -inset-6 rounded-[2.5rem] bg-[color:var(--accent-color)] opacity-30 blur-3xl animate-float pointer-events-none" />
              <div
                ref={cardRef}
                className="relative w-[78vw] max-w-[300px] sm:max-w-[380px] lg:max-w-[420px] aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl shadow-[#7f0000]/40 border border-white/10 transition-transform duration-300 ease-out"
              >
                <Image
                  src={asset(hero.photo)}
                  alt={`${hero.photoName} – ${hero.photoRole}`}
                  fill
                  sizes="(max-width: 640px) 78vw, 420px"
                  className="object-cover object-top"
                  preload
                />
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/85 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-white font-bold text-xl sm:text-2xl leading-tight mb-1">{hero.photoName}</p>
                  <p className="text-accent text-sm sm:text-base font-semibold tracking-wide">{hero.photoRole}</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-b from-transparent to-black z-10 pointer-events-none" />
    </section>
  );
}
