"use client";

import { useContext, useState } from "react";
import type { Popup } from "@/content/types";
import { NEW_POPUP } from "@/content/defaults";
import { popupInSchedule } from "@/content/normalize";
import PopupView from "@/components/PopupView";
import { Btn, Card, Choice, ColorPicker, DateInput, Empty, Grid, ItemControls, LinkInput, MediaPicker, NumberInput, PanelHeader, Text, TextArea, Toggle, UploadCtx, move } from "./fields";
import { Icon } from "./icons";
import type { PanelProps } from "./panels";

const inAWeek = () => {
  const d = new Date(Date.now() + 7 * 864e5);
  d.setHours(23, 59, 0, 0);
  return new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 16);
};

const TEMPLATES: { name: string; desc: string; emoji: string; make: () => Partial<Popup> }[] = [
  { name: "Launch", desc: "Announce a new playbook", emoji: "🚀", make: () => ({ name: "New launch", badge: "JUST DROPPED", title: "New Playbook Just Dropped 🔥", description: "The exact system I use — now in one book.", buttonText: "Get it now", buttonLink: "#playbooks", theme: "dark", layout: "image-top", animation: "zoom" }) },
  { name: "Flash sale", desc: "Countdown timer offer", emoji: "⏳", make: () => ({ name: "Flash sale", badge: "FLASH SALE", title: "50% off ends soon", description: "All playbooks at half price. Don't miss it.", buttonText: "Grab the deal", buttonLink: "#playbooks", theme: "gradient", layout: "text-only", animation: "bounce", countdownTo: inAWeek(), frequency: "daily" }) },
  { name: "Book a call", desc: "Push 1-on-1 sessions", emoji: "📞", make: () => ({ name: "Book a call", badge: "1-ON-1", title: "Stuck in chats? Let's fix it live.", description: "Personal guidance on a call with Ashish.", buttonText: "Book a session", buttonLink: "#book", theme: "red", layout: "text-only", animation: "slide-up", position: "bottom", trigger: "scroll", scrollPercent: 50 }) },
  { name: "Corner nudge", desc: "Small, not annoying", emoji: "💬", make: () => ({ name: "Corner nudge", badge: "", title: "Free tip inside 👀", description: "Check out the Opener Vault — 50 openers that work.", buttonText: "Show me", buttonLink: "#playbooks", theme: "glass", layout: "text-only", position: "corner", size: "small", animation: "slide-up", dismissText: "", trigger: "scroll", scrollPercent: 30 }) },
  { name: "Exit offer", desc: "When they're about to leave", emoji: "🚪", make: () => ({ name: "Exit offer", badge: "WAIT!", title: "Before you go…", description: "Take the bestseller with you.", buttonText: "Show me", buttonLink: "#playbooks", theme: "light", layout: "text-only", animation: "flip", trigger: "exit", frequency: "once" }) },
  { name: "Blank", desc: "Start from scratch", emoji: "✨", make: () => ({}) },
];

const newId = () => Date.now();

