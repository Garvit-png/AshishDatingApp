"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent"
    >
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
            <Link
              href="#playbooks"
              className="text-base font-medium text-white transition-colors duration-200 relative group"
            >
              Get Playbooks
              <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#7f0000] group-hover:w-full transition-all duration-300" />
            </Link>
            <Link
              href="#testimonials"
              className="text-base font-medium text-white transition-colors duration-200 relative group"
            >
              Testimonials
              <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#7f0000] group-hover:w-full transition-all duration-300" />
            </Link>
          </div>

          {/* Login Button */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="#login"
              className="px-6 py-2.5 text-base font-semibold text-white bg-black rounded-md hover:bg-gray-800 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Login / Sign Up
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-64 border-t border-white/10" : "max-h-0"}`}
      >
        <div className="px-6 py-4 flex flex-col gap-4 bg-black">
          <Link href="#playbooks" className="text-base font-medium text-white" onClick={() => setMenuOpen(false)}>
            Get Playbooks
          </Link>
          <Link href="#testimonials" className="text-base font-medium text-white" onClick={() => setMenuOpen(false)}>
            Testimonials
          </Link>
          <Link
            href="#login"
            className="inline-block text-center px-6 py-2.5 text-base font-semibold text-black bg-white rounded-md hover:bg-gray-100"
            onClick={() => setMenuOpen(false)}
          >
            Login / Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}
