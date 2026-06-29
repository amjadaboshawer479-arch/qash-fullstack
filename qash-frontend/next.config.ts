import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "clicksorderingsystem.nyc3.digitaloceanspaces.com" },
      { protocol: "https", hostname: "cdn.example.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
    // Allow local /public/images
    unoptimized: false,
  },
};

export default nextConfig;
