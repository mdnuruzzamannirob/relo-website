import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Clean, scalable imports
  experimental: {
    typedRoutes: true, // route-level type safety
  },

  // Image optimization (adjust domains as needed)
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Security & performance headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },

  // Production logging discipline
  logging: {
    fetches: {
      fullUrl: false,
    },
  },

  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
