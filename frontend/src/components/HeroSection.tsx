import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-black overflow-hidden flex items-center pt-16">
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-red-950/20 z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* LEFT — Text Content */}
          <div className="flex-1 max-w-2xl">
            {/* Social Proof Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8 animate-fade-in">
              <span className="text-xs font-semibold text-white tracking-wide">
                Helped And Guided Over
              </span>
              <span className="text-sm font-black text-red-400">1L+</span>
              <span className="text-xs font-semibold text-white">peoples</span>
              <div className="flex -space-x-2">
                {["😊", "🙂", "😄"].map((emoji, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-xs"
                  >
                    {emoji}
                  </div>
                ))}
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
              <span className="block opacity-0 animate-slide-up" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
                Attract{" "}
                <span className="italic text-red-400">Better.</span>
              </span>
              <span className="block opacity-0 animate-slide-up" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
                Date{" "}
                <span className="italic text-red-400">Smarter.</span>
              </span>
              <span className="block opacity-0 animate-slide-up" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
                Build Lasting{" "}
                <span className="text-white">Love.</span>
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className="text-gray-300 text-base sm:text-lg mb-10 max-w-md leading-relaxed opacity-0 animate-slide-up"
              style={{ animationDelay: "0.45s", animationFillMode: "forwards" }}
            >
              Join thousands of learners and take your career to the next level with our expert-led courses.
            </p>

            {/* CTA Button */}
            <div className="opacity-0 animate-slide-up" style={{ animationDelay: "0.55s", animationFillMode: "forwards" }}>
              <Link
                href="#courses"
                className="inline-flex items-center gap-2 bg-white text-black font-bold px-8 py-4 rounded-md text-sm hover:bg-gray-100 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-white/10"
              >
                Start Learning Now
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* RIGHT — Big Photo Card */}
          <div className="flex-1 flex justify-center lg:justify-end opacity-0 animate-slide-up" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
            <div className="relative w-[320px] sm:w-[380px] lg:w-[420px] h-[480px] sm:h-[540px] lg:h-[580px] rounded-3xl overflow-hidden shadow-2xl shadow-red-900/30 border border-white/10">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10 z-10 pointer-events-none" />
              <Image
                src="/ashish.jpeg"
                alt="Ashish Chhipa – Dating Coach"
                fill
                className="object-cover object-top"
                priority
              />
              {/* Bottom gradient on card */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/70 to-transparent z-10" />
              {/* Name tag on card */}
              <div className="absolute bottom-5 left-5 z-20">
                <p className="text-white font-bold text-lg leading-tight">Ashish Chhipa</p>
                <p className="text-red-400 text-sm font-medium">Dating Coach &amp; Mentor</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-bounce">
        <div className="w-0.5 h-8 bg-white/30 rounded-full" />
        <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
      </div>
    </section>
  );
}
