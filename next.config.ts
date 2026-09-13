import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow images from localhost for payment screenshots
  images: {
    remotePatterns: [],
  },

  // Allow larger payloads for file uploads (50MB server limit)
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
