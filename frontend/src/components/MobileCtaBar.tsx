"use client";

import { useEffect, useState } from "react";
import { useContent } from "@/content/ContentContext";
import SmartLink from "./SmartLink";

/** Sticky "buy" button at the bottom of phones, shown after the first screen. */
export default function MobileCtaBar() {
  const { content } = useContent();
  const { stickyMobileCta, mobileCtaText, mobileCtaLink } = content.settings;
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY > document.documentElement.scrollHeight - 500;
      setShow(window.scrollY > window.innerHeight * 1.2 && !nearBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!stickyMobileCta || !mobileCtaText) return null;

  return (
    <div
      className={`md:hidden fixed inset-x-0 bottom-0 z-40 px-4 pt-3 pb-safe bg-gradient-to-t from-black via-black/90 to-transparent transition-all duration-500 ease-out-expo ${
        show ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <SmartLink
        href={mobileCtaLink}
        className="btn-shine flex items-center justify-center gap-2 w-full py-4 rounded-full bg-[#7f0000] text-white font-bold text-base shadow-[0_10px_40px_-10px_var(--accent-color)] active:scale-[0.98] transition-transform"
      >
        {mobileCtaText}
        <span aria-hidden>→</span>
      </SmartLink>
    </div>
  );
}
