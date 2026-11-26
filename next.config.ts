import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev only. The extra pattern lets a port preview load /_next assets.
  allowedDevOrigins: ["127.0.0.1", "**.*"],
  cacheComponents: true,
  partialPrefetching: true,
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
