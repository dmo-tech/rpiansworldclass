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
  biggestChallenge: string;
  bookingAmount: number;
};

const PAYMENT_AMOUNT = 999;

/*
  IMPORTANT:
  नीचे अपना वास्तविक Razorpay या Instamojo payment-page link लगाइए।

  Example:
  https://rzp.io/l/your-payment-link
*/

const PAYMENT_LINK = "https://rzp.io/l/your-payment-link";

export default function PaymentPage() {
  const [applicationData, setApplicationData] =
    useState<ApplicationData | null>(null);

  const [isLoading, setIsLoading] = useState(true);

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

  const handlePayment = () => {
    if (PAYMENT_LINK.includes("PASTE_YOUR")) {
      alert(
        "Please add your real Razorpay or Instamojo payment link inside app/payment/page.tsx.",
      );
      return;
    }

    window.location.href = PAYMENT_LINK;
  };

  const whatsappMessage = encodeURIComponent(
    `Namaste RPIANS Team,

I have completed the application form.

Name: ${applicationData?.fullName ?? ""}
Company: ${applicationData?.companyName ?? ""}
Phone: ${applicationData?.phone ?? ""}
Business: ${applicationData?.businessCategory ?? ""}
Annual Turnover: ${applicationData?.annualTurnover ?? ""}

I am now on the ₹${PAYMENT_AMOUNT} payment page.`,
  );

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-[#d9a441]" />

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
        <div className="absolute inset-0 opacity-80 [background-image:linear-gradient(135deg,transparent_25%,rgba(217,164,65,0.08)_25%,rgba(217,164,65,0.08)_50%,transparent_50%,transparent_75%,rgba(217,164,65,0.08)_75%)] [background-size:180px_180px]" />
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
              <p className="text-2xl font-bold tracking-[0.28em] text-[#b67b20]">
                RPIANS
              </p>

              <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-gray-500">
                World Class Business Coaching
              </p>
            </div>
          </a>

          <p className="mt-12 text-sm font-semibold uppercase tracking-[0.25em] text-[#b67b20]">
            Strategic Business Diagnostic
          </p>

          <h1 className="mt-5 font-serif text-4xl leading-tight md:text-6xl">
            Complete Your Booking
            <span className="mt-2 block text-[#b67b20]">
              and Take the Next Step
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-gray-600">
            Your application has been received. Complete the ₹999 booking
            payment to confirm your Business Diagnostic session with the
            RPIANS team.
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
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#b67b20] text-sm font-bold text-white">
                  {index + 1}
                </span>

                <p className="pt-1 text-gray-700">{step}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-[#b67b20]/20 bg-white/70 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b67b20]">
              Contact Support
            </p>

            <p className="mt-3 text-gray-700">
              Call/WhatsApp:
              <a
                href="tel:+917389638105"
                className="ml-2 font-semibold text-[#9b6518]"
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
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b67b20]">
              Payment Details
            </p>

            <h2 className="mt-3 text-2xl font-bold">
              Business Diagnostic Booking
            </h2>
          </div>

          {applicationData ? (
            <div className="mt-7 space-y-5">
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
                  Full Name
                </p>

                <p className="mt-2 font-semibold">
                  {applicationData.fullName}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
                  Email
                </p>

                <p className="mt-2 break-all font-semibold">
                  {applicationData.email}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
                  Phone
                </p>

                <p className="mt-2 font-semibold">
                  {applicationData.phone}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
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
                <p className="text-sm text-gray-500">Booking Amount</p>

                <p className="mt-1 text-xs text-gray-400">
                  Inclusive of applicable taxes
                </p>
              </div>

              <p className="font-serif text-4xl font-bold text-[#b67b20]">
                ₹{PAYMENT_AMOUNT}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePayment}
            disabled={!applicationData}
            className="mt-7 w-full rounded-lg bg-gradient-to-r from-[#b67b20] via-[#f1c363] to-[#bd8126] px-7 py-4 font-bold text-black shadow-[0_15px_40px_rgba(182,123,32,0.25)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Pay ₹{PAYMENT_AMOUNT}
          </button>

          <a
            href={`https://wa.me/917389638105?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 block w-full rounded-lg border border-[#b67b20]/40 px-7 py-4 text-center font-semibold text-[#9b6518] transition hover:bg-[#b67b20]/5"
          >
            Contact Team on WhatsApp
          </a>

          <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-gray-400">
            <span>Secure Payment</span>
            <span>•</span>
            <span>Razorpay / UPI</span>
            <span>•</span>
            <span>SSL Protected</span>
          </div>

          <div className="mt-6 border-t border-black/10 pt-5 text-center">
            <a
              href="/#apply"
              className="text-sm font-medium text-gray-500 transition hover:text-[#b67b20]"
            >
              ← Edit application details
            </a>
          </div>
        </motion.section>
      </div>
    </main>
  );
}