"use client";

import Link from "next/link";
import { useContent } from "@/content/ContentContext";
import LazyVideo from "./LazyVideo";
import Reveal from "./motion/Reveal";

const instagramIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

function Social({ href, label }: { href: string; label: string }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-11 h-11 rounded-full border border-white/25 grid place-items-center text-white/60 hover:text-white hover:border-white hover:bg-gradient-to-br hover:from-[#833ab4] hover:via-[#fd1d1d] hover:to-[#fcb045] transition-all duration-300 hover:scale-110 hover:rotate-6"
    >
      {instagramIcon}
    </a>
  );
}

export default function Footer() {
  const { content, asset } = useContent();
  const f = content.footer;

  return (
    <footer className="relative border-t border-white/10 overflow-hidden pb-24 md:pb-0">
      <LazyVideo src={asset(f.video)} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/70" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          <Reveal>
            <h3 className="text-base font-black text-white tracking-[0.2em] uppercase mb-4">{f.aboutTitle}</h3>
            <p className="text-sm text-white/70 leading-relaxed max-w-md mb-6">{f.aboutText}</p>
            <Social href={f.instagram} label={`${f.aboutTitle} on Instagram`} />
          </Reveal>

          <Reveal delay={120} className="md:border-l md:border-white/10 md:pl-12 lg:pl-20">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h3 className="text-base font-black text-white tracking-[0.2em] uppercase">{f.partnerTitle}</h3>
              <span className="text-xs text-white/50 font-medium italic">{f.partnerTag}</span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed max-w-md mb-6">{f.partnerText}</p>
            <Social href={f.partnerInstagram} label={`${f.partnerTitle} on Instagram`} />
          </Reveal>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/10 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/50 text-center">{f.copyright}</p>
          <Link
            href="/admin"
            className="text-[10px] text-white/30 hover:text-white/70 font-medium tracking-[0.2em] uppercase transition-colors"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
