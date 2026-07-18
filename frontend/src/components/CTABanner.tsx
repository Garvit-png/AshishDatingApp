"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function CTABanner() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-gray-50 border-y border-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div
        className={`max-w-2xl mx-auto text-center transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <p className="text-xl sm:text-2xl font-bold text-black leading-snug mb-6">
          Sirf better pickup lines se kuch nahi hoga. Tumhe chahiye{" "}
          <span className="text-[#7f0000]">ek better dating strategy.</span>
        </p>
        <Link
          href="#courses"
          className="inline-flex items-center gap-2 bg-black text-white font-semibold px-7 py-3 rounded-md text-sm hover:bg-[#7f0000] hover:text-white transition-all duration-200 hover:scale-105 active:scale-95"
        >
          Read More
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
