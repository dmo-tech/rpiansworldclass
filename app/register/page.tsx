"use client";

import { AnimatePresence, motion } from "motion/react";
import { FormEvent, Suspense, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

type Plan = {
  id: string;
  label: string;
  description: string;
  amount: number | null;
};

const plans: Plan[] = [
  {
    id: "day-1",
    label: "Day 1",
    description:
      "A focused one-day session to fix your biggest business bottleneck.",
    amount: 999,
  },
  {
    id: "1-month",
    label: "1 Month",
    description:
      "Implement core business systems in one month with weekly reviews.",
    amount: 9999,
  },
  {
    id: "10-month",
    label: "10 Month",
    description:
      "A complete business transformation mentorship journey.",
    amount: null,
  },
];

type RegistrationData = {
  fullName: string;
  phone: string;
  email: string;
  companyName: string;
  businessCategory: string;
  annualTurnover: string;
  employeeCount: string;
};

const initialData: RegistrationData = {
  fullName: "",
  phone: "",
  email: "",
  companyName: "",
  businessCategory: "",
  annualTurnover: "",
  employeeCount: "",
};

type BusinessField =
  | {
      id: keyof RegistrationData;
      label: string;
      kind: "input";
      type: "text" | "tel" | "email" | "number";
      placeholder: string;
      autoComplete?: string;
    }
  | {
      id: keyof RegistrationData;
      label: string;
      kind: "select";
      options: string[];
    };

const businessFields: BusinessField[] = [
  {
    id: "fullName",
    label: "Full Name",
    kind: "input",
    type: "text",
    placeholder: "Enter your full name",
    autoComplete: "name",
  },
  {
    id: "phone",
    label: "WhatsApp Number",
    kind: "input",
    type: "tel",
    placeholder: "+91 98765 43210",
    autoComplete: "tel",
  },
  {
    id: "email",
    label: "Email Address",
    kind: "input",
    type: "email",
    placeholder: "name@company.com",
    autoComplete: "email",
  },
  {
    id: "companyName",
    label: "Company Name",
    kind: "input",
    type: "text",
    placeholder: "Enter company name",
    autoComplete: "organization",
  },
  {
    id: "businessCategory",
    label: "Business Category",
    kind: "select",
    options: [
      "Retail",
      "Wholesale",
      "Distribution",
      "Manufacturing",
      "Service Business",
      "Construction / Project",
      "Other",
    ],
  },
  {
    id: "annualTurnover",
    label: "Annual Turnover",
    kind: "select",
    options: [
      "Below ₹1 Crore",
      "₹1–5 Crore",
      "₹5–10 Crore",
      "₹10–25 Crore",
      "₹25–50 Crore",
      "₹50 Crore+",
    ],
  },
  {
    id: "employeeCount",
    label: "Number of Employees",
    kind: "input",
    type: "number",
    placeholder: "Enter number of employees",
  },
];

function validateField(field: BusinessField, value: string): string {
  if (field.id === "phone") {
    const cleanPhone = value.replace(/\D/g, "");

    if (cleanPhone.length < 10) {
      return "Please enter a valid WhatsApp number.";
    }

    return "";
  }

  if (!value.trim()) {
    return `Please enter your ${field.label.toLowerCase()}.`;
  }

  if (field.id === "email" && !value.includes("@")) {
    return "Please enter a valid email address.";
  }

  return "";
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const planFromQuery = plans.find(
    (plan) => plan.id === searchParams.get("plan"),
  );

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(
    planFromQuery?.id ?? null,
  );
  const [planError, setPlanError] = useState("");

  const selectedPlan =
    plans.find((plan) => plan.id === selectedPlanId) ?? null;

  const [formData, setFormData] =
    useState<RegistrationData>(initialData);

  const [fieldIndex, setFieldIndex] = useState(0);
  const [fieldError, setFieldError] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentField = businessFields[fieldIndex];
  const isLastField = fieldIndex === businessFields.length - 1;

  const updateField = (
    field: keyof RegistrationData,
    value: string,
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    setFieldError("");
  };

  const handleContinueFromPlan = () => {
    if (!selectedPlanId) {
      setPlanError("Please select a plan to continue.");
      return;
    }

    setPlanError("");
    setStep(2);
  };

  const submitApplication = async (data: RegistrationData) => {
    setIsSubmitting(true);
    setErrorMessage("");

    const applicationData = {
      ...data,
      planSelected: selectedPlan?.label ?? "",
      bookingAmount: selectedPlan?.amount ?? null,
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
      setIsSubmitting(false);
    }
  };

  const advanceField = (valueOverride?: string) => {
    const value = valueOverride ?? formData[currentField.id];
    const error = validateField(currentField, value);

    if (error) {
      setFieldError(error);
      return;
    }

    setFieldError("");

    const updatedData =
      valueOverride !== undefined
        ? { ...formData, [currentField.id]: valueOverride }
        : formData;

    if (valueOverride !== undefined) {
      setFormData(updatedData);
    }

    if (isLastField) {
      void submitApplication(updatedData);
    } else {
      setFieldIndex((current) => current + 1);
    }
  };

  const goBackField = () => {
    setFieldError("");

    if (fieldIndex === 0) {
      setStep(1);
    } else {
      setFieldIndex((current) => current - 1);
    }
  };

  const handleFieldSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    advanceField();
  };

  const paymentStepLabel =
    selectedPlan?.amount != null
      ? `Complete ₹${selectedPlan.amount} booking payment`
      : "Discuss custom pricing with our team";

  return (
    <main className="relative min-h-screen overflow-hidden bg-white px-5 py-12 text-[#0f172a] md:px-8">
      {/* BACKGROUND EFFECT */}

      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#3b82f6]/10 blur-[170px]" />

      <div className="relative mx-auto max-w-6xl">
        {/* HEADER */}

        <header className="flex items-center justify-between border-b border-black/10 pb-6">
          <a href="/" className="flex items-center gap-3">
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

          <a
            href="/"
            className="rounded-lg border border-[#3b82f6]/35 px-5 py-3 text-sm font-semibold text-[#1d4ed8] transition hover:bg-[#3b82f6]/10"
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
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#3b82f6]">
              Business Diagnostic Application
            </p>

            <h1 className="mt-6 font-serif text-4xl leading-tight md:text-6xl">
              Apply to Work

              <span className="mt-2 block text-[#1d4ed8]">
                With RPIANS
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-gray-600">
              Complete this application to help our team understand your
              business, current challenges and growth goals.
            </p>

            <div className="mt-10 space-y-5">
              {[
                "Select your plan",
                "Share your business details",
                paymentStepLabel,
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
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#3b82f6]/40 bg-[#3b82f6]/10 font-bold text-[#22c55e]">
                    {index + 1}
                  </span>

                  <p className="pt-2 text-gray-600">
                    {item}
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 rounded-2xl border border-[#3b82f6]/20 bg-[#3b82f6]/5 p-6">
              <p className="text-sm font-semibold text-[#1d4ed8]">
                {selectedPlan ? `${selectedPlan.label} — Booking Amount` : "Booking Amount"}
              </p>

              <p className="mt-2 font-serif text-4xl font-bold">
                {selectedPlan
                  ? selectedPlan.amount != null
                    ? `₹${selectedPlan.amount}`
                    : "Custom"
                  : "Select a plan"}
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
            className="rounded-3xl border border-[#3b82f6]/30 bg-black/[0.04] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.55)] backdrop-blur md:p-10"
          >
            {step === 1 ? (
              <div>
                <div className="border-b border-black/10 pb-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#3b82f6]">
                    Step 1 of 3
                  </p>

                  <h2 className="mt-3 text-2xl font-bold md:text-3xl">
                    Select Your Plan
                  </h2>

                  <p className="mt-3 text-gray-500">
                    Choose the program you want to apply for.
                  </p>
                </div>

                <div className="mt-8 space-y-4">
                  {plans.map((plan) => {
                    const isSelected = plan.id === selectedPlanId;

                    return (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => {
                          setSelectedPlanId(plan.id);
                          setPlanError("");
                        }}
                        className={`w-full rounded-xl border-2 p-5 text-left transition ${
                          isSelected
                            ? "border-[#3b82f6] bg-[#3b82f6]/5"
                            : "border-black/10 bg-white/70 hover:border-[#3b82f6]/40"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <span
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                                isSelected
                                  ? "border-[#3b82f6]"
                                  : "border-black/20"
                              }`}
                            >
                              {isSelected && (
                                <span className="h-2.5 w-2.5 rounded-full bg-[#3b82f6]" />
                              )}
                            </span>

                            <div>
                              <p className="font-bold">{plan.label}</p>

                              <p className="mt-1 text-sm text-gray-600">
                                {plan.description}
                              </p>
                            </div>
                          </div>

                          <p className="shrink-0 font-serif text-xl font-bold text-[#1d4ed8]">
                            {plan.amount != null ? `₹${plan.amount}` : "Custom"}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {planError && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700"
                    >
                      {planError}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  type="button"
                  onClick={handleContinueFromPlan}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-7 w-full rounded-xl bg-gradient-to-r from-[#1d4ed8] to-[#1e3a8a] px-7 py-4 font-bold text-white shadow-[0_15px_50px_rgba(34,197,94,0.22)]"
                >
                  Continue
                </motion.button>
              </div>
            ) : (
              <div>
                <div className="border-b border-black/10 pb-7">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#3b82f6]">
                      Step 2 of 3
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setFieldIndex(0);
                        setFieldError("");
                        setStep(1);
                      }}
                      className="text-xs font-semibold text-gray-500 transition hover:text-[#1d4ed8]"
                    >
                      ← Change plan
                    </button>
                  </div>

                  <h2 className="mt-3 text-2xl font-bold md:text-3xl">
                    Enter Your Business Details
                  </h2>

                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      Question {fieldIndex + 1} of {businessFields.length}
                    </span>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/10">
                    <motion.div
                      animate={{
                        width: `${((fieldIndex + 1) / businessFields.length) * 100}%`,
                      }}
                      transition={{
                        duration: 0.4,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="h-full rounded-full bg-gradient-to-r from-[#ef4444] via-[#22c55e] to-[#3b82f6]"
                    />
                  </div>
                </div>

                <div className="mt-8 min-h-[260px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentField.id}
                      initial={{
                        opacity: 0,
                        x: 40,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      exit={{
                        opacity: 0,
                        x: -40,
                      }}
                      transition={{
                        duration: 0.35,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <label
                        htmlFor={currentField.id}
                        className="block text-xl font-bold md:text-2xl"
                      >
                        {currentField.label} *
                      </label>

                      {currentField.kind === "input" ? (
                        <form onSubmit={handleFieldSubmit} className="mt-6">
                          <input
                            key={currentField.id}
                            id={currentField.id}
                            type={currentField.type}
                            min={
                              currentField.type === "number" ? "0" : undefined
                            }
                            value={formData[currentField.id]}
                            onChange={(event) =>
                              updateField(currentField.id, event.target.value)
                            }
                            placeholder={currentField.placeholder}
                            autoComplete={currentField.autoComplete}
                            autoFocus
                            className="w-full rounded-xl border border-black/10 bg-white/70 px-4 py-4 text-lg outline-none transition placeholder:text-gray-400 focus:border-[#3b82f6]"
                          />

                          <button
                            type="submit"
                            className="mt-5 rounded-lg bg-gradient-to-r from-[#1d4ed8] to-[#1e3a8a] px-8 py-3 font-bold text-white transition hover:scale-105"
                          >
                            {isLastField ? "Continue to Payment Details" : "OK"}
                          </button>
                        </form>
                      ) : (
                        <div className="mt-6 grid gap-3 sm:grid-cols-2">
                          {currentField.options.map((option) => {
                            const isSelected =
                              formData[currentField.id] === option;

                            return (
                              <button
                                key={option}
                                type="button"
                                onClick={() => advanceField(option)}
                                className={`rounded-xl border-2 px-4 py-4 text-left font-semibold transition ${
                                  isSelected
                                    ? "border-[#3b82f6] bg-[#3b82f6]/5"
                                    : "border-black/10 bg-white/70 hover:border-[#3b82f6]/40"
                                }`}
                              >
                                {option}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <AnimatePresence>
                  {fieldError && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700"
                    >
                      {fieldError}
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {errorMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700"
                    >
                      {errorMessage}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-6 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={goBackField}
                    disabled={isSubmitting}
                    className="text-sm font-semibold text-gray-500 transition hover:text-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    ← Back
                  </button>

                  {isSubmitting && (
                    <p className="text-sm text-gray-500">
                      Saving your application...
                    </p>
                  )}
                </div>

                <p className="mt-6 text-center text-xs leading-6 text-gray-500">
                  By continuing, you agree to our Terms and Conditions,
                  Privacy Policy and Refund Policy.
                </p>
              </div>
            )}
          </motion.section>
        </div>
      </div>
    </main>
  );
}
