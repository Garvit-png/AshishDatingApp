import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/adminAuth";
import { GitHubError, writeFile } from "@/lib/github";

const MAX_BYTES = 4 * 1024 * 1024; // Vercel request body limit is ~4.5MB
const ALLOWED = /^(image\/(jpeg|png|webp|gif|avif)|video\/(mp4|webm))$/;

export async function POST(req: NextRequest) {
  if (!verifyAdminSession(req)) {
    return NextResponse.json({ error: "Session expired. Please log in again." }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file provided" }, { status: 400 });
  if (!ALLOWED.test(file.type)) return NextResponse.json({ error: "Only JPG, PNG, WEBP, GIF, AVIF images or MP4/WEBM videos" }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "File is too big (max 4MB). Try a smaller image." }, { status: 400 });

  // Unique, URL-safe name so uploads never overwrite each other
  const dot = file.name.lastIndexOf(".");
  const base = (dot > 0 ? file.name.slice(0, dot) : file.name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "upload";
  const ext = (dot > 0 ? file.name.slice(dot + 1) : file.type.split("/")[1]).toLowerCase().replace(/[^a-z0-9]/g, "");
  const filename = `${base}-${Date.now().toString(36)}.${ext}`;

  try {
    await writeFile(`frontend/public/uploads/${filename}`, Buffer.from(await file.arrayBuffer()), `Admin: upload ${filename}`);
    return NextResponse.json({ success: true, path: `/uploads/${filename}` });
  } catch (e) {
    const status = e instanceof GitHubError ? e.status : 500;
    return NextResponse.json({ error: e instanceof Error ? e.message : "Upload failed" }, { status });
  }
}
