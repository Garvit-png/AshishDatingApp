"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  {
    value: "7 Years+",
    label: "EXPERIENCE",
    color: "text-red-500",
  },
  {
    value: "161k+",
    label: "MEMBERS",
    color: "text-red-500",
  },
  {
    value: "10+",
    label: "MASTER COURSES & EBOOKS",
    color: "text-red-500",
  },
  {
    value: "4.8",
    label: "TRUSTPILOT RATING",
    color: "text-red-500",
    isRating: true,
  },
];

export default function StatsSection() {
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
    <section ref={ref} className="bg-white border-y border-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`flex flex-col items-center py-6 px-4 transition-all duration-700 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center gap-1 mb-1">
                {stat.isRating && (
                  <div className="flex text-red-500 text-sm mb-0.5">
                    {"★★★★★".split("").map((star, j) => (
                      <span key={j}>{star}</span>
                    ))}
                  </div>
                )}
              </div>
              <span className={`text-3xl sm:text-4xl font-black ${stat.color} leading-none`}>
                {stat.value}
              </span>
              {stat.isRating && (
                <div className="flex text-yellow-400 text-sm mt-1">
                  {"★★★★★".split("").map((star, j) => (
                    <span key={j}>{star}</span>
                  ))}
                </div>
              )}
              <span className="text-xs font-semibold text-gray-400 tracking-widest mt-2 text-center uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
