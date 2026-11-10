// ─────────────────────────────────────────────────────────────
// Single source of truth for everything editable on the website.
// The whole site reads from ONE file: src/data/site.json
// The admin dashboard edits that file and publishes it to GitHub.
// ─────────────────────────────────────────────────────────────

export type Tone = "red" | "white" | "black";
export type ButtonStyle = "red" | "white" | "black" | "outline";

export type SectionId =
  | "intro"
  | "eyeroll"
  | "hero"
  | "stats"
  | "dateSmarter"
  | "testimonials"
  | "products"
  | "booking";

export interface LinkItem {
  label: string;
  href: string;
}

export interface Product {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  tag: string;
  tagStyle: Tone;
  price: string;
  oldPrice: string;
  href: string;
  hidden: boolean;
  featured: boolean;
}

export interface Session {
  id: number;
  title: string;
  mins: string;
  price: string;
  was: string;
  tag: string;
  /** Booking link for this session (empty = use the main booking link) */
  link: string;
}

export interface Stat {
  value: string;
  label: string;
}

export type PopupTheme = "dark" | "light" | "red" | "glass" | "gradient";
export type PopupLayout = "image-top" | "image-side" | "text-only" | "image-only";
export type PopupPosition = "center" | "bottom" | "corner";
export type PopupSize = "small" | "medium" | "large";
export type PopupAnimation = "zoom" | "slide-up" | "fade" | "bounce" | "flip";
export type PopupTrigger = "load" | "scroll" | "exit";
export type PopupFrequency = "always" | "session" | "daily" | "once";
export type PopupPages = "all" | "home" | "courses";
export type PopupDevice = "all" | "mobile" | "desktop";

export interface Popup {
  id: number;
  enabled: boolean;
  /** Private name, only shown in the dashboard */
  name: string;
  badge: string;
  title: string;
  description: string;
  image: string;
  buttonText: string;
  buttonLink: string;
  buttonStyle: ButtonStyle;
  dismissText: string;
  theme: PopupTheme;
  accentColor: string;
  layout: PopupLayout;
  position: PopupPosition;
  size: PopupSize;
  animation: PopupAnimation;
  trigger: PopupTrigger;
  delaySeconds: number;
  scrollPercent: number;
  frequency: PopupFrequency;
  pages: PopupPages;
  device: PopupDevice;
  /** yyyy-mm-dd, empty = no limit */
  startDate: string;
  endDate: string;
  /** yyyy-mm-ddThh:mm, empty = no countdown */
  countdownTo: string;
}

export interface SiteContent {
  settings: {
    siteTitle: string;
    siteDescription: string;
    accentColor: string;
    animations: boolean;
    smoothScroll: boolean;
    stickyMobileCta: boolean;
    mobileCtaText: string;
    mobileCtaLink: string;
  };
  announcement: {
    enabled: boolean;
    text: string;
    linkText: string;
    link: string;
    style: Tone;
  };
  nav: {
    brand: string;
    links: LinkItem[];
    ctaText: string;
    ctaLink: string;
  };
  sections: { id: SectionId; visible: boolean }[];
  intro: {
    eyebrow: string;
    name: string;
    scrollHint: string;
    video: string;
  };
  eyeroll: {
    bigText: string;
    image: string;
  };
  hero: {
    line1: string;
    line2: string;
    line3: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
    photo: string;
    photoName: string;
    photoRole: string;
  };
  stats: {
    video: string;
    items: Stat[];
  };
  dateSmarter: {
    title: string;
    subtitle: string;
    video: string;
    headline: string;
    buttonText: string;
    buttonLink: string;
  };
  testimonials: {
    eyebrow: string;
    heading: string;
    subheading: string;
    autoplaySeconds: number;
    screenshots: string[];
  };
  products: {
    heading: string;
    tagline: string;
    buyText: string;
    homeCount: number;
    viewAllText: string;
    items: Product[];
  };
  booking: {
    badge: string;
    heading: string;
    highlight: string;
    description: string;
    url: string;
    ctaTitle: string;
    ctaSubtitle: string;
    sessions: Session[];
  };
  coursesPage: {
    badge: string;
    headingLines: { lead: string; highlight: string }[];
    subtitle: string;
    benefits: string[];
    ctaText: string;
    socialProofTitle: string;
    socialProofSubtitle: string;
    quoteTop: string;
    quoteMain: string;
    quoteAuthor: string;
    portrait: string;
    gridTitle: string;
    gridSubtitle: string;
    showLoader: boolean;
  };
  footer: {
    aboutTitle: string;
    aboutText: string;
    instagram: string;
    partnerTitle: string;
    partnerTag: string;
    partnerText: string;
    partnerInstagram: string;
    copyright: string;
    video: string;
  };
  popups: Popup[];
}
