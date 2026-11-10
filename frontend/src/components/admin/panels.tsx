"use client";

import { useContext } from "react";
import type { SiteContent } from "@/content/types";
import { DEFAULT_CONTENT, NEW_SESSION, SECTION_LABELS } from "@/content/defaults";
import {
  Btn,
  Card,
  Choice,
  ColorPicker,
  Empty,
  Grid,
  ItemControls,
  LinkInput,
  MediaPicker,
  NumberInput,
  PanelHeader,
  Text,
  TextArea,
  Toggle,
  UploadCtx,
  move,
} from "./fields";
import { Icon } from "./icons";

export type Edit = (fn: (d: SiteContent) => void) => void;
export interface PanelProps {
  c: SiteContent;
  set: Edit;
}

function ResetBtn({ onClick }: { onClick: () => void }) {
  return (
    <Btn small onClick={() => confirm("Reset this part back to the original text?") && onClick()} title="Reset to original">
      <Icon name="refresh" className="w-3.5 h-3.5" /> Reset
    </Btn>
  );
}

// ── Page layout ────────────────────────────────────────────────
export function LayoutPanel({ c, set }: PanelProps) {
  return (
    <>
      <PanelHeader title="Page layout" desc="Choose which sections appear on the homepage and in what order. Use the arrows to move a section up or down." />
      <Card>
        <ol className="space-y-2">
          {c.sections.map((s, i) => (
            <li
              key={s.id}
              className={`flex items-center gap-3 rounded-xl border px-3 py-3 transition-all ${
                s.visible ? "border-white/10 bg-black/30" : "border-white/5 bg-black/10 opacity-50"
              }`}
            >
              <span className="w-7 h-7 shrink-0 rounded-lg bg-white/5 grid place-items-center text-xs font-bold text-white/50 tabular-nums">{i + 1}</span>
              <span className="flex-1 text-sm font-medium">{SECTION_LABELS[s.id]}</span>
              <button
                onClick={() => set((d) => void (d.sections[i].visible = !d.sections[i].visible))}
                className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border transition-colors ${
                  s.visible ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10" : "border-white/10 text-white/40"
                }`}
              >
                {s.visible ? "Showing" : "Hidden"}
              </button>
              <div className="flex gap-1">
                <button disabled={i === 0} onClick={() => set((d) => void (d.sections = move(d.sections, i, i - 1)))} className="w-8 h-8 rounded-lg border border-white/10 grid place-items-center text-white/50 hover:text-white disabled:opacity-20" aria-label="Move up">
                  <Icon name="up" />
                </button>
                <button disabled={i === c.sections.length - 1} onClick={() => set((d) => void (d.sections = move(d.sections, i, i + 1)))} className="w-8 h-8 rounded-lg border border-white/10 grid place-items-center text-white/50 hover:text-white disabled:opacity-20" aria-label="Move down">
                  <Icon name="down" />
                </button>
              </div>
            </li>
          ))}
        </ol>
      </Card>
    </>
  );
}

// ── Hero & intro ──────────────────────────────────────────────
export function HeroPanel({ c, set }: PanelProps) {
  return (
    <>
      <PanelHeader title="Hero & intro" desc="The first things visitors see when they open the website." />

      <Card title="1 · Intro video" desc="Full-screen video with the big glowing name." actions={<ResetBtn onClick={() => set((d) => void (d.intro = structuredClone(DEFAULT_CONTENT.intro)))} />}>
        <Grid>
          <Text label="Small text above name" value={c.intro.eyebrow} onChange={(v) => set((d) => void (d.intro.eyebrow = v))} />
          <Text label="Big name" value={c.intro.name} onChange={(v) => set((d) => void (d.intro.name = v))} max={20} />
        </Grid>
        <Text label="Scroll hint" hint="Small text at the bottom of the screen" value={c.intro.scrollHint} onChange={(v) => set((d) => void (d.intro.scrollHint = v))} />
        <MediaPicker kind="video" label="Background video" hint="MP4, under 4MB works best" value={c.intro.video} onChange={(v) => set((d) => void (d.intro.video = v))} />
      </Card>

      <Card title="2 · “Don't Stop” scroll section" desc="Huge red text with a picture that grows as you scroll.">
        <Text label="Big background text" value={c.eyeroll.bigText} onChange={(v) => set((d) => void (d.eyeroll.bigText = v))} max={16} />
        <MediaPicker label="Picture" value={c.eyeroll.image} onChange={(v) => set((d) => void (d.eyeroll.image = v))} aspect={1} />
      </Card>

      <Card title="3 · Main hero" desc="Headline, button and your photo." actions={<ResetBtn onClick={() => set((d) => void (d.hero = structuredClone(DEFAULT_CONTENT.hero)))} />}>
        <Grid cols={3}>
          <Text label="Line 1" value={c.hero.line1} onChange={(v) => set((d) => void (d.hero.line1 = v))} />
          <Text label="Line 2" hint="Shimmers with colour" value={c.hero.line2} onChange={(v) => set((d) => void (d.hero.line2 = v))} />
          <Text label="Line 3" value={c.hero.line3} onChange={(v) => set((d) => void (d.hero.line3 = v))} />
        </Grid>
        <TextArea label="Description" value={c.hero.subtitle} onChange={(v) => set((d) => void (d.hero.subtitle = v))} />
        <Grid>
          <Text label="Button text" value={c.hero.ctaText} onChange={(v) => set((d) => void (d.hero.ctaText = v))} />
          <LinkInput label="Button goes to" value={c.hero.ctaLink} onChange={(v) => set((d) => void (d.hero.ctaLink = v))} />
        </Grid>
        <MediaPicker label="Photo" hint="Portrait photo works best (3:4)" value={c.hero.photo} onChange={(v) => set((d) => void (d.hero.photo = v))} aspect={3 / 4} tall />
        <Grid>
          <Text label="Name on photo" value={c.hero.photoName} onChange={(v) => set((d) => void (d.hero.photoName = v))} />
          <Text label="Title on photo" value={c.hero.photoRole} onChange={(v) => set((d) => void (d.hero.photoRole = v))} />
        </Grid>
      </Card>
    </>
  );
}

// ── Stats & videos ─────────────────────────────────────────────
export function StatsPanel({ c, set }: PanelProps) {
  return (
    <>
      <PanelHeader title="Stats & videos" desc="The numbers that count up over the video, and the red “Date Smarter” section." />
      <Card
        title="Numbers"
        desc="Numbers animate from 0 when visitors scroll to them. Keep them short, e.g. 95% or 1L+."
        actions={
          <Btn small onClick={() => set((d) => void d.stats.items.push({ value: "100+", label: "New stat" }))} disabled={c.stats.items.length >= 6}>
            <Icon name="plus" className="w-3.5 h-3.5" /> Add
          </Btn>
        }
      >
        {c.stats.items.map((s, i) => (
          <div key={i} className="flex flex-col sm:flex-row sm:items-end gap-3 rounded-xl border border-white/5 bg-black/20 p-3">
            <div className="sm:w-32">
              <Text label="Number" value={s.value} onChange={(v) => set((d) => void (d.stats.items[i].value = v))} />
            </div>
            <div className="flex-1">
              <Text label="Label" value={s.label} onChange={(v) => set((d) => void (d.stats.items[i].label = v))} />
            </div>
            <ItemControls
              index={i}
              count={c.stats.items.length}
              onMove={(a, b) => set((d) => void (d.stats.items = move(d.stats.items, a, b)))}
              onDelete={() => set((d) => void d.stats.items.splice(i, 1))}
            />
          </div>
        ))}
        <MediaPicker kind="video" label="Video behind the numbers" value={c.stats.video} onChange={(v) => set((d) => void (d.stats.video = v))} />
      </Card>

      <Card title="“Date Smarter” section" actions={<ResetBtn onClick={() => set((d) => void (d.dateSmarter = structuredClone(DEFAULT_CONTENT.dateSmarter)))} />}>
        <Grid>
          <Text label="Big title" value={c.dateSmarter.title} onChange={(v) => set((d) => void (d.dateSmarter.title = v))} />
          <Text label="Line under title" value={c.dateSmarter.subtitle} onChange={(v) => set((d) => void (d.dateSmarter.subtitle = v))} />
        </Grid>
        <MediaPicker kind="video" label="Video" value={c.dateSmarter.video} onChange={(v) => set((d) => void (d.dateSmarter.video = v))} />
        <TextArea label="Headline under video" rows={2} value={c.dateSmarter.headline} onChange={(v) => set((d) => void (d.dateSmarter.headline = v))} />
        <Grid>
          <Text label="Button text" value={c.dateSmarter.buttonText} onChange={(v) => set((d) => void (d.dateSmarter.buttonText = v))} />
          <LinkInput label="Button goes to" value={c.dateSmarter.buttonLink} onChange={(v) => set((d) => void (d.dateSmarter.buttonLink = v))} />
        </Grid>
      </Card>
    </>
  );
}

// ── Testimonials ───────────────────────────────────────────────
export function TestimonialsPanel({ c, set }: PanelProps) {
  const { upload, asset } = useContext(UploadCtx);
  const t = c.testimonials;

  const addFiles = async (files: FileList | null) => {
    if (!files) return;
    for (const f of Array.from(files)) {
      try {
        const path = await upload(f);
        set((d) => void d.testimonials.screenshots.push(path));
      } catch (e) {
        alert(e instanceof Error ? e.message : "Upload failed");
      }
    }
  };

  return (
    <>
      <PanelHeader title="Testimonials" desc="Screenshots of happy clients, shown in a swipeable slider.">
        <label className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold bg-white text-black hover:bg-white/90 cursor-pointer active:scale-95 transition">
          <Icon name="upload" className="w-4 h-4" /> Add screenshots
          <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
        </label>
      </PanelHeader>

      <Card title="Text">
        <Grid cols={3}>
          <Text label="Small label" value={t.eyebrow} onChange={(v) => set((d) => void (d.testimonials.eyebrow = v))} />
          <Text label="Heading" value={t.heading} onChange={(v) => set((d) => void (d.testimonials.heading = v))} />
          <Text label="Sub-heading" value={t.subheading} onChange={(v) => set((d) => void (d.testimonials.subheading = v))} />
        </Grid>
        <NumberInput label="Seconds per slide" min={2} max={10} value={t.autoplaySeconds} suffix="s" onChange={(v) => set((d) => void (d.testimonials.autoplaySeconds = v))} />
      </Card>

      <Card title={`Screenshots (${t.screenshots.length})`} desc="Tip: you can select many images at once. Use arrows to change the order.">
        {t.screenshots.length === 0 ? (
          <Empty icon="star" title="No testimonials yet" />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {t.screenshots.map((src, i) => (
              <div key={src + i} className="group relative aspect-[9/16] rounded-xl overflow-hidden border border-white/10 bg-black admin-fade">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset(src)} alt="" className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 text-[10px] font-bold bg-black/70 rounded-md px-1.5 py-0.5">#{i + 1}</span>
                <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black via-black/80 to-transparent flex justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <ItemControls
                    index={i}
                    count={t.screenshots.length}
                    onMove={(a, b) => set((d) => void (d.testimonials.screenshots = move(d.testimonials.screenshots, a, b)))}
                    onDelete={() => set((d) => void d.testimonials.screenshots.splice(i, 1))}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </>
  );
}

// ── Booking ────────────────────────────────────────────────────
export function BookingPanel({ c, set }: PanelProps) {
  const b = c.booking;
  return (
    <>
      <PanelHeader title="1-on-1 sessions" desc="Paid call options. Every card opens your booking page.">
        <Btn variant="primary" onClick={() => set((d) => void d.booking.sessions.push({ ...NEW_SESSION, id: Date.now() }))}>
          <Icon name="plus" /> Add session
        </Btn>
      </PanelHeader>

      <Card title="Section text" actions={<ResetBtn onClick={() => set((d) => void (d.booking = { ...structuredClone(DEFAULT_CONTENT.booking), sessions: d.booking.sessions }))} />}>
        <Text label="Small badge" value={b.badge} onChange={(v) => set((d) => void (d.booking.badge = v))} />
        <Grid>
          <Text label="Heading" value={b.heading} onChange={(v) => set((d) => void (d.booking.heading = v))} />
          <Text label="Coloured part of heading" value={b.highlight} onChange={(v) => set((d) => void (d.booking.highlight = v))} />
        </Grid>
        <TextArea label="Description" value={b.description} onChange={(v) => set((d) => void (d.booking.description = v))} />
        <LinkInput label="Main booking page link" hint="Used by the big button, and by any session without its own link" value={b.url} onChange={(v) => set((d) => void (d.booking.url = v))} />
        <Grid>
          <Text label="Big button title" value={b.ctaTitle} onChange={(v) => set((d) => void (d.booking.ctaTitle = v))} />
          <Text label="Big button small text" value={b.ctaSubtitle} onChange={(v) => set((d) => void (d.booking.ctaSubtitle = v))} />
        </Grid>
      </Card>

      {b.sessions.map((s, i) => (
        <Card
          key={s.id}
          title={s.title || "Untitled session"}
          desc={`${s.mins} · ${s.price}`}
          actions={
            <ItemControls
              index={i}
              count={b.sessions.length}
              onMove={(a, z) => set((d) => void (d.booking.sessions = move(d.booking.sessions, a, z)))}
              onDuplicate={() => set((d) => void d.booking.sessions.splice(i + 1, 0, { ...structuredClone(s), id: Date.now() }))}
              onDelete={() => set((d) => void d.booking.sessions.splice(i, 1))}
            />
          }
        >
          <Grid>
            <Text label="Session name" value={s.title} onChange={(v) => set((d) => void (d.booking.sessions[i].title = v))} />
            <Text label="Length" placeholder="30 mins" value={s.mins} onChange={(v) => set((d) => void (d.booking.sessions[i].mins = v))} />
          </Grid>
          <Grid cols={3}>
            <Text label="Price" placeholder="₹999" value={s.price} onChange={(v) => set((d) => void (d.booking.sessions[i].price = v))} />
            <Text label="Old price (crossed out)" hint="Leave empty to hide" value={s.was} onChange={(v) => set((d) => void (d.booking.sessions[i].was = v))} />
            <Text label="Badge" hint="e.g. Most Popular" value={s.tag} onChange={(v) => set((d) => void (d.booking.sessions[i].tag = v))} />
          </Grid>
          <LinkInput label="Booking link for this session" hint="Leave empty to use the main booking page link" value={s.link} onChange={(v) => set((d) => void (d.booking.sessions[i].link = v))} />
        </Card>
      ))}
    </>
  );
}

// ── Courses page ───────────────────────────────────────────────
export function CoursesPagePanel({ c, set }: PanelProps) {
  const p = c.coursesPage;
  return (
    <>
      <PanelHeader title="Courses page" desc="The separate /courses page that lists all your playbooks." />
      <Card title="Top of the page" actions={<ResetBtn onClick={() => set((d) => void (d.coursesPage = structuredClone(DEFAULT_CONTENT.coursesPage)))} />}>
        <Text label="Small badge" value={p.badge} onChange={(v) => set((d) => void (d.coursesPage.badge = v))} />
        <div className="space-y-3">
          {p.headingLines.map((l, i) => (
            <Grid key={i}>
              <Text label={`Heading line ${i + 1} — white part`} value={l.lead} onChange={(v) => set((d) => void (d.coursesPage.headingLines[i].lead = v))} />
              <Text label="Black (highlighted) part" value={l.highlight} onChange={(v) => set((d) => void (d.coursesPage.headingLines[i].highlight = v))} />
            </Grid>
          ))}
        </div>
        <TextArea label="Description" value={p.subtitle} onChange={(v) => set((d) => void (d.coursesPage.subtitle = v))} />
        <Text label="Button text" value={p.ctaText} onChange={(v) => set((d) => void (d.coursesPage.ctaText = v))} />
        <Grid>
          <Text label="Social proof (bold)" value={p.socialProofTitle} onChange={(v) => set((d) => void (d.coursesPage.socialProofTitle = v))} />
          <Text label="Social proof (small)" value={p.socialProofSubtitle} onChange={(v) => set((d) => void (d.coursesPage.socialProofSubtitle = v))} />
        </Grid>
      </Card>

      <Card
        title="Benefits list"
        desc="The ✓ ticked points."
        actions={
          <Btn small onClick={() => set((d) => void d.coursesPage.benefits.push("New benefit"))}>
            <Icon name="plus" className="w-3.5 h-3.5" /> Add
          </Btn>
        }
      >
        {p.benefits.map((b, i) => (
          <div key={i} className="flex items-end gap-2">
            <div className="flex-1">
              <Text label={`Point ${i + 1}`} value={b} onChange={(v) => set((d) => void (d.coursesPage.benefits[i] = v))} />
            </div>
            <ItemControls
              index={i}
              count={p.benefits.length}
              onMove={(a, z) => set((d) => void (d.coursesPage.benefits = move(d.coursesPage.benefits, a, z)))}
              onDelete={() => set((d) => void d.coursesPage.benefits.splice(i, 1))}
            />
          </div>
        ))}
      </Card>

      <Card title="Quote & portrait">
        <Grid>
          <Text label="Quote (first line)" value={p.quoteTop} onChange={(v) => set((d) => void (d.coursesPage.quoteTop = v))} />
          <Text label="Quote (big line)" value={p.quoteMain} onChange={(v) => set((d) => void (d.coursesPage.quoteMain = v))} />
        </Grid>
        <Text label="Quote author" value={p.quoteAuthor} onChange={(v) => set((d) => void (d.coursesPage.quoteAuthor = v))} />
        <MediaPicker label="Portrait" value={p.portrait} onChange={(v) => set((d) => void (d.coursesPage.portrait = v))} aspect={4 / 5} tall />
      </Card>

      <Card title="Product list">
        <Grid>
          <Text label="List title" value={p.gridTitle} onChange={(v) => set((d) => void (d.coursesPage.gridTitle = v))} />
          <Text label="List sub-title" value={p.gridSubtitle} onChange={(v) => set((d) => void (d.coursesPage.gridSubtitle = v))} />
        </Grid>
        <Toggle label="Show loading animation" hint="A short branded loader the first time someone opens the page" value={p.showLoader} onChange={(v) => set((d) => void (d.coursesPage.showLoader = v))} />
      </Card>
    </>
  );
}

// ── Header & footer ────────────────────────────────────────────
export function HeaderFooterPanel({ c, set }: PanelProps) {
  return (
    <>
      <PanelHeader title="Header & footer" desc="Top menu, announcement strip and the bottom of every page." />

      <Card title="Announcement strip" desc="A thin bar above the menu — great for offers and launches.">
        <Toggle label="Show announcement strip" value={c.announcement.enabled} onChange={(v) => set((d) => void (d.announcement.enabled = v))} />
        {c.announcement.enabled && (
          <div className="space-y-5 admin-fade">
            <Text label="Message" value={c.announcement.text} onChange={(v) => set((d) => void (d.announcement.text = v))} max={90} />
            <Grid>
              <Text label="Link text" hint="Leave empty for no link" value={c.announcement.linkText} onChange={(v) => set((d) => void (d.announcement.linkText = v))} />
              <LinkInput label="Link goes to" value={c.announcement.link} onChange={(v) => set((d) => void (d.announcement.link = v))} />
            </Grid>
            <Choice
              label="Colour"
              value={c.announcement.style}
              onChange={(v) => set((d) => void (d.announcement.style = v))}
              options={[
                { value: "red", label: "Red", swatch: "#7f0000" },
                { value: "white", label: "White", swatch: "#fff" },
                { value: "black", label: "Black", swatch: "#000" },
              ]}
            />
          </div>
        )}
      </Card>

      <Card
        title="Top menu"
        actions={
          <Btn small onClick={() => set((d) => void d.nav.links.push({ label: "New link", href: "#playbooks" }))} disabled={c.nav.links.length >= 6}>
            <Icon name="plus" className="w-3.5 h-3.5" /> Add link
          </Btn>
        }
      >
        <Text label="Brand name (top left)" value={c.nav.brand} onChange={(v) => set((d) => void (d.nav.brand = v))} />
        {c.nav.links.map((l, i) => (
          <div key={i} className="rounded-xl border border-white/5 bg-black/20 p-3 space-y-3">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Text label={`Menu link ${i + 1}`} value={l.label} onChange={(v) => set((d) => void (d.nav.links[i].label = v))} />
              </div>
              <ItemControls
                index={i}
                count={c.nav.links.length}
                onMove={(a, z) => set((d) => void (d.nav.links = move(d.nav.links, a, z)))}
                onDelete={() => set((d) => void d.nav.links.splice(i, 1))}
              />
            </div>
            <LinkInput label="Goes to" value={l.href} onChange={(v) => set((d) => void (d.nav.links[i].href = v))} />
          </div>
        ))}
        <Grid>
          <Text label="Menu button text" value={c.nav.ctaText} onChange={(v) => set((d) => void (d.nav.ctaText = v))} />
          <LinkInput label="Menu button goes to" value={c.nav.ctaLink} onChange={(v) => set((d) => void (d.nav.ctaLink = v))} />
        </Grid>
      </Card>

      <Card title="Footer" actions={<ResetBtn onClick={() => set((d) => void (d.footer = structuredClone(DEFAULT_CONTENT.footer)))} />}>
        <Text label="About — title" value={c.footer.aboutTitle} onChange={(v) => set((d) => void (d.footer.aboutTitle = v))} />
        <TextArea label="About — text" rows={4} value={c.footer.aboutText} onChange={(v) => set((d) => void (d.footer.aboutText = v))} />
        <LinkInput label="Your Instagram" value={c.footer.instagram} onChange={(v) => set((d) => void (d.footer.instagram = v))} />
        <Grid>
          <Text label="Partner — title" value={c.footer.partnerTitle} onChange={(v) => set((d) => void (d.footer.partnerTitle = v))} />
          <Text label="Partner — small tag" value={c.footer.partnerTag} onChange={(v) => set((d) => void (d.footer.partnerTag = v))} />
        </Grid>
        <TextArea label="Partner — text" value={c.footer.partnerText} onChange={(v) => set((d) => void (d.footer.partnerText = v))} />
        <LinkInput label="Partner Instagram" value={c.footer.partnerInstagram} onChange={(v) => set((d) => void (d.footer.partnerInstagram = v))} />
        <Text label="Copyright line" value={c.footer.copyright} onChange={(v) => set((d) => void (d.footer.copyright = v))} />
        <MediaPicker kind="video" label="Footer background video" value={c.footer.video} onChange={(v) => set((d) => void (d.footer.video = v))} />
      </Card>
    </>
  );
}

// ── Settings ───────────────────────────────────────────────────
export function SettingsPanel({ c, set }: PanelProps) {
  const s = c.settings;
  return (
    <>
      <PanelHeader title="Settings" desc="Look & feel, Google search text and phone extras." />

      <Card title="Look & feel">
        <ColorPicker label="Accent colour" hint="Used for glows, highlights and the glowing name" value={s.accentColor} onChange={(v) => set((d) => void (d.settings.accentColor = v))} />
        <Toggle label="Scroll animations" hint="Things fade and slide in as you scroll" value={s.animations} onChange={(v) => set((d) => void (d.settings.animations = v))} />
        <Toggle label="Smooth scrolling on computers" hint="Silky scrolling with a mouse or trackpad (phones always use normal scrolling)" value={s.smoothScroll} onChange={(v) => set((d) => void (d.settings.smoothScroll = v))} />
      </Card>

      <Card title="Phone extras">
        <Toggle label="Sticky button at the bottom on phones" hint="Appears after the first screen, hides near the footer" value={s.stickyMobileCta} onChange={(v) => set((d) => void (d.settings.stickyMobileCta = v))} />
        {s.stickyMobileCta && (
          <Grid>
            <Text label="Button text" value={s.mobileCtaText} onChange={(v) => set((d) => void (d.settings.mobileCtaText = v))} />
            <LinkInput label="Button goes to" value={s.mobileCtaLink} onChange={(v) => set((d) => void (d.settings.mobileCtaLink = v))} />
          </Grid>
        )}
      </Card>

      <Card title="Google & sharing" desc="How your site appears on Google and when shared on WhatsApp / Instagram.">
        <Text label="Page title" value={s.siteTitle} max={65} onChange={(v) => set((d) => void (d.settings.siteTitle = v))} />
        <TextArea label="Description" value={s.siteDescription} onChange={(v) => set((d) => void (d.settings.siteDescription = v))} />
        <div className="rounded-xl bg-white p-4 text-left">
          <p className="text-[11px] text-[#202124]">yourwebsite.com</p>
          <p className="text-[#1a0dab] text-lg leading-snug truncate">{s.siteTitle}</p>
          <p className="text-[#4d5156] text-xs line-clamp-2">{s.siteDescription}</p>
        </div>
      </Card>
    </>
  );
}
