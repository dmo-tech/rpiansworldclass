import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Video poster hosted next to the video on worldclassbc.com.
    remotePatterns: [new URL("https://worldclassbc.com/media/**")],
  },
  async redirects() {
    return [
      // One address for the site: www.worldclassbc.com → worldclassbc.com,
      // same path, and the query is passed through. Cookie consent, the
      // form → payment → thank-you hand-off and the sent-Purchase memory
      // are kept per address, so a visitor split between the two lost their
      // Meta Pixel Purchase. 301, as for any domain move. First, so
      // www…/training lands on worldclassbc.com/training before the redirect
      // below. /api/ is left out: a 301 turns a POST into a GET, so a www tab
      // open at deploy time would lose its lead or payment check.
      {
        source: "/:path((?!api/).*)",
        has: [{ type: "host", value: "www.worldclassbc.com" }],
        destination: "https://worldclassbc.com/:path",
        statusCode: 301,
      },
      // The rest are not permanent (307), so browsers don't cache them if
      // things change.
      // The Journey page was removed; old links land on Reviews (/results).
      { source: "/journey", destination: "/results", permanent: false },
      { source: "/reviews", destination: "/results", permanent: false },
      // The Book a Call calendar page was removed (no call times are picked
      // any more); old links land on the video.
      { source: "/book-call", destination: "/watch", permanent: false },
      // Short link worldclassbc.com/training: the homepage with the "One
      // Important Thing" popup open (ApplyCheckPopup), like the Start Your
      // Business Transformation Today buttons. "Yes" books the call (source
      // "... - Training Link"); "No" opens the video on /watch
      // (?from=Training Link). The space is written
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
