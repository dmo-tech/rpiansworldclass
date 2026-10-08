import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Video poster hosted next to the video on worldclassbc.com.
    remotePatterns: [new URL("https://worldclassbc.com/media/**")],
  },
};

export default nextConfig;
