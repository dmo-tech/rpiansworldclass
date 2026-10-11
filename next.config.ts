import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Video poster hosted next to the video on worldclassbc.com.
    remotePatterns: [new URL("https://worldclassbc.com/media/**")],
  },
  // The Journey page was removed; old links land on Reviews (/results).
  // Not permanent, so browsers don't cache it if the page comes back.
  async redirects() {
    return [
      { source: "/journey", destination: "/results", permanent: false },
      { source: "/reviews", destination: "/results", permanent: false },
    ];
  },
};

export default nextConfig;
