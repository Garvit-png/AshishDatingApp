"use client";

import { useRef } from "react";
import Image from "next/image";
import type { Product } from "@/content/types";
import { useContent } from "@/content/ContentContext";

const TAG: Record<string, string> = {
  red: "bg-[#7f0000] text-white",
  white: "bg-white text-black",
  black: "bg-black text-white border border-white/20",
};

export default function ProductCard({ product, buyText }: { product: Product; buyText: string }) {
  const { asset } = useContent();
  const tiltRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType !== "mouse" || !tiltRef.current) return;
    const r = tiltRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    tiltRef.current.style.transform = `perspective(900px) rotateY(${(x - 0.5) * 14}deg) rotateX(${(0.5 - y) * 14}deg) translateY(-8px)`;
    tiltRef.current.style.setProperty("--mx", `${x * 100}%`);
    tiltRef.current.style.setProperty("--my", `${y * 100}%`);
  };
  const onLeave = () => {
    if (tiltRef.current) tiltRef.current.style.transform = "";
  };

  return (
    <div className="group flex flex-col items-center w-full max-w-[280px]">
      {product.tag && (
        <span className={`${TAG[product.tagStyle] ?? TAG.red} text-[10px] font-bold tracking-[0.2em] px-3 py-1 rounded-full uppercase mb-4`}>
          {product.tag}
        </span>
      )}

      <a
        href={product.href}
        target="_blank"
        rel="noopener noreferrer"
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="w-full block"
        aria-label={`${product.title} – ${buyText}`}
      >
        <div
          ref={tiltRef}
          className={`spotlight relative w-full aspect-[2/3] rounded-2xl overflow-hidden ring-1 transition-transform duration-300 ease-out ${
            product.featured ? "ring-2 ring-[color:var(--accent-color)] shadow-[0_20px_60px_-15px_var(--accent-color)]" : "ring-white/10 shadow-2xl shadow-black"
          }`}
        >
          {product.image ? (
            <Image src={asset(product.image)} alt={product.title} fill sizes="(max-width: 640px) 80vw, 280px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
          ) : (
            <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-[#2a0000] to-black text-white/40 text-sm">No cover</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </a>

      <div className="mt-5 text-center">
        <h3 className="text-base sm:text-lg font-bold text-white leading-tight">{product.title}</h3>
        {product.subtitle && <p className="text-white/50 text-xs sm:text-sm mt-1">{product.subtitle}</p>}
        {product.price && (
          <p className="mt-2 text-white font-black text-lg">
            {product.price}
            {product.oldPrice && <span className="ml-2 text-sm font-medium text-white/40 line-through">{product.oldPrice}</span>}
          </p>
        )}
      </div>

      <a
        href={product.href}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-shine mt-4 inline-flex items-center justify-center gap-2 w-full text-sm font-bold bg-white text-black px-6 py-3.5 rounded-full hover:bg-[#7f0000] hover:text-white transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-lg"
      >
        {buyText}
        <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
      </a>
    </div>
  );
}
