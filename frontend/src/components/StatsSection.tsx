import SoftAurora from "./SoftAurora";

export default function StatsSection() {
  return (
    <section
      className="relative w-full bg-[#cc0000] flex flex-col items-center justify-center gap-6 py-24 px-6 overflow-hidden"
      style={{ minHeight: "100vh" }}
    >
      {/* Background SoftAurora */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-80">
        <SoftAurora
          speed={0.6}
          scale={1.5}
          brightness={1.0}
          color1="#000000"
          color2="#000000"
          noiseFrequency={2.5}
          noiseAmplitude={1.0}
          bandHeight={0.5}
          bandSpread={1.0}
          octaveDecay={0.1}
          layerOffset={0}
          colorSpeed={1.0}
          enableMouseInteraction={true}
          mouseInfluence={0.25}
        />
      </div>

      {/* Title - Fixed at the top */}
      <div className="absolute top-16 md:top-24 left-0 w-full z-20 flex justify-center px-6">
        <h2 className="text-6xl sm:text-7xl lg:text-8xl font-black text-black tracking-tight text-center leading-none">
          DATE SMARTER
        </h2>
      </div>

      {/* Content wrapper with z-index to appear over aurora */}
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
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 rounded-2xl ring-1 ring-black/20 pointer-events-none" />
        </div>

        {/* Post-Video Content */}
        <div className="flex flex-col items-center gap-8 mt-6">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black text-center max-w-3xl leading-tight">
            Only Pickup Lines aren't gonna work. You deserve something better.
          </h3>
          <button className="bg-black text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-900 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-black/20">
            Shop Now
          </button>
        </div>
      </div>
    </section>
  );
}
