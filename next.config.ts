import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // async rewrites() {
  //   return [
  //     {
  //       source: "/firestore/:path*", // your local path
  //       destination: "https://firestore.googleapis.com/google.firestore.v1.Firestore/:path*", // external API
  //     },
  //   ];
  // },
};

export default nextConfig;
