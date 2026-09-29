"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";

// Sundays are closed. Slots are in IST.
const TIME_SLOTS = [
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
];

const BOOKING_WINDOW_DAYS = 30;

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

// "3:00 PM" -> minutes since midnight
const slotToMinutes = (slot: string) => {
  const [time, period] = slot.split(" ");
  const [hours, minutes] = time.split(":").map(Number);
  return ((hours % 12) + (period === "PM" ? 12 : 0)) * 60 + minutes;
};

export default function BookingCalendar() {
  const today = useMemo(() => startOfDay(new Date()), []);
  const lastBookableDay = useMemo(() => {
    const date = new Date(today);
    date.setDate(date.getDate() + BOOKING_WINDOW_DAYS);
    return date;
  }, [today]);

  const [viewMonth, setViewMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [formData, setFormData] = useState<BookingData>(initialData);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  const calendarDays = useMemo(() => {
    const firstWeekday = viewMonth.getDay();
    const daysInMonth = new Date(
      viewMonth.getFullYear(),
      viewMonth.getMonth() + 1,
      0,
    ).getDate();

    const cells: (Date | null)[] = Array(firstWeekday).fill(null);

    for (let day = 1; day <= daysInMonth; day++) {
      cells.push(new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day));
    }

    return cells;
  }, [viewMonth]);

  const isDayAvailable = (date: Date) =>
    date.getDay() !== 0 && date >= today && date <= lastBookableDay;

  // Hide slots that have already passed (with a 1 hour buffer) for today.
  const availableSlots = useMemo(() => {
    if (!selectedDate) {
      return [];
    }

    if (!isSameDay(selectedDate, new Date())) {
      return TIME_SLOTS;
    }

    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    return TIME_SLOTS.filter((slot) => slotToMinutes(slot) > nowMinutes + 60);
  }, [selectedDate]);

  const canGoPrev =
    viewMonth > new Date(today.getFullYear(), today.getMonth(), 1);
  const canGoNext =
    viewMonth <
    new Date(lastBookableDay.getFullYear(), lastBookableDay.getMonth(), 1);

  const changeMonth = (offset: number) => {
    setViewMonth(
      (current) =>
        new Date(current.getFullYear(), current.getMonth() + offset, 1),
    );
  };

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const bookingData = {
      formType: "Call Booking",
      ...formData,
      bookingDate: selectedDate ? formatDate(selectedDate) : "",
      bookingTime: `${selectedSlot} IST`,
      submittedAt: new Date().toISOString(),
      source: "RPIANS Website - Book a Call",
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Booking failed.");
      }

      setIsBooked(true);
    } catch (error) {
      console.error("Booking error:", error);
      setErrorMessage(
        "Your booking could not be saved. Please try again or contact us on WhatsApp.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-black/10 bg-white px-4 py-4 text-[#0f172a] outline-none transition placeholder:text-gray-600 focus:border-[#3b82f6]";

  if (isBooked && selectedDate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-xl rounded-2xl border border-black/10 bg-white p-10 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-3xl text-green-600">
          ✓
        </div>

        <h2 className="mt-6 font-serif text-3xl">Your Call Is Booked!</h2>

        <p className="mt-4 leading-7 text-gray-600">
          Thank you, {formData.fullName.trim()}. Your call is scheduled for
        </p>

        <p className="mt-2 text-lg font-bold text-[#1d4ed8]">
          {formatDate(selectedDate)} at {selectedSlot} IST
        </p>

        <p className="mt-4 leading-7 text-gray-600">
          Our team will confirm the appointment on WhatsApp shortly.
        </p>

        <Link
          href="/"
          className="mt-8 inline-block rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#2563eb] px-8 py-4 font-bold text-white transition hover:scale-105"
        >
          Back to Home
        </Link>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-8 lg:grid-cols-[1.1fr_1fr]"
    >
      <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#3b82f6]">
          Step 1 · Pick a Date &amp; Time
        </p>

        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => changeMonth(-1)}
            disabled={!canGoPrev}
            aria-label="Previous month"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-black/10 text-lg text-[#3b82f6] transition hover:border-[#3b82f6] disabled:cursor-not-allowed disabled:opacity-30"
          >
            ‹
          </button>

          <p className="text-lg font-bold">
            {viewMonth.toLocaleDateString("en-IN", {
              month: "long",
              year: "numeric",
            })}
          </p>

          <button
            type="button"
            onClick={() => changeMonth(1)}
            disabled={!canGoNext}
            aria-label="Next month"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-black/10 text-lg text-[#3b82f6] transition hover:border-[#3b82f6] disabled:cursor-not-allowed disabled:opacity-30"
          >
            ›
          </button>
        </div>

        <div className="mt-6 grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase text-gray-500">
          {WEEKDAYS.map((day) => (
            <span key={day} className="py-2">
              {day}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, index) => {
            if (!date) {
              return <span key={`empty-${index}`} />;
            }

            const isAvailable = isDayAvailable(date);
            const isSelected = selectedDate && isSameDay(date, selectedDate);

            return (
              <button
                key={date.toISOString()}
                type="button"
                disabled={!isAvailable}
                onClick={() => selectDate(date)}
                aria-pressed={Boolean(isSelected)}
                className={`aspect-square rounded-lg text-sm font-semibold transition ${
                  isSelected
                    ? "bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white shadow-lg"
                    : isAvailable
                      ? "text-[#0f172a] hover:bg-[#3b82f6]/10 hover:text-[#1d4ed8]"
                      : "cursor-not-allowed text-gray-300"
                } ${isSameDay(date, today) && !isSelected ? "ring-1 ring-[#3b82f6]/40" : ""}`}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {selectedDate && (
            <motion.div
              key={selectedDate.toISOString()}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-8 border-t border-black/10 pt-6"
            >
              <p className="text-sm font-medium text-gray-600">
                Available slots on{" "}
                <span className="font-bold text-[#0f172a]">
                  {formatDate(selectedDate)}
                </span>{" "}
                (IST)
              </p>

              {availableSlots.length > 0 ? (
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => {
                        setSelectedSlot(slot);
                        setErrorMessage("");
                      }}
                      aria-pressed={selectedSlot === slot}
                      className={`rounded-lg border px-3 py-3 text-sm font-semibold transition ${
                        selectedSlot === slot
                          ? "border-transparent bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white"
                          : "border-black/10 text-[#0f172a] hover:border-[#3b82f6] hover:text-[#1d4ed8]"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="mt-4 rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-600">
                  No slots left for today. Please pick another date.
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
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
              placeholder="+91 98765 43210"
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
          disabled={isSubmitting}
          whileHover={isSubmitting ? undefined : { scale: 1.015 }}
          whileTap={isSubmitting ? undefined : { scale: 0.98 }}
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#2563eb] px-7 py-4 text-base font-bold text-white shadow-[0_15px_50px_rgba(59,130,246,0.22)] transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Booking Your Call..." : "Confirm Booking"}
        </motion.button>

        <div className="mt-5 flex flex-wrap justify-center gap-5 text-xs text-gray-500">
          <span>✓ Free consultation</span>
          <span>✓ WhatsApp confirmation</span>
          <span>✓ RPIANS team support</span>
        </div>
      </div>
    </form>
  );
}
