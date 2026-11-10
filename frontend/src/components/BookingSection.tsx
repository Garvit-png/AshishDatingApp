"use client";

import { useContent } from "@/content/ContentContext";
import Reveal from "./motion/Reveal";

const setSpot = (e: React.PointerEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};

export default function BookingSection() {
  const { content } = useContent();
  const b = content.booking;

  return (
    <section id="book" className="relative overflow-hidden bg-black py-20 sm:py-28 px-5 sm:px-6 lg:px-8 scroll-mt-16">
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-[#7f0000]/40 blur-[140px]" />
      <div className="relative max-w-5xl mx-auto">
        <div className="text-center mb-12 sm:mb-14">
          <Reveal as="span" className="inline-block text-xs font-semibold tracking-widest uppercase text-[#ff6b6b] border border-[#7f0000] bg-[#7f0000]/20 rounded-full px-4 py-1.5 mb-5">
            {b.badge}
          </Reveal>
          <Reveal as="h2" delay={80} className="text-3xl sm:text-5xl font-extrabold text-white leading-tight mb-4">
            {b.heading} <span className="text-accent">{b.highlight}</span>
          </Reveal>
          <Reveal as="p" delay={160} className="text-white/60 max-w-xl mx-auto">
            {b.description}
          </Reveal>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {b.sessions.map((s, i) => (
            <Reveal key={s.id} delay={i * 70} variant="zoom">
              <a
                href={s.link || b.url}
                target="_blank"
                rel="noopener noreferrer"
                onPointerMove={setSpot}
                className="spotlight group relative flex flex-col h-full rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#7f0000] hover:bg-white/[0.07]"
              >
                {s.tag && (
                  <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider bg-[#7f0000] text-white rounded-full px-2.5 py-1 shadow-[0_0_20px_var(--accent-color)]">
                    {s.tag}
                  </span>
                )}
                <p className="text-sm text-white/40 mb-2 flex items-center gap-1.5">
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 10.4V7h-2v6.4l4.3 2.6 1-1.7z" /></svg>
                  {s.mins}
                </p>
                <h3 className="text-lg font-bold text-white mb-6 pr-20">{s.title}</h3>
                <div className="mt-auto flex items-end justify-between">
                  <div>
                    <span className="text-2xl font-extrabold text-white">{s.price}</span>
                    {s.was && <span className="ml-2 text-sm text-white/35 line-through">{s.was}</span>}
                  </div>
                  <span className="w-9 h-9 rounded-full border border-white/20 grid place-items-center text-white/70 group-hover:bg-white group-hover:text-black group-hover:translate-x-1 transition-all">→</span>
                </div>
              </a>
            </Reveal>
          ))}

          <Reveal delay={b.sessions.length * 70} variant="zoom">
            <a
              href={b.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-shine flex flex-col items-center justify-center text-center h-full min-h-[160px] rounded-2xl bg-gradient-to-br from-[#a30000] to-[#5a0000] p-6 text-white font-bold text-xl transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-[0_20px_60px_-15px_var(--accent-color)]"
            >
              {b.ctaTitle}
              <span className="mt-1 text-sm font-medium text-white/80">{b.ctaSubtitle}</span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
