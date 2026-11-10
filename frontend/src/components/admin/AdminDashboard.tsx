"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SiteContent } from "@/content/types";
import { normalizeContent } from "@/content/normalize";
import { Btn, UploadCtx, shrinkImage } from "./fields";
import { Icon } from "./icons";
import LivePreview from "./LivePreview";
import OverviewPanel from "./OverviewPanel";
import ProductsPanel from "./ProductsPanel";
import PopupsPanel from "./PopupsPanel";
import { BookingPanel, CoursesPagePanel, HeaderFooterPanel, HeroPanel, LayoutPanel, SettingsPanel, StatsPanel, TestimonialsPanel } from "./panels";

type Key = keyof SiteContent;
const NAV: { id: string; label: string; icon: string; keys: Key[]; scroll?: string; page?: string }[] = [
  { id: "overview", label: "Overview", icon: "home", keys: [] },
  { id: "layout", label: "Page layout", icon: "layout", keys: ["sections"] },
  { id: "hero", label: "Hero & intro", icon: "sparkles", keys: ["intro", "eyeroll", "hero"], scroll: "about" },
  { id: "stats", label: "Stats & videos", icon: "chart", keys: ["stats", "dateSmarter"] },
  { id: "products", label: "Courses & playbooks", icon: "book", keys: ["products"], scroll: "playbooks" },
  { id: "testimonials", label: "Testimonials", icon: "star", keys: ["testimonials"], scroll: "testimonials" },
  { id: "booking", label: "1-on-1 sessions", icon: "calendar", keys: ["booking"], scroll: "book" },
  { id: "popups", label: "Popups", icon: "megaphone", keys: ["popups"] },
  { id: "courses", label: "Courses page", icon: "grad", keys: ["coursesPage"], page: "/courses" },
  { id: "header", label: "Header & footer", icon: "nav", keys: ["nav", "announcement", "footer"] },
  { id: "settings", label: "Settings", icon: "settings", keys: ["settings"] },
];

const DRAFT_KEY = "ac_admin_draft_v1";
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

type Toast = { id: number; msg: string; type: "success" | "error" | "info" };

