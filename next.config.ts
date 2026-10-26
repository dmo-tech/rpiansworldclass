import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Video poster hosted next to the video on worldclassbc.com.
    remotePatterns: [new URL("https://worldclassbc.com/media/**")],
  },
  // Not permanent (307), so browsers don't cache them if things change.
  async redirects() {
    return [
      // The Journey page was removed; old links land on Reviews (/results).
      { source: "/journey", destination: "/results", permanent: false },
      { source: "/reviews", destination: "/results", permanent: false },
      // Short link worldclassbc.com/training: the homepage with the "One
      // Important Thing" popup open (ApplyCheckPopup), like the Start Your
      // Business Transformation Today buttons. "Yes" books the call (source
      // "... - Training Link"); "No" opens the video on /watch
      // (?from=Training Link, without the details form). The space is written
      // %2520: Next decodes the destination once and doesn't re-encode values
      // from this config, so "%20" (or "+") would reach the Location header as
      // a raw space; this way the header carries a valid "Training%20Link".
      {
        source: "/training",
        destination: "/?enquire=1&from=Training%2520Link",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
