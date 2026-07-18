"use client";

import { useEffect, useRef, useState } from "react";

export default function DateSmarterSection() {
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
    <section ref={ref} id="about" className="bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        {/* Heading */}
        <h2
          className={`text-4xl sm:text-5xl font-black text-black tracking-tight mb-3 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          DATE SMARTER
        </h2>
        <p
          className={`text-gray-500 text-base sm:text-lg mb-10 transition-all duration-700 delay-100 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          Don&apos;t chase people. Become someone worth chasing.
        </p>

        {/* Video Placeholder */}
        <div
          className={`relative mx-auto rounded-xl overflow-hidden bg-gray-900 transition-all duration-700 delay-200 ${
            visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
          style={{ aspectRatio: "16/9", maxWidth: "640px" }}
        >
          {/* YouTube embed placeholder */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-black">
            <div className="w-20 h-20 rounded-full bg-[#7f0000] flex items-center justify-center cursor-pointer hover:bg-[#7f0000] transition-colors duration-200 shadow-2xl shadow-[#7f0000]/50 hover:scale-110 transition-transform">
              <svg
                className="w-8 h-8 text-white ml-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <p className="mt-4 text-sm text-gray-400 font-medium">Watch the video</p>
          </div>

          {/* Decorative border glow */}
          <div className="absolute inset-0 rounded-xl ring-1 ring-white/10 pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
