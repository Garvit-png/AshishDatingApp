import { NextRequest, NextResponse } from "next/server";
import otpStore from "@/lib/otpStore";

export async function POST(req: NextRequest) {
  const { otp } = await req.json();

  if (!otp) {
    return NextResponse.json({ error: "OTP required" }, { status: 400 });
  }

  const stored = otpStore.get("admin_otp");

  if (!stored) {
    return NextResponse.json({ error: "No OTP generated. Request a new one." }, { status: 401 });
  }

  if (Date.now() > stored.expiresAt) {
    otpStore.delete("admin_otp");
    return NextResponse.json({ error: "OTP expired. Request a new one." }, { status: 401 });
  }

  if (stored.otp !== otp.trim()) {
    return NextResponse.json({ error: "Invalid OTP." }, { status: 401 });
  }

  // Valid — clear OTP so it can't be reused
  otpStore.delete("admin_otp");

  // Return a session token (simple signed timestamp — stateless)
  const sessionToken = Buffer.from(
    JSON.stringify({ admin: true, iat: Date.now(), secret: process.env.OTP_SECRET })
  ).toString("base64");

  return NextResponse.json({ success: true, sessionToken });
}
