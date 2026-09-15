import type { Metadata } from "next";
import { Jost } from "next/font/google";

import "./globals.css";

const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jost",
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
    "Inventory Management System",
    "HRMS for Business",
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
    <html lang="en" className={jost.variable}>
      <body>{children}</body>
    </html>
  );
}