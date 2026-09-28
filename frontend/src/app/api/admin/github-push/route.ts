import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import path from "path";
import { verifyAdminSession } from "@/lib/adminAuth";

const BOOKS_PATH = path.join(process.cwd(), "src/data/books.json");

export async function POST(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH ?? "main";

  if (!token || !owner || !repo) {
    return NextResponse.json({ error: "GitHub not configured" }, { status: 500 });
  }

  const content = readFileSync(BOOKS_PATH, "utf-8");
  const base64Content = Buffer.from(content).toString("base64");

  const githubPath = "frontend/src/data/books.json";
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${githubPath}`;

  // Get current file SHA
  const shaRes = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
  });

  let sha: string | undefined;
  if (shaRes.ok) {
    const existing = await shaRes.json();
    sha = existing.sha;
  }

  const body: Record<string, string> = {
    message: "Admin: update books data",
    content: base64Content,
    branch,
  };
  if (sha) body.sha = sha;

  const res = await fetch(apiUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json();
    return NextResponse.json({ error: err.message ?? "GitHub push failed" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
