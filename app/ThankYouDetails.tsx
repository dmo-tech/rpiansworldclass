"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useSyncExternalStore } from "react";

import {
  PAYMENT_RECEIPT_STORAGE_KEY,
  parsePaymentReceipt,
} from "./paymentReceipt";
import { formatInr } from "./plans";
import { WHATSAPP_URL } from "./siteConfig";

// sessionStorage doesn't change while this page is open; nothing to subscribe to.
const subscribeToNothing = () => () => {};

const readStoredReceipt = () => {
  try {
    return sessionStorage.getItem(PAYMENT_RECEIPT_STORAGE_KEY);
  } catch {
    return null;
  }
};

// undefined during the server render, so "not read yet" differs from "no receipt".
const readNothingOnServer = () => undefined;

const NEXT_STEPS = [
  "Our team will contact you on WhatsApp or call within 24 hours.",
  "Check your email for the payment receipt.",
];

export default function ThankYouDetails() {
  const storedReceipt = useSyncExternalStore<string | null | undefined>(
    subscribeToNothing,
    readStoredReceipt,
    readNothingOnServer,
  );

  const isReady = storedReceipt !== undefined;
  const receipt = parsePaymentReceipt(storedReceipt ?? null);

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 24,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="w-full max-w-xl text-center"
    >
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.5,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 18,
          delay: 0.15,
        }}
        className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#3b82f6] to-[#2563eb] shadow-[0_20px_50px_rgba(37,99,235,0.35)] ring-8 ring-[#3b82f6]/15 sm:h-28 sm:w-28"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="h-12 w-12 text-white sm:h-14 sm:w-14"
        >
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </motion.div>

      <h1 className="mt-8 font-serif text-4xl font-semibold sm:text-5xl md:text-6xl">
        Thank You!
      </h1>

      {isReady ? (
        <>
          {receipt ? (
            <>
              <p className="mt-4 text-lg font-semibold text-[#1d4ed8] sm:text-xl">
                Your payment was successful
              </p>

              <dl className="mt-8 divide-y divide-black/10 rounded-2xl border border-black/10 bg-white px-5 text-left shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:px-6">
                <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                  <dt className="text-xs uppercase tracking-[0.15em] text-gray-500">
                    Program
                  </dt>

                  <dd className="font-semibold sm:text-right">
                    {receipt.planName}
                  </dd>
                </div>

                <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                  <dt className="text-xs uppercase tracking-[0.15em] text-gray-500">
                    Amount Paid
                  </dt>

                  <dd className="font-serif text-2xl font-bold text-[#1d4ed8] sm:text-right">
                    {formatInr(receipt.amount)}
                  </dd>
                </div>

                <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                  <dt className="text-xs uppercase tracking-[0.15em] text-gray-500">
                    Payment ID
                  </dt>

                  <dd className="break-all font-mono text-sm font-semibold sm:text-right">
                    {receipt.paymentId}
                  </dd>
                </div>
              </dl>
            </>
          ) : (
            <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
              Thank you for choosing RPIANS World Class Business Coaching. If
              you have just completed a payment, our team will be in touch
              with you shortly.
            </p>
          )}

          <div className="mt-8 rounded-2xl border border-[#1d4ed8]/20 bg-white/70 p-6 text-left">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1d4ed8]">
              What happens next
            </p>

            <ol className="mt-5 space-y-4">
              {NEXT_STEPS.map((step, index) => (
                <li key={step} className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1d4ed8] text-sm font-bold text-white">
                    {index + 1}
                  </span>

                  <p className="pt-1 text-gray-700">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#2563eb] px-8 py-4 text-center font-bold text-white! shadow-[0_15px_40px_rgba(37,99,235,0.25)] transition hover:scale-[1.02]"
            >
              Chat on WhatsApp
            </a>

            <Link
              href="/"
              className="rounded-lg border border-[#1d4ed8]/40 px-8 py-4 text-center font-semibold text-[#1e3a8a] transition hover:bg-[#1d4ed8]/5"
            >
              Back to Home
            </Link>
          </div>
        </>
      ) : null}
    </motion.div>
  );
}
