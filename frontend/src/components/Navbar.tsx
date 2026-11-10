"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useContent } from "@/content/ContentContext";
import SmartLink from "./SmartLink";

const TONE: Record<string, string> = {
  red: "bg-[#7f0000] text-white",
  white: "bg-white text-black",
  black: "bg-black text-white border-b border-white/10",
};

export default function Navbar() {
  const { content } = useContent();
  const { nav, announcement } = content;
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [barClosed, setBarClosed] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        setScrolled(y > 40);
        // Hide when scrolling down, show when scrolling up
        if (Math.abs(y - last) > 6) {
          setHidden(y > last && y > 240);
          last = y;
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    window.__lenis?.[menuOpen ? "stop" : "start"]();
  }, [menuOpen]);

  const showBar = announcement.enabled && !barClosed && !!announcement.text;
  const close = () => setMenuOpen(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-out-expo ${
        hidden && !menuOpen ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      {showBar && (
        <div className={`relative text-center text-xs sm:text-sm font-medium px-10 py-2 ${TONE[announcement.style]}`}>
          <span>{announcement.text}</span>
          {announcement.linkText && announcement.link && (
            <SmartLink href={announcement.link} className="ml-2 font-bold underline underline-offset-4 hover:opacity-80">
              {announcement.linkText} →
            </SmartLink>
          )}
          <button
            onClick={() => setBarClosed(true)}
            aria-label="Close announcement"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 grid place-items-center opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      <nav
        className={`transition-all duration-500 ${
          scrolled || menuOpen ? "bg-black/70 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/40" : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between transition-all duration-500 ${scrolled ? "h-16" : "h-20"}`}>
            <Link href="/" className="group flex items-center gap-2" onClick={close}>
              <span className="w-2 h-2 rounded-full bg-accent shadow-[0_0_12px_var(--accent-color)] group-hover:scale-150 transition-transform" />
              <span className="text-sm sm:text-base font-black tracking-[0.2em] text-white uppercase">{nav.brand}</span>
            </Link>

            <div className="hidden md:flex items-center gap-1 lg:gap-2">
              {nav.links.map((l) => (
                <SmartLink
                  key={l.label + l.href}
                  href={l.href}
                  className="relative px-3 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors group"
                >
                  {l.label}
                  <span className="absolute left-3 right-3 -bottom-0.5 h-0.5 bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </SmartLink>
              ))}
            </div>

            <div className="hidden md:block">
              <SmartLink
                href={nav.ctaLink}
                className="btn-shine inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-[#7f0000] rounded-full hover:bg-[#a30000] transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-[#7f0000]/30"
              >
                {nav.ctaText}
                <span aria-hidden>→</span>
              </SmartLink>
            </div>

            <button
              className="md:hidden relative w-11 h-11 -mr-2 grid place-items-center"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <span className={`absolute block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "rotate-45" : "-translate-y-[7px]"}`} />
              <span className={`absolute block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
              <span className={`absolute block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "-rotate-45" : "translate-y-[7px]"}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile full-screen menu */}
      <div
        className={`md:hidden absolute inset-x-0 top-full bg-black/95 backdrop-blur-xl transition-all duration-500 ease-out-expo ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
        style={{ height: "100dvh" }}
      >
        <div className="flex flex-col h-full px-6 pt-8 pb-safe">
          <div className="flex flex-col gap-1">
            {nav.links.map((l, i) => (
              <SmartLink
                key={l.label + l.href}
                href={l.href}
                onClick={close}
                className={`text-4xl font-black tracking-tight text-white py-3 border-b border-white/10 flex items-center justify-between transition-all duration-500 ease-out-expo ${
                  menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: menuOpen ? `${80 + i * 60}ms` : "0ms" }}
              >
                {l.label}
                <span className="text-accent text-2xl">→</span>
              </SmartLink>
            ))}
          </div>
          <SmartLink
            href={nav.ctaLink}
            onClick={close}
            className={`mt-8 text-center px-6 py-4 text-base font-bold text-white bg-[#7f0000] rounded-full transition-all duration-500 ${
              menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: menuOpen ? `${120 + nav.links.length * 60}ms` : "0ms" }}
          >
            {nav.ctaText}
          </SmartLink>
        </div>
      </div>
    </header>
  );
}
