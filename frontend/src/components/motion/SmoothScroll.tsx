"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { useContent } from "@/content/ContentContext";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/** Buttery smooth scrolling on desktop (mouse/trackpad). Phones keep their native scrolling. */
export default function SmoothScroll() {
  const { content } = useContent();
  const enabled = content.settings.smoothScroll;

  useEffect(() => {
    if (!enabled) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    const lenis = new Lenis({ autoRaf: true, anchors: { offset: -72 }, lerp: 0.11 });
    window.__lenis = lenis;
    return () => {
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, [enabled]);

  return null;
}

/** Scroll to "#id" (smoothly) or navigate to a normal URL. */
export function goTo(href: string) {
  if (!href) return;
  if (href.startsWith("#")) {
    const el = document.getElementById(href.slice(1));
    if (!el) return;
    if (window.__lenis) window.__lenis.scrollTo(el, { offset: -72 });
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  if (/^https?:\/\//.test(href)) window.open(href, "_blank", "noopener,noreferrer");
  else window.location.href = href;
}
