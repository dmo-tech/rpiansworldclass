import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";

// Jost, self-hosted so the build never downloads fonts (Hostinger's build
// can't reach Google Fonts). app/fonts holds the exact files Google Fonts
// served: Jost is a variable font, so each file covers weights 400–700 for
// one character set, with the same unicode-range as on Google. globals.css
// joins them into --font-jost with the same "Jost Fallback" metrics.
// (next/font needs literal options, hence three similar blocks.)
const jostLatin = localFont({
  src: [{ path: "./fonts/jost-latin.woff2", weight: "400 700", style: "normal" }],
  display: "swap",
  variable: "--font-jost-latin",
  adjustFontFallback: false,
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
    },
  ],
});

// Latin Extended includes the ₹ sign.
const jostLatinExt = localFont({
  src: [{ path: "./fonts/jost-latin-ext.woff2", weight: "400 700", style: "normal" }],
  display: "swap",
  variable: "--font-jost-latin-ext",
  adjustFontFallback: false,
  preload: false,
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF",
    },
  ],
});

const jostCyrillic = localFont({
  src: [{ path: "./fonts/jost-cyrillic.woff2", weight: "400 700", style: "normal" }],
  display: "swap",
  variable: "--font-jost-cyrillic",
  adjustFontFallback: false,
  preload: false,
  declarations: [
    {
      prop: "unicode-range",
      value: "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116",
    },
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rpiansworld.com"),

  title: {
    default:
      "RPIANS World Class Business Coaching | Business Automation and Profit Growth",
    template: "%s | RPIANS World Class Business Coaching",
  },

  description:
    "RPIANS World Class Business Coaching helps Indian business owners run their business on autopilot mode, build accountable teams, control inventory and multiply profit every year.",

  keywords: [
    "Business Automation Coach",
    "Profit Coach India",
    "Business Coaching India",
    "RPIANS",
    "Rajesh Kumar Kare",
    "Advanced Inventory Management System",
    "Team Accountability System",
    "Business Systems",
    "Profit Multiplication",
    "MSME Business Coach",
  ],

  authors: [
    {
      name: "Rajesh Kumar Kare",
    },
  ],

  creator: "RPIANS World Class Business Coaching LLP",

  publisher: "RPIANS World Class Business Coaching LLP",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title:
      "RPIANS World Class Business Coaching | Business Automation and Profit Growth",
    description:
      "Run your business on autopilot mode, build an accountable team and multiply profit every year with proven business systems.",
    url: "https://rpiansworld.com",
    siteName: "RPIANS World Class Business Coaching",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "RPIANS World Class Business Coaching",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title:
      "RPIANS World Class Business Coaching | Business Automation and Profit Growth",
    description:
      "Run your business on autopilot mode and multiply profit every year with proven business systems.",
    images: ["/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  icons: {
    icon: "/rpians-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jostLatin.variable} ${jostLatinExt.variable} ${jostCyrillic.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}