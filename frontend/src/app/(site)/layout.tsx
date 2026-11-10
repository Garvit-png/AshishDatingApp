import { siteContent } from "@/content/server";
import { ContentProvider } from "@/content/ContentContext";
import SmoothScroll from "@/components/motion/SmoothScroll";
import AnnouncementPopup from "@/components/AnnouncementPopup";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <ContentProvider initial={siteContent}>
      <SmoothScroll />
      <AnnouncementPopup />
      {children}
    </ContentProvider>
  );
}
