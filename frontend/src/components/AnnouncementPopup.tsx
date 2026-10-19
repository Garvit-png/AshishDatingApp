"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import popupData from "@/data/popup.json";

interface PopupItem {
  id: number;
  enabled: boolean;
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  buttonStyle: "red" | "white" | "black";
}

// Only show enabled popups
const activePopups = (popupData.popups as PopupItem[]).filter((p) => p.enabled);

export default function AnnouncementPopup() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (activePopups.length === 0) return;
    const dismissed = sessionStorage.getItem("popups_dismissed");
    if (dismissed) return;
    const timer = setTimeout(() => setVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    if (index < activePopups.length - 1) {
      // Animate out, then show next
      setAnimating(true);
      setTimeout(() => {
        setIndex((i) => i + 1);
        setAnimating(false);
      }, 200);
    } else {
      // All done
      setVisible(false);
      sessionStorage.setItem("popups_dismissed", "1");
    }
  };

  if (!visible || activePopups.length === 0) return null;

  const popup = activePopups[index];
  const total = activePopups.length;

  const btnClass =
    popup.buttonStyle === "red"
      ? "bg-[#7f0000] hover:bg-[#990000] text-white"
      : popup.buttonStyle === "white"
      ? "bg-white hover:bg-gray-100 text-black"
      : "bg-black hover:bg-[#111] text-white border border-white/20";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]"
        style={{ animation: "fade-in 0.2s ease forwards" }}
        onClick={handleClose}
      />

      {/* Popup */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center px-4 pointer-events-none">
        <div
          key={index}
          className="relative bg-[#0a0a0a] border border-[#222] rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto overflow-hidden"
          style={{
            animation: animating
              ? "popup-out 0.2s ease forwards"
              : "popup-in 0.28s cubic-bezier(0.34,1.56,0.64,1) forwards",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top bar — counter + close */}
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            {/* Dot indicators */}
            <div className="flex items-center gap-1.5">
              {total > 1 && activePopups.map((_, i) => (
                <span
                  key={i}
                  className={`rounded-full transition-all duration-300 ${
                    i === index
                      ? "w-4 h-1.5 bg-white"
                      : i < index
                      ? "w-1.5 h-1.5 bg-[#555]"
                      : "w-1.5 h-1.5 bg-[#333]"
                  }`}
                />
              ))}
            </div>

            {/* Counter + Close */}
            <div className="flex items-center gap-3 ml-auto">
              {total > 1 && (
                <span className="text-[#555] text-xs font-medium">{index + 1} / {total}</span>
              )}
              <button
                onClick={handleClose}
                className="w-7 h-7 bg-white/15 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all border border-white/30"
                aria-label={index < total - 1 ? "Next" : "Close"}
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Image */}
          {popup.image && (
            <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
              <Image
                src={popup.image}
                alt={popup.title || "Announcement"}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
            </div>
          )}

          {/* Content */}
          <div className="px-5 pb-5 pt-3">
            {popup.title && (
              <h2 className="text-xl font-black text-white mb-2 leading-tight">{popup.title}</h2>
            )}
            {popup.description && (
              <p className="text-[#888] text-sm leading-relaxed mb-5">{popup.description}</p>
            )}

            <div className="flex flex-col gap-2">
              {popup.buttonText && popup.buttonLink && (
                <Link
                  href={popup.buttonLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleClose}
                  className={`inline-flex items-center justify-center w-full py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] ${btnClass}`}
                >
                  {popup.buttonText}
                </Link>
              )}

              {/* Skip to next or close */}
              {index < total - 1 && (
                <button
                  onClick={handleClose}
                  className="w-full py-2.5 text-[#555] hover:text-white text-xs transition-colors"
                >
                  Skip →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in { from { opacity: 0 } to { opacity: 1 } }
        @keyframes popup-in {
          from { opacity: 0; transform: scale(0.92) translateY(16px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes popup-out {
          from { opacity: 1; transform: scale(1) translateY(0); }
          to   { opacity: 0; transform: scale(0.94) translateY(-10px); }
        }
      `}</style>
    </>
  );
}
