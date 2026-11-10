"use client";

import dynamic from "next/dynamic";
import { useContent } from "@/content/ContentContext";
import type { SectionId } from "@/content/types";
import Navbar from "./Navbar";
import IntroVideoSection from "./IntroVideoSection";
import EyeRollSection from "./EyeRollSection";
import HeroSection from "./HeroSection";
import StatsVideoSection from "./StatsVideoSection";
import StatsSection from "./StatsSection";
import TestimonialsSection from "./TestimonialsSection";
import CoursesSection from "./CoursesSection";
import BookingSection from "./BookingSection";
import Footer from "./Footer";
import ScrollProgress from "./motion/ScrollProgress";

const MobileCtaBar = dynamic(() => import("./MobileCtaBar"), { ssr: false });

const SECTIONS: Record<SectionId, React.ComponentType> = {
  intro: IntroVideoSection,
  eyeroll: EyeRollSection,
  hero: HeroSection,
  stats: StatsVideoSection,
  dateSmarter: StatsSection,
  testimonials: TestimonialsSection,
  products: CoursesSection,
  booking: BookingSection,
};

export default function HomePage() {
  const { content } = useContent();
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        {content.sections
          .filter((s) => s.visible)
          .map((s) => {
            const Section = SECTIONS[s.id];
            return <Section key={s.id} />;
          })}
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  );
}
