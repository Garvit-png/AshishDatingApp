import { NextRequest } from "next/server";

/**
 * Verify that the request carries a valid admin session token.
 * Token is passed as Bearer in Authorization header OR as
 * x-admin-token header from the dashboard.
 */
export function verifyAdminSession(req: NextRequest): boolean {
  const secret = process.env.OTP_SECRET;
  if (!secret) return false;

  const authHeader = req.headers.get("authorization") ?? "";
  const tokenHeader = req.headers.get("x-admin-token") ?? "";
  const raw = authHeader.replace("Bearer ", "").trim() || tokenHeader.trim();

  if (!raw) return false;

  try {
    const decoded = JSON.parse(Buffer.from(raw, "base64").toString("utf-8"));
    // Must have admin flag, correct secret, and be issued within last 24 hours
    const age = Date.now() - (decoded.iat ?? 0);
    return (
      decoded.admin === true &&
      decoded.secret === secret &&
      age < 24 * 60 * 60 * 1000
    );
  } catch {
    return false;
  }
}
