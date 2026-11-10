import { DEFAULT_CONTENT, NEW_POPUP, NEW_PRODUCT, NEW_SESSION } from "./defaults";
import type { Popup, Product, SectionId, SiteContent } from "./types";

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);

/** Deep-merge `value` over `base`. Arrays and primitives from `value` win when their type matches. */
function merge<T>(base: T, value: unknown): T {
  if (value === undefined || value === null) return base;
  if (Array.isArray(base)) return (Array.isArray(value) ? value : base) as T;
  if (isObj(base)) {
    if (!isObj(value)) return base;
    const out: Obj = { ...base };
    for (const key of Object.keys(base)) out[key] = merge((base as Obj)[key], value[key]);
    return out as T;
  }
  return (typeof value === typeof base ? value : base) as T;
}

function normalizeProduct(raw: unknown, i: number): Product {
  const p = merge({ ...NEW_PRODUCT, id: i + 1 } as Product, raw);
  // Legacy books.json used a Tailwind class for the tag colour
  if (isObj(raw) && typeof raw.tagColor === "string" && !raw.tagStyle) {
    p.tagStyle = raw.tagColor.includes("white") ? "white" : raw.tagColor.includes("black") ? "black" : "red";
  }
  return p;
}

/**
 * Always returns a complete, valid SiteContent — whatever is stored in site.json.
 * Missing fields fall back to the defaults so old data never breaks the site.
 */
export function normalizeContent(raw: unknown): SiteContent {
  const c = merge(DEFAULT_CONTENT, raw);
  c.products.items = c.products.items.map(normalizeProduct);
  c.popups = c.popups.map((p, i) => merge({ ...NEW_POPUP, id: i + 1 } as Popup, p));
  c.booking.sessions = c.booking.sessions.map((s, i) => merge({ ...NEW_SESSION, id: i + 1 }, s));

  // Make sure every homepage section appears exactly once
  const known = new Set(DEFAULT_CONTENT.sections.map((s) => s.id));
  const seen = new Set<SectionId>();
  const sections = c.sections.filter((s) => isObj(s) && known.has(s.id) && !seen.has(s.id) && seen.add(s.id));
  for (const s of DEFAULT_CONTENT.sections) if (!seen.has(s.id)) sections.push({ ...s });
  c.sections = sections.map((s) => ({ id: s.id, visible: s.visible !== false }));
  return c;
}

/** Is this popup allowed to show today (start / end date)? */
export function popupInSchedule(p: Popup, now = new Date()): boolean {
  const today = now.toISOString().slice(0, 10);
  if (p.startDate && today < p.startDate) return false;
  if (p.endDate && today > p.endDate) return false;
  return true;
}
