"use client";

import { useContext, useState } from "react";
import { NEW_PRODUCT } from "@/content/defaults";
import { Btn, Card, Choice, Empty, Grid, ItemControls, LinkInput, MediaPicker, NumberInput, PanelHeader, Text, Toggle, UploadCtx, move } from "./fields";
import { Icon } from "./icons";
import type { PanelProps } from "./panels";

const TAGS = ["BESTSELLER", "POPULAR", "NEW", "HOT", "LIMITED", "SALE"];

export default function ProductsPanel({ c, set }: PanelProps) {
  const { asset } = useContext(UploadCtx);
  const [open, setOpen] = useState<number | null>(null);
  const items = c.products.items;
  const visible = items.filter((p) => !p.hidden).length;
  const homeIds = new Set(items.filter((p) => !p.hidden).slice(0, c.products.homeCount).map((p) => p.id));

  const add = () => {
    const id = Date.now();
    set((d) => void d.products.items.unshift({ ...NEW_PRODUCT, id, title: "New playbook" }));
    setOpen(id);
  };

  return (
    <>
      <PanelHeader title="Courses & playbooks" desc={`${visible} showing on the site · ${items.length - visible} hidden. The first ${c.products.homeCount} visible ones appear on the homepage.`}>
        <Btn variant="primary" onClick={add}>
          <Icon name="plus" /> Add product
        </Btn>
      </PanelHeader>

      {items.length === 0 && (
        <Empty icon="book" title="No products yet">
          <Btn variant="primary" onClick={add}>Add your first product</Btn>
        </Empty>
      )}

      <div className="space-y-3 mb-6">
        {items.map((p, i) => {
          const isOpen = open === p.id;
          const edit = (fn: (x: typeof p) => void) => set((d) => fn(d.products.items[i]));
          return (
            <div key={p.id} className={`rounded-2xl border transition-all admin-fade ${isOpen ? "border-[#ff3b3b]/40 bg-white/[0.04]" : "border-white/[0.08] bg-white/[0.02]"} ${p.hidden && !isOpen ? "opacity-55" : ""}`}>
              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4">
                <button onClick={() => setOpen(isOpen ? null : p.id)} className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 text-left">
                  <div className="relative w-12 h-[72px] shrink-0 rounded-lg overflow-hidden bg-white/5 border border-white/10">
                    {p.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={asset(p.image)} alt="" className="w-full h-full object-cover" />
                    )}
                    {homeIds.has(p.id) && <span className="absolute bottom-0 inset-x-0 bg-[#d40000] text-[8px] font-bold text-center py-0.5">HOME</span>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      {p.tag && <span className="text-[9px] font-bold tracking-widest text-[#ff5252] uppercase">{p.tag}</span>}
                      {p.featured && <span className="text-[9px] font-bold tracking-widest text-amber-400 uppercase">★ Featured</span>}
                      {p.hidden && <span className="text-[9px] font-bold tracking-widest text-white/40 uppercase">Hidden</span>}
                    </div>
                    <p className="font-bold text-sm truncate">{p.title || "Untitled"}</p>
                    <p className="text-white/40 text-xs truncate">{p.subtitle}</p>
                  </div>
                  <p className="font-bold text-sm shrink-0 hidden sm:block">{p.price}</p>
                  <Icon name="down" className={`w-4 h-4 text-white/40 transition-transform duration-300 shrink-0 ${isOpen ? "rotate-180" : ""}`} />
                </button>
                <button
                  onClick={() => edit((x) => void (x.hidden = !x.hidden))}
                  title={p.hidden ? "Show on site" : "Hide from site"}
                  className={`hidden sm:grid w-8 h-8 rounded-lg place-items-center border transition ${p.hidden ? "border-white/10 text-white/40" : "border-emerald-500/30 text-emerald-400"}`}
                >
                  <Icon name={p.hidden ? "eyeOff" : "eye"} />
                </button>
              </div>

              {isOpen && (
                <div className="px-4 pb-5 pt-1 space-y-5 border-t border-white/5 admin-fade">
                  <div className="flex justify-end pt-3">
                    <ItemControls
                      index={i}
                      count={items.length}
                      onMove={(a, b) => set((d) => void (d.products.items = move(d.products.items, a, b)))}
                      onDuplicate={() => set((d) => void d.products.items.splice(i + 1, 0, { ...structuredClone(p), id: Date.now(), title: p.title + " (copy)" }))}
                      onDelete={() => {
                        set((d) => void d.products.items.splice(i, 1));
                        setOpen(null);
                      }}
                    />
                  </div>
                  <Grid>
                    <Text label="Title" value={p.title} onChange={(v) => edit((x) => void (x.title = v))} />
                    <Text label="Subtitle" value={p.subtitle} onChange={(v) => edit((x) => void (x.subtitle = v))} />
                  </Grid>
                  <LinkInput label="Payment / buy link" hint="Razorpay or any checkout link" value={p.href} onChange={(v) => edit((x) => void (x.href = v))} />
                  <Grid>
                    <Text label="Price" placeholder="₹299" value={p.price} onChange={(v) => edit((x) => void (x.price = v))} />
                    <Text label="Old price (crossed out)" hint="Optional — shows a discount" placeholder="₹599" value={p.oldPrice} onChange={(v) => edit((x) => void (x.oldPrice = v))} />
                  </Grid>
                  <MediaPicker label="Cover image" hint="Book cover, 2:3 portrait" value={p.image} onChange={(v) => edit((x) => void (x.image = v))} aspect={2 / 3} tall />
                  <Choice
                    label="Tag"
                    value={TAGS.includes(p.tag) ? p.tag : p.tag ? "__custom" : ""}
                    onChange={(v) => edit((x) => void (x.tag = v === "__custom" ? "SPECIAL" : v))}
                    options={[{ value: "", label: "None" }, ...TAGS.map((t) => ({ value: t, label: t })), { value: "__custom", label: "Custom…" }]}
                  />
                  {p.tag && !TAGS.includes(p.tag) && <Text label="Custom tag text" value={p.tag} onChange={(v) => edit((x) => void (x.tag = v.toUpperCase()))} />}
                  {p.tag && (
                    <Choice
                      label="Tag colour"
                      value={p.tagStyle}
                      onChange={(v) => edit((x) => void (x.tagStyle = v))}
                      options={[
                        { value: "red", label: "Red", swatch: "#7f0000" },
                        { value: "white", label: "White", swatch: "#fff" },
                        { value: "black", label: "Black", swatch: "#000" },
                      ]}
                    />
                  )}
                  <Grid>
                    <Toggle label="Show on website" value={!p.hidden} onChange={(v) => edit((x) => void (x.hidden = !v))} />
                    <Toggle label="Featured (glowing border)" value={p.featured} onChange={(v) => edit((x) => void (x.featured = v))} />
                  </Grid>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Card title="Section text">
        <Grid>
          <Text label="Heading" value={c.products.heading} onChange={(v) => set((d) => void (d.products.heading = v))} />
          <Text label="Red tagline" value={c.products.tagline} onChange={(v) => set((d) => void (d.products.tagline = v))} />
        </Grid>
        <Grid>
          <Text label="Buy button text" value={c.products.buyText} onChange={(v) => set((d) => void (d.products.buyText = v))} />
          <Text label="“View all” button text" value={c.products.viewAllText} onChange={(v) => set((d) => void (d.products.viewAllText = v))} />
        </Grid>
        <NumberInput label="How many on the homepage" min={1} max={9} value={c.products.homeCount} onChange={(v) => set((d) => void (d.products.homeCount = v))} />
      </Card>
    </>
  );
}
