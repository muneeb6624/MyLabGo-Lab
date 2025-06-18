import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // experimental: {
  //   appDir: true,
  //   //serverActions: true,
  // },
  typescript: {
    ignoreBuildErrors: true, // Use with caution, ideally fix the errors instead
  },
};

export default nextConfig;
