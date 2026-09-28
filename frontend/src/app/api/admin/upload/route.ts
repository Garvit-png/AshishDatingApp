import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/adminAuth";

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

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Sanitize filename
  const filename = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  const githubPath = `frontend/public/${filename}`;
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${githubPath}`;

  // Check if file already exists (to get SHA for update)
  let sha: string | undefined;
  try {
    const checkRes = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
    });
    if (checkRes.ok) {
      const existing = await checkRes.json();
      sha = existing.sha;
    }
  } catch {
    // File doesn't exist yet, that's fine
  }

  const body: Record<string, string> = {
    message: `Admin: upload image ${filename}`,
    content: base64,
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
    return NextResponse.json({ error: err.message ?? "GitHub upload failed" }, { status: 500 });
  }

  return NextResponse.json({ success: true, path: `/${filename}` });
}
