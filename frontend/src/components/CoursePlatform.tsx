"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useContent } from "@/content/ContentContext";
import CoursesLoader from "./CoursesLoader";
import CoursesHero from "./CoursesHero";
import ProductCard from "./ProductCard";
import Reveal from "./motion/Reveal";
import Footer from "./Footer";

export default function CoursePlatform() {
  const { content, preview } = useContent();
  const c = content.coursesPage;
  const products = content.products.items.filter((b) => !b.hidden);
  const [loading, setLoading] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  // Show the intro loader once per visit only
  useEffect(() => {
    if (!c.showLoader || preview) return;
    try {
      if (sessionStorage.getItem("courses_loader_seen")) return;
      sessionStorage.setItem("courses_loader_seen", "1");
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect -- depends on sessionStorage (browser only)
    setLoading(true);
  }, [c.showLoader, preview]);

  const done = useCallback(() => setLoading(false), []);
  const scrollToCourses = useCallback(() => {
    const el = gridRef.current;
    if (!el) return;
    if (window.__lenis) window.__lenis.scrollTo(el);
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {loading && <CoursesLoader onComplete={done} />}
      <CoursesHero onScrollToCourses={scrollToCourses} />

      <div ref={gridRef} className="border-b border-white/10 sticky top-0 z-30 bg-black/70 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-white/60 hover:text-white flex items-center gap-2 transition-colors text-sm group">
            <span className="transition-transform group-hover:-translate-x-1">←</span> Back to Home
          </Link>
          <span className="text-[10px] font-bold tracking-[0.3em] text-accent uppercase">{content.nav.brand}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-6 pt-16 pb-12 text-center">
        <Reveal as="h1" variant="blur" className="text-4xl md:text-6xl font-black tracking-tight mb-4">{c.gridTitle}</Reveal>
        <Reveal as="p" delay={100} className="text-white/50 text-lg max-w-xl mx-auto">{c.gridSubtitle}</Reveal>
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-14 sm:gap-10 lg:gap-14 justify-items-center">
          {products.map((product, i) => (
            <Reveal key={product.id} delay={(i % 3) * 110} className="w-full flex justify-center">
              <ProductCard product={product} buyText={content.products.buyText} />
            </Reveal>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
