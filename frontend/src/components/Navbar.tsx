"use client";

import { useState } from "react";
import Link from "next/link";

function smoothScrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="text-base font-bold tracking-widest text-white uppercase letter-spacing-ultra">
              ASHISH CHHIPA
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => smoothScrollTo("playbooks")}
              className="text-base font-medium text-white transition-colors duration-200 relative group cursor-pointer"
            >
              Get Playbooks
              <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#7f0000] group-hover:w-full transition-all duration-300" />
            </button>
            <button
              onClick={() => smoothScrollTo("playbooks")}
              className="text-base font-medium text-white transition-colors duration-200 relative group cursor-pointer"
            >
              Explore Courses
              <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#7f0000] group-hover:w-full transition-all duration-300" />
            </button>
          </div>

          {/* Login Button */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => smoothScrollTo("playbooks")}
              className="px-6 py-2.5 text-base font-semibold text-white bg-black rounded-md hover:bg-gray-800 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Explore Books & Courses
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-64 border-t border-white/10" : "max-h-0"}`}>
        <div className="px-6 py-4 flex flex-col gap-4 bg-black">
          <button
            onClick={() => { smoothScrollTo("playbooks"); setMenuOpen(false); }}
            className="text-base font-medium text-white text-left"
          >
            Get Playbooks
          </button>
          <button
            onClick={() => { smoothScrollTo("playbooks"); setMenuOpen(false); }}
            className="text-base font-medium text-white text-left"
          >
            Explore Courses
          </button>
          <button
            onClick={() => { smoothScrollTo("playbooks"); setMenuOpen(false); }}
            className="inline-block text-center px-6 py-2.5 text-base font-semibold text-black bg-white rounded-md hover:bg-gray-100"
          >
            Explore Books & Courses
          </button>
        </div>
      </div>
    </nav>
  );
}
