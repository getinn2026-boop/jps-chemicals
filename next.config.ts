import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure proper build output for production
  output: 'standalone',
};

export default nextConfig;
