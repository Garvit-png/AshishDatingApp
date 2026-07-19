"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import CoursesLoader from "@/components/CoursesLoader";
import CoursesHero from "@/components/CoursesHero";

// ─── Mock Data ───────────────────────────────────────────────
const allCourses = [
  {
    id: "course1",
    title: "Texting Masterclass",
    subtitle: "Learn exactly what to text, when to text, and how to keep her hooked on your messages.",
    price: "₹499",
    originalPrice: "₹999",
    tag: "BESTSELLER",
    totalDuration: "2h 15m",
    modules: [
      {
        id: "m1", title: "1. Texting Fundamentals", videos: [
          { id: "v1", title: "Why Most Guys Fail at Texting", duration: "8m", img: "https://images.unsplash.com/photo-1611606063065-ee7946f0787a?auto=format&fit=crop&w=800&q=80", desc: "Understanding the common mistakes that kill attraction over text." },
          { id: "v2", title: "The Push-Pull Framework", duration: "15m", img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80", desc: "How to create tension and keep the conversation exciting." },
        ]
      },
      {
        id: "m2", title: "2. Advanced Texting Strategies", videos: [
          { id: "v3", title: "Getting Her to Initiate", duration: "12m", img: "https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?auto=format&fit=crop&w=800&q=80", desc: "Flip the script so she's the one chasing you." },
          { id: "v4", title: "From Texting to Date", duration: "20m", img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80", desc: "The exact transition from online conversation to real-life meetup." },
        ]
      }
    ]
  },
  {
    id: "course2",
    title: "Body Language & Confidence",
    subtitle: "Master non-verbal communication. Walk into any room and own it without saying a word.",
    price: "₹699",
    originalPrice: "₹1499",
    tag: "POPULAR",
    totalDuration: "3h 40m",
    modules: [
      {
        id: "m3", title: "1. The Power of Presence", videos: [
          { id: "v5", title: "First Impressions That Stick", duration: "10m", img: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80", desc: "How your body language speaks louder than your words in the first 3 seconds." },
          { id: "v6", title: "Eye Contact Mastery", duration: "14m", img: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80", desc: "The right way to use eye contact to build trust and attraction." },
        ]
      },
      {
        id: "m4", title: "2. Confidence in Action", videos: [
          { id: "v7", title: "Handling Rejection Like a Boss", duration: "18m", img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80", desc: "Reframe rejection and use it as fuel instead of fear." },
        ]
      }
    ]
  },
  {
    id: "course3",
    title: "Date Psychology 101",
    subtitle: "Decode female psychology. Understand attraction triggers that actually work in real life.",
    price: "₹399",
    originalPrice: "₹799",
    tag: "NEW",
    totalDuration: "1h 50m",
    modules: [
      {
        id: "m5", title: "1. Understanding Attraction", videos: [
          { id: "v8", title: "What Women Actually Want", duration: "22m", img: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&w=800&q=80", desc: "Breaking down the real psychology behind what drives female attraction." },
          { id: "v9", title: "The Art of Conversation", duration: "25m", img: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80", desc: "How to have conversations that feel natural and build deep connections." },
        ]
      }
    ]
  },
];

// ─── Main Component ──────────────────────────────────────────
export default function CoursePlatform() {
  const [view, setView] = useState<"list" | "detail">("list");
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [unlockedCourses, setUnlockedCourses] = useState<string[]>([]);
  const [expandedModule, setExpandedModule] = useState<string>("");
  const [activeVideoId, setActiveVideoId] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success">("idle");
  const [loading, setLoading] = useState(true);

  const coursesGridRef = useRef<HTMLDivElement>(null);

  const handleLoaderComplete = useCallback(() => {
    setLoading(false);
  }, []);

  const scrollToCourses = useCallback(() => {
    coursesGridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const openCourse = (courseId: string) => {
    const course = allCourses.find(c => c.id === courseId);
    if (!course) return;
    setSelectedCourseId(courseId);
    setExpandedModule(course.modules[0].id);
    setActiveVideoId(course.modules[0].videos[0].id);
    setView("detail");
    window.scrollTo(0, 0);
  };

  const goBackToList = () => {
    setView("list");
    setSelectedCourseId(null);
    window.scrollTo(0, 0);
  };

  const handleBuy = (courseId: string) => {
    setPaymentStatus("processing");
    setTimeout(() => {
      setPaymentStatus("success");
      setUnlockedCourses(prev => [...prev, courseId]);
    }, 2000);
  };

  // ─── LIST VIEW ─────────────────────────────────────────────
  if (view === "list") {
    return (
      <div className="min-h-screen bg-black text-white">
        {/* Loading overlay — mounts on top of everything */}
        {loading && <CoursesLoader onComplete={handleLoaderComplete} />}

        {/* Hero section */}
        <CoursesHero onScrollToCourses={scrollToCourses} />

        {/* Scroll target anchor for "Explore All Courses" CTA */}
        <div ref={coursesGridRef} />

        {/* Header */}
        <div className="border-b border-[#222]">
          <div className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
            <Link href="/" className="text-[#a3a3a3] hover:text-white flex items-center gap-2 transition-colors text-sm">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" /></svg>
              Back to Home
            </Link>
            <span className="text-[10px] font-bold tracking-widest text-[#7f0000] uppercase">ASHISH CHHIPA</span>
          </div>
        </div>

        {/* Page Title */}
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">All Courses & Playbooks</h1>
          <p className="text-[#666] text-lg max-w-xl mx-auto">Real dating strategy. Real psychology. Zero cringe.</p>
        </div>

        {/* Course Grid */}
        <div className="max-w-6xl mx-auto px-6 pb-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allCourses.map((course) => {
            const isOwned = unlockedCourses.includes(course.id);
            const totalVideos = course.modules.reduce((sum, m) => sum + m.videos.length, 0);

            return (
              <div key={course.id} className="bg-[#111] border border-[#222] rounded-2xl overflow-hidden group hover:border-[#333] transition-all duration-300 flex flex-col">
                
                {/* Course Thumbnail — first video image blurred as background */}
                <div className="relative h-44 overflow-hidden bg-[#0a0a0a]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={course.modules[0].videos[0].img}
                    alt={course.title}
                    className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/60 to-transparent" />
                  {/* Tag */}
                  <span className="absolute top-4 left-4 bg-[#7f0000] text-white text-[10px] font-bold tracking-widest px-3 py-1 rounded-full uppercase">
                    {course.tag}
                  </span>
                  {/* Play icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-14 h-14 bg-[#7f0000]/80 rounded-full flex items-center justify-center pl-1 shadow-lg">
                      <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                  </div>
                </div>

                {/* Course Info */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-bold mb-2 leading-tight">{course.title}</h3>
                  <p className="text-[#666] text-sm leading-relaxed mb-5 flex-1">{course.subtitle}</p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-5 text-[#555] text-xs">
                    <span className="flex items-center gap-1.5">
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zM10 9h8v2h-8zm0 3h4v2h-4zm0-6h8v2h-8z" /></svg>
                      {course.modules.length} Modules
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M8 5v14l11-7z" /></svg>
                      {totalVideos} Videos
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" /><path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" /></svg>
                      {course.totalDuration}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-2xl font-black text-white">{course.price}</span>
                    <span className="text-sm text-[#555] line-through">{course.originalPrice}</span>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => openCourse(course.id)}
                      className="flex-1 border-2 border-[#333] hover:border-[#7f0000] text-white font-semibold py-3 rounded-xl text-sm transition-all hover:bg-[#7f0000]/10"
                    >
                      Explore Course
                    </button>
                    {!isOwned ? (
                      <button
                        onClick={() => handleBuy(course.id)}
                        className="flex-1 bg-[#7f0000] hover:bg-[#990000] text-white font-semibold py-3 rounded-xl text-sm transition-all shadow-lg hover:shadow-[0_0_20px_rgba(127,0,0,0.3)]"
                      >
                        Buy Now
                      </button>
                    ) : (
                      <button
                        onClick={() => openCourse(course.id)}
                        className="flex-1 bg-green-900/40 border border-green-700/50 text-green-400 font-semibold py-3 rounded-xl text-sm cursor-pointer"
                      >
                        ✓ Owned
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Payment Modal for list view */}
        {paymentStatus !== "idle" && (
          <PaymentModal paymentStatus={paymentStatus} onClose={() => setPaymentStatus("idle")} />
        )}
      </div>
    );
  }

  // ─── DETAIL VIEW (Video Player UI) ────────────────────────
  const course = allCourses.find(c => c.id === selectedCourseId);
  if (!course) return null;

  const isUnlocked = unlockedCourses.includes(course.id);

  let activeVideo = course.modules[0].videos[0];
  course.modules.forEach(m => {
    const found = m.videos.find(v => v.id === activeVideoId);
    if (found) activeVideo = found;
  });

  return (
    <div className="flex h-screen bg-[#050505] text-white font-sans overflow-hidden">

      {/* Tiny Sidebar */}
      <div className="w-14 bg-[#0a0a0a] border-r border-[#222] flex flex-col items-center py-6 gap-6 shrink-0 z-10">
        <button onClick={goBackToList} className="text-[#a3a3a3] hover:text-white transition-colors" title="Back to Courses">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" /></svg>
        </button>
        <Link href="/" className="text-[#555] hover:text-white transition-colors" title="Home">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>
        </Link>
      </div>

      {/* Course Curriculum Sidebar */}
      <div className="w-80 bg-[#111] border-r border-[#222] flex flex-col h-full shrink-0">
        <div className="p-5 border-b border-[#222] flex items-center gap-3">
          <button onClick={goBackToList} className="text-[#666] hover:text-white transition-colors shrink-0">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" /></svg>
          </button>
          <h2 className="text-sm font-bold tracking-tight truncate">{course.title}</h2>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
          {course.modules.map((mod) => (
            <div key={mod.id} className="bg-[#1a1a1a] rounded-lg overflow-hidden border border-[#222]">
              <button
                onClick={() => setExpandedModule(prev => prev === mod.id ? "" : mod.id)}
                className="w-full flex justify-between items-center p-4 hover:bg-[#222] transition-colors text-left"
              >
                <span className="font-semibold text-sm">{mod.title}</span>
                <svg viewBox="0 0 24 24" className={`w-5 h-5 fill-current text-[#555] transform transition-transform duration-300 ${expandedModule === mod.id ? 'rotate-180' : ''}`}>
                  <path d="M7 10l5 5 5-5z" />
                </svg>
              </button>

              <div className={`transition-all duration-300 ease-in-out overflow-hidden ${expandedModule === mod.id ? 'max-h-[500px]' : 'max-h-0'}`}>
                <div className="pb-2">
                  {mod.videos.map((vid) => {
                    const isActive = activeVideoId === vid.id;
                    return (
                      <button
                        key={vid.id}
                        onClick={() => setActiveVideoId(vid.id)}
                        className={`w-full flex items-center justify-between p-3 pl-6 hover:bg-[#222] transition-colors text-left group ${isActive ? 'bg-[#222] border-l-2 border-[#7f0000]' : 'border-l-2 border-transparent'}`}
                      >
                        <div className="flex items-center gap-3">
                          {!isUnlocked ? (
                            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0 fill-[#555]">
                              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
                            </svg>
                          ) : (
                            <svg viewBox="0 0 24 24" className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'fill-[#7f0000]' : 'fill-[#555] group-hover:fill-white transition-colors'}`}>
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          )}
                          <span className={`text-xs ${isActive ? 'text-white font-medium' : 'text-[#a3a3a3]'}`}>{vid.title}</span>
                        </div>
                        <span className="text-[10px] text-[#555] bg-[#111] px-2 py-0.5 rounded">{vid.duration}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 flex flex-col h-full bg-[#0a0a0a] overflow-y-auto custom-scrollbar relative">

        {/* Header */}
        <div className="p-6 md:px-10 md:py-8 flex justify-between items-start gap-4">
          <div>
            <p className="text-[10px] font-bold tracking-widest text-[#7f0000] uppercase mb-2">NOW PLAYING</p>
            <h1 className="text-2xl md:text-3xl font-extrabold">{activeVideo.title}</h1>
            <p className="text-[#555] text-sm mt-2 flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" /><path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" /></svg>
              {activeVideo.duration}
            </p>
          </div>
          {isUnlocked ? (
            <button className="bg-[#1a1a1a] border border-[#333] hover:border-[#7f0000] text-[#a3a3a3] hover:text-white px-6 py-2 rounded-md text-sm font-semibold transition-all">
              Mark Complete
            </button>
          ) : (
            <button onClick={() => handleBuy(course.id)} className="bg-[#7f0000] hover:bg-[#990000] text-white px-6 py-2 rounded-md text-sm font-bold shadow-lg transition-all transform hover:scale-105 active:scale-95">
              Unlock — {course.price}
            </button>
          )}
        </div>

        {/* Video Player */}
        <div className="px-6 md:px-10 pb-8 flex-shrink-0">
          <div className="relative w-full rounded-2xl overflow-hidden bg-black aspect-video border border-[#222] shadow-2xl flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeVideo.img}
              alt={activeVideo.title}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${!isUnlocked ? 'blur-xl opacity-40 scale-105' : 'blur-0 opacity-100 scale-100'}`}
            />

            {!isUnlocked ? (
              <div className="relative z-10 flex flex-col items-center text-center p-8 bg-black/60 backdrop-blur-sm rounded-xl border border-[#333] max-w-sm">
                <div className="w-16 h-16 bg-[#7f0000]/20 rounded-full flex items-center justify-center mb-4">
                  <svg viewBox="0 0 24 24" className="w-8 h-8 fill-[#7f0000]">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Video Locked</h3>
                <p className="text-[#a3a3a3] text-sm mb-6">Buy the playbook to unlock all videos.</p>
                <button onClick={() => handleBuy(course.id)} className="bg-[#7f0000] hover:bg-[#990000] text-white px-8 py-3 rounded-full font-bold shadow-lg transition-transform hover:scale-105 w-full">
                  Buy Now — {course.price}
                </button>
              </div>
            ) : (
              <div className="absolute inset-0 z-10 flex flex-col justify-between p-4 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="flex justify-end">
                  <span className="bg-black/60 text-white text-xs px-2 py-1 rounded">HD</span>
                </div>
                <div className="flex items-center justify-center absolute inset-0">
                  <button className="w-20 h-20 bg-[#7f0000] hover:bg-[#990000] rounded-full flex items-center justify-center pl-2 transition-transform hover:scale-110 shadow-[0_0_30px_rgba(127,0,0,0.5)]">
                    <svg viewBox="0 0 24 24" className="w-10 h-10 fill-white"><path d="M8 5v14l11-7z" /></svg>
                  </button>
                </div>
                <div className="w-full flex items-center gap-4 text-white">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current cursor-pointer"><path d="M8 5v14l11-7z" /></svg>
                  <div className="h-1 bg-white/30 flex-1 rounded-full overflow-hidden cursor-pointer">
                    <div className="h-full bg-[#7f0000] w-1/3"></div>
                  </div>
                  <span className="text-xs">01:23 / {activeVideo.duration}</span>
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current cursor-pointer"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" /></svg>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* About Lesson */}
        <div className="px-6 md:px-10 pb-20">
          <div className="bg-[#111] border border-[#222] rounded-xl overflow-hidden">
            <div className="bg-[#1a1a1a] p-4 border-b border-[#222]">
              <h3 className="font-bold text-lg">About this lesson</h3>
            </div>
            <div className="p-6">
              <p className="text-[#a3a3a3] leading-relaxed">{activeVideo.desc}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {paymentStatus !== "idle" && (
        <PaymentModal paymentStatus={paymentStatus} onClose={() => setPaymentStatus("idle")} />
      )}

      {/* Custom Scrollbar */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #333; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #555; }
      `}} />
    </div>
  );
}

// ─── Payment Modal Component ─────────────────────────────────
function PaymentModal({ paymentStatus, onClose }: { paymentStatus: "processing" | "success"; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-50">
      <div className="bg-[#111] border border-[#333] p-10 rounded-2xl text-center max-w-sm w-[90%] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#7f0000] shadow-[0_0_20px_rgba(127,0,0,1)]"></div>
        {paymentStatus === "processing" ? (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-[#333] border-t-[#7f0000] rounded-full animate-spin mb-6"></div>
            <h2 className="text-2xl font-bold mb-2">Processing...</h2>
            <p className="text-[#666] text-sm">Securing your access.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
              <svg viewBox="0 0 24 24" className="w-8 h-8 fill-green-500"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Unlocked!</h2>
            <p className="text-[#a3a3a3] text-sm mb-8">You now have full access.</p>
            <button onClick={onClose} className="bg-[#1a1a1a] hover:bg-[#222] border border-[#333] text-white font-bold py-3 px-6 rounded-xl w-full transition-colors">
              Start Watching
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
