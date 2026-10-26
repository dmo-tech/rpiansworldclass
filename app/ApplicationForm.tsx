"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";

import {
  APPLICATION_QUESTIONS,
  CONTACT_QUESTIONS,
} from "./businessQuestions";
import {
  parsePaymentReceipt,
  PAYMENT_RECEIPT_STORAGE_KEY,
  RAZORPAY_PAYMENT_ID_PATTERN,
} from "./paymentReceipt";
import QuestionFlow from "./QuestionFlow";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
import { WHATSAPP_BASE_URL } from "./siteConfig";

const QUESTIONS = [...CONTACT_QUESTIONS, ...APPLICATION_QUESTIONS];

const SUBMIT_TIMEOUT_MS = 15000;

type Status = "checking" | "ready" | "not-paid" | "unconfirmed";

const readSession = (key: string) => {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
};

// The booking this browser made before paying (the strategy-call form,
// /register); empty when the link was opened on another device.
function readBooking(): Record<string, unknown> {
  try {
    return JSON.parse(readSession("rpiansApplicationData") ?? "{}") ?? {};
  } catch {
    return {};
  }
}

// Name, WhatsApp, email and company from the booking (and the business
// answers too, after /register), for the visitor to check.
function prefilledValues(booking: Record<string, unknown>): Record<string, string> {
  return Object.fromEntries(
    QUESTIONS.map((question) => {
      const value = booking[question.id];

      return [
        question.id,
        typeof value === "string" || typeof value === "number"
          ? String(value)
          : "",
      ];
    }),
  );
}

function PageShell({ children }: { children: ReactNode }) {
  return (
    <main className="relative flex min-h-screen flex-col bg-white text-[#0f172a]">
      <SiteHeader />

      <div className="flex items-start justify-center px-6 pb-20 pt-32 md:pb-28 md:pt-40">
        <div className="w-full max-w-xl text-center">{children}</div>
      </div>

      <div className="flex flex-1 flex-col">
        <SiteFooter />
      </div>
    </main>
  );
}

// /application?payment=pay_…: the application form for a paid booking. No
// longer part of the booking flow (payment goes straight to /thank-you); kept
// for links customers already have. It opens only for a payment Razorpay
// confirms (or, if Razorpay can't be reached, the one this browser just
// paid); without a payment id it sends the visitor home. Submitting always
// continues to /thank-you, even if the answers couldn't be saved (that is
// logged).
export default function ApplicationForm() {
  const router = useRouter();
  const paymentId = useSearchParams().get("payment") ?? "";
  const hasPaymentId = RAZORPAY_PAYMENT_ID_PATTERN.test(paymentId);

  const [status, setStatus] = useState<Status>("checking");
  const [values, setValues] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!hasPaymentId) {
      router.replace("/");
      return;
    }

    let isCancelled = false;

    const checkPayment = async () => {
      const booking = readBooking();
      let paid: boolean | null = null;

      try {
        const response = await fetch(
          `/api/application?payment=${encodeURIComponent(paymentId)}`,
          { cache: "no-store" },
        );
        const result = await response.json();

        if (response.ok && result.success) {
          paid = result.paid === true;
        }
      } catch {
        // Checked below.
      }

      // Razorpay or the network is down: trust the receipt this browser
      // saved when it paid.
      if (paid === null) {
        const receipt = parsePaymentReceipt(
          readSession(PAYMENT_RECEIPT_STORAGE_KEY),
        );

        if (receipt?.paymentId === paymentId) {
          paid = true;
        }
      }

      if (isCancelled) return;

      setValues(prefilledValues(booking));
      setStatus(paid === true ? "ready" : paid === false ? "not-paid" : "unconfirmed");
    };

    checkPayment();

    return () => {
      isCancelled = true;
    };
  }, [hasPaymentId, paymentId, router]);

  const submitApplication = async (answers: Record<string, string>) => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), SUBMIT_TIMEOUT_MS);

    try {
      const response = await fetch("/api/application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentId,
          ...Object.fromEntries(
            CONTACT_QUESTIONS.map((question) => [question.id, answers[question.id]]),
          ),
          answers: Object.fromEntries(
            APPLICATION_QUESTIONS.map((question) => [question.id, answers[question.id]]),
          ),
        }),
        signal: controller.signal,
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        console.error("Application save error:", result.message);
      }
    } catch (error) {
      console.error("Application save error:", error);
    } finally {
      clearTimeout(timeout);
    }

    // replace, so Back doesn't return to the finished form.
    router.replace("/thank-you");
  };

  if (!hasPaymentId || status === "checking") {
    return (
      <PageShell>
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-black/10 border-t-[#3b82f6]" />

        <p className="mt-5 text-sm text-gray-500">Checking your payment...</p>
      </PageShell>
    );
  }

  if (status !== "ready") {
    const helpUrl = `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(
      `Hello RPIANS Team,\n\nI can't open my application form.\nPayment ID: ${paymentId}\n\nThank you.`,
    )}`;

    return (
      <PageShell>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#3b82f6]">
          Application Form
        </p>

        <h1 className="mt-3 font-serif text-3xl md:text-4xl">
          {status === "not-paid"
            ? "This form opens after your booking payment"
            : "We couldn't confirm your payment right now"}
        </h1>

        <p className="mt-4 font-medium leading-7 text-gray-600">
          {status === "not-paid"
            ? "This payment hasn't gone through. If you have paid, message us on WhatsApp with your Payment ID and we will help you."
            : "Please try again in a minute. If you have paid, message us on WhatsApp with your Payment ID and we will help you."}
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          {status === "not-paid" ? (
            <Link
              href="/"
              className="rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#2563eb] px-8 py-4 font-bold text-white! shadow-[0_15px_40px_rgba(37,99,235,0.25)] transition hover:scale-[1.02]"
            >
              Back to Home
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="cursor-pointer rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#2563eb] px-8 py-4 font-bold text-white shadow-[0_15px_40px_rgba(37,99,235,0.25)] transition hover:scale-[1.02]"
            >
              Try Again
            </button>
          )}

          <a
            href={helpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-[#1d4ed8]/40 px-8 py-4 font-semibold text-[#1e3a8a]! transition hover:bg-[#1d4ed8]/5"
          >
            Chat on WhatsApp
          </a>
        </div>
      </PageShell>
    );
  }

  return (
    <QuestionFlow
      questions={QUESTIONS}
      values={values}
      onChange={(id, value) =>
        setValues((current) => ({ ...current, [id]: value }))
      }
      onComplete={submitApplication}
      finishLabel="Submit Application"
      isSubmitting={isSubmitting}
      submittingText="Submitting your application..."
      notice={
        <p className="mb-8 inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-800 sm:text-sm">
          <span aria-hidden="true">✓</span>
          Payment received. One last step: your application.
        </p>
      }
    />
  );
}
