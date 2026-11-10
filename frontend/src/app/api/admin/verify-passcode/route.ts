import { NextRequest, NextResponse } from "next/server";
import { checkPasscode, createSessionToken } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  const { passcode } = await req.json().catch(() => ({ passcode: "" }));
  if (!passcode || typeof passcode !== "string") {
    return NextResponse.json({ error: "Passcode required" }, { status: 400 });
  }
  if (!process.env.ADMIN_PASSCODE) {
    return NextResponse.json({ error: "Server misconfigured: ADMIN_PASSCODE is not set" }, { status: 500 });
  }
  if (!checkPasscode(passcode)) {
    // Small delay slows down guessing
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ error: "Incorrect passcode" }, { status: 401 });
  }
  return NextResponse.json({ success: true, sessionToken: createSessionToken() });
}
