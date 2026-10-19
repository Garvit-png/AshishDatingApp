"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import popupData from "@/data/popup.json";

interface PopupData {
  enabled: boolean;
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  buttonStyle: "red" | "white" | "black";
}

const data = popupData as PopupData;

export default function AnnouncementPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!data.enabled) return;

    // Show popup 1s after page load, only once per session
    const dismissed = sessionStorage.getItem("popup_dismissed");
    if (dismissed) return;

    const timer = setTimeout(() => setVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setVisible(false);
    sessionStorage.setItem("popup_dismissed", "1");
  };

  if (!visible || !data.enabled) return null;

  const btnClass =
    data.buttonStyle === "red"
      ? "bg-[#7f0000] hover:bg-[#990000] text-white"
      : data.buttonStyle === "white"
      ? "bg-white hover:bg-gray-100 text-black"
      : "bg-black hover:bg-[#111] text-white border border-white/20";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] animate-fade-in"
        onClick={handleClose}
      />

      {/* Popup */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center px-4 pointer-events-none">
        <div
          className="relative bg-[#0a0a0a] border border-[#222] rounded-2xl shadow-2xl w-full max-w-md pointer-events-auto overflow-hidden animate-popup-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 z-10 w-8 h-8 bg-black/60 hover:bg-black rounded-full flex items-center justify-center text-[#888] hover:text-white transition-all border border-white/10"
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>

          {/* Image */}
          {data.image && (
            <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
              <Image
                src={data.image}
                alt={data.title || "Announcement"}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
            </div>
          )}

          {/* Content */}
          <div className="px-6 pb-6 pt-4">
            {data.title && (
              <h2 className="text-xl font-black text-white mb-2 leading-tight">{data.title}</h2>
            )}
            {data.description && (
              <p className="text-[#888] text-sm leading-relaxed mb-5">{data.description}</p>
            )}
            {data.buttonText && data.buttonLink && (
              <Link
                href={data.buttonLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClose}
                className={`inline-flex items-center justify-center w-full py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] ${btnClass}`}
              >
                {data.buttonText}
              </Link>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popup-in {
          from { opacity: 0; transform: scale(0.92) translateY(16px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.2s ease forwards; }
        .animate-popup-in { animation: popup-in 0.25s cubic-bezier(0.34,1.56,0.64,1) forwards; }
      `}</style>
    </>
  );
}
