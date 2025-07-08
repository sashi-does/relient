import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['tailark.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
