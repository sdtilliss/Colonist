import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Server Actions default to a 1MB body limit, which a real Colonist.io
      // screenshot (or two, for Overview + Stats) easily exceeds.
      bodySizeLimit: "8mb",
    },
  },
  // data/*.json is only read via a parameterized path inside blobStore.ts, which
  // Next's output file tracing can fail to pick up statically — force-include it
  // so the local-seed fallback (used until a Blob object exists) actually works
  // in the deployed serverless bundle.
  outputFileTracingIncludes: {
    "/*": ["./data/**/*.json"],
  },
};

export default nextConfig;
