"use client";

import { popupInSchedule } from "@/content/normalize";
import { Card, PanelHeader } from "./fields";
import { Icon } from "./icons";
import type { PanelProps } from "./panels";

export default function OverviewPanel({ c, go, lastPublished }: PanelProps & { go: (tab: string) => void; lastPublished: string | null }) {
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const livePopups = c.popups.filter((p) => p.enabled && popupInSchedule(p)).length;

  const stats = [
    { label: "Products showing", value: c.products.items.filter((p) => !p.hidden).length, icon: "book", tab: "products" },
    { label: "Live popups", value: livePopups, icon: "megaphone", tab: "popups" },
    { label: "Testimonials", value: c.testimonials.screenshots.length, icon: "star", tab: "testimonials" },
    { label: "1-on-1 sessions", value: c.booking.sessions.length, icon: "calendar", tab: "booking" },
  ];

  const actions = [
    { label: "Add a new playbook", icon: "plus", tab: "products" },
    { label: "Create a popup offer", icon: "megaphone", tab: "popups" },
    { label: "Change the headline", icon: "sparkles", tab: "hero" },
    { label: "Upload testimonials", icon: "upload", tab: "testimonials" },
    { label: "Show an announcement strip", icon: "nav", tab: "header" },
    { label: "Reorder homepage sections", icon: "layout", tab: "layout" },
  ];

  return (
    <>
      <PanelHeader title={`${greet} 👋`} desc="This is your website control room. Change anything, check the live preview, then press Publish." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {stats.map((s, i) => (
          <button
            key={s.label}
            onClick={() => go(s.tab)}
            className="text-left rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.05] to-transparent p-4 hover:border-white/20 hover:-translate-y-0.5 transition-all admin-fade"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <Icon name={s.icon} className="w-5 h-5 text-[#ff5252] mb-3" />
            <p className="text-3xl font-black tabular-nums">{s.value}</p>
            <p className="text-xs text-white/45 mt-0.5">{s.label}</p>
          </button>
        ))}
      </div>

      <Card title="Quick actions">
        <div className="grid sm:grid-cols-2 gap-2">
          {actions.map((a) => (
            <button
              key={a.label}
              onClick={() => go(a.tab)}
              className="group flex items-center gap-3 rounded-xl border border-white/[0.06] bg-black/30 px-4 py-3 text-sm text-left hover:border-[#ff3b3b]/40 hover:bg-[#ff3b3b]/5 transition-all"
            >
              <span className="w-8 h-8 rounded-lg bg-white/5 grid place-items-center group-hover:bg-[#d40000] transition-colors">
                <Icon name={a.icon} className="w-4 h-4" />
              </span>
              <span className="flex-1 font-medium">{a.label}</span>
              <span className="text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all">→</span>
            </button>
          ))}
        </div>
      </Card>

      <Card title="How it works">
        <ol className="grid sm:grid-cols-3 gap-3">
          {[
            ["1", "Edit", "Pick a section on the left and change the text, images or links."],
            ["2", "Preview", "Watch your changes live in the preview — on computer and phone."],
            ["3", "Publish", "Press the red Publish button. The live site updates in about 1–2 minutes."],
          ].map(([n, t, d]) => (
            <li key={n} className="rounded-xl bg-black/30 border border-white/[0.06] p-4">
              <span className="inline-grid place-items-center w-7 h-7 rounded-full bg-[#d40000] text-xs font-black mb-3">{n}</span>
              <p className="font-bold text-sm">{t}</p>
              <p className="text-xs text-white/45 mt-1 leading-relaxed">{d}</p>
            </li>
          ))}
        </ol>
        <p className="text-xs text-white/35 flex items-center gap-2">
          <Icon name="check" className="w-3.5 h-3.5 text-emerald-400" />
          Your unsaved edits are kept on this device, so closing the tab won&apos;t lose them.
          {lastPublished && <span className="ml-auto hidden sm:inline">Last published {lastPublished}</span>}
        </p>
      </Card>
    </>
  );
}
