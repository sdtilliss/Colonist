import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Server Actions default to a 1MB body limit, which a real Colonist.io
      // screenshot (or two, for Overview + Stats) easily exceeds.
      bodySizeLimit: "8mb",
    },
  },
};

export default nextConfig;
