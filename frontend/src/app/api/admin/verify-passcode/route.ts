import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { passcode } = await req.json();

  if (!passcode) {
    return NextResponse.json({ error: "Passcode required" }, { status: 400 });
  }

  const correctPasscode = process.env.ADMIN_PASSCODE;

  if (!correctPasscode) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  if (passcode.trim() !== correctPasscode) {
    return NextResponse.json({ error: "Incorrect passcode" }, { status: 401 });
  }

  // Issue session token — server-side only, never exposes passcode
  const sessionToken = Buffer.from(
    JSON.stringify({ admin: true, iat: Date.now(), secret: process.env.OTP_SECRET })
  ).toString("base64");

  return NextResponse.json({ success: true, sessionToken });
}
