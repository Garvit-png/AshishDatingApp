"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import ImageCropper from "./ImageCropper";

// ── Types ─────────────────────────────────────────────────────
interface Book {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  tag: string;
  tagColor: string;
  price: string;
  href: string;
  hidden: boolean;
  featured?: boolean;
}

interface PopupItem {
  id: number;
  enabled: boolean;
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  buttonStyle: "red" | "white" | "black";
}

interface HeroData {
  line1: string; line2: string; line3: string;
  subtitle: string; ctaText: string; ctaLink: string; photo: string;
}

interface Testimonial {
  id: number; name: string; handle: string; photo: string;
  text: string; rating: number; hidden: boolean;
}

interface TestimonialsFile {
  enabled: boolean; heading: string; subheading: string;
  testimonials: Testimonial[];
}

const EMPTY_HERO: HeroData = {
  line1: "Attract Better.", line2: "Date Smarter.", line3: "Build Lasting Love.",
  subtitle: "Join thousands of learners and transform your dating life.",
  ctaText: "Start Learning Now", ctaLink: "#playbooks", photo: "/ashish.jpeg",
};

const EMPTY_TESTIMONIALS: TestimonialsFile = {
  enabled: true,
  heading: "Real Results. Real People.",
  subheading: "Join thousands who've already transformed their dating life.",
  testimonials: [],
};

const EMPTY_TESTIMONIAL: Omit<Testimonial, "id"> = {
  name: "", handle: "", photo: "", text: "", rating: 5, hidden: false,
};

const EMPTY_BOOK: Omit<Book, "id"> = {
  title: "", subtitle: "", image: "", tag: "NEW",
  tagColor: "bg-[#7f0000]", price: "₹299", href: "", hidden: false, featured: false,
};

const EMPTY_POPUP: Omit<PopupItem, "id"> = {
  enabled: true, image: "", title: "", description: "",
  buttonText: "", buttonLink: "", buttonStyle: "red",
};

const TAG_OPTIONS = ["BESTSELLER", "POPULAR", "NEW", "HOT", "LIMITED"];
const TAG_COLOR_OPTIONS = [
  { label: "Red", value: "bg-[#7f0000]" },
  { label: "White", value: "bg-white" },
  { label: "Black", value: "bg-black" },
];

type Tab = "books" | "popup" | "hero" | "testimonials";
type UploadTarget = "edit" | "new" | `popup-${number}` | `newpopup` | "hero" | `testimonial-${number}` | "newtestimonial";

