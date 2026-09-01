"use client";

import { AnimatePresence, motion } from "motion/react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type RegistrationData = {
  fullName: string;
  phone: string;
  email: string;
  companyName: string;
  businessCategory: string;
  annualTurnover: string;
  employeeCount: string;
  biggestChallenge: string;
};

const initialData: RegistrationData = {
  fullName: "",
  phone: "",
  email: "",
  companyName: "",
  businessCategory: "",
  annualTurnover: "",
  employeeCount: "",
  biggestChallenge: "",
};

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] =
    useState<RegistrationData>(initialData);

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (
    field: keyof RegistrationData,
    value: string,
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    setErrorMessage("");
  };

  const validateForm = () => {
    const cleanPhone = formData.phone.replace(/\D/g, "");

    if (!formData.fullName.trim()) {
      return "Please enter your full name.";
    }

    if (cleanPhone.length < 10) {
      return "Please enter a valid WhatsApp number.";
    }

    if (!formData.email.trim()) {
      return "Please enter your email address.";
    }

    if (!formData.companyName.trim()) {
      return "Please enter your company name.";
    }

    if (!formData.businessCategory) {
      return "Please select your business category.";
    }

    if (!formData.annualTurnover) {
      return "Please select your annual turnover.";
    }

    if (!formData.employeeCount.trim()) {
      return "Please enter the number of employees.";
    }

    if (!formData.biggestChallenge.trim()) {
      return "Please enter your biggest business challenge.";
    }

    return "";
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const applicationData = {
      ...formData,
      bookingAmount: 999,
      submittedAt: new Date().toISOString(),
      source: "RPIANS Website",
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(applicationData),
      });

      let result: {
        success?: boolean;
        message?: string;
      };

      try {
        result = await response.json();
      } catch {
        throw new Error(
          "Server returned an invalid response. Please try again.",
        );
      }

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Your application could not be saved.",
        );
      }

      sessionStorage.setItem(
        "rpiansApplicationData",
        JSON.stringify(applicationData),
      );

      router.push("/payment");
    } catch (error) {
      console.error("Form submission error:", error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Your form could not be submitted. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-5 py-12 text-white md:px-8">
      {/* BACKGROUND EFFECT */}

      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#d9a441]/10 blur-[170px]" />

      <div className="relative mx-auto max-w-6xl">
        {/* HEADER */}

        <header className="flex items-center justify-between border-b border-white/10 pb-6">
          <a href="/">
            <p className="text-xl font-bold tracking-[0.28em] text-[#d9a441]">
              RPIANS
            </p>

            <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-gray-500">
              World Class Business Coaching
            </p>
          </a>

          <a
            href="/"
            className="rounded-lg border border-[#d9a441]/35 px-5 py-3 text-sm font-semibold text-[#edc66d] transition hover:bg-[#d9a441]/10"
          >
            Back to Website
          </a>
        </header>

        <div className="grid items-start gap-12 py-14 lg:grid-cols-[0.85fr_1.15fr] lg:py-20">
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
            className="lg:sticky lg:top-10"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#d9a441]">
              Business Diagnostic Application
            </p>

            <h1 className="mt-6 font-serif text-4xl leading-tight md:text-6xl">
              Apply to Work

              <span className="mt-2 block text-[#e0ad4d]">
                With RPIANS
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-gray-400">
              Complete this application to help our team understand your
              business, current challenges and growth goals.
            </p>

            <div className="mt-10 space-y-5">
              {[
                "Share your business details",
                "Complete ₹999 booking payment",
                "Application reviewed by RPIANS team",
                "Receive confirmation on WhatsApp",
              ].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{
                    opacity: 0,
                    x: -25,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: 0.2 + index * 0.1,
                  }}
                  className="flex items-start gap-4"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#d9a441]/40 bg-[#d9a441]/10 font-bold text-[#f1c363]">
                    {index + 1}
                  </span>

                  <p className="pt-2 text-gray-300">
                    {item}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 rounded-2xl border border-[#d9a441]/20 bg-[#d9a441]/5 p-6">
              <p className="text-sm font-semibold text-[#edc66d]">
                Booking Amount
              </p>

              <p className="mt-2 font-serif text-4xl font-bold">
                ₹999
              </p>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Your form response will be saved in the RPIANS Google
                Sheet. After submission, you will be redirected to the
                payment details page.
              </p>
            </div>
          </motion.section>

          {/* APPLICATION FORM */}

          <motion.section
            initial={{
              opacity: 0,
              x: 50,
              y: 30,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.85,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="rounded-3xl border border-[#d9a441]/30 bg-white/[0.04] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.55)] backdrop-blur md:p-10"
          >
            <div className="border-b border-white/10 pb-7">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#d9a441]">
                Step 1 of 2
              </p>

              <h2 className="mt-3 text-2xl font-bold md:text-3xl">
                Enter Your Business Details
              </h2>

              <p className="mt-3 text-gray-500">
                Fields marked with * are required.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-8"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-sm text-gray-300"
                  >
                    Full Name *
                  </label>

                  <input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(event) =>
                      updateField(
                        "fullName",
                        event.target.value,
                      )
                    }
                    placeholder="Enter your full name"
                    autoComplete="name"
                    className="w-full rounded-xl border border-white/10 bg-black/70 px-4 py-4 outline-none transition placeholder:text-gray-600 focus:border-[#d9a441]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm text-gray-300"
                  >
                    WhatsApp Number *
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(event) =>
                      updateField(
                        "phone",
                        event.target.value,
                      )
                    }
                    placeholder="+91 98765 43210"
                    autoComplete="tel"
                    className="w-full rounded-xl border border-white/10 bg-black/70 px-4 py-4 outline-none transition placeholder:text-gray-600 focus:border-[#d9a441]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm text-gray-300"
                  >
                    Email Address *
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(event) =>
                      updateField(
                        "email",
                        event.target.value,
                      )
                    }
                    placeholder="name@company.com"
                    autoComplete="email"
                    className="w-full rounded-xl border border-white/10 bg-black/70 px-4 py-4 outline-none transition placeholder:text-gray-600 focus:border-[#d9a441]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="companyName"
                    className="mb-2 block text-sm text-gray-300"
                  >
                    Company Name *
                  </label>

                  <input
                    id="companyName"
                    type="text"
                    value={formData.companyName}
                    onChange={(event) =>
                      updateField(
                        "companyName",
                        event.target.value,
                      )
                    }
                    placeholder="Enter company name"
                    autoComplete="organization"
                    className="w-full rounded-xl border border-white/10 bg-black/70 px-4 py-4 outline-none transition placeholder:text-gray-600 focus:border-[#d9a441]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="businessCategory"
                    className="mb-2 block text-sm text-gray-300"
                  >
                    Business Category *
                  </label>

                  <select
                    id="businessCategory"
                    value={formData.businessCategory}
                    onChange={(event) =>
                      updateField(
                        "businessCategory",
                        event.target.value,
                      )
                    }
                    className="w-full rounded-xl border border-white/10 bg-black px-4 py-4 outline-none transition focus:border-[#d9a441]"
                  >
                    <option value="">
                      Select category
                    </option>

                    <option value="Retail">
                      Retail
                    </option>

                    <option value="Wholesale">
                      Wholesale
                    </option>

                    <option value="Distribution">
                      Distribution
                    </option>

                    <option value="Manufacturing">
                      Manufacturing
                    </option>

                    <option value="Service Business">
                      Service Business
                    </option>

                    <option value="Construction / Project">
                      Construction / Project
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="annualTurnover"
                    className="mb-2 block text-sm text-gray-300"
                  >
                    Annual Turnover *
                  </label>

                  <select
                    id="annualTurnover"
                    value={formData.annualTurnover}
                    onChange={(event) =>
                      updateField(
                        "annualTurnover",
                        event.target.value,
                      )
                    }
                    className="w-full rounded-xl border border-white/10 bg-black px-4 py-4 outline-none transition focus:border-[#d9a441]"
                  >
                    <option value="">
                      Select turnover
                    </option>

                    <option value="Below ₹1 Crore">
                      Below ₹1 Crore
                    </option>

                    <option value="₹1–5 Crore">
                      ₹1–5 Crore
                    </option>

                    <option value="₹5–10 Crore">
                      ₹5–10 Crore
                    </option>

                    <option value="₹10–25 Crore">
                      ₹10–25 Crore
                    </option>

                    <option value="₹25–50 Crore">
                      ₹25–50 Crore
                    </option>

                    <option value="₹50 Crore+">
                      ₹50 Crore+
                    </option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="employeeCount"
                    className="mb-2 block text-sm text-gray-300"
                  >
                    Number of Employees *
                  </label>

                  <input
                    id="employeeCount"
                    type="number"
                    min="0"
                    value={formData.employeeCount}
                    onChange={(event) =>
                      updateField(
                        "employeeCount",
                        event.target.value,
                      )
                    }
                    placeholder="Enter number of employees"
                    className="w-full rounded-xl border border-white/10 bg-black/70 px-4 py-4 outline-none transition placeholder:text-gray-600 focus:border-[#d9a441]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="biggestChallenge"
                    className="mb-2 block text-sm text-gray-300"
                  >
                    Biggest Business Challenge *
                  </label>

                  <textarea
                    id="biggestChallenge"
                    value={formData.biggestChallenge}
                    onChange={(event) =>
                      updateField(
                        "biggestChallenge",
                        event.target.value,
                      )
                    }
                    rows={4}
                    placeholder="Team accountability, inventory, cash flow, owner dependency..."
                    className="w-full resize-none rounded-xl border border-white/10 bg-black/70 px-4 py-4 outline-none transition placeholder:text-gray-600 focus:border-[#d9a441]"
                  />
                </div>
              </div>

              <AnimatePresence>
                {errorMessage && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: -8,
                    }}
                    className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                  >
                    {errorMessage}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={
                  isSubmitting
                    ? undefined
                    : {
                        scale: 1.015,
                      }
                }
                whileTap={
                  isSubmitting
                    ? undefined
                    : {
                        scale: 0.98,
                      }
                }
                className="mt-7 w-full rounded-xl bg-gradient-to-r from-[#b67b20] via-[#f1c363] to-[#bd8126] px-7 py-4 font-bold text-black shadow-[0_15px_50px_rgba(217,164,65,0.22)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? "Saving Your Application..."
                  : "Continue to Payment Details"}
              </motion.button>

              <p className="mt-4 text-center text-xs leading-6 text-gray-500">
                By continuing, you agree to our Terms and Conditions,
                Privacy Policy and Refund Policy.
              </p>
            </form>
          </motion.section>
        </div>
      </div>
    </main>
  );
}