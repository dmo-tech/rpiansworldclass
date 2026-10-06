"use client";

import { useSyncExternalStore } from "react";

const SESSION_END_HOUR = 13; // Sessions run 9 AM – 1 PM IST

// Upcoming Sunday in IST. On a Sunday it stays on today until the session ends.
function getNextSessionLabel(): string {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      weekday: "short",
      hour: "numeric",
      hourCycle: "h23",
    })
      .formatToParts(new Date())
      .map((part) => [part.type, part.value]),
  );

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayOfWeek = weekdays.indexOf(parts.weekday);

  let daysUntilSunday = (7 - dayOfWeek) % 7;
  if (daysUntilSunday === 0 && Number(parts.hour) >= SESSION_END_HOUR) {
    daysUntilSunday = 7;
  }

  const sunday = new Date(
    Date.UTC(
      Number(parts.year),
      Number(parts.month) - 1,
      Number(parts.day) + daysUntilSunday,
    ),
  );

  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(sunday);
}

const subscribe = () => () => {};

export default function SessionTicker() {
  // Computed in the browser so the date never freezes at build time.
  const sessionDate = useSyncExternalStore(
    subscribe,
    getNextSessionLabel,
    () => null,
  );

  const message = sessionDate
    ? `Next Session: ${sessionDate} · 9:00 AM – 1:00 PM (IST)`
    : "Next Session: Every Sunday · 9:00 AM – 1:00 PM (IST)";

  const items = Array.from({ length: 4 }, (_, index) => (
    <span key={index} className="flex shrink-0 items-center gap-10 pr-10">
      <span>{message}</span>
      <span aria-hidden="true" className="text-white/60">
        ✦
      </span>
    </span>
  ));

  return (
    <div className="session-ticker overflow-hidden border-t border-white/10 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] py-2 text-[13px] font-semibold tracking-wide text-white">
      <p className="sr-only">{message}</p>

      <div aria-hidden="true" className="session-ticker-track flex w-max">
        <div className="flex">{items}</div>
        <div className="flex">{items}</div>
      </div>
    </div>
  );
}
