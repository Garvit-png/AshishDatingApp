import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/adminAuth";
import { readBooksFromGitHub, writeBooksToGitHub } from "@/lib/githubBooks";

/**
 * POST — Re-push the current books.json to GitHub to trigger a Vercel redeploy.
 * Since all edits already write to GitHub via the books API,
 * this just does a no-op write with a deploy trigger commit message.
 */
export async function POST(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const books = await readBooksFromGitHub();
    await writeBooksToGitHub(books);
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Push failed" }, { status: 500 });
  }
}
