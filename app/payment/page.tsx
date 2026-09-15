"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import Image from "next/image";

type ApplicationData = {
  fullName: string;
  phone: string;
  email: string;
  companyName: string;
  businessCategory: string;
  annualTurnover: string;
  planSelected?: string;
  bookingAmount: number | null;
  gstApplicable?: boolean;
};

const DEFAULT_PAYMENT_AMOUNT = 999;

type RazorpayPaymentResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  handler: (response: RazorpayPaymentResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
};

type RazorpayInstance = {
  open: () => void;
  on: (event: "payment.failed", handler: (response: unknown) => void) => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

const RAZORPAY_CHECKOUT_SCRIPT_ID = "razorpay-checkout-js";
const RAZORPAY_CHECKOUT_SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.getElementById(
      RAZORPAY_CHECKOUT_SCRIPT_ID,
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true));
      existingScript.addEventListener("error", () => resolve(false));
      return;
    }

    const script = document.createElement("script");
    script.id = RAZORPAY_CHECKOUT_SCRIPT_ID;
    script.src = RAZORPAY_CHECKOUT_SCRIPT_SRC;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function PaymentPage() {
  const [applicationData, setApplicationData] =
    useState<ApplicationData | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");

  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    const savedData = sessionStorage.getItem("rpiansApplicationData");

    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData) as ApplicationData;
        setApplicationData(parsedData);
      } catch {
        setApplicationData(null);
      }
    }

    setIsLoading(false);
  }, []);

  const paymentAmount = applicationData
    ? applicationData.bookingAmount
    : DEFAULT_PAYMENT_AMOUNT;

  const formattedPaymentAmount =
    paymentAmount != null
      ? `₹${paymentAmount.toLocaleString("en-IN")}${
          applicationData?.gstApplicable ? " + GST" : ""
        }`
      : null;

  const handlePayment = async () => {
    if (!applicationData || paymentAmount == null) return;

    setPaymentStatus("processing");
    setPaymentError(null);

    const scriptLoaded = await loadRazorpayScript();

    if (!scriptLoaded || !window.Razorpay) {
      setPaymentStatus("error");
      setPaymentError(
        "Could not load Razorpay checkout. Please check your connection and try again.",
      );
      return;
    }

    try {
      const orderResponse = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: paymentAmount,
          customer: {
            fullName: applicationData.fullName,
            email: applicationData.email,
            phone: applicationData.phone,
            companyName: applicationData.companyName,
          },
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok || !orderData.success) {
        throw new Error(orderData.message || "Could not create payment order.");
      }

      const razorpay = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: "RPIANS — World Class Business Coaching",
        description: applicationData.planSelected
          ? `${applicationData.planSelected} — Booking Payment`
          : "Business Diagnostic Booking",
        prefill: {
          name: applicationData.fullName,
          email: applicationData.email,
          contact: applicationData.phone,
        },
        theme: {
          color: "#1e3a8a",
        },
        handler: async (response) => {
          try {
            const verifyResponse = await fetch(
              "/api/razorpay/verify-payment",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(response),
              },
            );

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok || !verifyData.success) {
              throw new Error(
                verifyData.message || "Payment verification failed.",
              );
            }

            setPaymentStatus("success");
          } catch (error) {
            setPaymentStatus("error");
            setPaymentError(
              error instanceof Error
                ? error.message
                : "Payment verification failed.",
            );
          }
        },
        modal: {
          ondismiss: () => {
            setPaymentStatus((current) =>
              current === "processing" ? "idle" : current,
            );
          },
        },
      });

      razorpay.on("payment.failed", () => {
        setPaymentStatus("error");
        setPaymentError("Payment failed. Please try again.");
      });

      razorpay.open();
    } catch (error) {
      setPaymentStatus("error");
      setPaymentError(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Namaste RPIANS Team,

I have completed the application form.

Name: ${applicationData?.fullName ?? ""}
Company: ${applicationData?.companyName ?? ""}
Phone: ${applicationData?.phone ?? ""}
Business: ${applicationData?.businessCategory ?? ""}
Annual Turnover: ${applicationData?.annualTurnover ?? ""}
Plan Selected: ${applicationData?.planSelected ?? ""}

${
  paymentAmount != null
    ? `I am now on the ${formattedPaymentAmount} payment page.`
    : "I have selected a custom-pricing plan and would like to discuss the details."
}`,
  );

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white text-[#0f172a]">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-black/10 border-t-[#3b82f6]" />

          <p className="mt-5 text-sm text-gray-500">
            Loading payment details...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f4f1e9] text-[#171717]">
      {/* Background pattern */}

      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[34%] bg-[#1b1b1b] lg:block">
        <div className="absolute inset-0 opacity-80 [background-image:linear-gradient(135deg,transparent_25%,rgba(59,130,246,0.08)_25%,rgba(59,130,246,0.08)_50%,transparent_50%,transparent_75%,rgba(59,130,246,0.08)_75%)] [background-size:180px_180px]" />
      </div>

      <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-[1fr_0.8fr] lg:px-10">
        {/* LEFT CONTENT */}

        <motion.section
          initial={{
            opacity: 0,
            x: -50,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="max-w-2xl"
        >
          <a href="/" className="inline-flex items-center gap-3">
            <Image
              src="/rpians-logo.png"
              alt="RPIANS logo"
              width={44}
              height={33}
              className="h-9 w-auto"
            />

            <div>
              <p className="text-2xl font-bold tracking-[0.28em] text-[#1d4ed8]">
                RPIANS
              </p>

              <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-gray-500">
                World Class Business Coaching
              </p>
            </div>
          </a>

          <p className="mt-12 text-sm font-semibold uppercase tracking-[0.25em] text-[#1d4ed8]">
            Strategic Business Diagnostic
          </p>

          <h1 className="mt-5 font-serif text-4xl leading-tight md:text-6xl">
            Complete Your Booking
            <span className="mt-2 block text-[#1d4ed8]">
              and Take the Next Step
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-gray-600">
            {paymentAmount != null
              ? `Your application has been received. Complete the ${formattedPaymentAmount} booking payment to confirm your Business Diagnostic session with the RPIANS team.`
              : "Your application has been received. Our team will contact you to discuss pricing and confirm your Business Diagnostic session."}
          </p>

          <div className="mt-10 space-y-5">
            {[
              "Complete the secure booking payment",
              "Our team will review your application",
              "You will receive confirmation on WhatsApp",
              "Selected business owners will receive the diagnostic schedule",
            ].map((step, index) => (
              <motion.div
                key={step}
                initial={{
                  opacity: 0,
                  x: -20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.25 + index * 0.1,
                }}
                className="flex items-start gap-4"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1d4ed8] text-sm font-bold text-white">
                  {index + 1}
                </span>

                <p className="pt-1 text-gray-700">{step}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-[#1d4ed8]/20 bg-white/70 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1d4ed8]">
              Contact Support
            </p>

            <p className="mt-3 text-gray-700">
              Call/WhatsApp:
              <a
                href="tel:+917389638105"
                className="ml-2 font-semibold text-[#1e3a8a]"
              >
                +91 73896 38105
              </a>
            </p>
          </div>
        </motion.section>

        {/* PAYMENT CARD */}

        <motion.section
          initial={{
            opacity: 0,
            x: 50,
            y: 30,
            scale: 0.95,
          }}
          animate={{
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.85,
            delay: 0.15,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative z-10 rounded-2xl border border-black/10 bg-white p-7 shadow-[0_30px_100px_rgba(0,0,0,0.2)] md:p-9"
        >
          <div className="border-b border-black/10 pb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#3b82f6]">
              Step 3 of 3
            </p>

            <p className="mt-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#1d4ed8]">
              Payment Details
            </p>

            <h2 className="mt-3 text-2xl font-bold">
              Business Diagnostic Booking
            </h2>
          </div>

          {applicationData ? (
            <div className="mt-7 space-y-5">
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-gray-600">
                  Full Name
                </p>

                <p className="mt-2 font-semibold">
                  {applicationData.fullName}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-gray-600">
                  Email
                </p>

                <p className="mt-2 break-all font-semibold">
                  {applicationData.email}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-gray-600">
                  Phone
                </p>

                <p className="mt-2 font-semibold">
                  {applicationData.phone}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-gray-600">
                  Company
                </p>

                <p className="mt-2 font-semibold">
                  {applicationData.companyName}
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-7 rounded-xl border border-orange-300 bg-orange-50 p-4 text-sm text-orange-800">
              Application information was not found. Please complete the
              application form first.
            </div>
          )}

          <div className="mt-8 border-y border-black/10 py-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {applicationData?.planSelected
                    ? `${applicationData.planSelected} — Booking Amount`
                    : "Booking Amount"}
                </p>

                <p className="mt-1 text-xs text-gray-600">
                  {paymentAmount != null
                    ? "Inclusive of applicable taxes"
                    : "Our team will share pricing on a call"}
                </p>
              </div>

              <p className="font-serif text-4xl font-bold text-[#1d4ed8]">
                {formattedPaymentAmount ?? "Custom"}
              </p>
            </div>
          </div>

          {paymentStatus === "success" ? (
            <div className="mt-7 rounded-xl border border-green-300 bg-green-50 p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-2xl text-green-600">
                ✓
              </div>

              <p className="mt-4 text-lg font-bold text-green-800">
                Payment Successful
              </p>

              <p className="mt-2 text-sm text-green-700">
                Your booking payment of {formattedPaymentAmount} has been
                confirmed. Our team will reach out to you shortly.
              </p>

              {/* TODO: Trigger WhatsApp booking confirmation message here once that integration is ready. */}
            </div>
          ) : paymentAmount != null ? (
            <>
              <button
                type="button"
                onClick={handlePayment}
                disabled={!applicationData || paymentStatus === "processing"}
                className="mt-7 w-full rounded-lg bg-gradient-to-r from-[#1d4ed8] to-[#1e3a8a] px-7 py-4 font-bold text-white shadow-[0_15px_40px_rgba(34,197,94,0.25)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {paymentStatus === "processing"
                  ? "Processing..."
                  : `Pay ${formattedPaymentAmount}`}
              </button>

              {paymentStatus === "error" && paymentError ? (
                <p className="mt-3 text-center text-sm text-red-600">
                  {paymentError}
                </p>
              ) : null}

              <a
                href={`https://wa.me/917389638105?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block w-full rounded-lg border border-[#1d4ed8]/40 px-7 py-4 text-center font-semibold text-[#1e3a8a] transition hover:bg-[#1d4ed8]/5"
              >
                Contact Team on WhatsApp
              </a>
            </>
          ) : (
            <a
              href={`https://wa.me/917389638105?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 block w-full rounded-lg bg-gradient-to-r from-[#1d4ed8] to-[#1e3a8a] px-7 py-4 text-center font-bold text-white shadow-[0_15px_40px_rgba(34,197,94,0.25)] transition hover:scale-[1.02]"
            >
              Talk to Our Team on WhatsApp
            </a>
          )}

          <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-gray-600">
            <span>Secure Payment</span>
            <span>•</span>
            <span>Razorpay / UPI</span>
            <span>•</span>
            <span>SSL Protected</span>
          </div>

          <div className="mt-6 border-t border-black/10 pt-5 text-center">
            <a
              href="/#apply"
              className="text-sm font-medium text-gray-500 transition hover:text-[#1d4ed8]"
            >
              ← Edit application details
            </a>
          </div>
        </motion.section>
      </div>
    </main>
  );
}