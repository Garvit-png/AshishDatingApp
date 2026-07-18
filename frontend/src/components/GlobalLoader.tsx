"use client";

import { useEffect, useState } from "react";

export default function GlobalLoader() {
  const [loading, setLoading] = useState(true);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    // Attempt to preload the main hero video
    const video = document.createElement("video");
    video.src = "/shuru.mp4";
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;

    let isDone = false;

    const finishLoading = () => {
      if (isDone) return;
      isDone = true;
      setOpacity(0);
      setTimeout(() => setLoading(false), 600); // Match transition duration
    };

    // Safety timeout in case the video takes too long to load (max 3 seconds)
    const timeout = setTimeout(() => {
      finishLoading();
    }, 3000);

    video.oncanplaythrough = () => {
      clearTimeout(timeout);
      finishLoading();
    };

    video.onerror = () => {
      clearTimeout(timeout);
      finishLoading();
    };

    video.load();

    return () => {
      clearTimeout(timeout);
      video.oncanplaythrough = null;
      video.onerror = null;
    };
  }, []);

  if (!loading) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center pointer-events-none"
      style={{ 
        opacity, 
        transition: "opacity 0.6s cubic-bezier(0.87, 0, 0.13, 1)",
      }}
    >
      <div className="relative flex flex-col items-center gap-8">
        {/* Simple elegant loader */}
        <div className="w-10 h-10 border-2 border-white/20 border-t-[#ff1a1a] rounded-full animate-spin"></div>
        <span className="text-white/80 uppercase tracking-[0.5em] text-xs font-medium animate-pulse drop-shadow-[0_0_10px_rgba(255,26,26,0.5)]">
          Unlocking
        </span>
      </div>
    </div>
  );
}
