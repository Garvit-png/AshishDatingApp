import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/adminAuth";
import { readBooksFromGitHub, writeBooksToGitHub } from "@/lib/githubBooks";

// GET — fetch all books
export async function GET(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const books = await readBooksFromGitHub();
    return NextResponse.json(books);
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed to read books" }, { status: 500 });
  }
}

// POST — add new book
export async function POST(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const book = await req.json();
    const books = await readBooksFromGitHub() as Record<string, unknown>[];
    const newBook = { ...book, id: Date.now(), hidden: book.hidden ?? false };
    books.push(newBook);
    await writeBooksToGitHub(books);
    return NextResponse.json({ success: true, book: newBook });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed to add book" }, { status: 500 });
  }
}

// PUT — update existing book
export async function PUT(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const updated = await req.json();
    const books = await readBooksFromGitHub() as Record<string, unknown>[];
    const idx = books.findIndex((b) => b.id === updated.id);
    if (idx === -1) return NextResponse.json({ error: "Book not found" }, { status: 404 });
    books[idx] = { ...books[idx], ...updated };
    await writeBooksToGitHub(books);
    return NextResponse.json({ success: true, book: books[idx] });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed to update book" }, { status: 500 });
  }
}

// DELETE — remove book by id
export async function DELETE(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await req.json();
    const books = await readBooksFromGitHub() as Record<string, unknown>[];
    const filtered = books.filter((b) => b.id !== id);
    await writeBooksToGitHub(filtered);
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed to delete book" }, { status: 500 });
  }
}
