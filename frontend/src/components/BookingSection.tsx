const BOOKING_URL = "https://superprofile.bio/bookings/ashishchhipaofficial";

const SESSIONS = [
  { title: "Chat Game Audit", mins: "20 mins", price: "₹899", was: "₹1199", tag: "Most Popular" },
  { title: "Conversation Fix", mins: "30 mins", price: "₹1699", was: "₹2000" },
  { title: "Dating & Relationship Clarity", mins: "45 mins", price: "₹2500", was: "₹3200" },
  { title: "Clarity & Direction", mins: "60 mins", price: "₹3000", was: "₹3700" },
  { title: "Transformation Roadmap", mins: "90 mins", price: "₹6999", was: "₹10000" },
];

export default function BookingSection() {
  return (
    <section id="book" className="relative overflow-hidden bg-black py-20 px-4 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-[#7f0000]/40 blur-[140px]" />
      <div className="relative max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#ff6b6b] border border-[#7f0000] bg-[#7f0000]/20 rounded-full px-4 py-1.5 mb-5">
            1-on-1 with Ashish
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight mb-4">
            Stuck in chats? <span className="text-[#ff3b3b]">Let&apos;s fix it, live.</span>
          </h2>
          <p className="text-gray-300 max-w-xl mx-auto">
            Mixed signals decode karo, replies master karo, aur awkward chats ko confident
            conversations mein badlo — personalised guidance, seedha call pe.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SESSIONS.map((s) => (
            <a
              key={s.title}
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[#7f0000] hover:bg-white/10"
            >
              {s.tag && (
                <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider bg-[#7f0000] text-white rounded-full px-2.5 py-1">
                  {s.tag}
                </span>
              )}
              <p className="text-sm text-gray-400 mb-2">{s.mins}</p>
              <h3 className="text-lg font-bold text-white mb-6 pr-16">{s.title}</h3>
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-2xl font-extrabold text-white">{s.price}</span>
                  <span className="ml-2 text-sm text-gray-500 line-through">{s.was}</span>
                </div>
                <span className="text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all">→</span>
              </div>
            </a>
          ))}

          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center text-center rounded-2xl bg-[#7f0000] p-6 text-white font-bold text-lg transition-all duration-200 hover:bg-[#a30000] hover:scale-[1.03] active:scale-95"
          >
            Book Your Session
            <span className="mt-1 text-sm font-medium text-white/80">Slot choose karo →</span>
          </a>
        </div>
      </div>
    </section>
  );
}
