"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useContent } from "@/content/ContentContext";
import { popupInSchedule } from "@/content/normalize";
import type { Popup } from "@/content/types";
import PopupView from "./PopupView";

const seenKey = (p: Popup) => `ac_popup_${p.id}`;

function alreadySeen(p: Popup): boolean {
  try {
    if (p.frequency === "always") return false;
    if (p.frequency === "session") return !!sessionStorage.getItem(seenKey(p));
    const at = Number(localStorage.getItem(seenKey(p)) || 0);
    if (!at) return false;
    if (p.frequency === "daily") return Date.now() - at < 24 * 60 * 60 * 1000;
    return true; // "once"
  } catch {
    return false;
  }
}

function markSeen(p: Popup) {
  try {
    if (p.frequency === "session") sessionStorage.setItem(seenKey(p), "1");
    else if (p.frequency !== "always") localStorage.setItem(seenKey(p), String(Date.now()));
  } catch {}
}

/** Decides WHEN popups appear (page, device, schedule, trigger, frequency) and shows them one by one. */
export default function AnnouncementPopup() {
  const { content, preview, asset } = useContent();
  const pathname = usePathname();
  const [queue, setQueue] = useState<Popup[]>([]);
  const [closing, setClosing] = useState(false);

  const enqueue = useCallback((p: Popup) => {
    setQueue((q) => (q.some((x) => x.id === p.id) ? q : [...q, p]));
  }, []);

  useEffect(() => {
    if (preview) return; // the dashboard has its own popup preview
    const page = pathname === "/" ? "home" : pathname.startsWith("/courses") ? "courses" : "other";
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const eligible = content.popups.filter(
      (p) =>
        p.enabled &&
        popupInSchedule(p) &&
        (p.pages === "all" || p.pages === page) &&
        (p.device === "all" || (p.device === "mobile") === mobile) &&
        !alreadySeen(p)
    );
    if (!eligible.length) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    const cleanups: (() => void)[] = [];

    for (const p of eligible) {
      if (p.trigger === "load") {
        timers.push(setTimeout(() => enqueue(p), Math.max(0, p.delaySeconds) * 1000));
      } else if (p.trigger === "scroll") {
        const onScroll = () => {
          const max = document.documentElement.scrollHeight - window.innerHeight;
          if (max > 0 && (window.scrollY / max) * 100 >= p.scrollPercent) {
            enqueue(p);
            window.removeEventListener("scroll", onScroll);
          }
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        cleanups.push(() => window.removeEventListener("scroll", onScroll));
      } else if (p.trigger === "exit") {
        if (mobile) {
          // Phones have no "mouse leaving" — show after they've spent some time instead
          timers.push(setTimeout(() => enqueue(p), Math.max(15, p.delaySeconds) * 1000));
        } else {
          const onLeave = (e: MouseEvent) => {
            if (e.clientY <= 0) {
              enqueue(p);
              document.removeEventListener("mouseout", onLeave);
            }
          };
          // Small grace period so it doesn't fire instantly
          timers.push(setTimeout(() => document.addEventListener("mouseout", onLeave), 3000));
          cleanups.push(() => document.removeEventListener("mouseout", onLeave));
        }
      }
    }
    return () => {
      timers.forEach(clearTimeout);
      cleanups.forEach((c) => c());
    };
  }, [content.popups, pathname, preview, enqueue]);

  const current = queue[0];

  const close = useCallback(() => {
    if (!current || closing) return;
    markSeen(current);
    setClosing(true);
    setTimeout(() => {
      setQueue((q) => q.slice(1));
      setClosing(false);
    }, 220);
  }, [current, closing]);


  // Lock background scroll for centred popups
  useEffect(() => {
    if (!current || current.position !== "center") return;
    window.__lenis?.stop();
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
      window.__lenis?.start();
    };
  }, [current]);

  useEffect(() => {
    if (!current) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, close]);

  if (!current) return null;
  return <PopupView key={current.id} popup={current} onClose={close} closing={closing} step={queue.length > 1 ? `1 / ${queue.length}` : undefined} asset={asset} />;
}
