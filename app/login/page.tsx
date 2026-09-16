"use client";

import { AnimatePresence, motion } from "motion/react";
import { FormEvent, useState } from "react";
import Image from "next/image";

/*
  IMPORTANT:
  Ye Login page abhi sirf UI/design placeholder hai — koi real backend,
  user database ya OTP bhejne wala service (SMS/email) connected nahi hai.
  Jab real authentication system ready ho, "handleSendOtp" aur
  "handleVerifyOtp" ke andar actual API calls add karni hongi.
*/

export default function LoginPage() {
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [noticeMessage, setNoticeMessage] = useState("");

  const handleSendOtp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!loginId.trim()) {
      setErrorMessage("Please enter your registered email or phone number.");
      return;
    }

    if (!password.trim()) {
      setErrorMessage("Please enter your password.");
      return;
    }

    setErrorMessage("");
    setStep("otp");
  };

  const handleVerifyOtp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (otp.trim().length < 4) {
      setErrorMessage("Please enter the OTP sent to you.");
      return;
    }

    setErrorMessage("");
    setNoticeMessage(
      "Login is not active yet. Our team is setting this up — please contact us on WhatsApp for account access.",
    );
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-5 py-12 text-[#0f172a] md:px-8">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#3b82f6]/10 blur-[170px]" />

      <div className="relative w-full max-w-md">
        <a href="/" className="mb-10 flex items-center justify-center gap-3">
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
        </a>

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
            scale: 0.97,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="rounded-3xl border border-[#3b82f6]/30 bg-black/[0.04] p-7 shadow-[0_30px_100px_rgba(0,0,0,0.2)] backdrop-blur md:p-10"
        >
          {noticeMessage ? (
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#3b82f6]">
                Login
              </p>

              <h1 className="mt-3 text-2xl font-bold">
                We&rsquo;ll Get You In Soon
              </h1>

              <p className="mt-4 leading-7 text-gray-600">
                {noticeMessage}
              </p>

              <a
                href="https://wa.me/917389638105?text=Namaste%20RPIANS%20Team%2C%20mujhe%20login%20access%20chahiye."
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 block w-full rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#2563eb] px-7 py-4 text-center font-bold text-white transition hover:scale-[1.02]"
              >
                Contact Us on WhatsApp
              </a>

              <a
                href="/"
                className="mt-4 block w-full rounded-lg border border-[#3b82f6]/35 px-7 py-4 text-center font-semibold text-[#1d4ed8] transition hover:bg-[#3b82f6]/10"
              >
                Back to Website
              </a>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {step === "credentials" ? (
                <motion.div
                  key="credentials"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#3b82f6]">
                    Login
                  </p>

                  <h1 className="mt-3 text-2xl font-bold md:text-3xl">
                    Login to Your Account
                  </h1>

                  <p className="mt-3 text-gray-500">
                    Enter your ID and password to continue.
                  </p>

                  <form onSubmit={handleSendOtp} className="mt-8 space-y-5">
                    <div>
                      <label
                        htmlFor="loginId"
                        className="mb-2 block text-sm text-gray-600"
                      >
                        Email or Phone Number
                      </label>

                      <input
                        id="loginId"
                        type="text"
                        value={loginId}
                        onChange={(event) => {
                          setLoginId(event.target.value);
                          setErrorMessage("");
                        }}
                        placeholder="you@company.com"
                        autoComplete="username"
                        autoFocus
                        className="w-full rounded-xl border border-black/10 bg-white/70 px-4 py-4 outline-none transition placeholder:text-gray-400 focus:border-[#3b82f6]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="password"
                        className="mb-2 block text-sm text-gray-600"
                      >
                        Password
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
                        className="w-full rounded-xl border border-black/10 bg-white/70 px-4 py-4 outline-none transition placeholder:text-gray-400 focus:border-[#3b82f6]"
                      />
                    </div>

                    <AnimatePresence>
                      {errorMessage && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700"
                        >
                          {errorMessage}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#2563eb] px-7 py-4 font-bold text-white shadow-[0_15px_50px_rgba(34,197,94,0.22)]"
                    >
                      Send OTP
                    </motion.button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#3b82f6]">
                    Verify OTP
                  </p>

                  <h1 className="mt-3 text-2xl font-bold md:text-3xl">
                    Enter OTP
                  </h1>

                  <p className="mt-3 text-gray-500">
                    We&rsquo;ve sent a one-time password to {loginId || "your registered ID"}.
                  </p>

                  <form onSubmit={handleVerifyOtp} className="mt-8 space-y-5">
                    <div>
                      <label
                        htmlFor="otp"
                        className="mb-2 block text-sm text-gray-600"
                      >
                        One-Time Password
                      </label>

                      <input
                        id="otp"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={otp}
                        onChange={(event) => {
                          setOtp(event.target.value.replace(/\D/g, ""));
                          setErrorMessage("");
                        }}
                        placeholder="Enter OTP"
                        autoFocus
                        className="w-full rounded-xl border border-black/10 bg-white/70 px-4 py-4 text-center text-2xl tracking-[0.5em] outline-none transition placeholder:text-sm placeholder:tracking-normal placeholder:text-gray-400 focus:border-[#3b82f6]"
                      />
                    </div>

                    <AnimatePresence>
                      {errorMessage && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700"
                        >
                          {errorMessage}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#2563eb] px-7 py-4 font-bold text-white shadow-[0_15px_50px_rgba(34,197,94,0.22)]"
                    >
                      Verify &amp; Login
                    </motion.button>

                    <div className="flex items-center justify-between text-sm">
                      <button
                        type="button"
                        onClick={() => {
                          setStep("credentials");
                          setErrorMessage("");
                        }}
                        className="font-semibold text-gray-500 transition hover:text-[#1d4ed8]"
                      >
                        ← Back
                      </button>

                      <button
                        type="button"
                        onClick={() => setOtp("")}
                        className="font-semibold text-[#1d4ed8] transition hover:text-[#1e3a8a]"
                      >
                        Resend OTP
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </main>
  );
}
