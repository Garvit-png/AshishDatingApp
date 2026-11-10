"use client";

import { useRef } from "react";
import Image from "next/image";
import { useContent } from "@/content/ContentContext";
import { useScrollProgress } from "@/hooks/useScrollProgress";

export default function EyeRollSection() {
  const { content, asset } = useContent();
  const { bigText, image } = content.eyeroll;
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  const containerRef = useScrollProgress<HTMLDivElement>((p) => {
    if (imageRef.current) imageRef.current.style.transform = `scale(${0.2 + p * 0.65}) rotate(${(1 - p) * -8}deg)`;
    if (textRef.current) {
      textRef.current.style.transform = `scale(${1 + p * 0.15})`;
      textRef.current.style.letterSpacing = `${-0.05 + p * 0.03}em`;
    }
    if (indicatorRef.current) indicatorRef.current.style.opacity = `${Math.max(0, 1 - p * 3)}`;
  });

  const words = bigText.trim().split(/\s+/);

  return (
    <div ref={containerRef} className="relative w-full h-[200vh] md:h-[300vh]">
      <div className="sticky top-0 w-full h-[100svh] bg-black flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <div
            ref={textRef}
            className="font-black uppercase text-accent leading-[0.85] text-center opacity-90 text-[28vw] md:text-[18vw] will-change-transform"
          >
            {/* One word per line on phones, single line on desktop */}
            {words.map((w, i) => (
              <span key={i} className="block md:inline">
                {w}
                {i < words.length - 1 && <span className="hidden md:inline">&nbsp;</span>}
              </span>
            ))}
          </div>
        </div>

        <div ref={imageRef} className="relative z-10 w-[70vw] md:w-[60vw] max-w-[700px] will-change-transform" style={{ transform: "scale(0.2)" }}>
          <div className="relative overflow-hidden rounded-3xl shadow-[0_30px_120px_-20px_rgba(0,0,0,0.9)]">
            <Image src={asset(image)} alt="" width={700} height={700} sizes="(max-width: 768px) 70vw, 700px" className="w-full h-auto block" />
          </div>
        </div>

        <div ref={indicatorRef} className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
          <span className="text-white/50 uppercase tracking-[0.4em] text-xs font-light">scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent animate-bounce" />
        </div>
      </div>
    </div>
  );
}
