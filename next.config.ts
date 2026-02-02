import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  experimental: {
    optimizeCss: true,
    // Optimize barrel file imports for better bundle size and faster builds
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
    ],
  },
};

export default nextConfig;