export default function AdminDashboard({ sessionToken, onLogout }: { sessionToken: string; onLogout: (reason?: string) => void }) {
  const [published, setPublished] = useState<SiteContent | null>(null);
  const [draft, setDraft] = useState<SiteContent | null>(null);
  const [sha, setSha] = useState<string | null>(null);
  const [loadError, setLoadError] = useState("");
  const [tab, setTab] = useState("overview");
  const [assets, setAssets] = useState<Record<string, string>>({});
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [restored, setRestored] = useState<string | null>(null);
  const [publishOpen, setPublishOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [lastPublished, setLastPublished] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [mobilePreview, setMobilePreview] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [previewPage, setPreviewPage] = useState("/");
  const past = useRef<SiteContent[]>([]);
  const future = useRef<SiteContent[]>([]);
  const lastPush = useRef(0);
  const mainRef = useRef<HTMLDivElement>(null);

  const toast = useCallback((msg: string, type: Toast["type"] = "success") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  const api = useCallback(
    async (url: string, init: RequestInit = {}) => {
      const res = await fetch(url, { ...init, headers: { "x-admin-token": sessionToken, ...(init.body instanceof FormData ? {} : { "Content-Type": "application/json" }), ...init.headers } });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        onLogout("Your session expired. Please log in again — your changes are saved on this device.");
        throw new Error("Session expired");
      }
      if (!res.ok) throw Object.assign(new Error(data.error ?? `Request failed (${res.status})`), { status: res.status });
      return data;
    },
    [sessionToken, onLogout]
  );

  // ── Load ────────────────────────────────────────────────────
  const load = useCallback(async () => {
    setLoadError("");
    try {
      const data = await api("/api/admin/content");
      const content = normalizeContent(data.content);
      setPublished(content);
      setSha(data.sha);
      let start = content;
      try {
        const saved = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
        if (saved && saved.baseSha === data.sha && !same(normalizeContent(saved.content), content)) {
          start = normalizeContent(saved.content);
          setRestored(new Date(saved.at).toLocaleString());
        }
      } catch {}
      setDraft(start);
      past.current = [];
      future.current = [];
    } catch (e) {
      if (e instanceof Error && e.message !== "Session expired") setLoadError(e.message);
    }
  }, [api]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch
    load();
  }, [load]);

  // Keep a copy of the draft on this device
  useEffect(() => {
    if (!draft || !published) return;
    const t = setTimeout(() => {
      try {
        if (same(draft, published)) localStorage.removeItem(DRAFT_KEY);
        else localStorage.setItem(DRAFT_KEY, JSON.stringify({ content: draft, baseSha: sha, at: Date.now() }));
      } catch {}
    }, 400);
    return () => clearTimeout(t);
  }, [draft, published, sha]);

  // ── Editing with undo/redo ─────────────────────────────────
  // draftRef always holds the latest draft so several quick edits never overwrite each other
  const draftRef = useRef<SiteContent | null>(null);
  useEffect(() => {
    draftRef.current = draft;
  }, [draft]);

  const [history, setHistory] = useState({ undo: 0, redo: 0 });
  const commit = useCallback((next: SiteContent) => {
    draftRef.current = next;
    setDraft(next);
    setHistory({ undo: past.current.length, redo: future.current.length });
  }, []);

  const set = useCallback(
    (fn: (d: SiteContent) => void) => {
      const d = draftRef.current;
      if (!d) return;
      const now = Date.now();
      // Typing in one field quickly counts as one undo step
      if (now - lastPush.current > 700) past.current = [...past.current.slice(-60), d];
      lastPush.current = now;
      future.current = [];
      const next = structuredClone(d);
      fn(next);
      commit(next);
    },
    [commit]
  );

  const undo = useCallback(() => {
    const prev = past.current.pop();
    if (!prev || !draftRef.current) return;
    future.current.push(draftRef.current);
    lastPush.current = 0;
    commit(prev);
  }, [commit]);

  const redo = useCallback(() => {
    const next = future.current.pop();
    if (!next || !draftRef.current) return;
    past.current.push(draftRef.current);
    commit(next);
  }, [commit]);

  const dirtyKeys = useMemo(() => {
    if (!draft || !published) return new Set<Key>();
    return new Set((Object.keys(draft) as Key[]).filter((k) => !same(draft[k], published[k])));
  }, [draft, published]);
  const dirty = dirtyKeys.size > 0;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      const typing = (e.target as HTMLElement)?.matches?.("input, textarea");
      if (e.key.toLowerCase() === "z" && !typing) {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      } else if (e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (dirty) setPublishOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo, dirty]);

  // ── Upload ─────────────────────────────────────────────────
  const upload = useCallback(
    async (file: File) => {
      const ready = file.type.startsWith("image/") ? await shrinkImage(file) : file;
      const fd = new FormData();
      fd.append("file", ready);
      const data = await api("/api/admin/upload", { method: "POST", body: fd });
      setAssets((a) => ({ ...a, [data.path]: URL.createObjectURL(ready) }));
      toast("Uploaded ✓");
      return data.path as string;
    },
    [api, toast]
  );
  const asset = useCallback((src: string) => assets[src] ?? src, [assets]);
  const uploadCtx = useMemo(() => ({ upload, asset }), [upload, asset]);

  // ── Publish ────────────────────────────────────────────────
  const publish = async (message: string) => {
    if (!draft) return;
    setPublishing(true);
    try {
      const data = await api("/api/admin/content", { method: "PUT", body: JSON.stringify({ content: draft, sha, message: message || undefined }) });
      setPublished(draft);
      setSha(data.sha);
      setRestored(null);
      setPublishOpen(false);
      setLastPublished(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {}
      toast("Published! 🎉 The live site updates in about 1–2 minutes.");
    } catch (e) {
      const status = (e as { status?: number }).status;
      toast(status === 409 ? "Someone else changed the site meanwhile. Reload to get the latest, then redo your change." : e instanceof Error ? e.message : "Publish failed", "error");
    } finally {
      setPublishing(false);
    }
  };

  const discard = () => {
    if (!published || !confirm("Throw away all unpublished changes?")) return;
    if (draftRef.current) past.current.push(draftRef.current);
    commit(published);
    setRestored(null);
    toast("Changes discarded", "info");
  };

  const go = (id: string) => {
    setTab(id);
    setMenuOpen(false);
    const n = NAV.find((x) => x.id === id);
    if (n?.page) setPreviewPage(n.page);
    else if (n?.scroll) setPreviewPage("/");
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Render ─────────────────────────────────────────────────
  if (loadError) {
    return (
      <Center>
        <Icon name="alert" className="w-10 h-10 text-amber-400 mb-4" />
        <p className="font-bold mb-1">Couldn&apos;t load the website content</p>
        <p className="text-white/50 text-sm mb-6 max-w-sm text-center">{loadError}</p>
        <div className="flex gap-2">
          <Btn variant="primary" onClick={load}>Try again</Btn>
          <Btn onClick={() => onLogout()}>Log out</Btn>
        </div>
      </Center>
    );
  }
  if (!draft || !published) {
    return (
      <Center>
        <span className="w-8 h-8 border-2 border-white/15 border-t-[#ff1a1a] rounded-full animate-spin mb-4" />
        <p className="text-white/50 text-sm">Loading your website…</p>
      </Center>
    );
  }

  const current = NAV.find((n) => n.id === tab)!;
  const props = { c: draft, set };
  const panel = {
    overview: <OverviewPanel {...props} go={go} lastPublished={lastPublished} />,
    layout: <LayoutPanel {...props} />,
    hero: <HeroPanel {...props} />,
    stats: <StatsPanel {...props} />,
    products: <ProductsPanel {...props} />,
    testimonials: <TestimonialsPanel {...props} />,
    booking: <BookingPanel {...props} />,
    popups: <PopupsPanel {...props} />,
    courses: <CoursesPagePanel {...props} />,
    header: <HeaderFooterPanel {...props} />,
    settings: <SettingsPanel {...props} />,
  }[tab];

  const changedAreas = NAV.filter((n) => n.keys.some((k) => dirtyKeys.has(k)));

  const sidebar = (
    <nav className="flex flex-col gap-0.5 p-3">
      {NAV.map((n) => {
        const changed = n.keys.some((k) => dirtyKeys.has(k));
        const on = tab === n.id;
        return (
          <button
            key={n.id}
            onClick={() => go(n.id)}
            className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-all ${on ? "bg-white text-black font-semibold shadow-lg" : "text-white/60 hover:text-white hover:bg-white/5"}`}
          >
            <Icon name={n.icon} className="w-[18px] h-[18px] shrink-0" />
            <span className="flex-1 truncate">{n.label}</span>
            {changed && <span className={`w-2 h-2 rounded-full ${on ? "bg-[#d40000]" : "bg-amber-400"} shadow-[0_0_8px_currentColor]`} title="Unpublished changes" />}
          </button>
        );
      })}
    </nav>
  );

  return (
    <UploadCtx.Provider value={uploadCtx}>
      <style>{`
        .admin-fade { animation: adminIn .45s var(--ease-out-expo) both; }
        @keyframes adminIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
      `}</style>
      <div className="h-dvh flex flex-col bg-[#060606] text-white overflow-hidden">
        {/* Top bar */}
        <header className="shrink-0 h-16 flex items-center gap-3 px-3 sm:px-5 border-b border-white/[0.06] bg-black/60 backdrop-blur-xl z-30">
          <button className="lg:hidden w-10 h-10 grid place-items-center rounded-xl hover:bg-white/5" onClick={() => setMenuOpen(true)} aria-label="Menu">
            <Icon name="menu" className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#ff1a1a] to-[#5a0000] grid place-items-center text-xs font-black shadow-[0_0_20px_rgba(255,26,26,0.4)]">AC</span>
            <div className="hidden sm:block leading-tight">
              <p className="text-sm font-black tracking-tight">Website Studio</p>
              <p className="text-[10px] text-white/40">{current.label}</p>
            </div>
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-1">
            <button onClick={undo} disabled={!history.undo} title="Undo (Ctrl+Z)" className="w-9 h-9 grid place-items-center rounded-lg text-white/60 hover:text-white hover:bg-white/5 disabled:opacity-25">
              <Icon name="undo" />
            </button>
            <button onClick={redo} disabled={!history.redo} title="Redo (Ctrl+Shift+Z)" className="w-9 h-9 grid place-items-center rounded-lg text-white/60 hover:text-white hover:bg-white/5 disabled:opacity-25">
              <Icon name="redo" />
            </button>
          </div>

          <span className={`hidden md:inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border ${dirty ? "border-amber-400/30 text-amber-300 bg-amber-400/10" : "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${dirty ? "bg-amber-400 animate-pulse" : "bg-emerald-400"}`} />
            {dirty ? `${changedAreas.length} area${changedAreas.length === 1 ? "" : "s"} changed` : "All published"}
          </span>

          {dirty && (
            <button onClick={discard} className="hidden sm:block text-xs text-white/50 hover:text-white px-2">
              Discard
            </button>
          )}

          <button
            onClick={() => setShowPreview((s) => !s)}
            className={`hidden xl:grid w-9 h-9 place-items-center rounded-lg transition ${showPreview ? "text-white bg-white/10" : "text-white/50 hover:text-white hover:bg-white/5"}`}
            title="Toggle preview"
          >
            <Icon name="panel" />
          </button>
          <a href="/" target="_blank" className="hidden sm:grid w-9 h-9 place-items-center rounded-lg text-white/60 hover:text-white hover:bg-white/5" title="Open live website">
            <Icon name="external" />
          </a>

          <button
            onClick={() => setPublishOpen(true)}
            disabled={!dirty}
            className="relative inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-bold bg-[#d40000] text-white hover:bg-[#ff1a1a] shadow-[0_8px_24px_-8px_rgba(255,26,26,0.8)] disabled:bg-white/10 disabled:text-white/40 disabled:shadow-none transition-all active:scale-95"
          >
            <Icon name="rocket" />
            <span>Publish</span>
            {dirty && <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 border-2 border-[#060606] animate-pulse" />}
          </button>

          <button onClick={() => onLogout()} title="Log out" className="hidden sm:grid w-9 h-9 place-items-center rounded-lg text-white/50 hover:text-white hover:bg-white/5">
            <Icon name="logout" />
          </button>
        </header>

        <div className="flex-1 flex min-h-0">
          {/* Sidebar (desktop) */}
          <aside className="hidden lg:flex flex-col w-60 shrink-0 border-r border-white/[0.06] overflow-y-auto">
            {sidebar}
            <div className="mt-auto p-4 text-[11px] text-white/30 leading-relaxed">
              <p className="mb-1 font-semibold text-white/50">Tips</p>
              Ctrl/⌘ + Z to undo · Ctrl/⌘ + S to publish
            </div>
          </aside>

          {/* Mobile drawer */}
          <div className={`lg:hidden fixed inset-0 z-50 transition ${menuOpen ? "visible" : "invisible"}`}>
            <div className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity ${menuOpen ? "opacity-100" : "opacity-0"}`} onClick={() => setMenuOpen(false)} />
            <div className={`absolute left-0 top-0 bottom-0 w-72 bg-[#0b0b0b] border-r border-white/10 overflow-y-auto transition-transform duration-300 ease-out-expo ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
              <div className="flex items-center justify-between p-4 border-b border-white/5">
                <p className="font-black">Website Studio</p>
                <button onClick={() => setMenuOpen(false)} className="w-9 h-9 grid place-items-center rounded-lg hover:bg-white/5"><Icon name="x" /></button>
              </div>
              {sidebar}
              <div className="p-3 border-t border-white/5 space-y-1">
                {dirty && <button onClick={discard} className="w-full text-left px-3 py-2.5 rounded-xl text-sm text-white/60 hover:bg-white/5">Discard changes</button>}
                <a href="/" target="_blank" className="block px-3 py-2.5 rounded-xl text-sm text-white/60 hover:bg-white/5">Open live website ↗</a>
                <button onClick={() => onLogout()} className="w-full text-left px-3 py-2.5 rounded-xl text-sm text-white/60 hover:bg-white/5">Log out</button>
              </div>
            </div>
          </div>

          {/* Editor */}
          <main ref={mainRef} className="flex-1 min-w-0 overflow-y-auto">
            <div className="max-w-3xl mx-auto px-4 sm:px-8 py-6 sm:py-10 pb-28 lg:pb-10">
              {restored && (
                <div className="mb-6 rounded-2xl border border-sky-500/30 bg-sky-500/10 p-4 flex flex-col sm:flex-row sm:items-center gap-3 admin-fade">
                  <Icon name="refresh" className="w-5 h-5 text-sky-400 shrink-0" />
                  <p className="text-sm flex-1">We brought back your unpublished changes from <b>{restored}</b>.</p>
                  <div className="flex gap-2">
                    <Btn small onClick={() => setRestored(null)}>Keep them</Btn>
                    <Btn small variant="danger" onClick={() => { commit(published); setRestored(null); }}>Throw away</Btn>
                  </div>
                </div>
              )}
              <div key={tab} className="admin-fade">{panel}</div>
            </div>
          </main>

          {/* Live preview (wide screens) */}
          {showPreview && (
            <aside className="hidden xl:flex flex-col w-[44%] max-w-[760px] shrink-0 border-l border-white/[0.06] bg-black">
              <LivePreview content={draft} assets={assets} page={previewPage} scrollTo={current.scroll} onPage={setPreviewPage} />
            </aside>
          )}
        </div>

        {/* Mobile bottom bar */}
        <div className="xl:hidden fixed bottom-0 inset-x-0 z-30 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-gradient-to-t from-black via-black/95 to-transparent lg:left-60">
          <button onClick={() => setMobilePreview(true)} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-white/15 bg-white/5 backdrop-blur text-sm font-semibold active:scale-[0.98] transition">
            <Icon name="eye" /> Preview my changes
          </button>
        </div>
        {mobilePreview && (
          <div className="xl:hidden fixed inset-0 z-[60] bg-black flex flex-col admin-fade">
            <LivePreview content={draft} assets={assets} page={previewPage} scrollTo={current.scroll} onPage={setPreviewPage} onClose={() => setMobilePreview(false)} />
          </div>
        )}

        {/* Publish dialog */}
        {publishOpen && <PublishDialog areas={changedAreas.map((a) => a.label)} busy={publishing} onCancel={() => setPublishOpen(false)} onPublish={publish} />}

        {/* Toasts */}
        <div className="fixed top-20 right-4 left-4 sm:left-auto z-[200] flex flex-col gap-2 items-end pointer-events-none">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`pointer-events-auto max-w-sm px-4 py-3 rounded-xl text-sm font-medium shadow-2xl border backdrop-blur-xl admin-fade ${
                t.type === "success" ? "bg-emerald-950/90 border-emerald-700/50 text-emerald-200" : t.type === "error" ? "bg-red-950/90 border-red-700/50 text-red-200" : "bg-white/10 border-white/15 text-white"
              }`}
            >
              {t.msg}
            </div>
          ))}
        </div>
      </div>
    </UploadCtx.Provider>
  );
}

function Center({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-[#060606] text-white flex flex-col items-center justify-center px-6">{children}</div>;
}

function PublishDialog({ areas, busy, onCancel, onPublish }: { areas: string[]; busy: boolean; onCancel: () => void; onPublish: (msg: string) => void }) {
  const [note, setNote] = useState("");
  return (
    <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center sm:p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" style={{ animation: "pop-fade .25s both" }} onClick={busy ? undefined : onCancel} />
      <div className="relative w-full sm:max-w-md bg-[#0d0d0d] border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl" style={{ animation: "pop-slide-up .4s var(--ease-out-expo) both" }}>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ff1a1a] to-[#5a0000] grid place-items-center mb-4 shadow-[0_0_30px_rgba(255,26,26,0.4)]">
          <Icon name="rocket" className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-black mb-1">Publish your changes?</h2>
        <p className="text-sm text-white/50 mb-4">These parts of the website will be updated:</p>
        <div className="flex flex-wrap gap-1.5 mb-5">
          {areas.map((a) => (
            <span key={a} className="text-xs px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-200">{a}</span>
          ))}
        </div>
        <label className="block text-xs text-white/50 mb-1.5">Note for yourself (optional)</label>
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Diwali sale popup" className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm mb-5 focus:outline-none focus:border-white/30" />
        <div className="flex gap-2">
          <Btn onClick={onCancel} disabled={busy}>Not yet</Btn>
          <button
            onClick={() => onPublish(note.trim() ? `Admin: ${note.trim()}` : "")}
            disabled={busy}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl py-3 font-bold bg-[#d40000] hover:bg-[#ff1a1a] disabled:opacity-60 transition active:scale-95"
          >
            {busy ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Icon name="rocket" />}
            {busy ? "Publishing…" : "Publish now"}
          </button>
        </div>
        <p className="text-[11px] text-white/30 mt-4 text-center">The live website refreshes in about 1–2 minutes after publishing.</p>
      </div>
    </div>
  );
}
