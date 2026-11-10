import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/adminAuth";
import { CONTENT_PATH, GitHubError, readFile, writeFile } from "@/lib/github";
import { normalizeContent } from "@/content/normalize";
import { siteContent } from "@/content/server";

const unauthorized = () => NextResponse.json({ error: "Session expired. Please log in again." }, { status: 401 });

function fail(e: unknown) {
  const status = e instanceof GitHubError ? e.status : 500;
  return NextResponse.json({ error: e instanceof Error ? e.message : "Something went wrong" }, { status });
}

/** GET — latest published content (from GitHub, falling back to this deployment's copy). */
export async function GET(req: NextRequest) {
  if (!verifyAdminSession(req)) return unauthorized();
  try {
    const file = await readFile(CONTENT_PATH);
    if (!file) return NextResponse.json({ content: siteContent, sha: null });
    return NextResponse.json({ content: normalizeContent(JSON.parse(file.text)), sha: file.sha });
  } catch (e) {
    return fail(e);
  }
}

/** PUT — publish the whole content file in one commit. */
export async function PUT(req: NextRequest) {
  if (!verifyAdminSession(req)) return unauthorized();
  try {
    const { content, sha, message } = await req.json();
    const clean = normalizeContent(content);
    await writeFile(CONTENT_PATH, JSON.stringify(clean, null, 2) + "\n", message || "Admin: update website content", sha ?? undefined);
    const after = await readFile(CONTENT_PATH);
    return NextResponse.json({ success: true, sha: after?.sha ?? null });
  } catch (e) {
    return fail(e);
  }
}
