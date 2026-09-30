"use client";

import { useMemo, useState } from "react";
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

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const formatBookingDate = (date: Date) =>
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

type CallSlotPickerProps = {
  selectedDate: Date | null;
  selectedSlot: string;
  onSelectDate: (date: Date) => void;
  onSelectSlot: (slot: string) => void;
};

export default function CallSlotPicker({
  selectedDate,
  selectedSlot,
  onSelectDate,
  onSelectSlot,
}: CallSlotPickerProps) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const lastBookableDay = useMemo(() => {
    const date = new Date(today);
    date.setDate(date.getDate() + BOOKING_WINDOW_DAYS);
    return date;
  }, [today]);

  const [viewMonth, setViewMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );

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

  return (
    <div>
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
              onClick={() => onSelectDate(date)}
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
                {formatBookingDate(selectedDate)}
              </span>{" "}
              (IST)
            </p>

            {availableSlots.length > 0 ? (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => onSelectSlot(slot)}
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
  );
}
