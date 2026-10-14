import type { Metadata } from "next";
import { Suspense } from "react";

import ApplicationForm from "../ApplicationForm";

export const metadata: Metadata = {
  title: "Application Form",
  description:
    "Complete your RPIANS application after your booking payment.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function ApplicationPage() {
  // useSearchParams (the payment id) needs a Suspense boundary.
  return (
    <Suspense fallback={null}>
      <ApplicationForm />
    </Suspense>
  );
}
