import { NextResponse } from "next/server";
import { Resend } from "resend";
import crypto from "crypto";
import otpStore from "@/lib/otpStore";

export async function POST() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminEmail2 = process.env.ADMIN_EMAIL_2;
  const resendKey = process.env.RESEND_API_KEY;

  if (!adminEmail || !resendKey) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  // Generate 6-digit OTP
  const otp = crypto.randomInt(100000, 999999).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  otpStore.set("admin_otp", { otp, expiresAt });

  const resend = new Resend(resendKey);

  const emailHtml = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; background: #000; color: #fff; padding: 40px; border-radius: 12px;">
      <h1 style="font-size: 24px; font-weight: 900; letter-spacing: -0.5px; margin-bottom: 8px;">Ashish Chhipa</h1>
      <p style="color: #7f0000; font-size: 11px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 32px;">Admin Portal</p>
      <p style="color: #a3a3a3; margin-bottom: 24px;">Your one-time access code (valid for 10 minutes):</p>
      <div style="background: #111; border: 1px solid #333; border-radius: 12px; padding: 32px; text-align: center; margin-bottom: 24px;">
        <span style="font-size: 48px; font-weight: 900; letter-spacing: 8px; color: #fff;">${otp}</span>
      </div>
      <p style="color: #555; font-size: 12px;">If you didn't request this, ignore this email. Do not share this code with anyone.</p>
    </div>
  `;

  // Build recipients list — always includes primary, add secondary if set
  const recipients = [adminEmail];
  if (adminEmail2) recipients.push(adminEmail2);

  try {
    // Send to all recipients (Resend supports array of `to` addresses)
    await resend.emails.send({
      from: "Ashish Admin <onboarding@resend.dev>",
      to: recipients,
      subject: "Your Admin Portal Access Code",
      html: emailHtml,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
