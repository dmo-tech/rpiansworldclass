"use client";

import { motion } from "motion/react";
import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import EnquireNowTab from "../EnquireNowTab";
import { WHATSAPP_BASE_URL } from "../siteConfig";

/*
  IMPORTANT:
  Ye Login page abhi sirf UI/design placeholder hai — koi real backend,
  user database ya password reset service connected nahi hai. Jab real
  authentication system ready ho, "handleLogin" aur "handleReset" ke andar
  actual API calls add karni hongi.
*/

type Tab = "login" | "reset";

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());

const fieldClass =
  "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#1d4ed8] focus:ring-2 focus:ring-[#1d4ed8]/15";

function Required() {
  return (
    <span aria-hidden="true" className="text-red-600">
      *
    </span>
  );
}

function SignInIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-4 w-4"
    >
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <path d="m10 17 5-5-5-5" />
      <path d="M15 12H3" />
    </svg>
  );
}

export default function LoginPage() {
  const [tab, setTab] = useState<Tab>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [noticeMessage, setNoticeMessage] = useState("");

  const switchTab = (next: Tab) => {
    setTab(next);
    setErrorMessage("");
  };

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isEmail(email)) {
      setErrorMessage("Please enter your registered email address.");
      return;
    }

    if (!password.trim()) {
      setErrorMessage("Please enter your password.");
      return;
    }

    setErrorMessage("");
    setNoticeMessage(
      "Login is not active yet. Our team is setting this up — please contact us on WhatsApp for account access.",
    );
  };

  const handleReset = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isEmail(resetEmail)) {
      setErrorMessage("Please enter your registered email address.");
      return;
    }

    setErrorMessage("");
    setNoticeMessage(
      "Password reset is not active yet. Our team is setting this up — please contact us on WhatsApp and we will help you.",
    );
  };

  return (
    // Below sm the right padding leaves room for the Enquire Now tab, so it
    // never covers the card (a little tighter below 360px so the tabs fit).
    // The top padding keeps the card clear of "Back to website".
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white pb-12 pl-4 pr-12 pt-16 text-[#0f172a] max-[359px]:pl-3 max-[359px]:pr-11 sm:px-5 md:px-8">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#3b82f6]/10 blur-[170px]" />

      <Link
        href="/"
        className="absolute left-4 top-4 py-1 text-sm font-semibold text-gray-600! transition hover:text-[#1d4ed8]! max-[359px]:left-3 sm:left-6 sm:top-6 md:left-8"
      >
        ← Back to website
      </Link>

      <EnquireNowTab from="Login - Enquire Now" />

      <div className="relative w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-black/10 bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.12)] max-[359px]:p-4 sm:p-6 md:p-10"
        >
          <Link href="/" className="flex items-center justify-center gap-3">
            <Image
              src="/rpians-logo.png"
              alt="RPIANS logo"
              width={44}
              height={33}
              className="h-9 w-auto"
            />

            <div>
              <p className="text-xl font-bold tracking-[0.28em] text-[#3b82f6]">
                RPIANS
              </p>

              <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-gray-500">
                World Class Business Coaching
              </p>
            </div>
          </Link>

          <h1 className="mt-6 text-balance text-center text-[1.375rem] font-bold leading-snug sm:text-2xl md:text-[1.7rem]">
            <span className="block">Welcome to</span>{" "}
            <span className="block">
              Business Automation And Profit Mastery Program
            </span>
          </h1>

          <hr className="mt-6 border-black/10" />

          {noticeMessage ? (
            <div className="mt-6 text-center">
              <h2 className="text-xl font-bold">We&rsquo;ll Get You In Soon</h2>

              <p className="mt-3 leading-7 text-gray-600">{noticeMessage}</p>

              <a
                href={`${WHATSAPP_BASE_URL}?text=Namaste%20RPIANS%20Team%2C%20mujhe%20login%20access%20chahiye.`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 block w-full rounded-lg bg-[#1d4ed8] px-7 py-3.5 text-center font-bold text-white! transition hover:bg-[#1e40af]"
              >
                Contact Us on WhatsApp
              </a>

              <button
                type="button"
                onClick={() => setNoticeMessage("")}
                className="mt-3 block w-full rounded-lg border border-black/10 bg-gray-100 px-7 py-3.5 text-center font-semibold text-gray-700 transition hover:bg-gray-200"
              >
                Back to Login
              </button>
            </div>
          ) : (
            <>
              <div
                role="tablist"
                aria-label="Login options"
                className="mt-6 flex rounded-lg bg-gray-100 p-1"
              >
                {(
                  [
                    ["login", "Log in"],
                    ["reset", "Reset your password"],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    role="tab"
                    id={`tab-${value}`}
                    aria-selected={tab === value}
                    aria-controls={`panel-${value}`}
                    onClick={() => switchTab(value)}
                    className={`whitespace-nowrap rounded-md px-3 py-2.5 text-sm font-semibold transition max-[359px]:px-2.5 sm:px-4 ${
                      tab === value
                        ? "bg-[#1d4ed8] text-white shadow-sm"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {tab === "login" ? (
                <form
                  id="panel-login"
                  role="tabpanel"
                  aria-labelledby="tab-login"
                  onSubmit={handleLogin}
                  noValidate
                  className="mt-6 space-y-5"
                >
                  <div>
                    <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-gray-700">
                      Email address <Required />
                    </label>
                    <input
                      id="email"
                      type="email"
                      inputMode="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        setErrorMessage("");
                      }}
                      placeholder="you@company.com"
                      autoComplete="username"
                      required
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-gray-700">
                      Password <Required />
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        setErrorMessage("");
                      }}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                      className={fieldClass}
                    />
                  </div>

                  {errorMessage && (
                    <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700">
                      {errorMessage}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#1d4ed8] px-6 py-3 font-bold text-white transition hover:bg-[#1e40af]"
                  >
                    <SignInIcon />
                    Log in
                  </button>
                </form>
              ) : (
                <form
                  id="panel-reset"
                  role="tabpanel"
                  aria-labelledby="tab-reset"
                  onSubmit={handleReset}
                  noValidate
                  className="mt-6 space-y-5"
                >
                  <p className="text-sm leading-6 text-gray-600">
                    Enter the email address you use for your account and we
                    will help you reset your password.
                  </p>

                  <div>
                    <label htmlFor="reset-email" className="mb-1.5 block text-sm font-semibold text-gray-700">
                      Email address <Required />
                    </label>
                    <input
                      id="reset-email"
                      type="email"
                      inputMode="email"
                      value={resetEmail}
                      onChange={(event) => {
                        setResetEmail(event.target.value);
                        setErrorMessage("");
                      }}
                      placeholder="you@company.com"
                      autoComplete="email"
                      required
                      className={fieldClass}
                    />
                  </div>

                  {errorMessage && (
                    <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700">
                      {errorMessage}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#1d4ed8] px-6 py-3 font-bold text-white transition hover:bg-[#1e40af]"
                  >
                    Send reset link
                  </button>
                </form>
              )}
            </>
          )}
        </motion.div>
      </div>
    </main>
  );
}
