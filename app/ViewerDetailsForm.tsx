import type { FormEvent, ReactNode } from "react";

// The details form asked before a strategy call is booked: "Enter your
// details to book your strategy call" in ApplyCheckPopup.

// Last details entered on this browser: prefill the form, and go with the
// /watch tracking (videoViews).
export const VIEWER_KEY = "rpiansVideoViewer";

export const OCCUPATION_OPTIONS = [
  "Retailer",
  "Wholesaler",
  "Distributor",
  "Manufacturer",
  "Service business",
  "Other",
];

export const REVENUE_OPTIONS = [
  "₹3 Cr – ₹5 Cr",
  "₹5 Cr – ₹50 Cr",
  "₹50 Cr – ₹500 Cr",
];

export type Viewer = {
  fullName: string;
  phone: string;
  email: string;
  // Missing on viewers saved before these questions were added.
  occupation: string;
  revenue: string;
};

export const EMPTY_VIEWER: Viewer = {
  fullName: "",
  phone: "",
  email: "",
  occupation: "",
  revenue: "",
};

export type FormErrors = Partial<Record<keyof Viewer, string>>;

export const normalizePhone = (value: string) => {
  const digits = value.replace(/\D/g, "");
  return digits.length === 12 && digits.startsWith("91")
    ? digits.slice(2)
    : digits.slice(0, 10);
};

// What was typed, trimmed and normalised, ready to check and save.
export const cleanViewer = (viewer: Viewer): Viewer => ({
  fullName: viewer.fullName.trim(),
  phone: normalizePhone(viewer.phone),
  email: viewer.email.trim().toLowerCase(),
  occupation: viewer.occupation,
  revenue: viewer.revenue,
});

export const validateViewer = (viewer: Viewer): FormErrors => {
  const errors: FormErrors = {};

  if (viewer.fullName.trim().length < 2) {
    errors.fullName = "Please enter your name.";
  }

  if (!viewer.phone) {
    errors.phone = "Please enter your mobile number.";
  } else if (!/^[6-9]\d{9}$/.test(viewer.phone)) {
    errors.phone =
      "Mobile number must be 10 digits and start with 6, 7, 8 or 9.";
  }

  if (!viewer.email.trim()) {
    errors.email = "Please enter your email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(viewer.email.trim())) {
    errors.email = "Please enter a valid email (e.g. name@gmail.com).";
  }

  if (!OCCUPATION_OPTIONS.includes(viewer.occupation)) {
    errors.occupation = "Please choose what you currently do.";
  }

  if (!REVENUE_OPTIONS.includes(viewer.revenue)) {
    errors.revenue = "Please choose your annual turnover.";
  }

  return errors;
};

// The last details saved on this browser, or null. Viewers saved before
// occupation / revenue were asked are prefilled with what they gave.
export function readSavedViewer(): Viewer | null {
  try {
    const stored = JSON.parse(
      localStorage.getItem(VIEWER_KEY) ?? "null",
    ) as Partial<Viewer> | null;

    return stored?.fullName && stored.phone && stored.email
      ? { ...EMPTY_VIEWER, ...stored }
      : null;
  } catch {
    return null;
  }
}

function IndiaFlag() {
  return (
    <svg
      viewBox="0 0 30 20"
      aria-hidden="true"
      className="h-4 w-6 shrink-0 rounded-sm ring-1 ring-black/10"
    >
      <rect width="30" height="20" fill="#fff" />
      <rect width="30" height="6.67" fill="#FF9933" />
      <rect y="13.33" width="30" height="6.67" fill="#138808" />
      <circle
        cx="15"
        cy="10"
        r="2.6"
        fill="none"
        stroke="#000080"
        strokeWidth="0.8"
      />
    </svg>
  );
}

const fieldBaseClass =
  "mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none transition focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20";

const fieldClass = `${fieldBaseClass} text-gray-900`;

