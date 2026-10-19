"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import IntroVideoSection from "@/components/IntroVideoSection";
import EyeRollSection from "@/components/EyeRollSection";
import Footer from "@/components/Footer";
import AnnouncementPopup from "@/components/AnnouncementPopup";
import TestimonialsSection from "@/components/TestimonialsSection";

const HeroSection = dynamic(() => import("@/components/HeroSection"), { ssr: false });
const StatsVideoSection = dynamic(() => import("@/components/StatsVideoSection"), { ssr: false });
const StatsSection = dynamic(() => import("@/components/StatsSection"), { ssr: false });
const CoursesSection = dynamic(() => import("@/components/CoursesSection"), { ssr: false });

export default function HomePage() {
  return (
    <>
      <AnnouncementPopup />
      <Navbar />
      <main>
        <IntroVideoSection />
        <EyeRollSection />
        <HeroSection />
        <StatsVideoSection />
        <StatsSection />
        <CoursesSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </>
  );
}
