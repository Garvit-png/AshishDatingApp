"use client";

import { useEffect, useState } from "react";

interface CoursesLoaderProps {
  onComplete: () => void;
}

export default function CoursesLoader({ onComplete }: CoursesLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "done">("loading");

  useEffect(() => {
    // Simulate asset loading with smooth progress increments
    const steps = [
      { target: 18, delay: 80 },
      { target: 35, delay: 120 },
      { target: 52, delay: 90 },
      { target: 68, delay: 150 },
      { target: 80, delay: 100 },
      { target: 91, delay: 130 },
      { target: 97, delay: 90 },
      { target: 100, delay: 200 },
    ];

    let timeout: ReturnType<typeof setTimeout>;
    let stepIndex = 0;

    const runStep = () => {
      if (stepIndex >= steps.length) {
        // Small pause at 100% then fade out
        timeout = setTimeout(() => {
          setPhase("done");
          setTimeout(onComplete, 600);
        }, 300);
        return;
      }
      const { target, delay } = steps[stepIndex];
      const current = stepIndex === 0 ? 0 : steps[stepIndex - 1].target;
      const diff = target - current;
      let tick = current;

      const increment = () => {
        tick += 1;
        setProgress(tick);
        if (tick < target) {
          timeout = setTimeout(increment, delay / diff);
        } else {
          stepIndex++;
          timeout = setTimeout(runStep, delay);
        }
      };
      increment();
    };

    timeout = setTimeout(runStep, 200);
    return () => clearTimeout(timeout);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black transition-opacity duration-500 ${
        phase === "done" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Ambient glow blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #7f0000 0%, transparent 70%)",
            top: "20%",
            left: "30%",
            transform: "translate(-50%, -50%)",
            animation: "pulse-glow 3s ease-in-out infinite",
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-8"
          style={{
            background: "radial-gradient(circle, #1a0000 0%, transparent 70%)",
            bottom: "20%",
            right: "30%",
            animation: "pulse-glow 3.5s ease-in-out infinite reverse",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-10 w-full max-w-xs px-8">
        {/* Logo / Brand */}
        <div className="flex flex-col items-center gap-2" style={{ animation: "fade-slide-up 0.6s ease forwards" }}>
          <span
            className="text-[10px] font-bold tracking-[0.3em] text-[#7f0000] uppercase"
          >
            Ashish Chhipa
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Courses & Playbooks
          </h2>
        </div>

        {/* Animated book icon */}
        <div
          className="relative flex items-center justify-center w-20 h-20"
          style={{ animation: "fade-slide-up 0.6s ease 0.1s both" }}
        >
          {/* Spinning ring */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 80 80"
            style={{ animation: "spin-slow 2s linear infinite" }}
          >
            <circle
              cx="40" cy="40" r="36"
              fill="none"
              stroke="#1a1a1a"
              strokeWidth="2"
            />
            <circle
              cx="40" cy="40" r="36"
              fill="none"
              stroke="#7f0000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="50 176"
              style={{ filter: "drop-shadow(0 0 4px #7f0000)" }}
            />
          </svg>
          {/* Book icon */}
          <svg viewBox="0 0 24 24" className="w-9 h-9 fill-white">
            <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z" />
          </svg>
        </div>

        {/* Progress bar */}
        <div
          className="w-full flex flex-col gap-3"
          style={{ animation: "fade-slide-up 0.6s ease 0.2s both" }}
        >
          <div className="h-[2px] w-full bg-[#111] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-100 ease-linear"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #7f0000, #cc0000)",
                boxShadow: "0 0 8px rgba(127,0,0,0.8), 0 0 16px rgba(127,0,0,0.4)",
              }}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[11px] text-[#555] font-medium tracking-widest uppercase">
              {progress < 30
                ? "Loading content..."
                : progress < 60
                ? "Preparing courses..."
                : progress < 85
                ? "Almost ready..."
                : progress < 100
                ? "Finalising..."
                : "Ready"}
            </span>
            <span className="text-[11px] font-bold text-[#7f0000] tabular-nums">
              {progress}%
            </span>
          </div>
        </div>

        {/* Bottom tagline */}
        <p
          className="text-[11px] text-[#333] font-medium tracking-widest uppercase text-center"
          style={{ animation: "fade-slide-up 0.6s ease 0.35s both" }}
        >
          Real strategy. Real results.
        </p>
      </div>

      <style>{`
        @keyframes pulse-glow {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.1; }
          50% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.18; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fade-slide-up {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
