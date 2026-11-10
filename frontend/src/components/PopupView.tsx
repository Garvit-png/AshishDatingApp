"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Popup } from "@/content/types";
import SmartLink from "./SmartLink";

const THEMES: Record<Popup["theme"], { box: string; text: string; muted: string; close: string }> = {
  dark: { box: "bg-[#0a0a0a] border border-white/10", text: "text-white", muted: "text-white/60", close: "bg-white/10 hover:bg-white/25 text-white" },
  light: { box: "bg-white border border-black/5", text: "text-black", muted: "text-black/60", close: "bg-black/5 hover:bg-black/15 text-black" },
  red: { box: "bg-gradient-to-br from-[#9b0000] via-[#5a0000] to-[#1a0000] border border-white/10", text: "text-white", muted: "text-white/75", close: "bg-black/25 hover:bg-black/45 text-white" },
  glass: { box: "bg-white/10 backdrop-blur-2xl border border-white/25", text: "text-white", muted: "text-white/75", close: "bg-white/15 hover:bg-white/30 text-white" },
  gradient: { box: "border border-white/10", text: "text-white", muted: "text-white/80", close: "bg-black/25 hover:bg-black/45 text-white" },
};

const SIZES: Record<Popup["size"], string> = {
  small: "max-w-sm",
  medium: "max-w-lg",
  large: "max-w-3xl",
};

const ANIM: Record<Popup["animation"], string> = {
  zoom: "pop-zoom 0.45s var(--ease-spring) both",
  "slide-up": "pop-slide-up 0.55s var(--ease-out-expo) both",
  fade: "pop-fade 0.4s ease both",
  bounce: "pop-bounce 0.7s ease both",
  flip: "pop-flip 0.6s var(--ease-out-expo) both",
};

function useCountdown(to: string) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);
  const target = to ? new Date(to).getTime() : NaN;
  if (now === null || Number.isNaN(target)) return null;
  return Math.max(0, target - now);
}

function Countdown({ to, muted, accent }: { to: string; muted: string; accent: string }) {
  const left = useCountdown(to);
  if (left === null) return null;
  const s = Math.floor(left / 1000);
  const parts = [
    { v: Math.floor(s / 86400), l: "Days" },
    { v: Math.floor((s % 86400) / 3600), l: "Hrs" },
    { v: Math.floor((s % 3600) / 60), l: "Min" },
    { v: s % 60, l: "Sec" },
  ];
  return (
    <div className="flex gap-2 mb-5">
      {parts.map((p) => (
        <div key={p.l} className="flex-1 rounded-xl bg-black/30 border border-white/10 py-2 text-center">
          <div className="text-xl font-black tabular-nums" style={{ color: accent }}>
            {String(p.v).padStart(2, "0")}
          </div>
          <div className={`text-[9px] uppercase tracking-widest ${muted}`}>{p.l}</div>
        </div>
      ))}
    </div>
  );
}

