"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import testimonialsData from "@/data/testimonials.json";

interface Testimonial {
  id: number;
  name: string;
  handle: string;
  photo: string;
  text: string;
  rating: number;
  hidden: boolean;
}

interface TestimonialsFile {
  enabled: boolean;
  heading: string;
  subheading: string;
  testimonials: Testimonial[];
}

const data = testimonialsData as TestimonialsFile;
const visible = data.testimonials.filter((t) => !t.hidden);

export default function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); observer.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  if (!data.enabled || visible.length === 0) return null;

  return (
    <section ref={ref} className="relative bg-black py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Subtle bg glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[#7f0000]/10 blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <p className="text-[#7f0000] text-xs font-bold tracking-[4px] uppercase mb-4">TESTIMONIALS</p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4">
            {data.heading}
          </h2>
          <p className="text-[#666] text-lg max-w-xl mx-auto">{data.subheading}</p>
        </div>

        {/* Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
          {visible.map((t, i) => (
            <div
              key={t.id}
              className={`break-inside-avoid bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-6 transition-all duration-700 hover:border-[#2a2a2a]`}
              style={{ transitionDelay: `${i * 80}ms`, opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)" }}
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, si) => (
                  <svg key={si} viewBox="0 0 24 24" className={`w-4 h-4 ${si < t.rating ? "fill-[#ff1a1a]" : "fill-[#333]"}`}>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>

              {/* Text */}
              <p className="text-[#ccc] text-sm leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#111] border border-[#333] shrink-0">
                  {t.photo
                    ? <Image src={t.photo} alt={t.name} fill className="object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-[#555] font-bold text-sm">
                        {t.name.charAt(0).toUpperCase()}
                      </div>
                  }
                </div>
                <div>
                  <p className="text-white font-bold text-sm leading-tight">{t.name}</p>
                  {t.handle && <p className="text-[#555] text-xs">{t.handle}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
