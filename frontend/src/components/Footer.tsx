"use client";

import Link from "next/link";
import LazyVideo from "./LazyVideo";

const instagramIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

export default function Footer() {

  return (
    <footer className="relative border-t border-white/10 overflow-hidden">
      {/* Background — Video everywhere */}
      <LazyVideo
        src="/ghoda.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div className="absolute inset-0 bg-black/60 z-0" />

      {/* Main Footer */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Column – Ashish Chhipa */}
          <div>
            <h3 className="text-base font-black text-white tracking-widest uppercase mb-4">
              Ashish Chhipa
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed max-w-sm mb-6">
              Ashish Chhipa is a dating coach and content creator who helps people build confidence,
              understand the science behind attraction, and improve their dating skills. To improve his
              advice based on psychology and real-life experience, he pledges his values to
              communicate better, form meaningful connections, and navigate love in the early and
              confident way.
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="https://www.instagram.com/ashishchhipaofficial/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-gray-500 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-all duration-200 hover:scale-110"
                aria-label="Instagram"
              >
                {instagramIcon}
              </Link>
            </div>
          </div>

          {/* Right Column – Sellixa */}
          <div className="md:border-l md:border-white/10 md:pl-12 lg:pl-20">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h3 className="text-base font-black text-white tracking-widest uppercase">
                Sellixa
              </h3>
              <span className="text-xs text-gray-400 font-medium italic">Made In Collaboration</span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed max-w-sm mb-6">
              Sellixa helps coaches and teachers to offer their income through courses, ebooks, webinars, and growth
              speakers.
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="https://www.instagram.com/sellixa._hq/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-gray-500 flex items-center justify-center text-gray-400 hover:text-white hover:border-white transition-all duration-200 hover:scale-110"
                aria-label="Sellixa Instagram"
              >
                {instagramIcon}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            Copyright © 2025 Appvision, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            {["Privacy Policy", "Terms of Use", "Cookie Policy", "Preferences", "Privacy List", "Accessibility"].map(
              (item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  {item}
                </Link>
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