function status(p: Popup): { label: string; cls: string } {
  if (!p.enabled) return { label: "Off", cls: "bg-white/5 text-white/40 border-white/10" };
  const today = new Date().toISOString().slice(0, 10);
  if (p.endDate && today > p.endDate) return { label: "Ended", cls: "bg-white/5 text-white/40 border-white/10" };
  if (!popupInSchedule(p)) return { label: "Scheduled", cls: "bg-sky-500/10 text-sky-400 border-sky-500/30" };
  return { label: "Live", cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" };
}

export default function PopupsPanel({ c, set }: PanelProps) {
  const [editing, setEditing] = useState<number | null>(null);
  const [picking, setPicking] = useState(false);
  const popups = c.popups;
  const idx = popups.findIndex((p) => p.id === editing);

  const create = (tpl: Partial<Popup>) => {
    const id = newId();
    set((d) => void d.popups.push({ ...NEW_POPUP, ...tpl, id }));
    setPicking(false);
    setEditing(id);
  };

  if (idx >= 0) {
    return <PopupEditor popup={popups[idx]} onBack={() => setEditing(null)} edit={(fn) => set((d) => fn(d.popups[idx]))} />;
  }

  return (
    <>
      <PanelHeader title="Popups" desc="Eye-catching boxes for offers and launches. You decide how they look, where they appear and when.">
        <Btn variant="primary" onClick={() => setPicking(true)}>
          <Icon name="plus" /> New popup
        </Btn>
      </PanelHeader>

      {(picking || popups.length === 0) && (
        <Card title="Pick a starting point" desc="Choose a template — you can change everything after.">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {TEMPLATES.map((t) => (
              <button
                key={t.name}
                onClick={() => create(t.make())}
                className="text-left rounded-xl border border-white/10 bg-black/30 p-4 hover:border-[#ff3b3b]/50 hover:bg-[#ff3b3b]/5 hover:-translate-y-0.5 transition-all"
              >
                <div className="text-2xl mb-2">{t.emoji}</div>
                <p className="font-bold text-sm">{t.name}</p>
                <p className="text-white/40 text-xs mt-0.5">{t.desc}</p>
              </button>
            ))}
          </div>
          {picking && popups.length > 0 && (
            <div className="flex justify-end">
              <Btn small onClick={() => setPicking(false)}>Cancel</Btn>
            </div>
          )}
        </Card>
      )}

      {popups.length === 0 && !picking ? (
        <Empty icon="megaphone" title="No popups yet" />
      ) : (
        <div className="space-y-3">
          {popups.map((p, i) => {
            const s = status(p);
            return (
              <div key={p.id} className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 admin-fade">
                <button onClick={() => setEditing(p.id)} className="flex items-center gap-4 flex-1 min-w-0 text-left group">
                  <div className="w-16 h-12 shrink-0 rounded-lg border border-white/10 overflow-hidden grid place-items-center" style={{ background: p.theme === "light" ? "#fff" : p.theme === "red" ? "#5a0000" : p.theme === "gradient" ? `linear-gradient(135deg, ${p.accentColor}, #000)` : "#0a0a0a" }}>
                    <span className="w-8 h-1.5 rounded-full" style={{ background: p.accentColor }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm truncate group-hover:text-[#ff5252] transition-colors">{p.name || p.title || "Untitled"}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${s.cls}`}>{s.label}</span>
                    </div>
                    <p className="text-white/40 text-xs truncate mt-0.5">
                      {p.trigger === "load" ? `After ${p.delaySeconds}s` : p.trigger === "scroll" ? `At ${p.scrollPercent}% scroll` : "When leaving"} · {p.pages === "all" ? "all pages" : `${p.pages} page`} · {p.device === "all" ? "all devices" : p.device}
                    </p>
                  </div>
                </button>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    role="switch"
                    aria-checked={p.enabled}
                    onClick={() => set((d) => void (d.popups[i].enabled = !d.popups[i].enabled))}
                    className={`relative w-11 h-6 rounded-full transition-colors ${p.enabled ? "bg-[#d40000]" : "bg-white/15"}`}
                    title={p.enabled ? "Turn off" : "Turn on"}
                  >
                    <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${p.enabled ? "translate-x-5" : ""}`} />
                  </button>
                  <Btn small onClick={() => setEditing(p.id)}>
                    <Icon name="edit" className="w-3.5 h-3.5" /> Edit
                  </Btn>
                  <ItemControls
                    index={i}
                    count={popups.length}
                    onMove={(a, b) => set((d) => void (d.popups = move(d.popups, a, b)))}
                    onDuplicate={() => set((d) => void d.popups.splice(i + 1, 0, { ...structuredClone(p), id: Date.now(), name: `${p.name} (copy)`, enabled: false }))}
                    onDelete={() => set((d) => void d.popups.splice(i, 1))}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
      {popups.length > 1 && <p className="text-xs text-white/30 mt-4">If several popups are ready at the same time, they show one after another in this order.</p>}
    </>
  );
}

// ── Editor ─────────────────────────────────────────────────────
type Tab = "content" | "style" | "when";

function PopupEditor({ popup: p, edit, onBack }: { popup: Popup; edit: (fn: (p: Popup) => void) => void; onBack: () => void }) {
  const { asset } = useContext(UploadCtx);
  const [tab, setTab] = useState<Tab>("content");
  const [device, setDevice] = useState<"desktop" | "phone">("desktop");
  const [replay, setReplay] = useState(0);
  const [shown, setShown] = useState(true);
  const up = <K extends keyof Popup>(k: K) => (v: Popup[K]) => edit((x) => void (x[k] = v));

  return (
    <div className="admin-fade">
      <button onClick={onBack} className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white mb-4 group">
        <span className="transition-transform group-hover:-translate-x-1">←</span> All popups
      </button>
      <PanelHeader title={p.name || "Popup"} desc="Changes show instantly in the preview. Remember to Publish when you're happy.">
        <Toggle label={p.enabled ? "Popup is ON" : "Popup is OFF"} value={p.enabled} onChange={up("enabled")} />
      </PanelHeader>

      <div className="flex flex-col-reverse gap-6">
        <div>
          <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10 mb-5">
            {([
              ["content", "✏️ Content"],
              ["style", "🎨 Style"],
              ["when", "⏱ Timing"],
            ] as [Tab, string][]).map(([k, l]) => (
              <button key={k} onClick={() => setTab(k)} className={`flex-1 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${tab === k ? "bg-white text-black shadow" : "text-white/50 hover:text-white"}`}>
                {l}
              </button>
            ))}
          </div>

          {tab === "content" && (
            <Card>
              <Text label="Private name" hint="Only you see this, to recognise the popup" value={p.name} onChange={up("name")} />
              <Text label="Small badge" hint="e.g. LIMITED OFFER — leave empty to hide" value={p.badge} onChange={up("badge")} max={24} />
              <Text label="Title" value={p.title} onChange={up("title")} max={60} />
              <TextArea label="Message" value={p.description} onChange={up("description")} />
              <MediaPicker label="Image" hint="Optional" value={p.image} onChange={up("image")} removable />
              <Grid>
                <Text label="Button text" hint="Leave empty for no button" value={p.buttonText} onChange={up("buttonText")} />
                <Text label="“Close” text" hint="e.g. Maybe later — empty to hide" value={p.dismissText} onChange={up("dismissText")} />
              </Grid>
              <LinkInput label="Button goes to" value={p.buttonLink} onChange={up("buttonLink")} />
              <DateInput label="Countdown timer to" hint="Optional — shows a live countdown (great for sales)" value={p.countdownTo} onChange={up("countdownTo")} withTime />
            </Card>
          )}

          {tab === "style" && (
            <Card>
              <Choice
                label="Theme"
                value={p.theme}
                onChange={up("theme")}
                options={[
                  { value: "dark", label: "Dark", swatch: "#0a0a0a" },
                  { value: "light", label: "Light", swatch: "#ffffff" },
                  { value: "red", label: "Deep red", swatch: "#5a0000" },
                  { value: "glass", label: "Glass", swatch: "rgba(255,255,255,0.3)" },
                  { value: "gradient", label: "Gradient", swatch: `linear-gradient(135deg, ${p.accentColor}, #000)` },
                ]}
              />
              <ColorPicker label="Highlight colour" hint="Badge, button and gradient colour" value={p.accentColor} onChange={up("accentColor")} />
              <Choice
                label="Layout"
                value={p.layout}
                onChange={up("layout")}
                options={[
                  { value: "image-top", label: "Image on top" },
                  { value: "image-side", label: "Image on side" },
                  { value: "text-only", label: "Text only" },
                  { value: "image-only", label: "Just the image" },
                ]}
              />
              <Choice
                label="Position"
                value={p.position}
                onChange={up("position")}
                options={[
                  { value: "center", label: "Centre (dims page)" },
                  { value: "bottom", label: "Bottom sheet" },
                  { value: "corner", label: "Small corner" },
                ]}
              />
              {p.position !== "corner" && (
                <Choice
                  label="Size"
                  value={p.size}
                  onChange={up("size")}
                  options={[
                    { value: "small", label: "Small" },
                    { value: "medium", label: "Medium" },
                    { value: "large", label: "Large" },
                  ]}
                />
              )}
              <Choice
                label="Button style"
                value={p.buttonStyle}
                onChange={up("buttonStyle")}
                options={[
                  { value: "red", label: "Highlight colour", swatch: p.accentColor },
                  { value: "white", label: "White", swatch: "#fff" },
                  { value: "black", label: "Black", swatch: "#000" },
                  { value: "outline", label: "Outline" },
                ]}
              />
              <Choice
                label="Entrance animation"
                value={p.animation}
                onChange={(v) => {
                  up("animation")(v);
                  setReplay((r) => r + 1);
                }}
                options={[
                  { value: "zoom", label: "Zoom" },
                  { value: "slide-up", label: "Slide up" },
                  { value: "fade", label: "Fade" },
                  { value: "bounce", label: "Bounce" },
                  { value: "flip", label: "Flip" },
                ]}
              />
            </Card>
          )}

          {tab === "when" && (
            <Card>
              <Choice
                label="Show it…"
                value={p.trigger}
                onChange={up("trigger")}
                options={[
                  { value: "load", label: "After a few seconds" },
                  { value: "scroll", label: "After scrolling" },
                  { value: "exit", label: "When they try to leave" },
                ]}
              />
              {p.trigger === "load" && <NumberInput label="Wait" min={0} max={60} value={p.delaySeconds} suffix=" sec" onChange={up("delaySeconds")} />}
              {p.trigger === "scroll" && <NumberInput label="After scrolling" min={5} max={95} step={5} value={p.scrollPercent} suffix="% of the page" onChange={up("scrollPercent")} />}
              {p.trigger === "exit" && <p className="text-xs text-white/40 -mt-2">On computers: when the mouse moves to close the tab. On phones: after 15 seconds.</p>}
              <Choice
                label="How often"
                value={p.frequency}
                onChange={up("frequency")}
                options={[
                  { value: "session", label: "Once per visit" },
                  { value: "daily", label: "Once a day" },
                  { value: "once", label: "Only once ever" },
                  { value: "always", label: "Every page load" },
                ]}
              />
              <Choice
                label="On which page"
                value={p.pages}
                onChange={up("pages")}
                options={[
                  { value: "home", label: "Homepage" },
                  { value: "courses", label: "Courses page" },
                  { value: "all", label: "All pages" },
                ]}
              />
              <Choice
                label="On which devices"
                value={p.device}
                onChange={up("device")}
                options={[
                  { value: "all", label: "All" },
                  { value: "mobile", label: "📱 Phones only" },
                  { value: "desktop", label: "💻 Computers only" },
                ]}
              />
              <Grid>
                <DateInput label="Start showing on" hint="Optional" value={p.startDate} onChange={up("startDate")} />
                <DateInput label="Stop showing after" hint="Optional" value={p.endDate} onChange={up("endDate")} />
              </Grid>
            </Card>
          )}
        </div>

        {/* Live preview */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold uppercase tracking-widest text-white/40">Live preview</p>
            <div className="flex items-center gap-1">
              <button onClick={() => { setShown(true); setReplay((r) => r + 1); }} className="text-xs px-2.5 py-1.5 rounded-lg border border-white/10 text-white/60 hover:text-white flex items-center gap-1">
                <Icon name="play" className="w-3 h-3" /> Replay
              </button>
              {(["desktop", "phone"] as const).map((d) => (
                <button key={d} onClick={() => setDevice(d)} className={`w-8 h-8 rounded-lg grid place-items-center border ${device === d ? "bg-white text-black border-white" : "border-white/10 text-white/50"}`} title={d}>
                  <Icon name={d === "desktop" ? "monitor" : "phone"} />
                </button>
              ))}
            </div>
          </div>
          <div className={`mx-auto transition-all duration-500 ease-out-expo ${device === "phone" ? "max-w-[280px]" : "max-w-[560px]"}`}>
            <div className={`relative overflow-hidden border border-white/10 bg-[#111] shadow-2xl ${device === "phone" ? "rounded-[2rem] aspect-[9/18] border-[6px] border-[#222]" : "rounded-xl aspect-[16/11]"}`}>
              {device === "desktop" && (
                <div className="absolute top-0 inset-x-0 h-6 bg-[#1a1a1a] flex items-center gap-1.5 px-3 z-[120]">
                  <span className="w-2 h-2 rounded-full bg-red-500/70" />
                  <span className="w-2 h-2 rounded-full bg-amber-500/70" />
                  <span className="w-2 h-2 rounded-full bg-emerald-500/70" />
                </div>
              )}
              {/* fake page behind */}
              <div className={`absolute inset-0 ${device === "desktop" ? "top-6" : ""} p-4 space-y-3 bg-gradient-to-br from-[#2a0000] via-black to-black`}>
                <div className="h-3 w-24 rounded bg-white/20" />
                <div className="h-8 w-3/4 rounded bg-white/10 mt-6" />
                <div className="h-8 w-1/2 rounded bg-white/10" />
                <div className="h-3 w-2/3 rounded bg-white/5" />
                <div className="h-24 w-full rounded-xl bg-white/5 mt-6" />
              </div>
              <div className={`absolute inset-0 ${device === "desktop" ? "top-6" : ""} [container-type:inline-size]`} style={{ transform: "translateZ(0)" }}>
                <div className={device === "desktop" ? "absolute inset-0 origin-top-left" : "absolute inset-0"} style={device === "desktop" ? { width: "166.66%", height: "166.66%", transform: "scale(0.6)" } : undefined}>
                  {shown ? (
                    <PopupView key={replay} popup={p} onClose={() => setShown(false)} contained asset={asset} />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center">
                      <Btn onClick={() => { setShown(true); setReplay((r) => r + 1); }}>
                        <Icon name="play" /> Show again
                      </Btn>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
