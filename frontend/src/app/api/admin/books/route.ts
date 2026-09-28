import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { verifyAdminSession } from "@/lib/adminAuth";

const BOOKS_PATH = path.join(process.cwd(), "src/data/books.json");

function readBooks() {
  return JSON.parse(readFileSync(BOOKS_PATH, "utf-8"));
}

function writeBooks(books: unknown[]) {
  writeFileSync(BOOKS_PATH, JSON.stringify(books, null, 2));
}

// GET — fetch all books
export async function GET(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(readBooks());
}

// POST — add new book
export async function POST(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const book = await req.json();
  const books = readBooks();
  const newBook = {
    ...book,
    id: Date.now(),
    hidden: book.hidden ?? false,
  };
  books.push(newBook);
  writeBooks(books);
  return NextResponse.json({ success: true, book: newBook });
}

// PUT — update existing book
export async function PUT(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const updated = await req.json();
  const books = readBooks();
  const idx = books.findIndex((b: { id: number }) => b.id === updated.id);
  if (idx === -1) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }
  books[idx] = { ...books[idx], ...updated };
  writeBooks(books);
  return NextResponse.json({ success: true, book: books[idx] });
}

// DELETE — remove book by id
export async function DELETE(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await req.json();
  const books = readBooks();
  const filtered = books.filter((b: { id: number }) => b.id !== id);
  writeBooks(filtered);
  return NextResponse.json({ success: true });
}