function SelectField({
  id,
  label,
  value,
  options,
  error,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: string[];
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-gray-700">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`${fieldBaseClass} appearance-none bg-white pr-10 ${
            value ? "text-gray-900" : "text-gray-400"
          }`}
        >
          <option value="" disabled>
            Select an option
          </option>
          {options.map((option) => (
            <option key={option} value={option} className="text-gray-900">
              {option}
            </option>
          ))}
        </select>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 mt-0.5 h-4 w-4 -translate-y-1/2 text-gray-500"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

type ViewerDetailsFormProps = {
  // Start of each field's id.
  idPrefix: string;
  viewer: Viewer;
  errors: FormErrors;
  onFieldChange: (field: keyof Viewer, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  // Also named in the consent line below the button.
  submitLabel: string;
  submitIcon: ReactNode;
  isSubmitting?: boolean;
};

export default function ViewerDetailsForm({
  idPrefix,
  viewer,
  errors,
  onFieldChange,
  onSubmit,
  submitLabel,
  submitIcon,
  isSubmitting = false,
}: ViewerDetailsFormProps) {
  return (
    <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
      <div>
        <label
          htmlFor={`${idPrefix}-name`}
          className="text-sm font-semibold text-gray-700"
        >
          Name
        </label>
        <input
          id={`${idPrefix}-name`}
          type="text"
          autoComplete="name"
          value={viewer.fullName}
          onChange={(event) => onFieldChange("fullName", event.target.value)}
          placeholder="Your full name"
          className={fieldClass}
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
        )}
      </div>

      <div>
        <label
          htmlFor={`${idPrefix}-email`}
          className="text-sm font-semibold text-gray-700"
        >
          Email
        </label>
        <input
          id={`${idPrefix}-email`}
          type="email"
          inputMode="email"
          autoComplete="email"
          value={viewer.email}
          onChange={(event) => onFieldChange("email", event.target.value)}
          placeholder="name@gmail.com"
          className={fieldClass}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <div>
        <label
          htmlFor={`${idPrefix}-phone`}
          className="text-sm font-semibold text-gray-700"
        >
          Mobile
        </label>
        <div className="mt-1 flex rounded-xl border border-gray-300 transition focus-within:border-[#3b82f6] focus-within:ring-2 focus-within:ring-[#3b82f6]/20">
          <span className="flex items-center gap-2 border-r border-gray-200 px-3 text-base text-gray-600">
            <IndiaFlag />
            +91
          </span>
          <input
            id={`${idPrefix}-phone`}
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            maxLength={10}
            value={viewer.phone}
            onChange={(event) =>
              onFieldChange("phone", normalizePhone(event.target.value))
            }
            placeholder="10 digit mobile number"
            className="w-full min-w-0 rounded-r-xl px-4 py-3 text-base text-gray-900 outline-none"
          />
        </div>
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
        )}
      </div>

      <SelectField
        id={`${idPrefix}-occupation`}
        label="What do you currently do?"
        value={viewer.occupation}
        options={OCCUPATION_OPTIONS}
        error={errors.occupation}
        onChange={(occupation) => onFieldChange("occupation", occupation)}
      />

      <SelectField
        id={`${idPrefix}-revenue`}
        label="Annual Turnover"
        value={viewer.revenue}
        options={REVENUE_OPTIONS}
        error={errors.revenue}
        onChange={(revenue) => onFieldChange("revenue", revenue)}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 text-balance rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#2563eb] px-5 py-4 text-center text-base font-bold uppercase leading-snug tracking-wide text-white shadow-lg shadow-blue-600/25 transition hover:scale-[1.02] disabled:cursor-wait disabled:opacity-70 disabled:hover:scale-100 max-[359px]:px-3 max-[359px]:text-sm max-[359px]:tracking-normal"
      >
        {submitIcon}
        {submitLabel}
      </button>

      <p className="text-center text-xs leading-5 text-gray-400">
        By clicking {submitLabel}, you agree that the RPIANS team may contact
        you by call, WhatsApp or email. See our{" "}
        <a
          href="/privacy-policy"
          target="_blank"
          className="underline underline-offset-2 hover:text-gray-600"
        >
          Privacy Policy
        </a>
        .
      </p>
    </form>
  );
}