export default function PopupView({
  popup: p,
  onClose,
  closing = false,
  contained = false,
  step,
  asset = (s) => s,
}: {
  popup: Popup;
  onClose: () => void;
  closing?: boolean;
  /** render inside a parent box (dashboard preview) instead of over the whole page */
  contained?: boolean;
  step?: string;
  asset?: (src: string) => string;
}) {
  const t = THEMES[p.theme] ?? THEMES.dark;
  const pos = contained ? "absolute" : "fixed";
  const accent = p.accentColor || "#ff1a1a";
  const hasImage = !!p.image && p.layout !== "text-only";
  const side = p.layout === "image-side" && hasImage;
  const imageOnly = p.layout === "image-only" && hasImage;

  const btnStyle: React.CSSProperties =
    p.buttonStyle === "red"
      ? { background: accent, color: "#fff", boxShadow: `0 12px 30px -10px ${accent}` }
      : p.buttonStyle === "white"
      ? { background: "#fff", color: "#000" }
      : p.buttonStyle === "black"
      ? { background: "#000", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }
      : { background: "transparent", color: "inherit", border: "2px solid currentColor" };

  const wrapper =
    p.position === "center"
      ? "inset-0 flex items-center justify-center p-4"
      : p.position === "bottom"
      ? "inset-x-0 bottom-0 flex justify-center sm:p-4"
      : "right-0 bottom-0 p-3 sm:p-5 flex justify-end";

  const box =
    p.position === "bottom"
      ? `w-full ${SIZES[p.size]} rounded-t-3xl sm:rounded-3xl`
      : p.position === "corner"
      ? "w-[min(360px,calc(100vw-1.5rem))] rounded-2xl"
      : `w-full ${SIZES[p.size]} rounded-3xl`;

  const onLink = (e: React.MouseEvent) => {
    if (contained) e.preventDefault();
    onClose();
  };

  const closeBtn = (
    <button
      onClick={onClose}
      aria-label="Close"
      className={`absolute top-3 right-3 z-20 w-9 h-9 rounded-full grid place-items-center backdrop-blur transition-all hover:rotate-90 ${t.close}`}
    >
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
      </svg>
    </button>
  );

  return (
    <div className={`${pos} z-[100] ${contained ? "inset-0" : ""}`} role="dialog" aria-modal={p.position === "center"} aria-label={p.title || p.name}>
      {p.position === "center" && (
        <div
          className={`${contained ? "absolute" : "fixed"} inset-0 bg-black/70 backdrop-blur-sm`}
          style={{ animation: closing ? "pop-out 0.2s ease forwards" : "pop-fade 0.3s ease both" }}
          onClick={onClose}
        />
      )}
      <div className={`${pos} ${wrapper} pointer-events-none`}>
        <div
          className={`relative pointer-events-auto overflow-hidden shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)] ${t.box} ${box} ${t.text} ${
            side ? "sm:grid sm:grid-cols-2" : ""
          } max-h-[calc(100%-1rem)] overflow-y-auto no-scrollbar`}
          style={{
            animation: closing ? "pop-out 0.2s ease forwards" : ANIM[p.animation],
            ...(p.theme === "gradient" ? { background: `linear-gradient(135deg, ${accent} 0%, #2a0000 55%, #000 100%)` } : {}),
          }}
        >
          {closeBtn}

          {imageOnly ? (
            <SmartLink href={p.buttonLink || "#"} onClick={onLink} className="block relative w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(p.image)} alt={p.title || "Announcement"} className="w-full h-auto block" />
            </SmartLink>
          ) : (
            <>
              {hasImage && (
                <div className={`relative w-full ${side ? "aspect-[4/3] sm:aspect-auto sm:h-full sm:min-h-[320px]" : p.position === "corner" ? "aspect-[16/9]" : "aspect-[16/9]"}`}>
                  <Image src={asset(p.image)} alt="" fill sizes="(max-width: 768px) 100vw, 600px" className="object-cover" />
                  {!side && <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />}
                </div>
              )}

              <div className={`${p.position === "corner" ? "p-5" : "p-6 sm:p-8"} ${side ? "flex flex-col justify-center" : ""} ${!hasImage ? "pt-12" : ""}`}>
                {(p.badge || step) && (
                  <div className="flex items-center gap-2 mb-3">
                    {p.badge && (
                      <span className="text-[10px] font-black tracking-[0.2em] uppercase px-2.5 py-1 rounded-full text-white" style={{ background: accent }}>
                        {p.badge}
                      </span>
                    )}
                    {step && <span className={`text-[10px] ${t.muted}`}>{step}</span>}
                  </div>
                )}
                {p.title && <h2 className={`${p.position === "corner" ? "text-lg" : "text-2xl sm:text-3xl"} font-black leading-tight mb-2`}>{p.title}</h2>}
                {p.description && <p className={`${t.muted} text-sm sm:text-base leading-relaxed mb-5 whitespace-pre-line`}>{p.description}</p>}

                {p.countdownTo && <Countdown to={p.countdownTo} muted={t.muted} accent={p.theme === "light" ? accent : "#fff"} />}

                <div className="flex flex-col gap-2">
                  {p.buttonText && p.buttonLink && (
                    <SmartLink
                      href={p.buttonLink}
                      onClick={onLink}
                      className="btn-shine inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold text-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
                      style={btnStyle}
                    >
                      {p.buttonText} <span aria-hidden>→</span>
                    </SmartLink>
                  )}
                  {p.dismissText && (
                    <button onClick={onClose} className={`w-full py-2 text-xs ${t.muted} hover:opacity-100 opacity-80 transition-opacity`}>
                      {p.dismissText}
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
