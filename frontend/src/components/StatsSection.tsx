"use client";

import { useContent } from "@/content/ContentContext";
import LazyVideo from "./LazyVideo";
import Reveal from "./motion/Reveal";
import SmartLink from "./SmartLink";

/** The red "DATE SMARTER" section. */
export default function StatsSection() {
  const { content, asset } = useContent();
  const d = content.dateSmarter;

  return (
    <section className="relative w-full bg-[#cc0000] overflow-hidden py-20 sm:py-28 px-5">
      <div className="absolute inset-0 pointer-events-none opacity-60">
        <div
          className="absolute -inset-[80px]"
          style={{
            background: "repeating-linear-gradient(135deg, transparent, transparent 40px, rgba(0,0,0,0.15) 40px, rgba(0,0,0,0.15) 80px)",
            animation: "drift 8s linear infinite",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(0,0,0,0.3)_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center gap-8 text-center">
        <Reveal as="h2" variant="blur" className="text-[15vw] sm:text-7xl lg:text-9xl font-black text-black tracking-tighter leading-none">
          {d.title}
        </Reveal>
        <Reveal as="p" delay={120} className="text-black/75 text-lg sm:text-xl font-semibold max-w-lg">
          {d.subtitle}
        </Reveal>

        <Reveal variant="zoom" delay={200} className="w-full max-w-[820px]">
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-[0_40px_100px_-30px_rgba(0,0,0,0.8)] ring-1 ring-black/20">
            <LazyVideo src={asset(d.video)} autoPlay muted loop playsInline className="w-full h-full object-cover" />
          </div>
        </Reveal>

        <Reveal as="h3" delay={100} className="text-2xl sm:text-3xl lg:text-5xl font-black text-black max-w-3xl leading-tight mt-4">
          {d.headline}
        </Reveal>
        <Reveal delay={200}>
          <SmartLink
            href={d.buttonLink}
            className="btn-shine inline-flex items-center gap-3 bg-black text-white px-10 py-4 rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-transform shadow-2xl shadow-black/30"
          >
            {d.buttonText} <span aria-hidden>→</span>
          </SmartLink>
        </Reveal>
      </div>
    </section>
  );
}
