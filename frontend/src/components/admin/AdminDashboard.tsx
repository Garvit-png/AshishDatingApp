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

export default function AdminDashboard({
  sessionToken,
  onLogout,
}: {
  sessionToken: string;
  onLogout: () => void;
}) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/books", { headers });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBooks(data);
    } catch {
      showToast("Failed to load books", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBooks(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
      showToast("Saved ✓");
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Save failed", "error");
    } finally {
      setSaving(false);
    }
  };

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

  const handleToggleHidden = async (book: Book) => {
    try {
      const res = await fetch("/api/admin/books", {
        method: "PUT",
        headers,
        body: JSON.stringify({ ...book, hidden: !book.hidden }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      await fetchBooks();
      showToast(book.hidden ? "Book is now visible ✓" : "Book hidden ✓");
    } catch {
      showToast("Failed to update", "error");
    }
  };

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
      showToast("Deleted ✓");
    } catch {
      showToast("Delete failed", "error");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl text-sm font-semibold shadow-2xl border transition-all ${
          toast.type === "success"
            ? "bg-green-950 border-green-800 text-green-300"
            : "bg-red-950 border-red-800 text-red-300"
        }`}>
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
      <header className="sticky top-0 z-40 border-b border-[#1a1a1a] bg-black/90 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-base font-black tracking-tight">ASHISH CHHIPA</p>
            <p className="text-[9px] font-bold tracking-[3px] text-[#7f0000] uppercase">Admin Panel</p>
          </div>
          <button
            onClick={onLogout}
            className="text-[#444] hover:text-white text-xs transition-colors flex items-center gap-1.5"
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
            </svg>
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">

        {/* Title + Add button */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black">Products</h1>
            <p className="text-[#444] text-sm mt-0.5">
              {books.filter(b => !b.hidden).length} visible · {books.filter(b => b.hidden).length} hidden
            </p>
          </div>
          <button
            onClick={() => { setShowAddForm(true); setEditingBook(null); }}
            className="flex items-center gap-2 bg-white text-black font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-gray-100 transition-all hover:scale-105 active:scale-95"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            Add Book
          </button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <BookForm
            book={newBook}
            isNew
            saving={saving}
            uploadingFor={uploadingFor}
            onUpload={(target) => { setUploadingFor(target); fileInputRef.current?.click(); }}
            onChange={(field, value) => setNewBook(prev => ({ ...prev, [field]: value }))}
            onSave={handleAddBook}
            onCancel={() => { setShowAddForm(false); setNewBook(EMPTY_BOOK); }}
          />
        )}

        {/* Books list */}
        {loading ? (
          <div className="flex justify-center py-24">
            <span className="w-7 h-7 border-2 border-[#333] border-t-white rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-3">
            {books.map((book) => (
              <div key={book.id}>
                {editingBook?.id === book.id ? (
                  <BookForm
                    book={editingBook}
                    saving={saving}
                    uploadingFor={uploadingFor}
                    onUpload={(target) => { setUploadingFor(target); fileInputRef.current?.click(); }}
                    onChange={(field, value) =>
                      setEditingBook(prev => prev ? { ...prev, [field]: value } : prev)
                    }
                    onSave={handleSaveEdit}
                    onCancel={() => setEditingBook(null)}
                  />
                ) : (
                  <BookRow
                    book={book}
                    onEdit={() => { setEditingBook(book); setShowAddForm(false); }}
                    onToggleHidden={() => handleToggleHidden(book)}
                    onDelete={() => setDeleteConfirm(book.id)}
                  />
                )}

                {deleteConfirm === book.id && (
                  <div className="mt-2 bg-red-950/30 border border-red-900/40 rounded-xl px-5 py-4 flex items-center justify-between">
                    <p className="text-red-400 text-sm">Delete &ldquo;{book.title}&rdquo;? Cannot be undone.</p>
                    <div className="flex gap-2">
                      <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-sm text-[#666] hover:text-white border border-[#333] rounded-lg transition-colors">Cancel</button>
                      <button onClick={() => handleDelete(book.id)} className="px-4 py-2 text-sm bg-red-700 hover:bg-red-600 text-white font-bold rounded-lg transition-colors">Delete</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// ── Book Row ──────────────────────────────────────────────────
function BookRow({ book, onEdit, onToggleHidden, onDelete }: {
  book: Book;
  onEdit: () => void;
  onToggleHidden: () => void;
  onDelete: () => void;
}) {
  return (
    <div className={`flex items-center gap-4 bg-[#0a0a0a] border rounded-2xl px-5 py-4 transition-all ${
      book.hidden ? "border-[#1a1a1a] opacity-50" : "border-[#222] hover:border-[#2a2a2a]"
    }`}>
      {/* Cover */}
      <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-[#111] border border-[#222] shrink-0">
        {book.image ? (
          <Image src={book.image} alt={book.title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#333]">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[9px] font-bold tracking-widest text-[#7f0000] uppercase">{book.tag}</span>
          {book.hidden && <span className="text-[9px] font-bold tracking-widest text-[#444] uppercase">· Hidden</span>}
        </div>
        <p className="font-bold text-white text-sm truncate">{book.title}</p>
        <p className="text-[#555] text-xs truncate">{book.subtitle}</p>
      </div>

      {/* Price */}
      <p className="text-white font-bold text-sm shrink-0 hidden sm:block">{book.price}</p>

      {/* Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        <ActionBtn onClick={onToggleHidden} title={book.hidden ? "Show" : "Hide"}>
          {book.hidden ? (
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
          ) : (
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/></svg>
          )}
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
    <div className="bg-[#0d0d0d] border-2 border-[#7f0000]/30 rounded-2xl p-6 mb-3">
      <p className="text-xs font-bold tracking-widest text-[#7f0000] uppercase mb-5">
        {isNew ? "New Book" : "Edit Book"}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Title *">
          <input value={book.title} onChange={e => onChange("title", e.target.value)}
            placeholder="e.g. Opener Vault"
            className="input-field" />
        </Field>

        <Field label="Subtitle">
          <input value={book.subtitle} onChange={e => onChange("subtitle", e.target.value)}
            placeholder="e.g. 50 Proven Openers"
            className="input-field" />
        </Field>

        <Field label="Payment Link *">
          <input value={book.href} onChange={e => onChange("href", e.target.value)}
            placeholder="https://rzp.io/rzp/..."
            className="input-field font-mono text-xs" />
        </Field>

        <Field label="Price">
          <input value={book.price} onChange={e => onChange("price", e.target.value)}
            placeholder="₹299"
            className="input-field" />
        </Field>

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
            {book.image && (
              <div className="relative w-9 h-12 rounded-lg overflow-hidden border border-[#333] shrink-0">
                <Image src={book.image} alt="cover" fill className="object-cover" />
              </div>
            )}
            <button onClick={() => onUpload(target)} disabled={uploadingFor !== null}
              className="flex-1 flex items-center justify-center gap-2 bg-[#111] border border-[#333] hover:border-[#555] rounded-xl px-4 py-2.5 text-sm text-[#888] hover:text-white transition-all disabled:opacity-50">
              {uploadingFor === target ? (
                <><span className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Uploading…</>
              ) : (
                <><svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/></svg>
                {book.image ? "Replace" : "Upload Image"}</>
              )}
            </button>
          </div>
        </Field>

        <Field label="Visibility">
          <label className="flex items-center gap-3 cursor-pointer h-[42px]">
            <div onClick={() => onChange("hidden", !book.hidden)}
              className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${book.hidden ? "bg-[#333]" : "bg-[#7f0000]"}`}>
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${book.hidden ? "translate-x-0.5" : "translate-x-5"}`} />
            </div>
            <span className="text-sm text-[#888]">{book.hidden ? "Hidden" : "Visible"}</span>
          </label>
        </Field>
      </div>

      {/* Save button */}
      <div className="flex gap-3 mt-6">
        <button onClick={onSave} disabled={saving}
          className="bg-white text-black font-bold px-7 py-3 rounded-xl text-sm hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 flex items-center gap-2">
          {saving ? <><span className="w-3 h-3 border-2 border-black/20 border-t-black rounded-full animate-spin" />Saving…</> : "Save Changes"}
        </button>
        <button onClick={onCancel}
          className="px-5 py-3 text-sm text-[#555] hover:text-white border border-[#222] hover:border-[#444] rounded-xl transition-all">
          Cancel
        </button>
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
  onClick: () => void;
  title: string;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button onClick={onClick} title={title}
      className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${
        danger
          ? "border-[#222] text-[#555] hover:border-red-800 hover:text-red-500"
          : "border-[#222] text-[#555] hover:border-[#444] hover:text-white"
      }`}>
      {children}
    </button>
  );
}
