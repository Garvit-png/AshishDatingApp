"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { SiteContent } from "./types";

export const PREVIEW_MESSAGE = "ac-preview-content";
export const PREVIEW_READY = "ac-preview-ready";
export const PREVIEW_SCROLL = "ac-preview-scroll";

interface ContentCtx {
  content: SiteContent;
  /** true when rendered inside the admin dashboard's live preview */
  preview: boolean;
  /** Maps an image/video path to something the browser can show (handles not-yet-deployed uploads in preview) */
  asset: (src: string) => string;
}

const Ctx = createContext<ContentCtx | null>(null);

export function ContentProvider({ initial, children }: { initial: SiteContent; children: React.ReactNode }) {
  const [content, setContent] = useState(initial);
  const [assets, setAssets] = useState<Record<string, string>>({});
  // Only used inside effects, so it is safe for this to differ between server and browser
  const [preview] = useState(
    () => typeof window !== "undefined" && window.parent !== window && new URLSearchParams(window.location.search).get("preview") === "1"
  );

  useEffect(() => {
    if (!preview) return;
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type === PREVIEW_MESSAGE) {
        setContent(e.data.content as SiteContent);
        setAssets(e.data.assets ?? {});
      } else if (e.data?.type === PREVIEW_SCROLL) {
        const el = document.getElementById(e.data.id);
        if (!el) return;
        if (window.__lenis) window.__lenis.scrollTo(el, { immediate: true });
        else el.scrollIntoView({ block: "start" });
      }
    };
    window.addEventListener("message", onMessage);
    window.parent.postMessage({ type: PREVIEW_READY }, window.location.origin);
    return () => window.removeEventListener("message", onMessage);
  }, [preview]);

  // Accent colour is a CSS variable so every section picks it up
  useEffect(() => {
    document.documentElement.style.setProperty("--accent-color", content.settings.accentColor);
    document.documentElement.dataset.motion = content.settings.animations ? "on" : "off";
  }, [content.settings.accentColor, content.settings.animations]);

  const asset = useCallback((src: string) => assets[src] ?? src, [assets]);
  const value = useMemo(() => ({ content, preview, asset }), [content, preview, asset]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useContent() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useContent must be used inside <ContentProvider>");
  return v;
}
