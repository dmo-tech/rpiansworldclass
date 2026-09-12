"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";

type FormData = {
  fullName: string;
  phone: string;
  email: string;
  companyName: string;
  businessCategory: string;
  annualTurnover: string;
  biggestChallenge: string;
};

const initialFormData: FormData = {
  fullName: "",
  phone: "",
  email: "",
  companyName: "",
  businessCategory: "",
  annualTurnover: "",
  biggestChallenge: "",
};

export default function LeadForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    setErrorMessage("");
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      return "Please enter your full name.";
    }

    if (!formData.phone.trim()) {
      return "Please enter your WhatsApp number.";
    }

    const cleanPhone = formData.phone.replace(/\D/g, "");

    if (cleanPhone.length < 10) {
      return "Please enter a valid 10-digit WhatsApp number.";
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

    if (!formData.biggestChallenge.trim()) {
      return "Please share your biggest business challenge.";
    }

    return "";
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const registrationData = {
      ...formData,
      registeredAt: new Date().toISOString(),
      source: "RPIANS Website",
      bookingAmount: 999,
    };

    sessionStorage.setItem(
      "rpiansApplicationData",
      JSON.stringify(registrationData),
    );

    setTimeout(() => {
      router.push("/payment");
    }, 900);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-10">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label
            htmlFor="fullName"
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            Full Name *
          </label>

          <input
            id="fullName"
            type="text"
            value={formData.fullName}
            onChange={(event) =>
              updateField("fullName", event.target.value)
            }
            placeholder="Enter your full name"
            autoComplete="name"
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-4 text-white outline-none transition placeholder:text-gray-600 focus:border-[#3b82f6]"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            WhatsApp Number *
          </label>

          <input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(event) =>
              updateField("phone", event.target.value)
            }
            placeholder="+91 98765 43210"
            autoComplete="tel"
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-4 text-white outline-none transition placeholder:text-gray-600 focus:border-[#3b82f6]"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            Email Address *
          </label>

          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(event) =>
              updateField("email", event.target.value)
            }
            placeholder="name@company.com"
            autoComplete="email"
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-4 text-white outline-none transition placeholder:text-gray-600 focus:border-[#3b82f6]"
          />
        </div>

        <div>
          <label
            htmlFor="companyName"
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            Company Name *
          </label>

          <input
            id="companyName"
            type="text"
            value={formData.companyName}
            onChange={(event) =>
              updateField("companyName", event.target.value)
            }
            placeholder="Enter your company name"
            autoComplete="organization"
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-4 text-white outline-none transition placeholder:text-gray-600 focus:border-[#3b82f6]"
          />
        </div>

        <div>
          <label
            htmlFor="businessCategory"
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            Business Category *
          </label>

          <select
            id="businessCategory"
            value={formData.businessCategory}
            onChange={(event) =>
              updateField("businessCategory", event.target.value)
            }
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-4 text-white outline-none transition focus:border-[#3b82f6]"
          >
            <option value="">Select business category</option>
            <option value="Retail">Retail</option>
            <option value="Wholesale">Wholesale</option>
            <option value="Distribution">Distribution</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Service">Service Business</option>
            <option value="Construction">Construction / Project Business</option>
            <option value="Other">Other Business</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="annualTurnover"
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            Annual Turnover *
          </label>

          <select
            id="annualTurnover"
            value={formData.annualTurnover}
            onChange={(event) =>
              updateField("annualTurnover", event.target.value)
            }
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-4 text-white outline-none transition focus:border-[#3b82f6]"
          >
            <option value="">Select annual turnover</option>
            <option value="Below ₹1 Crore">Below ₹1 Crore</option>
            <option value="₹1–5 Crore">₹1–5 Crore</option>
            <option value="₹5–10 Crore">₹5–10 Crore</option>
            <option value="₹10–25 Crore">₹10–25 Crore</option>
            <option value="₹25–50 Crore">₹25–50 Crore</option>
            <option value="₹50 Crore+">₹50 Crore+</option>
          </select>
        </div>
      </div>

      <div className="mt-5">
        <label
          htmlFor="biggestChallenge"
          className="mb-2 block text-sm font-medium text-gray-300"
        >
          Biggest Business Challenge *
        </label>

        <textarea
          id="biggestChallenge"
          value={formData.biggestChallenge}
          onChange={(event) =>
            updateField("biggestChallenge", event.target.value)
          }
          placeholder="For example: team accountability, inventory, cash flow, owner dependency..."
          rows={4}
          className="w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-4 text-white outline-none transition placeholder:text-gray-600 focus:border-[#3b82f6]"
        />
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
        className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#ef4444] via-[#facc15] to-[#ec4899] px-7 py-4 text-base font-bold text-black shadow-[0_15px_50px_rgba(236,72,153,0.22)] transition disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting
          ? "Opening Payment Details..."
          : "Continue to Payment Details"}
      </motion.button>

      <div className="mt-5 flex flex-wrap justify-center gap-5 text-xs text-gray-500">
        <span>✓ Secure registration</span>
        <span>✓ ₹999 booking amount</span>
        <span>✓ RPIANS team support</span>
      </div>
    </form>
  );
}