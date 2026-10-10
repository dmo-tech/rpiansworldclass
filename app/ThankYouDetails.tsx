"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import type { ReactNode } from "react";

import {
  PAYMENT_RECEIPT_STORAGE_KEY,
  parsePaymentReceipt,
} from "./paymentReceipt";
import { formatInr } from "./plans";
import { WHATSAPP_URL } from "./siteConfig";

// The application form opened by "Click here" in step 1. Change it here only.
const APPLICATION_FORM_URL = "<<URL I WILL GIVE>>";

const CONTACT_EMAIL = "info@worldclassbc.com";

const PROGRAM_NAME = "Business Automation And Profit Mastery Program";

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

const NEXT_STEPS: ReactNode[] = [
  <>
    <a
      href={APPLICATION_FORM_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="mr-1 inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#2563eb] px-4 py-1.5 align-middle font-bold text-white! shadow-[0_10px_30px_rgba(37,99,235,0.3)] transition hover:scale-[1.03]"
    >
      Click here
      <span aria-hidden="true">↗</span>
    </a>{" "}
    to fill out the short application. Based on your answers your
    application will be selected or rejected. So just be very honest with
    your answers as per your current business situation.
  </>,
  "Please check your email, we have already sent you the application form. If it went to spam, kindly move it to Primary. If you still don't see it, let us know.",
  "Our team will review your answers and get back to you with a response within 48 business hours.",
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
      className="w-full max-w-2xl"
    >
      {/* Payment confirmation, or the generic note when there's no receipt. */}
      {isReady ? (
        receipt ? (
          <div className="rounded-2xl border border-[#3b82f6]/25 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-6">
            <p className="flex items-center gap-3 text-lg font-bold text-[#1d4ed8]">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#3b82f6] to-[#2563eb] shadow-[0_8px_20px_rgba(37,99,235,0.35)]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="h-5 w-5 text-white"
                >
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
              </span>
              Payment successful
            </p>

            <dl className="mt-5 grid gap-4 border-t border-black/10 pt-5 sm:grid-cols-3">
              <div>
                <dt className="text-xs uppercase tracking-[0.15em] text-gray-500">
                  Program
                </dt>

                <dd className="mt-1 font-semibold">{receipt.planName}</dd>
              </div>

              <div>
                <dt className="text-xs uppercase tracking-[0.15em] text-gray-500">
                  Amount Paid
                </dt>

                <dd className="mt-1 font-serif text-2xl font-bold text-[#1d4ed8]">
                  {formatInr(receipt.amount)}
                </dd>
              </div>

              <div>
                <dt className="text-xs uppercase tracking-[0.15em] text-gray-500">
                  Payment ID
                </dt>

                <dd className="mt-1 break-all font-mono text-sm font-semibold">
                  {receipt.paymentId}
                </dd>
              </div>
            </dl>
          </div>
        ) : (
          <p className="rounded-2xl border border-[#3b82f6]/25 bg-white/80 p-5 text-base leading-7 text-gray-600 sm:p-6">
            Thank you for choosing RPIANS World Class Business Coaching. If you
            have just completed a payment, our team will be in touch with you
            shortly.
          </p>
        )
      ) : null}

      <h1 className="mt-10 font-serif text-4xl font-semibold leading-tight sm:text-5xl">
        One more step to go:
      </h1>

      <div className="mt-6 space-y-4 text-lg leading-8 text-gray-700">
        <p>
          Thank you for showing your interest in the{" "}
          <span className="text-[#1d4ed8]">{PROGRAM_NAME}</span>.
        </p>

        <p>
          We&apos;re so excited to see if we&apos;re a good fit to work
          together to help scale your brand and business.
        </p>
      </div>

      <div className="mt-7 border-l-4 border-[#3b82f6] pl-4">
        <p className="text-lg font-bold text-[#0f172a]">Rajesh Kumar Kare</p>

        <p className="text-sm text-gray-500">
          Business Automation And Profit Coach
        </p>
      </div>

      <h2 className="mt-12 text-2xl font-bold text-[#0f172a] sm:text-3xl">
        Here&apos;s what to do next:
      </h2>

      <ol className="mt-6 space-y-4">
        {NEXT_STEPS.map((step, index) => (
          <li
            key={index}
            className={`flex items-start gap-4 rounded-2xl border bg-white p-5 shadow-[0_15px_45px_rgba(15,23,42,0.07)] sm:gap-5 sm:p-6 ${
              index === 0 ? "border-[#3b82f6]/50" : "border-black/10"
            }`}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] text-lg font-bold text-white">
              {index + 1}
            </span>

            <p className="pt-1.5 leading-8 text-gray-700">{step}</p>
          </li>
        ))}
      </ol>

      <p className="mt-10 leading-7 text-gray-600">
        If you have any questions related to the {PROGRAM_NAME}, email us at{" "}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="break-all font-semibold text-[#1d4ed8]! underline underline-offset-4 hover:text-[#1e3a8a]!"
        >
          {CONTACT_EMAIL}
        </a>
        .
      </p>

      <p className="mt-6 text-lg font-bold text-[#0f172a]">Team RPIANS</p>

      <div className="mt-10 flex flex-col gap-3 border-t border-black/10 pt-8 sm:flex-row">
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
    </motion.div>
  );
}
