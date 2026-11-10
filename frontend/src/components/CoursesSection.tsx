"use client";

import Link from "next/link";
import { useContent } from "@/content/ContentContext";
import ProductCard from "./ProductCard";
import Reveal from "./motion/Reveal";

export default function CoursesSection() {
  const { content } = useContent();
  const p = content.products;
  const visible = p.items.filter((b) => !b.hidden);
  const shown = visible.slice(0, Math.max(1, p.homeCount));

  return (
    <section id="playbooks" className="relative bg-black py-20 sm:py-28 px-5 sm:px-6 lg:px-8 overflow-hidden scroll-mt-16">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14 md:mb-20">
          <Reveal as="h2" variant="blur" className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-5 tracking-tight">
            {p.heading}
          </Reveal>
          <Reveal as="p" delay={120} className="text-[11px] sm:text-xs font-bold tracking-[0.3em] text-accent uppercase">
            {p.tagline}
          </Reveal>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14 sm:gap-10 lg:gap-14 justify-items-center">
          {shown.map((product, i) => (
            <Reveal key={product.id} delay={i * 120} className="w-full flex justify-center">
              <ProductCard product={product} buyText={p.buyText} />
            </Reveal>
          ))}
        </div>

        {visible.length > 0 && (
          <Reveal className="text-center mt-16 sm:mt-20" delay={200}>
            <Link
              href="/courses"
              className="group inline-flex items-center gap-3 border-2 border-white/80 text-white font-bold px-8 py-3.5 rounded-full text-sm hover:bg-white hover:text-black transition-all duration-300"
            >
              {p.viewAllText}
              {visible.length > shown.length && (
                <span className="text-[10px] bg-[#7f0000] text-white rounded-full px-2 py-0.5">+{visible.length - shown.length}</span>
              )}
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </Reveal>
        )}
      </div>
    </section>
  );
}
