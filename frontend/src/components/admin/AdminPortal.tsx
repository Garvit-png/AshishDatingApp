"use client";

import { useState, useEffect } from "react";
import AdminDashboard from "./AdminDashboard";

type AuthState = "idle" | "sending" | "sent" | "verifying" | "error";

export default function AdminPortal() {
  const [authState, setAuthState] = useState<AuthState>("idle");
  const [otp, setOtp] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  // Restore session from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("admin_session");
    if (stored) {
      try {
        const { token, iat } = JSON.parse(stored);
        const age = Date.now() - iat;
        if (age < 24 * 60 * 60 * 1000) {
          setSessionToken(token);
        } else {
          localStorage.removeItem("admin_session");
        }
      } catch {
        localStorage.removeItem("admin_session");
      }
    }
  }, []);

  const handleSendOTP = async () => {
    setAuthState("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/send-otp", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to send OTP");
      setAuthState("sent");
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : "Something went wrong");
      setAuthState("error");
    }
  };

  const handleVerifyOTP = async () => {
    setAuthState("verifying");
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Invalid OTP");
      localStorage.setItem(
        "admin_session",
        JSON.stringify({ token: data.sessionToken, iat: Date.now() })
      );
      setSessionToken(data.sessionToken);
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : "Something went wrong");
      setAuthState("sent");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    setSessionToken(null);
    setAuthState("idle");
    setOtp("");
  };

  if (sessionToken) {
    return <AdminDashboard sessionToken={sessionToken} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-black text-white tracking-tight">ASHISH CHHIPA</h1>
          <p className="text-[#7f0000] text-[10px] font-bold tracking-[4px] uppercase mt-2">
            Admin Portal
          </p>
        </div>

        <div className="bg-[#0a0a0a] border border-[#222] rounded-2xl p-8">
          {authState === "idle" || authState === "sending" || authState === "error" ? (
            <>
              <h2 className="text-xl font-bold text-white mb-2">Access Admin Panel</h2>
              <p className="text-[#666] text-sm mb-8 leading-relaxed">
                Click below to receive a one-time access code on{" "}
                <span className="text-[#a3a3a3]">garvitgandhi0313@gmail.com</span>
              </p>

              {errorMsg && (
                <div className="bg-red-950/40 border border-red-800/50 rounded-xl px-4 py-3 mb-6 text-red-400 text-sm">
                  {errorMsg}
                </div>
              )}

              <button
                onClick={handleSendOTP}
                disabled={authState === "sending"}
                className="w-full bg-white text-black font-bold py-4 rounded-xl text-sm hover:bg-gray-100 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-3"
              >
                {authState === "sending" ? (
                  <>
                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Sending Code…
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                    Generate & Send Access Code
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-green-500">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Code Sent!</h2>
                  <p className="text-[#666] text-xs">Check garvitgandhi0313@gmail.com</p>
                </div>
              </div>

              {errorMsg && (
                <div className="bg-red-950/40 border border-red-800/50 rounded-xl px-4 py-3 mb-6 text-red-400 text-sm">
                  {errorMsg}
                </div>
              )}

              <label className="block text-xs font-bold text-[#a3a3a3] tracking-widest uppercase mb-3">
                Enter 6-Digit Code
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="w-full bg-[#111] border border-[#333] rounded-xl px-5 py-4 text-white text-2xl font-black tracking-[12px] text-center placeholder:text-[#333] placeholder:tracking-[12px] focus:outline-none focus:border-[#555] mb-6"
              />

              <button
                onClick={handleVerifyOTP}
                disabled={otp.length !== 6 || authState === "verifying"}
                className="w-full bg-[#7f0000] hover:bg-[#990000] text-white font-bold py-4 rounded-xl text-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-3 mb-4"
              >
                {authState === "verifying" ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verifying…
                  </>
                ) : (
                  "Enter Admin Panel →"
                )}
              </button>

              <button
                onClick={() => { setAuthState("idle"); setOtp(""); setErrorMsg(""); }}
                className="w-full text-[#555] hover:text-[#a3a3a3] text-sm py-2 transition-colors"
              >
                ← Resend Code
              </button>
            </>
          )}
        </div>

        <p className="text-center text-[#333] text-xs mt-8">
          This portal is private. Do not share access.
        </p>
      </div>
    </div>
  );
}
