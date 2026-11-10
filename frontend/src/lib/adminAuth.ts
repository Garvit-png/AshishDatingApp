import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest } from "next/server";

const SESSION_MS = 24 * 60 * 60 * 1000;

function secret() {
  // OTP_SECRET signs sessions; it never leaves the server.
  return process.env.OTP_SECRET || process.env.ADMIN_PASSCODE || "";
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function checkPasscode(input: string): boolean {
  const correct = process.env.ADMIN_PASSCODE;
  return !!correct && safeEqual(input.trim(), correct);
}

/** Signed token: base64url(payload).signature — the secret itself is never included. */
export function createSessionToken(): string {
  const payload = Buffer.from(JSON.stringify({ admin: true, iat: Date.now() })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminSession(req: NextRequest): boolean {
  if (!secret()) return false;
  const raw =
    (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "").trim() ||
    (req.headers.get("x-admin-token") ?? "").trim();
  const [payload, sig] = raw.split(".");
  if (!payload || !sig || !safeEqual(sig, sign(payload))) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"));
    return data.admin === true && Date.now() - (data.iat ?? 0) < SESSION_MS;
  } catch {
    return false;
  }
}
