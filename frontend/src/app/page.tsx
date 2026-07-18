import Navbar from "@/components/Navbar";
import IntroVideoSection from "@/components/IntroVideoSection";
import EyeRollSection from "@/components/EyeRollSection";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import DateSmarterSection from "@/components/DateSmarterSection";
import CTABanner from "@/components/CTABanner";
import CoursesSection from "@/components/CoursesSection";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <IntroVideoSection />
        <EyeRollSection />
        <HeroSection />
        <StatsSection />
        <DateSmarterSection />
        <CTABanner />
        <CoursesSection />
      </main>
      <Footer />
    </>
  );
}
