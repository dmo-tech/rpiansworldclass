"use client";

import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";

import CallSlotPicker, { formatBookingDate as formatDate } from "./CallSlotPicker";
import { plans } from "./plans";

// A booked call is paid for as the "Book a Strategy Call" plan.
const STRATEGY_CALL_PLAN = plans.find((plan) => plan.id === "strategy-call");

type BookingData = {
  fullName: string;
  phone: string;
  email: string;
  companyName: string;
  message: string;
};

const initialData: BookingData = {
  fullName: "",
  phone: "",
  email: "",
  companyName: "",
  message: "",
};

type BookingCalendarProps = {
  // Where the booking came from. Falls back to the ?from= query param set
  // by BookCallButton, so the Google Sheet shows which placement worked.
  from?: string;
};

export default function BookingCalendar({ from }: BookingCalendarProps) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [formData, setFormData] = useState<BookingData>(initialData);
  const [errorMessage, setErrorMessage] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Blocks a second submit before the disabled button re-renders, so a
  // double click can't save the lead to the sheet twice.
  const isRedirectingRef = useRef(false);

  const selectDate = (date: Date) => {
    setSelectedDate(date);
    setSelectedSlot("");
    setErrorMessage("");
  };

  const updateField = (field: keyof BookingData, value: string) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    setErrorMessage("");
  };

  const validateForm = () => {
    if (!selectedDate) {
      return "Please select a date from the calendar.";
    }

    if (!selectedSlot) {
      return "Please select a time slot.";
    }

    if (!formData.fullName.trim()) {
      return "Please enter your full name.";
    }

    if (formData.phone.replace(/\D/g, "").length < 10) {
      return "Please enter a valid 10-digit WhatsApp number.";
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      return "Please enter a valid email address.";
    }

    return "";
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isRedirectingRef.current) return;

    const validationError = validateForm();

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    if (!STRATEGY_CALL_PLAN || STRATEGY_CALL_PLAN.amount == null) {
      setErrorMessage(
        "Online booking is unavailable right now. Please contact us on WhatsApp.",
      );
      return;
    }

    const bookingData = {
      formType: "Call Booking",
      ...formData,
      bookingDate: selectedDate ? formatDate(selectedDate) : "",
      bookingTime: `${selectedSlot} IST`,
      submittedAt: new Date().toISOString(),
      source: `RPIANS Website - ${
        from ||
        new URLSearchParams(window.location.search).get("from") ||
        "Book a Call Page"
      }`,
    };

    // Same hand-off as /register: /payment reads the booking from sessionStorage.
    try {
      sessionStorage.setItem(
        "rpiansApplicationData",
        JSON.stringify({
          ...bookingData,
          planId: STRATEGY_CALL_PLAN.id,
          planSelected: STRATEGY_CALL_PLAN.label,
          bookingAmount: STRATEGY_CALL_PLAN.amount,
          gstApplicable: STRATEGY_CALL_PLAN.gstApplicable ?? false,
        }),
      );
    } catch {
      setErrorMessage(
        "Your browser blocked saving your booking. Please try another browser or contact us on WhatsApp.",
      );
      return;
    }

    isRedirectingRef.current = true;
    setIsRedirecting(true);
    setErrorMessage("");

    // As in /register, the lead is saved in the background so a slow Google
    // Sheet never stops the visitor from reaching payment.
    fetch("/api/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    }).catch((error) => {
      console.error("Lead save error (non-blocking):", error);
    });

    router.push("/payment");
  };

  const inputClass =
    "w-full rounded-xl border border-black/10 bg-white px-4 py-4 text-[#0f172a] outline-none transition placeholder:text-gray-600 focus:border-[#3b82f6]";

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-8 lg:grid-cols-[1.1fr_1fr]"
    >
      <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#3b82f6]">
          Step 1 · Pick a Date &amp; Time
        </p>

        <CallSlotPicker
          selectedDate={selectedDate}
          selectedSlot={selectedSlot}
          onSelectDate={selectDate}
          onSelectSlot={(slot) => {
            setSelectedSlot(slot);
            setErrorMessage("");
          }}
        />
      </div>

      <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#3b82f6]">
          Step 2 · Your Details
        </p>

        <div className="mt-6 flex flex-col gap-5">
          <div>
            <label
              htmlFor="booking-fullName"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              Full Name *
            </label>
            <input
              id="booking-fullName"
              type="text"
              value={formData.fullName}
              onChange={(event) => updateField("fullName", event.target.value)}
              placeholder="Enter your full name"
              autoComplete="name"
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="booking-phone"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              WhatsApp Number *
            </label>
            <input
              id="booking-phone"
              type="tel"
              value={formData.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              placeholder="10 digit mobile number"
              autoComplete="tel"
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="booking-email"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              Email Address *
            </label>
            <input
              id="booking-email"
              type="email"
              value={formData.email}
              onChange={(event) => updateField("email", event.target.value)}
              placeholder="name@company.com"
              autoComplete="email"
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="booking-companyName"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              Company Name
            </label>
            <input
              id="booking-companyName"
              type="text"
              value={formData.companyName}
              onChange={(event) =>
                updateField("companyName", event.target.value)
              }
              placeholder="Enter your company name"
              autoComplete="organization"
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor="booking-message"
              className="mb-2 block text-sm font-medium text-gray-600"
            >
              What would you like to discuss?
            </label>
            <textarea
              id="booking-message"
              value={formData.message}
              onChange={(event) => updateField("message", event.target.value)}
              placeholder="For example: team accountability, inventory, cash flow..."
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>

        {selectedDate && selectedSlot && (
          <p className="mt-6 rounded-xl bg-[#3b82f6]/10 px-4 py-3 text-sm text-[#1d4ed8]">
            Selected: <strong>{formatDate(selectedDate)}</strong> at{" "}
            <strong>{selectedSlot} IST</strong>
          </p>
        )}

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

        <motion.button
          type="submit"
          disabled={isRedirecting}
          whileHover={isRedirecting ? undefined : { scale: 1.015 }}
          whileTap={isRedirecting ? undefined : { scale: 0.98 }}
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#2563eb] px-7 py-4 text-base font-bold text-white shadow-[0_15px_50px_rgba(59,130,246,0.22)] transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isRedirecting
            ? "Redirecting to payment..."
            : "Confirm & Continue to Payment"}
        </motion.button>

        <div className="mt-5 flex flex-wrap justify-center gap-5 text-xs text-gray-500">
          <span>✓ One-on-one consultation</span>
          <span>✓ WhatsApp confirmation</span>
          <span>✓ RPIANS team support</span>
        </div>
      </div>
    </form>
  );
}
