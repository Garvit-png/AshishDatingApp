"use client";

import { useRef, useCallback, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import CoursesLoader from "@/components/CoursesLoader";
import CoursesHero from "@/components/CoursesHero";
import booksData from "@/data/books.json";

interface Book {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  tag: string;
  tagColor: string;
  price: string;
  href: string;
  hidden: boolean;
  featured?: boolean;
}

// All visible books from books.json
const products = (booksData as Book[]).filter((b) => !b.hidden);

// ─── Main Component ───────────────────────────────────────────
export default function CoursePlatform() {
  const [loading, setLoading] = useState(true);
  const coursesGridRef = useRef<HTMLDivElement>(null);

  const handleLoaderComplete = useCallback(() => {
    setLoading(false);
  }, []);

  const scrollToCourses = useCallback(() => {
    coursesGridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {loading && <CoursesLoader onComplete={handleLoaderComplete} />}

      {/* Hero */}
      <CoursesHero onScrollToCourses={scrollToCourses} />

      {/* Scroll anchor */}
      <div ref={coursesGridRef} />

      {/* Back to Home bar */}
      <div className="border-b border-[#222]">
        <div className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
          <Link
            href="/"
            className="text-[#a3a3a3] hover:text-white flex items-center gap-2 transition-colors text-sm"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
            Back to Home
          </Link>
          <span className="text-[10px] font-bold tracking-widest text-[#7f0000] uppercase">
            ASHISH CHHIPA
          </span>
        </div>
      </div>

      {/* Page Title */}
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-12 text-center">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
          All Courses &amp; Playbooks
        </h1>
        <p className="text-[#666] text-lg max-w-xl mx-auto">
          Real dating strategy. Real psychology. Zero cringe.
        </p>
      </div>

      {/* Books Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        <div className="flex flex-wrap justify-center gap-12 sm:gap-16">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex flex-col items-center w-56 sm:w-64 group"
            >
              {/* Tag */}
              <span
                className={`${product.tagColor} ${
                  product.tagColor === "bg-white" ? "text-black" : "text-white"
                } text-[10px] font-bold tracking-widest px-3 py-1 rounded-full uppercase mb-4`}
              >
                {product.tag}
              </span>

              {/* Book Cover */}
              <Link
                href={product.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex justify-center"
              >
                <div
                  className="relative w-full rounded-xl overflow-hidden ring-1 ring-white/10 shadow-2xl transition-transform duration-300 hover:scale-105"
                  style={{ aspectRatio: "2/3" }}
                >
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300 rounded-xl" />
                </div>
              </Link>

              {/* Title */}
              <div className="mt-5 text-center">
                <h3 className="text-base font-bold text-white leading-tight">
                  {product.title}
                </h3>
                <p className="text-[#666] text-xs mt-1">{product.subtitle}</p>
              </div>

              {/* Buy Now */}
              <div className="mt-4 w-full">
                <Link
                  href={product.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full text-center text-sm font-bold bg-white text-black px-6 py-3 rounded-full hover:bg-gray-200 transition-transform hover:scale-105 active:scale-95 shadow-lg"
                >
                  Buy Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
