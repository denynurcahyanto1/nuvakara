import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Template galleries accept owner-provided URLs (Supabase Storage, CDNs…).
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  /* config options here */
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
