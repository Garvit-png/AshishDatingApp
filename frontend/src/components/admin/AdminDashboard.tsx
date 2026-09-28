"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

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

const EMPTY_BOOK: Omit<Book, "id"> = {
  title: "",
  subtitle: "",
  image: "",
  tag: "NEW",
  tagColor: "bg-[#7f0000]",
  price: "₹299",
  href: "",
  hidden: false,
  featured: false,
};

const TAG_OPTIONS = ["BESTSELLER", "POPULAR", "NEW", "HOT", "LIMITED"];
const TAG_COLOR_OPTIONS = [
  { label: "Red", value: "bg-[#7f0000]" },
  { label: "White", value: "bg-white" },
  { label: "Black", value: "bg-black" },
];

type Tab = "books" | "push";

export default function AdminDashboard({
  sessionToken,
  onLogout,
}: {
  sessionToken: string;
  onLogout: () => void;
}) {
  const [tab, setTab] = useState<Tab>("books");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pushing, setPushing] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBook, setNewBook] = useState<Omit<Book, "id">>(EMPTY_BOOK);
  const [uploadingFor, setUploadingFor] = useState<"edit" | "new" | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const headers = {
    "Content-Type": "application/json",
    "x-admin-token": sessionToken,
  };

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Load books
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/books", { headers });
      const data = await res.json();
      setBooks(data);
    } catch {
      showToast("Failed to load books", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBooks(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Upload image to GitHub
  const handleImageUpload = async (file: File, target: "edit" | "new") => {
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
      } else {
        setNewBook((prev) => ({ ...prev, image: data.path }));
      }
      showToast("Image uploaded ✓");
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Upload failed", "error");
    } finally {
      setUploadingFor(null);
    }
  };

  // Save edited book
  const handleSaveEdit = async () => {
    if (!editingBook) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/books", {
        method: "PUT",
        headers,
        body: JSON.stringify(editingBook),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      await fetchBooks();
      setEditingBook(null);
      showToast("Book updated ✓");
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Save failed", "error");
    } finally {
      setSaving(false);
    }
  };

  // Add new book
  const handleAddBook = async () => {
    if (!newBook.title || !newBook.href) {
      showToast("Title and payment link are required", "error");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/books", {
        method: "POST",
        headers,
        body: JSON.stringify(newBook),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      await fetchBooks();
      setNewBook(EMPTY_BOOK);
      setShowAddForm(false);
      showToast("Book added ✓");
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Add failed", "error");
    } finally {
      setSaving(false);
    }
  };

  // Toggle hidden
  const handleToggleHidden = async (book: Book) => {
    try {
      const res = await fetch("/api/admin/books", {
        method: "PUT",
        headers,
        body: JSON.stringify({ ...book, hidden: !book.hidden }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      await fetchBooks();
      showToast(book.hidden ? "Book visible ✓" : "Book hidden ✓");
    } catch {
      showToast("Failed to update", "error");
    }
  };

  // Delete book
  const handleDelete = async (id: number) => {
    try {
      const res = await fetch("/api/admin/books", {
        method: "DELETE",
        headers,
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      await fetchBooks();
      setDeleteConfirm(null);
      showToast("Book deleted ✓");
    } catch {
      showToast("Delete failed", "error");
    }
  };

  // Push to GitHub
  const handleGitHubPush = async () => {
    setPushing(true);
    try {
      const res = await fetch("/api/admin/github-push", {
        method: "POST",
        headers,
      });
      if (!res.ok) throw new Error((await res.json()).error);
      showToast("Changes pushed to GitHub ✓ Vercel will redeploy automatically.");
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Push failed", "error");
    } finally {
      setPushing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3.5 rounded-xl text-sm font-semibold shadow-2xl transition-all ${
            toast.type === "success"
              ? "bg-green-900/80 border border-green-700/50 text-green-300"
              : "bg-red-950/80 border border-red-700/50 text-red-300"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && uploadingFor) handleImageUpload(file, uploadingFor);
          e.target.value = "";
        }}
      />

      {/* Header */}
      <header className="border-b border-[#222] bg-[#050505] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-black tracking-tight">ASHISH CHHIPA</h1>
            <p className="text-[#7f0000] text-[9px] font-bold tracking-[3px] uppercase">
              Admin Panel
            </p>
          </div>

          <nav className="flex items-center gap-1 bg-[#111] rounded-xl p-1 border border-[#222]">
            {(["books", "push"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
                  tab === t
                    ? "bg-white text-black"
                    : "text-[#666] hover:text-white"
                }`}
              >
                {t === "books" ? "📚 Products" : "🚀 Publish"}
              </button>
            ))}
          </nav>

          <button
            onClick={onLogout}
            className="text-[#555] hover:text-white text-sm transition-colors flex items-center gap-2"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
            </svg>
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* ── BOOKS TAB ── */}
        {tab === "books" && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black">Products / Playbooks</h2>
                <p className="text-[#555] text-sm mt-1">
                  {books.filter((b) => !b.hidden).length} visible · {books.filter((b) => b.hidden).length} hidden
                </p>
              </div>
              <button
                onClick={() => { setShowAddForm(true); setEditingBook(null); }}
                className="bg-white text-black font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>
                Add New Book
              </button>
            </div>

            {/* Add Form */}
            {showAddForm && (
              <BookForm
                book={newBook}
                isNew
                saving={saving}
                uploadingFor={uploadingFor}
                onUpload={(target) => {
                  setUploadingFor(target);
                  fileInputRef.current?.click();
                }}
                onChange={(field, value) => setNewBook((prev) => ({ ...prev, [field]: value }))}
                onSave={handleAddBook}
                onCancel={() => { setShowAddForm(false); setNewBook(EMPTY_BOOK); }}
              />
            )}

            {loading ? (
              <div className="flex items-center justify-center py-24">
                <span className="w-8 h-8 border-2 border-[#333] border-t-white rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {books.map((book) => (
                  <div key={book.id}>
                    {editingBook?.id === book.id ? (
                      <BookForm
                        book={editingBook}
                        saving={saving}
                        uploadingFor={uploadingFor}
                        onUpload={(target) => {
                          setUploadingFor(target);
                          fileInputRef.current?.click();
                        }}
                        onChange={(field, value) =>
                          setEditingBook((prev) => prev ? { ...prev, [field]: value } : prev)
                        }
                        onSave={handleSaveEdit}
                        onCancel={() => setEditingBook(null)}
                      />
                    ) : (
                      <BookRow
                        book={book}
                        onEdit={() => setEditingBook(book)}
                        onToggleHidden={() => handleToggleHidden(book)}
                        onDelete={() => setDeleteConfirm(book.id)}
                      />
                    )}

                    {/* Delete confirm */}
                    {deleteConfirm === book.id && (
                      <div className="bg-red-950/30 border border-red-800/40 rounded-xl p-4 mt-2 flex items-center justify-between">
                        <p className="text-red-400 text-sm font-semibold">
                          Delete &ldquo;{book.title}&rdquo;? This cannot be undone.
                        </p>
                        <div className="flex gap-3">
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="text-[#666] hover:text-white text-sm px-4 py-2 rounded-lg border border-[#333] transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleDelete(book.id)}
                            className="bg-red-700 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg font-bold transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── PUBLISH TAB ── */}
        {tab === "push" && (
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-black mb-3">Publish Changes</h2>
              <p className="text-[#666] text-sm leading-relaxed">
                After editing products, click below to push changes to GitHub.
                Vercel will automatically redeploy your website.
              </p>
            </div>

            <div className="bg-[#0a0a0a] border border-[#222] rounded-2xl p-8">
              <div className="space-y-4 mb-8">
                <InfoRow icon="📦" label="Repository" value="Garvit-png/AshishDatingApp" />
                <InfoRow icon="🌿" label="Branch" value="main" />
                <InfoRow icon="📄" label="File" value="frontend/src/data/books.json" />
                <InfoRow icon="⚡" label="Deploy" value="Auto (Vercel)" />
              </div>

              <button
                onClick={handleGitHubPush}
                disabled={pushing}
                className="w-full bg-[#7f0000] hover:bg-[#990000] text-white font-bold py-4 rounded-xl text-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3"
              >
                {pushing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Pushing to GitHub…
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                    </svg>
                    Push & Publish to Live Website
                  </>
                )}
              </button>

              <p className="text-[#444] text-xs text-center mt-4">
                Changes go live in ~30–60 seconds after pushing.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// ── Book Row (read mode) ──────────────────────────────────────
function BookRow({
  book,
  onEdit,
  onToggleHidden,
  onDelete,
}: {
  book: Book;
  onEdit: () => void;
  onToggleHidden: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className={`bg-[#0a0a0a] border rounded-2xl p-5 flex items-center gap-5 transition-all ${
        book.hidden ? "border-[#1a1a1a] opacity-50" : "border-[#222] hover:border-[#333]"
      }`}
    >
      {/* Cover thumb */}
      <div className="relative w-14 h-20 rounded-lg overflow-hidden bg-[#111] shrink-0 border border-[#333]">
        {book.image ? (
          <Image src={book.image} alt={book.title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#444]">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
            </svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-[#7f0000]/20 text-[#ff6666] text-[9px] font-bold tracking-widest px-2 py-0.5 rounded-full uppercase">
            {book.tag}
          </span>
          {book.hidden && (
            <span className="bg-[#222] text-[#555] text-[9px] font-bold tracking-widest px-2 py-0.5 rounded-full uppercase">
              Hidden
            </span>
          )}
        </div>
        <h3 className="font-bold text-white truncate">{book.title}</h3>
        <p className="text-[#555] text-xs truncate mt-0.5">{book.subtitle}</p>
        <p className="text-[#a3a3a3] text-xs mt-1 font-semibold">{book.price}</p>
      </div>

      {/* Link preview */}
      <div className="hidden md:block text-[#444] text-xs font-mono truncate max-w-[200px]">
        {book.href}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onToggleHidden}
          title={book.hidden ? "Show book" : "Hide book"}
          className="w-9 h-9 rounded-lg bg-[#111] border border-[#222] hover:border-[#444] text-[#666] hover:text-white transition-all flex items-center justify-center"
        >
          {book.hidden ? (
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
            </svg>
          )}
        </button>

        <button
          onClick={onEdit}
          title="Edit"
          className="w-9 h-9 rounded-lg bg-[#111] border border-[#222] hover:border-[#444] text-[#666] hover:text-white transition-all flex items-center justify-center"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
          </svg>
        </button>

        <button
          onClick={onDelete}
          title="Delete"
          className="w-9 h-9 rounded-lg bg-[#111] border border-[#222] hover:border-red-800 text-[#666] hover:text-red-500 transition-all flex items-center justify-center"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ── Book Form (edit/add mode) ─────────────────────────────────
function BookForm({
  book,
  isNew = false,
  saving,
  uploadingFor,
  onUpload,
  onChange,
  onSave,
  onCancel,
}: {
  book: Omit<Book, "id"> & { id?: number };
  isNew?: boolean;
  saving: boolean;
  uploadingFor: "edit" | "new" | null;
  onUpload: (target: "edit" | "new") => void;
  onChange: (field: string, value: string | boolean) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const target = isNew ? "new" : "edit";

  return (
    <div className="bg-[#0d0d0d] border-2 border-[#7f0000]/40 rounded-2xl p-6 mb-2">
      <h3 className="text-base font-bold mb-6 text-[#ff6666]">
        {isNew ? "✦ Add New Book" : "✦ Editing: " + (book.title || "Book")}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Title */}
        <Field label="Title *">
          <input
            value={book.title}
            onChange={(e) => onChange("title", e.target.value)}
            placeholder="e.g. Opener Vault"
            className="w-full bg-[#111] border border-[#333] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#555] placeholder:text-[#444]"
          />
        </Field>

        {/* Subtitle */}
        <Field label="Subtitle">
          <input
            value={book.subtitle}
            onChange={(e) => onChange("subtitle", e.target.value)}
            placeholder="e.g. 50 Proven Openers"
            className="w-full bg-[#111] border border-[#333] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#555] placeholder:text-[#444]"
          />
        </Field>

        {/* Payment Link */}
        <Field label="Payment Link (Razorpay) *">
          <input
            value={book.href}
            onChange={(e) => onChange("href", e.target.value)}
            placeholder="https://rzp.io/rzp/..."
            className="w-full bg-[#111] border border-[#333] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#555] placeholder:text-[#444] font-mono"
          />
        </Field>

        {/* Price */}
        <Field label="Price">
          <input
            value={book.price}
            onChange={(e) => onChange("price", e.target.value)}
            placeholder="₹299"
            className="w-full bg-[#111] border border-[#333] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#555] placeholder:text-[#444]"
          />
        </Field>

        {/* Tag */}
        <Field label="Tag Badge">
          <select
            value={book.tag}
            onChange={(e) => onChange("tag", e.target.value)}
            className="w-full bg-[#111] border border-[#333] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#555]"
          >
            {TAG_OPTIONS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </Field>

        {/* Tag Color */}
        <Field label="Tag Color">
          <select
            value={book.tagColor}
            onChange={(e) => onChange("tagColor", e.target.value)}
            className="w-full bg-[#111] border border-[#333] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#555]"
          >
            {TAG_COLOR_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </Field>

        {/* Book Cover Upload */}
        <Field label="Book Cover Image">
          <div className="flex items-center gap-3">
            {book.image && (
              <div className="relative w-10 h-14 rounded-lg overflow-hidden bg-[#111] border border-[#333] shrink-0">
                <Image src={book.image} alt="cover" fill className="object-cover" />
              </div>
            )}
            <button
              onClick={() => onUpload(target)}
              disabled={uploadingFor !== null}
              className="flex-1 bg-[#111] border border-[#333] hover:border-[#555] rounded-xl px-4 py-3 text-sm text-[#a3a3a3] hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {uploadingFor === target ? (
                <>
                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Uploading…
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                    <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z" />
                  </svg>
                  {book.image ? "Replace Image" : "Upload Image"}
                </>
              )}
            </button>
          </div>
          {book.image && (
            <p className="text-[#444] text-xs mt-1.5 font-mono truncate">{book.image}</p>
          )}
        </Field>

        {/* Hidden toggle */}
        <Field label="Visibility">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div
              onClick={() => onChange("hidden", !book.hidden)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                book.hidden ? "bg-[#333]" : "bg-[#7f0000]"
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  book.hidden ? "translate-x-0.5" : "translate-x-5"
                }`}
              />
            </div>
            <span className="text-sm text-[#a3a3a3]">
              {book.hidden ? "Hidden (not shown on site)" : "Visible on website"}
            </span>
          </label>
        </Field>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={onSave}
          disabled={saving}
          className="bg-white text-black font-bold px-6 py-3 rounded-xl text-sm hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
        >
          {saving ? (
            <>
              <span className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              Saving…
            </>
          ) : (
            isNew ? "Add Book" : "Save Changes"
          )}
        </button>
        <button
          onClick={onCancel}
          className="border border-[#333] text-[#666] hover:text-white hover:border-[#555] font-semibold px-6 py-3 rounded-xl text-sm transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ── Small helper components ───────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-[#555] tracking-widest uppercase mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#1a1a1a] last:border-0">
      <span className="text-[#555] text-sm flex items-center gap-2">
        {icon} {label}
      </span>
      <span className="text-[#a3a3a3] text-sm font-mono">{value}</span>
    </div>
  );
}
