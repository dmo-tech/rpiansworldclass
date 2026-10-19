"use client";

import { AnimatePresence, motion } from "motion/react";
import { Suspense, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  ANNUAL_TURNOVER_OPTIONS,
  BUSINESS_CATEGORY_OPTIONS,
  type Question,
} from "../businessQuestions";
import QuestionFlow from "../QuestionFlow";
import SiteFooter from "../SiteFooter";
import SiteHeader from "../SiteHeader";
import CallSlotPicker, { formatBookingDate } from "../CallSlotPicker";
import {
  endsOnWhatsApp,
  formatPlanAmount,
  planAmountLabel,
  plans,
  planWhatsAppUrl,
} from "../plans";
import { WaitlistBadge } from "../ProgramOffer";

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

const businessFields: Question<keyof RegistrationData>[] = [
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
    placeholder: "10 digit mobile number",
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
    options: BUSINESS_CATEGORY_OPTIONS,
  },
  {
    id: "annualTurnover",
    label: "Annual Turnover",
    kind: "select",
    options: ANNUAL_TURNOVER_OPTIONS,
  },
  {
    id: "employeeCount",
    label: "Number of Employees",
    kind: "input",
    type: "number",
    placeholder: "Enter number of employees",
  },
];

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

  // Waitlist plans (Personal Mentorship) arrive from their page's "Explore
  // Exclusive Mentorship" and start at the questions; Back from the first
  // question still shows the plan step.
  const [step, setStep] = useState<1 | 2 | 3>(planFromQuery?.waitlist ? 2 : 1);
  const [callDate, setCallDate] = useState<Date | null>(null);
  const [callSlot, setCallSlot] = useState("");
  const [callError, setCallError] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(
    planFromQuery?.id ?? null,
  );
  const [planError, setPlanError] = useState("");

  // Arriving with a valid ?plan= (a program page, Our Programs) shows only
  // that plan; "Change plan" reveals the rest (not offered for the strategy
  // call). Without one, all plans show.
  const [showAllPlans, setShowAllPlans] = useState(!planFromQuery);

  const selectedPlan =
    plans.find((plan) => plan.id === selectedPlanId) ?? null;

  // Waitlist plans and 10 Month end at the call step, on WhatsApp.
  const isWhatsAppPlan = selectedPlan ? endsOnWhatsApp(selectedPlan) : false;
  const stepCount = isWhatsAppPlan ? 3 : 4;

  const visiblePlans =
    showAllPlans || !selectedPlan ? plans : [selectedPlan];

  const [formData, setFormData] =
    useState<RegistrationData>(initialData);

  // The question QuestionFlow is on, so Back from the call step returns to it.
  const [questionIndex, setQuestionIndex] = useState(0);

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
  };

  const handleContinueFromPlan = () => {
    if (!selectedPlanId) {
      setPlanError("Please select a plan to continue.");
      return;
    }

    setPlanError("");
    setStep(2);
  };

  // The lead that goes to the Google Sheet (and, for checkout, sessionStorage).
  const buildApplication = (
    data: RegistrationData,
    date: Date,
    slot: string,
    source: string,
  ) => ({
    ...data,
    bookingDate: formatBookingDate(date),
    bookingTime: `${slot} IST`,
    planSelected: selectedPlan?.label ?? "",
    bookingAmount: selectedPlan?.amount ?? null,
    gstApplicable: selectedPlan?.gstApplicable ?? false,
    submittedAt: new Date().toISOString(),
    source,
  });

  const submitApplication = (data: RegistrationData) => {
    if (!callDate || !callSlot) {
      setCallError("Please select a date and time for your call.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const applicationData = buildApplication(
      data,
      callDate,
      callSlot,
      "RPIANS Website",
    );

    // planId is only needed by checkout, so it stays out of the Google Sheet lead.
    sessionStorage.setItem(
      "rpiansApplicationData",
      JSON.stringify({
        ...applicationData,
        planId: selectedPlan?.id ?? "",
      }),
    );

    // Lead is saved to Google Sheets in the background. The customer must
    // never be blocked from reaching payment by a slow/flaky third-party
    // spreadsheet call — we already have their data safely in sessionStorage.
    fetch("/api/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(applicationData),
    }).catch((error) => {
      console.error("Lead save error (non-blocking):", error);
    });

    router.push("/payment");
  };

  // WhatsApp plans end at the call step: "Join the Waitlist" / "Book Call on
  // WhatsApp" saves the lead (once per chosen call time) and opens WhatsApp
  // with the details. The tab opens inside the click itself, so pop-up
  // blockers allow it; a link to open it again is shown below in case it
  // didn't.
  const [whatsAppOpened, setWhatsAppOpened] = useState(false);
  const whatsAppLeadKeyRef = useRef("");

  const whatsAppUrl =
    selectedPlan && isWhatsAppPlan && callDate && callSlot
      ? planWhatsAppUrl(selectedPlan, {
          fullName: formData.fullName.trim(),
          companyName: formData.companyName.trim(),
          callTime: `${formatBookingDate(callDate)} at ${callSlot} IST`,
        })
      : "";

  const sendOnWhatsApp = () => {
    if (!callDate || !callSlot || !whatsAppUrl) {
      setCallError("Please select a date and time for your call.");
      return;
    }

    const leadKey = `${callDate.toDateString()}|${callSlot}`;

    if (whatsAppLeadKeyRef.current !== leadKey) {
      whatsAppLeadKeyRef.current = leadKey;

      fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          buildApplication(
            formData,
            callDate,
            callSlot,
            selectedPlan?.waitlist
              ? "RPIANS Website - Waitlist"
              : "RPIANS Website - WhatsApp Booking",
          ),
        ),
        keepalive: true,
      }).catch((error) => {
        console.error("WhatsApp lead save error (non-blocking):", error);
      });
    }

    window.open(whatsAppUrl, "_blank", "noopener,noreferrer");
    setWhatsAppOpened(true);
  };

  const paymentStepLabel = selectedPlan
    ? selectedPlan.waitlist
      ? "Join the waitlist on WhatsApp"
      : selectedPlan.bookOnWhatsApp
      ? "Confirm your call with our team on WhatsApp"
      : selectedPlan.amount != null
      ? `Complete ${formatPlanAmount(selectedPlan)} booking payment`
      : "Discuss custom pricing with our team"
    : "Complete your booking payment";

  if (step === 3) {
    return (
      <main className="relative flex min-h-screen flex-col bg-white px-6 text-[#0f172a] md:px-16">
        <SiteHeader />

        {/* Fixed space above the footer (80px mobile, 112px desktop). */}
        <div className="flex items-start justify-center pb-20 pt-32 md:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-2xl"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#3b82f6]">
              Step 3 of {stepCount}
            </p>

            <h1 className="mt-3 font-serif text-3xl md:text-5xl">
              Book Your Call With the RPIANS Team
            </h1>

            <p className="mt-4 leading-7 text-gray-600">
              {selectedPlan?.waitlist
                ? "Pick a date and time that suits you, then join the waitlist on WhatsApp. Our team will call you at this time."
                : isWhatsAppPlan
                ? "Pick a date and time that suits you, then send your booking to our team on WhatsApp. Our team will call you at this time."
                : "Pick a date and time that suits you. After booking your call, you will continue to the payment page."}
            </p>

            <div className="mt-8 rounded-2xl border border-black/10 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:p-8">
              <CallSlotPicker
                selectedDate={callDate}
                selectedSlot={callSlot}
                onSelectDate={(date) => {
                  setCallDate(date);
                  setCallSlot("");
                  setCallError("");
                  setWhatsAppOpened(false);
                }}
                onSelectSlot={(slot) => {
                  setCallSlot(slot);
                  setCallError("");
                  setWhatsAppOpened(false);
                }}
              />

              {callDate && callSlot && (
                <p className="mt-6 rounded-xl bg-[#3b82f6]/10 px-4 py-3 text-sm text-[#1d4ed8]">
                  Selected: <strong>{formatBookingDate(callDate)}</strong> at{" "}
                  <strong>{callSlot} IST</strong>
                </p>
              )}

              <AnimatePresence>
                {callError && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700"
                  >
                    {callError}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    setCallError("");
                    setStep(2);
                  }}
                  className="rounded-xl border border-black/10 px-6 py-4 font-semibold text-gray-600 transition hover:border-[#3b82f6] hover:text-[#1d4ed8]"
                >
                  ← Back
                </button>

                {isWhatsAppPlan ? (
                  <motion.button
                    type="button"
                    onClick={sendOnWhatsApp}
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#2563eb] px-7 py-4 font-bold text-white shadow-[0_15px_50px_rgba(59,130,246,0.22)] transition"
                  >
                    {selectedPlan?.waitlist
                      ? "Join the Waitlist"
                      : "Book Call on WhatsApp"}
                  </motion.button>
                ) : (
                  <motion.button
                    type="button"
                    onClick={() => submitApplication(formData)}
                    disabled={isSubmitting}
                    whileHover={isSubmitting ? undefined : { scale: 1.015 }}
                    whileTap={isSubmitting ? undefined : { scale: 0.98 }}
                    className="flex-1 rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#2563eb] px-7 py-4 font-bold text-white shadow-[0_15px_50px_rgba(59,130,246,0.22)] transition disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting
                      ? "Booking Your Call..."
                      : "Book Call & Continue to Payment"}
                  </motion.button>
                )}
              </div>

              {whatsAppOpened && whatsAppUrl && (
                <div
                  role="status"
                  className="mt-5 rounded-xl border border-[#22c55e]/30 bg-[#22c55e]/10 px-4 py-3 text-sm text-[#15803d]"
                >
                  <p className="font-bold">
                    Thank you! Your details and call time are saved.
                  </p>

                  <p className="mt-1">
                    {selectedPlan?.waitlist
                      ? "Send the message in WhatsApp to join the waitlist."
                      : "Send the message in WhatsApp to confirm your call."}{" "}
                    WhatsApp didn&rsquo;t open?{" "}
                    <a
                      href={whatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[#15803d]! underline! underline-offset-2"
                    >
                      Open WhatsApp
                    </a>
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Cancel main's side padding so the dark footer spans the full width;
            on tall screens the footer stretches to the bottom of the window. */}
        <div className="-mx-6 flex flex-1 flex-col md:-mx-16">
          <SiteFooter />
        </div>
      </main>
    );
  }

  if (step === 2) {
    return (
      <QuestionFlow
        questions={businessFields}
        values={formData}
        onChange={updateField}
        onComplete={() => setStep(3)}
        onBackFromFirst={() => setStep(1)}
        finishLabel="Continue to Book a Call"
        isSubmitting={isSubmitting}
        submittingText="Saving your application..."
        errorMessage={errorMessage}
        initialIndex={questionIndex}
        onIndexChange={setQuestionIndex}
      />
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-white px-5 pb-12 pt-24 text-[#0f172a] md:px-8">
      <SiteHeader />

      {/* BACKGROUND EFFECT */}

      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-[#3b82f6]/10 blur-[170px]" />

      <div className="relative mx-auto max-w-6xl">
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
                "Book a call with our team",
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
              {selectedPlan?.waitlist && (
                <p className="mb-3">
                  <WaitlistBadge>
                    ⏳ Waitlist Till {selectedPlan.waitlist.until}
                  </WaitlistBadge>
                </p>
              )}

              <p className="text-sm font-semibold text-[#1d4ed8]">
                {selectedPlan
                  ? `${selectedPlan.label} — ${planAmountLabel(selectedPlan)}`
                  : "Booking Amount"}
              </p>

              {selectedPlan?.waitlist ? (
                <>
                  <p className="mt-2 font-serif text-3xl font-bold md:text-4xl">
                    {selectedPlan.waitlist.price}
                  </p>

                  <p className="mt-1 text-lg font-semibold text-gray-700">
                    {selectedPlan.waitlist.extra}
                  </p>
                </>
              ) : (
                <p className="mt-2 font-serif text-4xl font-bold">
                  {selectedPlan
                    ? formatPlanAmount(selectedPlan)
                    : "Select a plan"}
                </p>
              )}
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
            <div>
                <div className="border-b border-black/10 pb-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#3b82f6]">
                    Step 1 of {stepCount}
                  </p>

                  <h2 className="mt-3 text-2xl font-bold md:text-3xl">
                    Select Your Plan
                  </h2>

                  <p className="mt-3 text-gray-500">
                    Choose the program you want to apply for.
                  </p>
                </div>

                <div className="mt-8 space-y-4">
                  {visiblePlans.map((plan) => {
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
                          <div className="flex min-w-0 items-center gap-3">
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

                          {plan.waitlist ? (
                            <div className="max-w-[7rem] shrink-0 text-right sm:max-w-[9.5rem]">
                              <p className="text-[13px] font-bold leading-5 text-[#1d4ed8] sm:text-sm">
                                {plan.waitlist.shortPrice}
                              </p>

                              <p className="mt-1 text-[11px] font-semibold text-amber-700">
                                Waitlist till {plan.waitlist.until}
                              </p>
                            </div>
                          ) : (
                            <p className="shrink-0 font-serif text-xl font-bold text-[#1d4ed8]">
                              {formatPlanAmount(plan)}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {!showAllPlans && selectedPlan?.id !== "strategy-call" && (
                  <button
                    type="button"
                    onClick={() => setShowAllPlans(true)}
                    className="mt-4 text-sm font-semibold text-[#1d4ed8] underline underline-offset-4 transition hover:text-[#1e3a8a]"
                  >
                    Change plan
                  </button>
                )}

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

                {selectedPlan?.waitlist && (
                  <div
                    role="note"
                    className="mt-6 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800"
                  >
                    <p className="font-bold">
                      {selectedPlan.label} is waitlist-only
                    </p>

                    <p className="mt-1">
                      Waitlist till {selectedPlan.waitlist.until}. Share your
                      details and pick a call time, then join the waitlist on
                      WhatsApp.
                    </p>
                  </div>
                )}

                <motion.button
                  type="button"
                  onClick={handleContinueFromPlan}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-7 w-full rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#2563eb] px-7 py-4 font-bold text-white shadow-[0_15px_50px_rgba(34,197,94,0.22)]"
                >
                  Continue
                </motion.button>
              </div>
          </motion.section>
        </div>
      </div>
    </main>
  );
}
