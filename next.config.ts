import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.ticimax.cloud",
      }
    ]
  },
};

export default nextConfig;
