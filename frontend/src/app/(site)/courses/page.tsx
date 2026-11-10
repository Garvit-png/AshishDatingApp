import type { Metadata } from "next";
import CoursePlatform from "@/components/CoursePlatform";
import { siteContent } from "@/content/server";

export const metadata: Metadata = {
  title: `${siteContent.coursesPage.gridTitle} – ${siteContent.nav.brand}`,
  description: siteContent.coursesPage.subtitle,
};

export default function CoursesPage() {
  return <CoursePlatform />;
}
