"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SiteContent } from "@/content/types";
import { PREVIEW_MESSAGE, PREVIEW_READY, PREVIEW_SCROLL } from "@/content/ContentContext";
import { Icon } from "./icons";

const SIZES = { desktop: { w: 1366, h: 900 }, phone: { w: 390, h: 844 } };

/** The real website in an iframe, fed with the unpublished draft in real time. */
export default function LivePreview({
  content,
  assets,
  page,
  scrollTo,
  onPage,
  onClose,
}: {
  content: SiteContent;
  assets: Record<string, string>;
  page: string;
  scrollTo?: string;
  onPage: (p: string) => void;
  onClose?: () => void;
}) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [device, setDevice] = useState<"desktop" | "phone">("desktop");
  const [scale, setScale] = useState(0.5);
  const [frameH, setFrameH] = useState(SIZES.desktop.h);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const latest = useRef({ content, assets });

  const send = useCallback(() => {
    frameRef.current?.contentWindow?.postMessage({ type: PREVIEW_MESSAGE, ...latest.current }, window.location.origin);
  }, []);

  useEffect(() => {
    latest.current = { content, assets };
    send();
  }, [content, assets, send]);

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.origin === window.location.origin && e.data?.type === PREVIEW_READY && e.source === frameRef.current?.contentWindow) {
        send();
        setLoading(false);
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [send]);

  useEffect(() => {
    if (scrollTo) frameRef.current?.contentWindow?.postMessage({ type: PREVIEW_SCROLL, id: scrollTo }, window.location.origin);
  }, [scrollTo, loading]);

  // Fit the virtual screen into the available space
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const fit = () => {
      const { w, h } = SIZES[device];
      const sx = (box.clientWidth - 24) / w;
      const sy = (box.clientHeight - 24) / h;
      const k = Math.max(0.15, Math.min(1, device === "phone" ? Math.min(sx, sy) : sx));
      setScale(k);
      // Desktop: fill the whole panel height
      setFrameH(device === "desktop" ? Math.max(500, (box.clientHeight - 24) / k) : h);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(box);
    return () => ro.disconnect();
  }, [device]);

  const { w } = SIZES[device];

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-white/[0.06]">
        <div className="flex gap-1 p-0.5 rounded-lg bg-white/5">
          {[
            ["/", "Home"],
            ["/courses", "Courses"],
          ].map(([p, l]) => (
            <button
              key={p}
              onClick={() => {
                setLoading(true);
                onPage(p);
              }}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${page === p ? "bg-white text-black" : "text-white/50 hover:text-white"}`}
            >
              {l}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        {(["desktop", "phone"] as const).map((d) => (
          <button key={d} onClick={() => setDevice(d)} title={d === "desktop" ? "Computer" : "Phone"} className={`w-8 h-8 rounded-lg grid place-items-center transition ${device === d ? "bg-white text-black" : "text-white/50 hover:text-white hover:bg-white/5"}`}>
            <Icon name={d === "desktop" ? "monitor" : "phone"} />
          </button>
        ))}
        <button
          onClick={() => {
            setLoading(true);
            setReloadKey((k) => k + 1);
          }}
          title="Reload preview"
          className="w-8 h-8 rounded-lg grid place-items-center text-white/50 hover:text-white hover:bg-white/5"
        >
          <Icon name="refresh" />
        </button>
        {onClose && (
          <button onClick={onClose} title="Close preview" className="w-8 h-8 rounded-lg grid place-items-center text-white/50 hover:text-white hover:bg-white/5">
            <Icon name="x" />
          </button>
        )}
      </div>

      <div ref={boxRef} className="relative flex-1 min-h-0 overflow-hidden bg-[radial-gradient(circle_at_50%_0%,#1a0505,#050505_70%)] grid place-items-start justify-center pt-3">
        <div
          className={`relative overflow-hidden bg-black shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] transition-[border-radius] ${device === "phone" ? "ring-[10px] ring-[#1d1d1d]" : "ring-1 ring-white/10"}`}
          style={{ width: w * scale, height: frameH * scale, borderRadius: device === "phone" ? 44 * scale + 10 : 10 }}
        >
          <iframe
            key={`${page}-${reloadKey}`}
            ref={frameRef}
            src={`${page}?preview=1`}
            title="Website preview"
            className="absolute top-0 left-0 origin-top-left border-0 bg-black"
            style={{ width: w, height: frameH, transform: `scale(${scale})` }}
          />
          {loading && (
            <div className="absolute inset-0 grid place-items-center bg-black/80">
              <span className="w-7 h-7 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>
      <p className="text-[10px] text-white/30 text-center py-2 border-t border-white/[0.06]">Preview of your unpublished changes · scroll inside to explore</p>
    </div>
  );
}
