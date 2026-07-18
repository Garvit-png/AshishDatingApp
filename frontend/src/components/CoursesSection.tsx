"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const products = [
  {
    id: 1,
    title: "Opener Vault",
    subtitle: "50 Proven Lines",
    image: "/opener_vault.png",
    tag: "BESTSELLER",
    tagColor: "bg-[#7f0000]",
    price: "₹299",
    href: "https://pages.razorpay.com/pl_T7w20RI546muZh/view",
  },
  {
    id: 2,
    title: "The Approach Blueprint",
    subtitle: "How To Talk To Women Without Being Creepy",
    image: "/approach_psycho.png",
    tag: "POPULAR",
    tagColor: "bg-white",
    price: "₹499",
    href: "https://pages.razorpay.com/pl_T8KezcbkXSpP6H/view",
    featured: true,
  },
  {
    id: 3,
    title: "The Girl Psychology Playbook",
    subtitle: "Understand Female Attraction",
    image: "/girl.png",
    tag: "NEW",
    tagColor: "bg-[#7f0000]",
    price: "₹299",
    href: "https://pages.razorpay.com/pl_T7w8Pgiwh8NpMp/view",
  },
];

export default function CoursesSection() {
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
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id="playbooks"
      className="relative bg-black min-h-screen flex flex-col items-center py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto w-full flex-grow flex flex-col justify-center">
        {/* Header - Fixed at the top */}
        <div
          className={`absolute top-16 md:top-24 left-0 w-full text-center transition-all duration-700 px-4 z-30 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-4 tracking-tight">
            Explore Courses &amp; Playbooks
          </h2>
          <p className="text-xs font-bold tracking-widest text-[#ff0000] uppercase">
            REAL DATING STRATEGY. REAL PSYCHOLOGY. ZERO CRINGE.
          </p>
        </div>

        {/* Book Cards */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-12 sm:gap-16 mt-20 md:mt-32">
          {products.map((product, i) => (
            <div
              key={product.id}
              className={`relative flex flex-col items-center transition-all duration-700 group w-64 sm:w-72 ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              {/* Book Cover */}
              <Link href={product.href} target="_blank" rel="noopener noreferrer" className="w-full flex justify-center">
                <div className="relative transition-all duration-500 ease-out hover:scale-105 cursor-pointer hover:z-20">
                  <div
                    className="relative w-56 sm:w-64 rounded-xl overflow-hidden ring-1 ring-white/10 shadow-2xl"
                    style={{ aspectRatio: "2/3" }}
                  >
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300 rounded-xl" />
                  </div>
                </div>
              </Link>

              {/* Buy Now Button */}
              <div className="mt-8 text-center w-full">
                <Link
                  href={product.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-sm font-bold bg-white text-black px-10 py-3.5 rounded-full hover:bg-gray-200 transition-transform hover:scale-105 active:scale-95 shadow-lg"
                >
                  Buy Now
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div
          className={`text-center mt-20 transition-all duration-700 delay-500 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Link
            href="#all-products"
            className="inline-flex items-center gap-2 border-2 border-white text-white font-bold px-8 py-3 rounded-full text-sm hover:bg-white hover:text-black transition-all duration-200"
          >
            View All Courses &amp; Playbooks
          </Link>
        </div>
      </div>
    </section>
  );
}
