"use client";

import { useState, useEffect } from "react";
import AdminDashboard from "./AdminDashboard";

type AuthState = "idle" | "verifying" | "error";

export default function AdminPortal() {
  const [authState, setAuthState] = useState<AuthState>("idle");
  const [passcode, setPasscode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [showPasscode, setShowPasscode] = useState(false);

  // Restore session from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("admin_session");
    if (stored) {
      try {
        const { token, iat } = JSON.parse(stored);
        if (Date.now() - iat < 24 * 60 * 60 * 1000) {
          setSessionToken(token);
        } else {
          localStorage.removeItem("admin_session");
        }
      } catch {
        localStorage.removeItem("admin_session");
      }
    }
  }, []);

  const handleVerify = async () => {
    if (!passcode.trim()) return;
    setAuthState("verifying");
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/verify-passcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: passcode.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Incorrect passcode");
      localStorage.setItem(
        "admin_session",
        JSON.stringify({ token: data.sessionToken, iat: Date.now() })
      );
      setSessionToken(data.sessionToken);
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : "Something went wrong");
      setAuthState("error");
      setPasscode("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    setSessionToken(null);
    setAuthState("idle");
    setPasscode("");
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
          <h2 className="text-xl font-bold text-white mb-2">Enter Passcode</h2>
          <p className="text-[#555] text-sm mb-8">Enter your admin passcode to access the dashboard.</p>

          {errorMsg && (
            <div className="bg-red-950/40 border border-red-800/50 rounded-xl px-4 py-3 mb-6 text-red-400 text-sm">
              {errorMsg}
            </div>
          )}

          <label className="block text-[10px] font-bold text-[#555] tracking-widest uppercase mb-3">
            Passcode
          </label>

          <div className="relative mb-6">
            <input
              type={showPasscode ? "text" : "password"}
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleVerify()}
              placeholder="Enter passcode"
              autoComplete="off"
              className="w-full bg-[#111] border border-[#333] rounded-xl px-5 py-4 text-white text-base font-bold tracking-widest focus:outline-none focus:border-[#555] placeholder:text-[#333] placeholder:tracking-normal placeholder:font-normal pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPasscode(p => !p)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#444] hover:text-[#888] transition-colors"
            >
              {showPasscode ? (
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27z"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
              )}
            </button>
          </div>

          <button
            onClick={handleVerify}
            disabled={!passcode.trim() || authState === "verifying"}
            className="w-full bg-white text-black font-bold py-4 rounded-xl text-sm hover:bg-gray-100 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-3"
          >
            {authState === "verifying" ? (
              <>
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Verifying…
              </>
            ) : (
              "Enter Admin Panel →"
            )}
          </button>
        </div>

        <p className="text-center text-[#2a2a2a] text-xs mt-8">
          This portal is private. Do not share access.
        </p>
      </div>
    </div>
  );
}
