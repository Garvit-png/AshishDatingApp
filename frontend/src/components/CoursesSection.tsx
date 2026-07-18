"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const products = [
  {
    id: 1,
    title: "Opener Vault",
    subtitle: "50 Proven Lines",
    image: "/book-opener-vault.png",
    tag: "BESTSELLER",
    tagColor: "bg-red-600",
    price: "₹299",
    href: "#opener-vault",
  },
  {
    id: 2,
    title: "The Approach Blueprint",
    subtitle: "How To Talk To Women Without Being Creepy",
    image: "/book-approach-blueprint.png",
    tag: "POPULAR",
    tagColor: "bg-black",
    price: "₹499",
    href: "#approach-blueprint",
    featured: true,
  },
  {
    id: 3,
    title: "The Girl Psychology Playbook",
    subtitle: "Understand Female Attraction",
    image: "/book-girl-psychology.png",
    tag: "NEW",
    tagColor: "bg-red-600",
    price: "₹299",
    href: "#girl-psychology",
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
      className="bg-white py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div
          className={`text-center mb-14 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <p className="text-xs font-bold tracking-widest text-red-500 uppercase mb-3">
            REAL DATING STRATEGY. REAL PSYCHOLOGY. ZERO CRINGE.
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-black mb-3">
            Explore Courses &amp; Playbooks
          </h2>
        </div>

        {/* Book Cards */}
        <div className="flex flex-col sm:flex-row items-end justify-center gap-6 sm:gap-4">
          {products.map((product, i) => (
            <div
              key={product.id}
              className={`relative transition-all duration-700 group ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              } ${product.featured ? "sm:-mt-8 sm:scale-110 z-10" : ""}`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              {/* Tag */}
              <div
                className={`absolute top-3 left-3 z-20 ${product.tagColor} text-white text-xs font-black px-2 py-1 rounded tracking-widest`}
              >
                {product.tag}
              </div>

              {/* Book Cover */}
              <Link href={product.href}>
                <div className="relative overflow-hidden rounded-xl shadow-2xl cursor-pointer hover:shadow-3xl transition-shadow duration-300">
                  <div
                    className="relative w-48 sm:w-52 md:w-56"
                    style={{ aspectRatio: "3/4" }}
                  >
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-xl" />
                  </div>

                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 rounded-xl pointer-events-none" />
                </div>
              </Link>

              {/* Info below */}
              <div className="mt-4 px-1 w-48 sm:w-52 md:w-56">
                <h3 className="text-sm font-bold text-black leading-tight">{product.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{product.subtitle}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-black text-red-500">{product.price}</span>
                  <Link
                    href={product.href}
                    className="text-xs font-semibold bg-black text-white px-3 py-1.5 rounded-md hover:bg-gray-800 transition-colors"
                  >
                    Get It →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div
          className={`text-center mt-14 transition-all duration-700 delay-500 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Link
            href="#all-products"
            className="inline-flex items-center gap-2 border-2 border-black text-black font-bold px-8 py-3 rounded-md text-sm hover:bg-black hover:text-white transition-all duration-200"
          >
            View All Courses &amp; Playbooks
          </Link>
        </div>
      </div>
    </section>
  );
}
