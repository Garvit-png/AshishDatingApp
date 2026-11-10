"use client";

import { useCallback, useEffect, useState } from "react";
import AdminDashboard from "./AdminDashboard";
import { Icon } from "./icons";

const SESSION_KEY = "admin_session";

export default function AdminPortal() {
  const [ready, setReady] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [passcode, setPasscode] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(0);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- restoring the session from localStorage (browser only) */
    try {
      const stored = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
      // New-style tokens contain a "." (signed); old ones are discarded
      if (stored?.token?.includes(".") && Date.now() - stored.iat < 24 * 60 * 60 * 1000) setToken(stored.token);
      else localStorage.removeItem(SESSION_KEY);
    } catch {}
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim() || busy) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/verify-passcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: passcode.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Incorrect passcode");
      localStorage.setItem(SESSION_KEY, JSON.stringify({ token: data.sessionToken, iat: Date.now() }));
      setToken(data.sessionToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setShake((s) => s + 1);
      setPasscode("");
    } finally {
      setBusy(false);
    }
  };

  const logout = useCallback((reason?: string) => {
    localStorage.removeItem(SESSION_KEY);
    setToken(null);
    setPasscode("");
    setError(reason ?? "");
  }, []);

  if (!ready) return <div className="min-h-dvh bg-[#060606]" />;
  if (token) return <AdminDashboard sessionToken={token} onLogout={logout} />;

  return (
    <div className="relative min-h-dvh bg-[#060606] text-white flex items-center justify-center px-5 overflow-hidden">
      <style>{`@keyframes shake{10%,90%{transform:translateX(-2px)}20%,80%{transform:translateX(4px)}30%,50%,70%{transform:translateX(-8px)}40%,60%{transform:translateX(8px)}}`}</style>
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-[#7f0000]/30 blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)] pointer-events-none" />

      <div className="relative w-full max-w-sm animate-slide-up">
        <div className="text-center mb-10">
          <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-[#ff1a1a] to-[#5a0000] grid place-items-center text-lg font-black shadow-[0_0_40px_rgba(255,26,26,0.45)] animate-float">AC</div>
          <h1 className="text-2xl font-black tracking-tight">Website Studio</h1>
          <p className="text-white/40 text-sm mt-1">Edit your website — no coding needed.</p>
        </div>

        <form
          key={shake}
          onSubmit={login}
          className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 sm:p-7 shadow-2xl"
          style={shake ? { animation: "shake .5s both" } : undefined}
        >
          {error && (
            <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-3.5 py-3 mb-5 text-red-300 text-sm">
              <Icon name="alert" className="w-4 h-4 mt-0.5 shrink-0" />
              {error}
            </div>
          )}
          <label htmlFor="passcode" className="block text-sm font-semibold text-white/80 mb-2">
            Passcode
          </label>
          <div className="relative mb-5">
            <input
              id="passcode"
              type={show ? "text" : "password"}
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter your passcode"
              autoComplete="current-password"
              autoFocus
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3.5 pr-12 text-base tracking-wider focus:outline-none focus:border-[#ff3b3b]/60 focus:ring-4 focus:ring-[#ff3b3b]/10 transition placeholder:tracking-normal placeholder:text-white/20"
            />
            <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 grid place-items-center text-white/40 hover:text-white" aria-label={show ? "Hide passcode" : "Show passcode"}>
              <Icon name={show ? "eyeOff" : "eye"} />
            </button>
          </div>
          <button
            type="submit"
            disabled={!passcode.trim() || busy}
            className="btn-shine w-full flex items-center justify-center gap-2 bg-[#d40000] hover:bg-[#ff1a1a] text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] disabled:opacity-40 shadow-[0_10px_30px_-10px_rgba(255,26,26,0.8)]"
          >
            {busy ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
            {busy ? "Checking…" : "Open dashboard →"}
          </button>
        </form>
        <p className="text-center text-white/25 text-xs mt-6">Private area. Don&apos;t share your passcode.</p>
      </div>
    </div>
  );
}
