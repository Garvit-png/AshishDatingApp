"use client";

import { createContext, useContext, useId, useRef, useState } from "react";
import ImageCropper from "./ImageCropper";
import { Icon } from "./icons";

// ── Upload context (provided by the dashboard) ──────────────────
export interface UploadApi {
  upload: (file: File) => Promise<string>;
  asset: (src: string) => string;
}
export const UploadCtx = createContext<UploadApi>({ upload: async () => "", asset: (s) => s });

// ── Layout ──────────────────────────────────────────────────────
export function PanelHeader({ title, desc, children }: { title: string; desc?: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{title}</h1>
        {desc && <p className="text-white/45 text-sm mt-1 max-w-xl">{desc}</p>}
      </div>
      {children && <div className="flex gap-2 flex-wrap">{children}</div>}
    </div>
  );
}

export function Card({
  title,
  desc,
  children,
  actions,
  className = "",
}: {
  title?: string;
  desc?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 sm:p-6 mb-5 admin-fade ${className}`}>
      {(title || actions) && (
        <div className="flex items-start justify-between gap-3 mb-5">
          <div>
            {title && <h2 className="font-bold text-white text-base">{title}</h2>}
            {desc && <p className="text-white/40 text-xs mt-1 leading-relaxed">{desc}</p>}
          </div>
          {actions}
        </div>
      )}
      <div className="space-y-5">{children}</div>
    </section>
  );
}

export function Grid({ children, cols = 2 }: { children: React.ReactNode; cols?: 2 | 3 }) {
  return <div className={`grid grid-cols-1 ${cols === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"} gap-5`}>{children}</div>;
}

function Label({ label, hint, htmlFor, right }: { label: string; hint?: string; htmlFor?: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-2 mb-1.5">
      <label htmlFor={htmlFor} className="block text-[13px] font-semibold text-white/85">
        {label}
        {hint && <span className="block text-[11px] font-normal text-white/35 mt-0.5">{hint}</span>}
      </label>
      {right}
    </div>
  );
}

const inputCls =
  "w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#ff3b3b]/60 focus:ring-4 focus:ring-[#ff3b3b]/10 transition-all";

// ── Inputs ──────────────────────────────────────────────────────
export function Text({
  label,
  hint,
  value,
  onChange,
  placeholder,
  max,
  mono,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  max?: number;
  mono?: boolean;
}) {
  const id = useId();
  return (
    <div>
      <Label
        label={label}
        hint={hint}
        htmlFor={id}
        right={max ? <span className={`text-[10px] tabular-nums ${value.length > max ? "text-amber-400" : "text-white/25"}`}>{value.length}/{max}</span> : null}
      />
      <input id={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`${inputCls} ${mono ? "font-mono text-xs" : ""}`} />
    </div>
  );
}

export function TextArea({
  label,
  hint,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  const id = useId();
  return (
    <div>
      <Label label={label} hint={hint} htmlFor={id} right={<span className="text-[10px] text-white/25 tabular-nums">{value.length}</span>} />
      <textarea id={id} value={value} rows={rows} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`${inputCls} resize-y leading-relaxed`} />
    </div>
  );
}

export function NumberInput({
  label,
  hint,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  suffix,
}: {
  label: string;
  hint?: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}) {
  return (
    <div>
      <Label label={label} hint={hint} right={<span className="text-xs font-bold text-white tabular-nums">{value}{suffix}</span>} />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#ff1a1a] h-2 cursor-pointer"
      />
    </div>
  );
}

export function Toggle({ label, hint, value, onChange }: { label: string; hint?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className="w-full flex items-center justify-between gap-4 text-left rounded-xl border border-white/10 bg-black/30 px-4 py-3 hover:border-white/20 transition-colors"
    >
      <span>
        <span className="block text-[13px] font-semibold text-white/85">{label}</span>
        {hint && <span className="block text-[11px] text-white/35 mt-0.5">{hint}</span>}
      </span>
      <span className={`relative shrink-0 w-11 h-6 rounded-full transition-colors duration-300 ${value ? "bg-[#d40000]" : "bg-white/15"}`}>
        <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ease-spring ${value ? "translate-x-5" : ""}`} />
      </span>
    </button>
  );
}

export function Choice<T extends string>({
  label,
  hint,
  value,
  onChange,
  options,
}: {
  label: string;
  hint?: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string; icon?: React.ReactNode; swatch?: string }[];
}) {
  return (
    <div>
      <Label label={label} hint={hint} />
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = o.value === value;
          return (
            <button
              type="button"
              key={o.value}
              onClick={() => onChange(o.value)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                on ? "bg-white text-black border-white shadow-[0_6px_20px_-6px_rgba(255,255,255,0.5)] scale-[1.03]" : "border-white/10 text-white/60 hover:text-white hover:border-white/30 bg-black/30"
              }`}
            >
              {o.swatch && <span className="w-3.5 h-3.5 rounded-full border border-white/30" style={{ background: o.swatch }} />}
              {o.icon}
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const SWATCHES = ["#ff1a1a", "#d40000", "#7f0000", "#ff6b00", "#ffb800", "#16a34a", "#0ea5e9", "#7c3aed", "#ec4899", "#ffffff"];

export function ColorPicker({ label, hint, value, onChange }: { label: string; hint?: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Label label={label} hint={hint} />
      <div className="flex flex-wrap items-center gap-2">
        {SWATCHES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onChange(c)}
            aria-label={c}
            className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${value.toLowerCase() === c ? "border-white scale-110 ring-4 ring-white/15" : "border-white/10"}`}
            style={{ background: c }}
          />
        ))}
        <label className="relative w-8 h-8 rounded-full border-2 border-dashed border-white/30 grid place-items-center cursor-pointer hover:border-white text-white/60" title="Custom colour">
          <Icon name="plus" className="w-3.5 h-3.5" />
          <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" />
        </label>
        <span className="text-xs font-mono text-white/40 ml-1">{value}</span>
      </div>
    </div>
  );
}

export function DateInput({ label, hint, value, onChange, withTime }: { label: string; hint?: string; value: string; onChange: (v: string) => void; withTime?: boolean }) {
  const id = useId();
  return (
    <div>
      <Label label={label} hint={hint} htmlFor={id} right={value ? <button onClick={() => onChange("")} className="text-[11px] text-white/40 hover:text-white">Clear</button> : null} />
      <input id={id} type={withTime ? "datetime-local" : "date"} value={value} onChange={(e) => onChange(e.target.value)} className={`${inputCls} [color-scheme:dark]`} />
    </div>
  );
}

// ── Links ──────────────────────────────────────────────────────
const LINK_PRESETS = [
  { label: "Playbooks", href: "#playbooks" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "1-on-1 booking", href: "#book" },
  { label: "Courses page", href: "/courses" },
  { label: "Home", href: "/" },
];

export function LinkInput({ label, hint, value, onChange }: { label: string; hint?: string; value: string; onChange: (v: string) => void }) {
  const id = useId();
  const valid = !value || /^(#[\w-]+|\/[^\s]*|https?:\/\/[^\s]+\.[^\s]+|mailto:[^\s]+|tel:[^\s]+)$/.test(value.trim());
  return (
    <div>
      <Label label={label} hint={hint ?? "Paste a web link, or pick a place on your site"} htmlFor={id} />
      <div className="relative">
        <input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value.trim())}
          placeholder="https://… or #playbooks"
          className={`${inputCls} font-mono text-xs pr-10 ${valid ? "" : "!border-amber-500/60"}`}
        />
        {value && /^https?:/.test(value) && valid && (
          <a href={value} target="_blank" rel="noreferrer" className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white" title="Open link">
            <Icon name="external" className="w-4 h-4" />
          </a>
        )}
      </div>
      {!valid && <p className="text-[11px] text-amber-400 mt-1">This doesn&apos;t look like a link. Start with https:// or pick one below.</p>}
      <div className="flex flex-wrap gap-1.5 mt-2">
        {LINK_PRESETS.map((p) => (
          <button
            key={p.href}
            type="button"
            onClick={() => onChange(p.href)}
            className={`text-[10px] px-2 py-1 rounded-md border transition-colors ${value === p.href ? "border-[#ff3b3b] text-white bg-[#ff3b3b]/15" : "border-white/10 text-white/40 hover:text-white hover:border-white/30"}`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Images & videos ─────────────────────────────────────────────
export async function shrinkImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") return file;
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;
  const MAX = 2000;
  if (file.size < 900_000 && Math.max(bitmap.width, bitmap.height) <= MAX) return file;
  const k = Math.min(1, MAX / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * k);
  canvas.height = Math.round(bitmap.height * k);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", 0.85));
  if (!blob || blob.size >= file.size) return file;
  const ext = blob.type === "image/webp" ? "webp" : "png";
  return new File([blob], file.name.replace(/\.\w+$/, "") + "." + ext, { type: blob.type });
}

export function MediaPicker({
  label,
  hint,
  value,
  onChange,
  kind = "image",
  aspect,
  crop = true,
  removable = false,
  tall = false,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  kind?: "image" | "video";
  aspect?: number;
  crop?: boolean;
  removable?: boolean;
  tall?: boolean;
}) {
  const { upload, asset } = useContext(UploadCtx);
  const inputRef = useRef<HTMLInputElement>(null);
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const [err, setErr] = useState("");

  const doUpload = async (file: File) => {
    setBusy(true);
    setErr("");
    try {
      const ready = kind === "image" ? await shrinkImage(file) : file;
      onChange(await upload(ready));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  const pick = (file?: File | null) => {
    if (!file) return;
    if (kind === "image" && crop && file.type !== "image/gif") setCropFile(file);
    else doUpload(file);
  };

  return (
    <div>
      <Label label={label} hint={hint} />
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          pick(e.dataTransfer.files?.[0]);
        }}
        className={`group relative flex items-center gap-4 rounded-xl border border-dashed p-3 transition-all ${
          drag ? "border-[#ff3b3b] bg-[#ff3b3b]/10" : "border-white/15 bg-black/30 hover:border-white/30"
        }`}
      >
        <div className={`relative shrink-0 ${tall ? "w-16 h-24" : "w-24 h-16"} rounded-lg overflow-hidden bg-white/5 border border-white/10 grid place-items-center`}>
          {value ? (
            kind === "video" ? (
              <video src={asset(value)} muted playsInline className="w-full h-full object-cover" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={asset(value)} alt="" className="w-full h-full object-cover" />
            )
          ) : (
            <Icon name={kind === "video" ? "video" : "image"} className="w-6 h-6 text-white/20" />
          )}
          {busy && (
            <div className="absolute inset-0 bg-black/70 grid place-items-center">
              <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white text-black text-xs font-bold hover:bg-white/90 disabled:opacity-50 transition"
            >
              <Icon name="upload" className="w-3.5 h-3.5" />
              {busy ? "Uploading…" : value ? "Replace" : `Upload ${kind}`}
            </button>
            {removable && value && (
              <button type="button" onClick={() => onChange("")} className="px-3 py-2 rounded-lg border border-white/10 text-xs text-white/50 hover:text-red-400 hover:border-red-500/40 transition">
                Remove
              </button>
            )}
          </div>
          <p className="text-[11px] text-white/30 mt-1.5 truncate">{value ? value.split("/").pop() : `or drag & drop ${kind === "video" ? "an MP4" : "an image"} here`}</p>
          {err && <p className="text-[11px] text-red-400 mt-1">{err}</p>}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={kind === "video" ? "video/mp4,video/webm" : "image/*"}
          className="hidden"
          onChange={(e) => {
            pick(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>
      {cropFile && (
        <ImageCropper
          file={cropFile}
          aspect={aspect}
          onCancel={() => setCropFile(null)}
          onCropComplete={(f) => {
            setCropFile(null);
            doUpload(f);
          }}
        />
      )}
    </div>
  );
}

// ── Buttons ─────────────────────────────────────────────────────
export function Btn({
  children,
  onClick,
  variant = "ghost",
  disabled,
  title,
  small,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "danger" | "red";
  disabled?: boolean;
  title?: string;
  small?: boolean;
  type?: "button" | "submit";
}) {
  const v = {
    primary: "bg-white text-black hover:bg-white/90 shadow-[0_8px_24px_-8px_rgba(255,255,255,0.4)]",
    red: "bg-[#d40000] text-white hover:bg-[#ff1a1a] shadow-[0_8px_24px_-8px_rgba(255,26,26,0.7)]",
    ghost: "border border-white/10 text-white/70 hover:text-white hover:border-white/30 bg-white/[0.03]",
    danger: "border border-red-500/20 text-red-400/80 hover:text-red-300 hover:border-red-500/50 hover:bg-red-500/10",
  }[variant];
  return (
    <button
      type={type}
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-xl font-semibold transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none ${
        small ? "px-2.5 py-1.5 text-xs" : "px-4 py-2.5 text-sm"
      } ${v}`}
    >
      {children}
    </button>
  );
}

export function IconBtn({ icon, onClick, title, danger, disabled }: { icon: string; onClick: () => void; title: string; danger?: boolean; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      disabled={disabled}
      className={`w-8 h-8 rounded-lg grid place-items-center border border-white/10 transition-all disabled:opacity-20 disabled:pointer-events-none ${
        danger ? "text-white/50 hover:text-red-400 hover:border-red-500/40 hover:bg-red-500/10" : "text-white/50 hover:text-white hover:border-white/30 hover:bg-white/5"
      }`}
    >
      <Icon name={icon} className="w-4 h-4" />
    </button>
  );
}

/** Up / down / duplicate / delete controls for list items. */
export function ItemControls({
  index,
  count,
  onMove,
  onDuplicate,
  onDelete,
}: {
  index: number;
  count: number;
  onMove: (from: number, to: number) => void;
  onDuplicate?: () => void;
  onDelete: () => void;
}) {
  const [confirm, setConfirm] = useState(false);
  return (
    <div className="flex items-center gap-1">
      <IconBtn icon="up" title="Move up" disabled={index === 0} onClick={() => onMove(index, index - 1)} />
      <IconBtn icon="down" title="Move down" disabled={index === count - 1} onClick={() => onMove(index, index + 1)} />
      {onDuplicate && <IconBtn icon="copy" title="Duplicate" onClick={onDuplicate} />}
      {confirm ? (
        <span className="flex items-center gap-1 ml-1 admin-fade">
          <button onClick={onDelete} className="px-2.5 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-500">Delete</button>
          <button onClick={() => setConfirm(false)} className="px-2 py-1.5 rounded-lg text-xs text-white/50 hover:text-white">Cancel</button>
        </span>
      ) : (
        <IconBtn icon="trash" title="Delete" danger onClick={() => setConfirm(true)} />
      )}
    </div>
  );
}

export function move<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length) return arr;
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function Empty({ icon, title, children }: { icon: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="text-center py-14 px-6 rounded-2xl border border-dashed border-white/10">
      <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-white/5 grid place-items-center">
        <Icon name={icon} className="w-6 h-6 text-white/30" />
      </div>
      <p className="font-semibold text-white/70">{title}</p>
      {children && <div className="mt-4 flex justify-center">{children}</div>}
    </div>
  );
}
