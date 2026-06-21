import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  turbopack: {
    root: __dirname,
  },
  allowedDevOrigins: ["192.168.186.1"],
  images: {
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
    remotePatterns: [
      {
        hostname: "localhost",
        port: "5050",
        protocol: "http",
        pathname: "/uploads/**",
      },
      {
        hostname: "images.unsplash.com",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
