import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve modern formats at the right size (book covers were 1.5MB+ PNGs)
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async headers() {
    return [
      {
        source: "/:file(.*\\.(?:mp4|webm|webp|png|jpe?g|avif))",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }],
      },
    ];
  },
};

export default nextConfig;