// ── Main Dashboard ────────────────────────────────────────────
export default function AdminDashboard({ sessionToken, onLogout }: {
  sessionToken: string;
  onLogout: () => void;
}) {
  const [tab, setTab] = useState<Tab>("books");
  const [books, setBooks] = useState<Book[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [showAddBook, setShowAddBook] = useState(false);
  const [newBook, setNewBook] = useState<Omit<Book, "id">>(EMPTY_BOOK);
  const [uploadingFor, setUploadingFor] = useState<UploadTarget | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [deleteBookConfirm, setDeleteBookConfirm] = useState<number | null>(null);

  // Crop state
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [cropTarget, setCropTarget] = useState<UploadTarget | null>(null);

  // Popup state
  const [popups, setPopups] = useState<PopupItem[]>([]);
  const [loadingPopup, setLoadingPopup] = useState(true);
  const [savingPopup, setSavingPopup] = useState(false);
  const [editingPopupId, setEditingPopupId] = useState<number | null>(null);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [newPopup, setNewPopup] = useState<Omit<PopupItem, "id">>(EMPTY_POPUP);
  const [deletePopupConfirm, setDeletePopupConfirm] = useState<number | null>(null);

  // Hero state
  const [hero, setHero] = useState<HeroData>(EMPTY_HERO);
  const [loadingHero, setLoadingHero] = useState(true);
  const [savingHero, setSavingHero] = useState(false);

  // Testimonials state
  const [testimonialsFile, setTestimonialsFile] = useState<TestimonialsFile>(EMPTY_TESTIMONIALS);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);
  const [savingTestimonials, setSavingTestimonials] = useState(false);
  const [editingTestimonialId, setEditingTestimonialId] = useState<number | null>(null);
  const [showAddTestimonial, setShowAddTestimonial] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState<Omit<Testimonial, "id">>(EMPTY_TESTIMONIAL);
  const [deleteTestimonialConfirm, setDeleteTestimonialConfirm] = useState<number | null>(null);

  const headers = { "Content-Type": "application/json", "x-admin-token": sessionToken };

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Fetch ──────────────────────────────────────────────────
  const fetchBooks = async () => {
    setLoadingBooks(true);
    try {
      const res = await fetch("/api/admin/books", { headers });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBooks(data);
    } catch { showToast("Failed to load books", "error"); }
    finally { setLoadingBooks(false); }
  };

  const fetchPopups = async () => {
    setLoadingPopup(true);
    try {
      const res = await fetch("/api/admin/popup", { headers });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPopups(data.popups ?? []);
    } catch { showToast("Failed to load popups", "error"); }
    finally { setLoadingPopup(false); }
  };

  useEffect(() => { fetchBooks(); fetchPopups(); fetchHero(); fetchTestimonials(); }, []); // eslint-disable-line

  const fetchHero = async () => {
    setLoadingHero(true);
    try {
      const res = await fetch("/api/admin/hero", { headers });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setHero(data);
    } catch { showToast("Failed to load hero", "error"); }
    finally { setLoadingHero(false); }
  };

  const fetchTestimonials = async () => {
    setLoadingTestimonials(true);
    try {
      const res = await fetch("/api/admin/testimonials", { headers });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setTestimonialsFile(data);
    } catch { showToast("Failed to load testimonials", "error"); }
    finally { setLoadingTestimonials(false); }
  };

  // ── Image upload ───────────────────────────────────────────
  const handleImageUpload = async (file: File, target: UploadTarget) => {
    setUploadingFor(target);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "x-admin-token": sessionToken },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (target === "edit" && editingBook) {
        setEditingBook({ ...editingBook, image: data.path });
      } else if (target === "new") {
        setNewBook(p => ({ ...p, image: data.path }));
      } else if (target === "newpopup") {
        setNewPopup(p => ({ ...p, image: data.path }));
      } else if (target === "hero") {
        setHero(p => ({ ...p, photo: data.path }));
      } else if (target === "newtestimonial") {
        setNewTestimonial(p => ({ ...p, photo: data.path }));
      } else if (target.startsWith("testimonial-")) {
        const id = parseInt(target.replace("testimonial-", ""));
        setTestimonialsFile(prev => ({ ...prev, testimonials: prev.testimonials.map(t => t.id === id ? { ...t, photo: data.path } : t) }));
      } else if (target.startsWith("popup-")) {
        const id = parseInt(target.replace("popup-", ""));
        setPopups(ps => ps.map(p => p.id === id ? { ...p, image: data.path } : p));
        if (editingPopupId === id) {
          setPopups(ps => ps.map(p => p.id === id ? { ...p, image: data.path } : p));
        }
      }
      showToast("Image uploaded ✓");
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Upload failed", "error");
    } finally { setUploadingFor(null); }
  };

  // ── Books CRUD ─────────────────────────────────────────────
  const handleSaveEditBook = async () => {
    if (!editingBook) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/books", { method: "PUT", headers, body: JSON.stringify(editingBook) });
      if (!res.ok) throw new Error((await res.json()).error);
      await fetchBooks(); setEditingBook(null); showToast("Saved ✓");
    } catch (e: unknown) { showToast(e instanceof Error ? e.message : "Save failed", "error"); }
    finally { setSaving(false); }
  };

  const handleAddBook = async () => {
    if (!newBook.title || !newBook.href) { showToast("Title and payment link required", "error"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/books", { method: "POST", headers, body: JSON.stringify(newBook) });
      if (!res.ok) throw new Error((await res.json()).error);
      await fetchBooks(); setNewBook(EMPTY_BOOK); setShowAddBook(false); showToast("Book added ✓");
    } catch (e: unknown) { showToast(e instanceof Error ? e.message : "Add failed", "error"); }
    finally { setSaving(false); }
  };

  const handleToggleHidden = async (book: Book) => {
    try {
      const res = await fetch("/api/admin/books", { method: "PUT", headers, body: JSON.stringify({ ...book, hidden: !book.hidden }) });
      if (!res.ok) throw new Error((await res.json()).error);
      await fetchBooks(); showToast(book.hidden ? "Visible ✓" : "Hidden ✓");
    } catch { showToast("Failed", "error"); }
  };

  const handleDeleteBook = async (id: number) => {
    try {
      const res = await fetch("/api/admin/books", { method: "DELETE", headers, body: JSON.stringify({ id }) });
      if (!res.ok) throw new Error((await res.json()).error);
      await fetchBooks(); setDeleteBookConfirm(null); showToast("Deleted ✓");
    } catch { showToast("Delete failed", "error"); }
  };

  // ── Popups save ────────────────────────────────────────────
  const savePopups = async (updated: PopupItem[]) => {
    setSavingPopup(true);
    try {
      const res = await fetch("/api/admin/popup", { method: "POST", headers, body: JSON.stringify({ popups: updated }) });
      if (!res.ok) throw new Error((await res.json()).error);
      setPopups(updated); showToast("Saved ✓");
    } catch (e: unknown) { showToast(e instanceof Error ? e.message : "Save failed", "error"); }
    finally { setSavingPopup(false); }
  };

  const handleAddPopup = async () => {
    if (!newPopup.title && !newPopup.image) { showToast("Add a title or image", "error"); return; }
    const item: PopupItem = { ...newPopup, id: Date.now() };
    await savePopups([...popups, item]);
    setNewPopup(EMPTY_POPUP); setShowAddPopup(false);
  };

  const handleSavePopup = async (updated: PopupItem) => {
    await savePopups(popups.map(p => p.id === updated.id ? updated : p));
    setEditingPopupId(null);
  };

  const handleDeletePopup = async (id: number) => {
    await savePopups(popups.filter(p => p.id !== id));
    setDeletePopupConfirm(null);
  };

  const handleTogglePopup = async (popup: PopupItem) => {
    await savePopups(popups.map(p => p.id === popup.id ? { ...p, enabled: !p.enabled } : p));
  };

  // ── Hero save ──────────────────────────────────────────────
  const handleSaveHero = async () => {
    setSavingHero(true);
    try {
      const res = await fetch("/api/admin/hero", { method: "POST", headers, body: JSON.stringify(hero) });
      if (!res.ok) throw new Error((await res.json()).error);
      showToast("Hero saved ✓");
    } catch (e: unknown) { showToast(e instanceof Error ? e.message : "Save failed", "error"); }
    finally { setSavingHero(false); }
  };

  // ── Testimonials save ──────────────────────────────────────
  const saveTestimonialsFile = async (updated: TestimonialsFile) => {
    setSavingTestimonials(true);
    try {
      const res = await fetch("/api/admin/testimonials", { method: "POST", headers, body: JSON.stringify(updated) });
      if (!res.ok) throw new Error((await res.json()).error);
      setTestimonialsFile(updated); showToast("Saved ✓");
    } catch (e: unknown) { showToast(e instanceof Error ? e.message : "Save failed", "error"); }
    finally { setSavingTestimonials(false); }
  };

  const handleAddTestimonial = async () => {
    if (!newTestimonial.name || !newTestimonial.text) { showToast("Name and review text required", "error"); return; }
    const item: Testimonial = { ...newTestimonial, id: Date.now() };
    await saveTestimonialsFile({ ...testimonialsFile, testimonials: [...testimonialsFile.testimonials, item] });
    setNewTestimonial(EMPTY_TESTIMONIAL); setShowAddTestimonial(false);
  };

  const handleSaveTestimonial = async (updated: Testimonial) => {
    await saveTestimonialsFile({ ...testimonialsFile, testimonials: testimonialsFile.testimonials.map(t => t.id === updated.id ? updated : t) });
    setEditingTestimonialId(null);
  };

  const handleDeleteTestimonial = async (id: number) => {
    await saveTestimonialsFile({ ...testimonialsFile, testimonials: testimonialsFile.testimonials.filter(t => t.id !== id) });
    setDeleteTestimonialConfirm(null);
  };

  const handleToggleTestimonial = async (t: Testimonial) => {
    await saveTestimonialsFile({ ...testimonialsFile, testimonials: testimonialsFile.testimonials.map(x => x.id === t.id ? { ...x, hidden: !x.hidden } : x) });
  };

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-black text-white">

      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl text-sm font-semibold shadow-2xl border ${
          toast.type === "success" ? "bg-green-950 border-green-800 text-green-300" : "bg-red-950 border-red-800 text-red-300"
        }`}>{toast.msg}</div>
      )}

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && uploadingFor) {
            // Show cropper before uploading
            setCropFile(file);
            setCropTarget(uploadingFor);
          }
          e.target.value = "";
        }}
      />

      {/* Image Cropper Modal */}
      {cropFile && cropTarget && (
        <ImageCropper
          file={cropFile}
          onCropComplete={(croppedFile) => {
            setCropFile(null);
            handleImageUpload(croppedFile, cropTarget);
            setCropTarget(null);
          }}
          onCancel={() => { setCropFile(null); setCropTarget(null); setUploadingFor(null); }}
        />
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#1a1a1a] bg-black/90 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-base font-black tracking-tight">ASHISH CHHIPA</p>
            <p className="text-[9px] font-bold tracking-[3px] text-[#7f0000] uppercase">Admin Panel</p>
          </div>
          <nav className="flex items-center gap-1 bg-[#111] rounded-xl p-1 border border-[#1a1a1a]">
            {(["books", "popup", "hero", "testimonials"] as Tab[]).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${tab === t ? "bg-white text-black" : "text-[#555] hover:text-white"}`}>
                {t === "books" ? "📚 Products" : t === "popup" ? "📣 Popups" : t === "hero" ? "🏠 Hero" : "⭐ Reviews"}
              </button>
            ))}
          </nav>
          <button onClick={onLogout} className="text-[#444] hover:text-white text-xs transition-colors flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">

        {/* ── BOOKS TAB ── */}
        {tab === "books" && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-black">Products</h1>
                <p className="text-[#444] text-sm mt-0.5">{books.filter(b => !b.hidden).length} visible · {books.filter(b => b.hidden).length} hidden</p>
              </div>
              <button onClick={() => { setShowAddBook(true); setEditingBook(null); }}
                className="flex items-center gap-2 bg-white text-black font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-gray-100 transition-all hover:scale-105 active:scale-95">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                Add Book
              </button>
            </div>

            {showAddBook && (
              <BookForm book={newBook} isNew saving={saving} uploadingFor={uploadingFor}
                onUpload={(t) => { setUploadingFor(t); fileInputRef.current?.click(); }}
                onChange={(f, v) => setNewBook(p => ({ ...p, [f]: v }))}
                onSave={handleAddBook} onCancel={() => { setShowAddBook(false); setNewBook(EMPTY_BOOK); }} />
            )}

            {loadingBooks ? (
              <div className="flex justify-center py-24"><span className="w-7 h-7 border-2 border-[#333] border-t-white rounded-full animate-spin" /></div>
            ) : (
              <div className="space-y-3">
                {books.map(book => (
                  <div key={book.id}>
                    {editingBook?.id === book.id ? (
                      <BookForm book={editingBook} saving={saving} uploadingFor={uploadingFor}
                        onUpload={(t) => { setUploadingFor(t); fileInputRef.current?.click(); }}
                        onChange={(f, v) => setEditingBook(p => p ? { ...p, [f]: v } : p)}
                        onSave={handleSaveEditBook} onCancel={() => setEditingBook(null)} />
                    ) : (
                      <BookRow book={book}
                        onEdit={() => { setEditingBook(book); setShowAddBook(false); }}
                        onToggleHidden={() => handleToggleHidden(book)}
                        onDelete={() => setDeleteBookConfirm(book.id)} />
                    )}
                    {deleteBookConfirm === book.id && (
                      <div className="mt-2 bg-red-950/30 border border-red-900/40 rounded-xl px-5 py-4 flex items-center justify-between">
                        <p className="text-red-400 text-sm">Delete &ldquo;{book.title}&rdquo;?</p>
                        <div className="flex gap-2">
                          <button onClick={() => setDeleteBookConfirm(null)} className="px-4 py-2 text-sm text-[#666] hover:text-white border border-[#333] rounded-lg">Cancel</button>
                          <button onClick={() => handleDeleteBook(book.id)} className="px-4 py-2 text-sm bg-red-700 hover:bg-red-600 text-white font-bold rounded-lg">Delete</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── POPUP TAB ── */}
        {tab === "popup" && (
          <div className="max-w-xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-black">Popups</h1>
                <p className="text-[#444] text-sm mt-0.5">
                  {popups.filter(p => p.enabled).length} active · shown one after another on page load
                </p>
              </div>
              <button onClick={() => { setShowAddPopup(true); setEditingPopupId(null); }}
                className="flex items-center gap-2 bg-white text-black font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-gray-100 transition-all hover:scale-105 active:scale-95">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                New Popup
              </button>
            </div>

            {loadingPopup ? (
              <div className="flex justify-center py-20"><span className="w-7 h-7 border-2 border-[#333] border-t-white rounded-full animate-spin" /></div>
            ) : (
              <div className="space-y-3">
                {/* Add form */}
                {showAddPopup && (
                  <PopupForm popup={newPopup} isNew saving={savingPopup} uploadingFor={uploadingFor}
                    onUpload={() => { setUploadingFor("newpopup"); fileInputRef.current?.click(); }}
                    onChange={(f, v) => setNewPopup(p => ({ ...p, [f]: v }))}
                    onSave={handleAddPopup} onCancel={() => { setShowAddPopup(false); setNewPopup(EMPTY_POPUP); }} />
                )}

                {popups.length === 0 && !showAddPopup && (
                  <div className="text-center py-16 text-[#444] text-sm">
                    No popups yet. Click &ldquo;New Popup&rdquo; to create one.
                  </div>
                )}

                {popups.map((popup, i) => (
                  <div key={popup.id}>
                    {editingPopupId === popup.id ? (
                      <PopupForm popup={popup} saving={savingPopup} uploadingFor={uploadingFor}
                        onUpload={() => { setUploadingFor(`popup-${popup.id}`); fileInputRef.current?.click(); }}
                        onChange={(f, v) => setPopups(ps => ps.map(p => p.id === popup.id ? { ...p, [f]: v } : p))}
                        onSave={() => handleSavePopup(popups.find(p => p.id === popup.id)!)}
                        onCancel={() => setEditingPopupId(null)} />
                    ) : (
                      <PopupRow popup={popup} index={i} total={popups.length}
                        onEdit={() => { setEditingPopupId(popup.id); setShowAddPopup(false); }}
                        onToggle={() => handleTogglePopup(popup)}
                        onDelete={() => setDeletePopupConfirm(popup.id)} />
                    )}
                    {deletePopupConfirm === popup.id && (
                      <div className="mt-2 bg-red-950/30 border border-red-900/40 rounded-xl px-5 py-4 flex items-center justify-between">
                        <p className="text-red-400 text-sm">Delete &ldquo;{popup.title || "this popup"}&rdquo;?</p>
                        <div className="flex gap-2">
                          <button onClick={() => setDeletePopupConfirm(null)} className="px-4 py-2 text-sm text-[#666] hover:text-white border border-[#333] rounded-lg">Cancel</button>
                          <button onClick={() => handleDeletePopup(popup.id)} className="px-4 py-2 text-sm bg-red-700 hover:bg-red-600 text-white font-bold rounded-lg">Delete</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── HERO TAB ── */}
        {tab === "hero" && (
          <div className="max-w-xl">
            <div className="mb-8">
              <h1 className="text-2xl font-black">Hero Section</h1>
              <p className="text-[#444] text-sm mt-0.5">Edit the main headline, subtitle and photo on the homepage</p>
            </div>

            {loadingHero ? (
              <div className="flex justify-center py-20"><span className="w-7 h-7 border-2 border-[#333] border-t-white rounded-full animate-spin" /></div>
            ) : (
              <div className="bg-[#0a0a0a] border border-[#222] rounded-2xl p-6 space-y-5">

                <Field label="Headline Line 1">
                  <input value={hero.line1} onChange={e => setHero(p => ({ ...p, line1: e.target.value }))} placeholder="Attract Better." className="input-field text-lg font-bold" />
                </Field>
                <Field label="Headline Line 2">
                  <input value={hero.line2} onChange={e => setHero(p => ({ ...p, line2: e.target.value }))} placeholder="Date Smarter." className="input-field text-lg font-bold" />
                </Field>
                <Field label="Headline Line 3">
                  <input value={hero.line3} onChange={e => setHero(p => ({ ...p, line3: e.target.value }))} placeholder="Build Lasting Love." className="input-field text-lg font-bold" />
                </Field>
                <Field label="Subtitle">
                  <textarea value={hero.subtitle} onChange={e => setHero(p => ({ ...p, subtitle: e.target.value }))} rows={3} placeholder="Join thousands of learners..." className="input-field resize-none" />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="CTA Button Text">
                    <input value={hero.ctaText} onChange={e => setHero(p => ({ ...p, ctaText: e.target.value }))} placeholder="Start Learning Now" className="input-field" />
                  </Field>
                  <Field label="CTA Button Link">
                    <input value={hero.ctaLink} onChange={e => setHero(p => ({ ...p, ctaLink: e.target.value }))} placeholder="#playbooks" className="input-field font-mono text-xs" />
                  </Field>
                </div>

                <Field label="Hero Photo">
                  <div className="flex items-center gap-3">
                    {hero.photo && (
                      <div className="relative w-14 h-20 rounded-xl overflow-hidden border border-[#333] shrink-0">
                        <Image src={hero.photo} alt="hero" fill className="object-cover object-top" />
                      </div>
                    )}
                    <button
                      onClick={() => { setUploadingFor("hero"); fileInputRef.current?.click(); }}
                      disabled={uploadingFor !== null}
                      className="flex-1 flex items-center justify-center gap-2 bg-[#111] border border-[#333] hover:border-[#555] rounded-xl px-4 py-2.5 text-sm text-[#888] hover:text-white transition-all disabled:opacity-50">
                      {uploadingFor === "hero"
                        ? <><span className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />Uploading…</>
                        : <><svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/></svg>{hero.photo ? "Replace Photo" : "Upload Photo"}</>
                      }
                    </button>
                  </div>
                </Field>

                <button onClick={handleSaveHero} disabled={savingHero}
                  className="w-full bg-white text-black font-bold py-3.5 rounded-xl text-sm hover:bg-gray-100 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2">
                  {savingHero ? <><span className="w-3 h-3 border-2 border-black/20 border-t-black rounded-full animate-spin" />Saving…</> : "Save Hero Section"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── TESTIMONIALS TAB ── */}
        {tab === "testimonials" && (
          <div className="max-w-2xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-black">Reviews</h1>
                <p className="text-[#444] text-sm mt-0.5">
                  {testimonialsFile.testimonials.filter(t => !t.hidden).length} visible reviews
                </p>
              </div>
              <div className="flex items-center gap-3">
                {/* Section toggle */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#555]">{testimonialsFile.enabled ? "Section On" : "Section Off"}</span>
                  <div onClick={() => saveTestimonialsFile({ ...testimonialsFile, enabled: !testimonialsFile.enabled })}
                    className={`relative w-9 h-5 rounded-full cursor-pointer transition-colors ${testimonialsFile.enabled ? "bg-[#7f0000]" : "bg-[#333]"}`}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${testimonialsFile.enabled ? "translate-x-4" : "translate-x-0.5"}`} />
                  </div>
                </div>
                <button onClick={() => { setShowAddTestimonial(true); setEditingTestimonialId(null); }}
                  className="flex items-center gap-2 bg-white text-black font-bold px-4 py-2 rounded-xl text-sm hover:bg-gray-100 transition-all hover:scale-105 active:scale-95">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                  Add Review
                </button>
              </div>
            </div>

            {/* Section heading editor */}
            <div className="bg-[#0a0a0a] border border-[#222] rounded-2xl p-5 mb-5 space-y-3">
              <p className="text-[10px] font-bold tracking-widest text-[#444] uppercase mb-3">Section Heading</p>
              <Field label="Main Heading">
                <input value={testimonialsFile.heading} onChange={e => setTestimonialsFile(p => ({ ...p, heading: e.target.value }))} className="input-field" placeholder="Real Results. Real People." />
              </Field>
              <Field label="Subheading">
                <input value={testimonialsFile.subheading} onChange={e => setTestimonialsFile(p => ({ ...p, subheading: e.target.value }))} className="input-field" placeholder="Join thousands..." />
              </Field>
              <button onClick={() => saveTestimonialsFile(testimonialsFile)} disabled={savingTestimonials}
                className="bg-white text-black font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center gap-2">
                {savingTestimonials ? <><span className="w-3 h-3 border-2 border-black/20 border-t-black rounded-full animate-spin" />Saving…</> : "Save Headings"}
              </button>
            </div>

            {loadingTestimonials ? (
              <div className="flex justify-center py-20"><span className="w-7 h-7 border-2 border-[#333] border-t-white rounded-full animate-spin" /></div>
            ) : (
              <div className="space-y-3">
                {showAddTestimonial && (
                  <TestimonialForm t={newTestimonial} isNew saving={savingTestimonials} uploadingFor={uploadingFor}
                    onUpload={() => { setUploadingFor("newtestimonial"); fileInputRef.current?.click(); }}
                    onChange={(f, v) => setNewTestimonial(p => ({ ...p, [f]: v }))}
                    onSave={handleAddTestimonial}
                    onCancel={() => { setShowAddTestimonial(false); setNewTestimonial(EMPTY_TESTIMONIAL); }} />
                )}

                {testimonialsFile.testimonials.length === 0 && !showAddTestimonial && (
                  <div className="text-center py-16 text-[#444] text-sm">No reviews yet. Click &ldquo;Add Review&rdquo; to create one.</div>
                )}

                {testimonialsFile.testimonials.map(t => (
                  <div key={t.id}>
                    {editingTestimonialId === t.id ? (
                      <TestimonialForm t={t} saving={savingTestimonials} uploadingFor={uploadingFor}
                        onUpload={() => { setUploadingFor(`testimonial-${t.id}`); fileInputRef.current?.click(); }}
                        onChange={(f, v) => setTestimonialsFile(prev => ({ ...prev, testimonials: prev.testimonials.map(x => x.id === t.id ? { ...x, [f]: v } : x) }))}
                        onSave={() => handleSaveTestimonial(testimonialsFile.testimonials.find(x => x.id === t.id)!)}
                        onCancel={() => setEditingTestimonialId(null)} />
                    ) : (
                      <TestimonialRow t={t}
                        onEdit={() => { setEditingTestimonialId(t.id); setShowAddTestimonial(false); }}
                        onToggle={() => handleToggleTestimonial(t)}
                        onDelete={() => setDeleteTestimonialConfirm(t.id)} />
                    )}
                    {deleteTestimonialConfirm === t.id && (
                      <div className="mt-2 bg-red-950/30 border border-red-900/40 rounded-xl px-5 py-4 flex items-center justify-between">
                        <p className="text-red-400 text-sm">Delete review by &ldquo;{t.name}&rdquo;?</p>
                        <div className="flex gap-2">
                          <button onClick={() => setDeleteTestimonialConfirm(null)} className="px-4 py-2 text-sm text-[#666] hover:text-white border border-[#333] rounded-lg">Cancel</button>
                          <button onClick={() => handleDeleteTestimonial(t.id)} className="px-4 py-2 text-sm bg-red-700 hover:bg-red-600 text-white font-bold rounded-lg">Delete</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}

// ── Popup Row ─────────────────────────────────────────────────
function PopupRow({ popup, index, total, onEdit, onToggle, onDelete }: {
  popup: PopupItem; index: number; total: number;
  onEdit: () => void; onToggle: () => void; onDelete: () => void;
}) {
  return (
    <div className={`flex items-center gap-4 bg-[#0a0a0a] border rounded-2xl px-5 py-4 transition-all ${
      popup.enabled ? "border-[#222]" : "border-[#1a1a1a] opacity-50"
    }`}>
      {/* Order badge */}
      <div className="w-7 h-7 rounded-full bg-[#111] border border-[#333] flex items-center justify-center text-[#555] text-xs font-bold shrink-0">
        {index + 1}
      </div>

      {/* Thumb */}
      <div className="relative w-14 h-9 rounded-lg overflow-hidden bg-[#111] border border-[#222] shrink-0">
        {popup.image
          ? <Image src={popup.image} alt="" fill className="object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-[#333]">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
            </div>
        }
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-white text-sm truncate">{popup.title || <span className="text-[#444] italic">Untitled</span>}</p>
        <p className="text-[#555] text-xs truncate">{popup.description || (popup.buttonText ? `Button: ${popup.buttonText}` : "No content")}</p>
      </div>

      {/* Status */}
      <span className={`text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full shrink-0 ${
        popup.enabled ? "bg-green-950 text-green-500 border border-green-900" : "bg-[#111] text-[#444] border border-[#222]"
      }`}>
        {popup.enabled ? `${index + 1} of ${total}` : "Off"}
      </span>

      {/* Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        <ActionBtn onClick={onToggle} title={popup.enabled ? "Disable" : "Enable"}>
          {popup.enabled
            ? <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
            : <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27z"/></svg>
          }
        </ActionBtn>
        <ActionBtn onClick={onEdit} title="Edit">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
        </ActionBtn>
        <ActionBtn onClick={onDelete} title="Delete" danger>
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
        </ActionBtn>
      </div>
    </div>
  );
}

// ── Popup Form ────────────────────────────────────────────────
function PopupForm({ popup, isNew = false, saving, uploadingFor, onUpload, onChange, onSave, onCancel }: {
  popup: Omit<PopupItem, "id"> & { id?: number };
  isNew?: boolean; saving: boolean; uploadingFor: UploadTarget | null;
  onUpload: () => void;
  onChange: (field: string, value: string | boolean) => void;
  onSave: () => void; onCancel: () => void;
}) {
  const isUploading = uploadingFor === "newpopup" || (popup.id && uploadingFor === `popup-${popup.id}`);

  return (
    <div className="bg-[#0d0d0d] border-2 border-[#7f0000]/30 rounded-2xl p-6 mb-3">
      <p className="text-xs font-bold tracking-widest text-[#7f0000] uppercase mb-5">
        {isNew ? "New Popup" : "Edit Popup"}
      </p>

      <div className="space-y-4">
        {/* Image */}
        <Field label="Image">
          <div className="flex items-center gap-3">
            {popup.image && (
              <div className="relative w-20 h-12 rounded-lg overflow-hidden border border-[#333] shrink-0">
                <Image src={popup.image} alt="" fill className="object-cover" />
              </div>
            )}
            <button onClick={onUpload} disabled={uploadingFor !== null}
              className="flex-1 flex items-center justify-center gap-2 bg-[#111] border border-[#333] hover:border-[#555] rounded-xl px-4 py-2.5 text-sm text-[#888] hover:text-white transition-all disabled:opacity-50">
              {isUploading
                ? <><span className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />Uploading…</>
                : <><svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/></svg>{popup.image ? "Replace Image" : "Upload Image"}</>
              }
            </button>
            {popup.image && (
              <button onClick={() => onChange("image", "")} className="text-[#555] hover:text-red-500 text-xs transition-colors">Remove</button>
            )}
          </div>
        </Field>

        {/* Title */}
        <Field label="Title">
          <input value={popup.title} onChange={e => onChange("title", e.target.value)}
            placeholder="e.g. New Playbook Just Dropped 🔥" className="input-field" />
        </Field>

        {/* Description */}
        <Field label="Description">
          <textarea value={popup.description} onChange={e => onChange("description", e.target.value)}
            placeholder="Short announcement..." rows={3} className="input-field resize-none" />
        </Field>

        {/* Button Text */}
        <Field label="Button Text">
          <input value={popup.buttonText} onChange={e => onChange("buttonText", e.target.value)}
            placeholder="e.g. Buy Now" className="input-field" />
        </Field>

        {/* Button Link */}
        <Field label="Button Link">
          <input value={popup.buttonLink} onChange={e => onChange("buttonLink", e.target.value)}
            placeholder="https://rzp.io/rzp/..." className="input-field font-mono text-xs" />
        </Field>

        {/* Button Style */}
        <Field label="Button Style">
          <div className="flex gap-2">
            {(["red", "white", "black"] as const).map(s => (
              <button key={s} onClick={() => onChange("buttonStyle", s)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold capitalize border transition-all ${
                  popup.buttonStyle === s
                    ? s === "red" ? "bg-[#7f0000] border-[#7f0000] text-white"
                      : s === "white" ? "bg-white border-white text-black"
                      : "bg-[#111] border-white text-white"
                    : "border-[#333] text-[#555] hover:border-[#555] hover:text-white bg-transparent"
                }`}>
                {s}
              </button>
            ))}
          </div>
        </Field>

        {/* Enabled toggle */}
        <Field label="Status">
          <label className="flex items-center gap-3 cursor-pointer h-[42px]">
            <div onClick={() => onChange("enabled", !popup.enabled)}
              className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${popup.enabled ? "bg-[#7f0000]" : "bg-[#333]"}`}>
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${popup.enabled ? "translate-x-5" : "translate-x-0.5"}`} />
            </div>
            <span className="text-sm text-[#888]">{popup.enabled ? "Active (shown on site)" : "Inactive (hidden)"}</span>
          </label>
        </Field>
      </div>

      <div className="flex gap-3 mt-6">
        <button onClick={onSave} disabled={saving}
          className="bg-white text-black font-bold px-7 py-3 rounded-xl text-sm hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center gap-2">
          {saving ? <><span className="w-3 h-3 border-2 border-black/20 border-t-black rounded-full animate-spin" />Saving…</> : "Save Popup"}
        </button>
        <button onClick={onCancel} className="px-5 py-3 text-sm text-[#555] hover:text-white border border-[#222] hover:border-[#444] rounded-xl transition-all">Cancel</button>
      </div>
    </div>
  );
}

// ── Book Row ──────────────────────────────────────────────────
function BookRow({ book, onEdit, onToggleHidden, onDelete }: {
  book: Book; onEdit: () => void; onToggleHidden: () => void; onDelete: () => void;
}) {
  return (
    <div className={`flex items-center gap-4 bg-[#0a0a0a] border rounded-2xl px-5 py-4 transition-all ${
      book.hidden ? "border-[#1a1a1a] opacity-50" : "border-[#222] hover:border-[#2a2a2a]"
    }`}>
      <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-[#111] border border-[#222] shrink-0">
        {book.image
          ? <Image src={book.image} alt={book.title} fill className="object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-[#333]"><svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg></div>
        }
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[9px] font-bold tracking-widest text-[#7f0000] uppercase">{book.tag}</span>
          {book.hidden && <span className="text-[9px] font-bold tracking-widest text-[#444] uppercase">· Hidden</span>}
        </div>
        <p className="font-bold text-white text-sm truncate">{book.title}</p>
        <p className="text-[#555] text-xs truncate">{book.subtitle}</p>
      </div>
      <p className="text-white font-bold text-sm shrink-0 hidden sm:block">{book.price}</p>
      <div className="flex items-center gap-1.5 shrink-0">
        <ActionBtn onClick={onToggleHidden} title={book.hidden ? "Show" : "Hide"}>
          {book.hidden
            ? <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
            : <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27z"/></svg>
          }
        </ActionBtn>
        <ActionBtn onClick={onEdit} title="Edit">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
        </ActionBtn>
        <ActionBtn onClick={onDelete} title="Delete" danger>
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
        </ActionBtn>
      </div>
    </div>
  );
}

// ── Book Form ─────────────────────────────────────────────────
function BookForm({ book, isNew = false, saving, uploadingFor, onUpload, onChange, onSave, onCancel }: {
  book: Omit<Book, "id"> & { id?: number }; isNew?: boolean; saving: boolean;
  uploadingFor: UploadTarget | null;
  onUpload: (target: "edit" | "new") => void;
  onChange: (field: string, value: string | boolean) => void;
  onSave: () => void; onCancel: () => void;
}) {
  const target = isNew ? "new" : "edit";
  return (
    <div className="bg-[#0d0d0d] border-2 border-[#7f0000]/30 rounded-2xl p-6 mb-3">
      <p className="text-xs font-bold tracking-widest text-[#7f0000] uppercase mb-5">{isNew ? "New Book" : "Edit Book"}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Title *"><input value={book.title} onChange={e => onChange("title", e.target.value)} placeholder="e.g. Opener Vault" className="input-field" /></Field>
        <Field label="Subtitle"><input value={book.subtitle} onChange={e => onChange("subtitle", e.target.value)} placeholder="e.g. 50 Proven Openers" className="input-field" /></Field>
        <Field label="Payment Link *"><input value={book.href} onChange={e => onChange("href", e.target.value)} placeholder="https://rzp.io/rzp/..." className="input-field font-mono text-xs" /></Field>
        <Field label="Price"><input value={book.price} onChange={e => onChange("price", e.target.value)} placeholder="₹299" className="input-field" /></Field>
        <Field label="Tag">
          <select value={book.tag} onChange={e => onChange("tag", e.target.value)} className="input-field">
            {TAG_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Tag Color">
          <select value={book.tagColor} onChange={e => onChange("tagColor", e.target.value)} className="input-field">
            {TAG_COLOR_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </Field>
        <Field label="Book Cover">
          <div className="flex items-center gap-3">
            {book.image && <div className="relative w-9 h-12 rounded-lg overflow-hidden border border-[#333] shrink-0"><Image src={book.image} alt="cover" fill className="object-cover" /></div>}
            <button onClick={() => onUpload(target)} disabled={uploadingFor !== null}
              className="flex-1 flex items-center justify-center gap-2 bg-[#111] border border-[#333] hover:border-[#555] rounded-xl px-4 py-2.5 text-sm text-[#888] hover:text-white transition-all disabled:opacity-50">
              {uploadingFor === target
                ? <><span className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />Uploading…</>
                : <><svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/></svg>{book.image ? "Replace" : "Upload Image"}</>
              }
            </button>
          </div>
        </Field>
        <Field label="Visibility">
          <label className="flex items-center gap-3 cursor-pointer h-[42px]">
            <div onClick={() => onChange("hidden", !book.hidden)} className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${book.hidden ? "bg-[#333]" : "bg-[#7f0000]"}`}>
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${book.hidden ? "translate-x-0.5" : "translate-x-5"}`} />
            </div>
            <span className="text-sm text-[#888]">{book.hidden ? "Hidden" : "Visible"}</span>
          </label>
        </Field>
      </div>
      <div className="flex gap-3 mt-6">
        <button onClick={onSave} disabled={saving} className="bg-white text-black font-bold px-7 py-3 rounded-xl text-sm hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center gap-2">
          {saving ? <><span className="w-3 h-3 border-2 border-black/20 border-t-black rounded-full animate-spin" />Saving…</> : "Save Changes"}
        </button>
        <button onClick={onCancel} className="px-5 py-3 text-sm text-[#555] hover:text-white border border-[#222] hover:border-[#444] rounded-xl transition-all">Cancel</button>
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-bold tracking-widest text-[#444] uppercase mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function ActionBtn({ onClick, title, danger, children }: {
  onClick: () => void; title: string; danger?: boolean; children: React.ReactNode;
}) {
  return (
    <button onClick={onClick} title={title}
      className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${
        danger ? "border-[#222] text-[#555] hover:border-red-800 hover:text-red-500"
               : "border-[#222] text-[#555] hover:border-[#444] hover:text-white"
      }`}>
      {children}
    </button>
  );
}

// ── Testimonial Row ───────────────────────────────────────────
function TestimonialRow({ t, onEdit, onToggle, onDelete }: {
  t: Testimonial; onEdit: () => void; onToggle: () => void; onDelete: () => void;
}) {
  return (
    <div className={`flex items-center gap-4 bg-[#0a0a0a] border rounded-2xl px-5 py-4 transition-all ${t.hidden ? "border-[#1a1a1a] opacity-50" : "border-[#222] hover:border-[#2a2a2a]"}`}>
      {/* Avatar */}
      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#111] border border-[#333] shrink-0">
        {t.photo
          ? <Image src={t.photo} alt={t.name} fill className="object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm bg-[#7f0000]">{t.name.charAt(0).toUpperCase()}</div>
        }
      </div>
      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="font-bold text-white text-sm">{t.name}</p>
          {t.handle && <p className="text-[#555] text-xs">{t.handle}</p>}
          <div className="flex gap-0.5 ml-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} viewBox="0 0 24 24" className={`w-3 h-3 ${i < t.rating ? "fill-[#ff1a1a]" : "fill-[#333]"}`}>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            ))}
          </div>
        </div>
        <p className="text-[#555] text-xs truncate">{t.text}</p>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <ActionBtn onClick={onToggle} title={t.hidden ? "Show" : "Hide"}>
          {t.hidden
            ? <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
            : <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27z"/></svg>
          }
        </ActionBtn>
        <ActionBtn onClick={onEdit} title="Edit">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
        </ActionBtn>
        <ActionBtn onClick={onDelete} title="Delete" danger>
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
        </ActionBtn>
      </div>
    </div>
  );
}

// ── Testimonial Form ──────────────────────────────────────────
function TestimonialForm({ t, isNew = false, saving, uploadingFor, onUpload, onChange, onSave, onCancel }: {
  t: Omit<Testimonial, "id"> & { id?: number }; isNew?: boolean; saving: boolean;
  uploadingFor: UploadTarget | null;
  onUpload: () => void;
  onChange: (field: string, value: string | boolean | number) => void;
  onSave: () => void; onCancel: () => void;
}) {
  const isUploading = uploadingFor === "newtestimonial" || (t.id && uploadingFor === `testimonial-${t.id}`);
  return (
    <div className="bg-[#0d0d0d] border-2 border-[#7f0000]/30 rounded-2xl p-6 mb-3">
      <p className="text-xs font-bold tracking-widest text-[#7f0000] uppercase mb-5">{isNew ? "New Review" : "Edit Review"}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Name *">
          <input value={t.name} onChange={e => onChange("name", e.target.value)} placeholder="e.g. Rahul S." className="input-field" />
        </Field>
        <Field label="Handle / Location">
          <input value={t.handle} onChange={e => onChange("handle", e.target.value)} placeholder="e.g. @rahuls · Mumbai" className="input-field" />
        </Field>
        <Field label="Review Text *">
          <textarea value={t.text} onChange={e => onChange("text", e.target.value)} rows={3} placeholder="What did they say?" className="input-field resize-none col-span-2" />
        </Field>
        <Field label="Star Rating">
          <div className="flex gap-2 h-[42px] items-center">
            {[1,2,3,4,5].map(n => (
              <button key={n} onClick={() => onChange("rating", n)}
                className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${t.rating >= n ? "border-[#7f0000] bg-[#7f0000]/20" : "border-[#333] bg-[#111]"}`}>
                <svg viewBox="0 0 24 24" className={`w-4 h-4 ${t.rating >= n ? "fill-[#ff1a1a]" : "fill-[#333]"}`}>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </button>
            ))}
          </div>
        </Field>
        <Field label="Photo (optional)">
          <div className="flex items-center gap-3">
            {t.photo && <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#333] shrink-0"><Image src={t.photo} alt="" fill className="object-cover" /></div>}
            <button onClick={onUpload} disabled={uploadingFor !== null}
              className="flex-1 flex items-center justify-center gap-2 bg-[#111] border border-[#333] hover:border-[#555] rounded-xl px-4 py-2.5 text-sm text-[#888] hover:text-white transition-all disabled:opacity-50">
              {isUploading
                ? <><span className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />Uploading…</>
                : <><svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/></svg>{t.photo ? "Replace" : "Upload"}</>
              }
            </button>
          </div>
        </Field>
      </div>
      <div className="flex gap-3 mt-6">
        <button onClick={onSave} disabled={saving}
          className="bg-white text-black font-bold px-7 py-3 rounded-xl text-sm hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center gap-2">
          {saving ? <><span className="w-3 h-3 border-2 border-black/20 border-t-black rounded-full animate-spin" />Saving…</> : "Save Review"}
        </button>
        <button onClick={onCancel} className="px-5 py-3 text-sm text-[#555] hover:text-white border border-[#222] hover:border-[#444] rounded-xl transition-all">Cancel</button>
      </div>
    </div>
  );
}
