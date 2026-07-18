export default function StatsSection() {
  return (
    <section
      className="relative w-full bg-[#cc0000] flex flex-col items-center justify-center gap-6 py-24 px-6 overflow-hidden"
      style={{ minHeight: "100vh" }}
    >
      {/* Lightweight animated background instead of WebGL SoftAurora */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
        <div
          className="absolute inset-0"
          style={{
            background: "repeating-linear-gradient(135deg, transparent, transparent 40px, rgba(0,0,0,0.15) 40px, rgba(0,0,0,0.15) 80px)",
            animation: "drift 8s linear infinite",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 30% 50%, rgba(0,0,0,0.3) 0%, transparent 70%), radial-gradient(ellipse at 70% 50%, rgba(0,0,0,0.2) 0%, transparent 60%)",
          }}
        />
      </div>

      {/* Title - Fixed at the top */}
      <div className="absolute top-16 md:top-24 left-0 w-full z-20 flex justify-center px-6">
        <h2 className="text-6xl sm:text-7xl lg:text-8xl font-black text-black tracking-tight text-center leading-none">
          DATE SMARTER
        </h2>
      </div>

      {/* Content wrapper with z-index to appear over background */}
      <div className="relative z-10 flex flex-col items-center gap-8 w-full mt-24">
        {/* Subheading */}
        <p className="text-black/70 text-lg sm:text-xl font-medium text-center max-w-lg">
          Don&apos;t chase people. Become someone worth chasing.
        </p>

        {/* Video */}
        <div
          className="relative w-full rounded-2xl overflow-hidden shadow-2xl shadow-black/40"
          style={{ maxWidth: 760, aspectRatio: "16/9" }}
        >
          <video
            src="/stats.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 rounded-2xl ring-1 ring-black/20 pointer-events-none" />
        </div>

        {/* Post-Video Content */}
        <div className="flex flex-col items-center gap-8 mt-6">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black text-center max-w-3xl leading-tight">
            Only Pickup Lines aren&apos;t gonna work. You deserve something better.
          </h3>
          <button className="bg-black text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-900 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-black/20">
            Shop Now
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes drift {
          0% { transform: translate(0, 0); }
          100% { transform: translate(80px, 80px); }
        }
      `}</style>
    </section>
  );
}
