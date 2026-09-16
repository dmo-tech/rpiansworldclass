"use client";

import { AnimatePresence, motion } from "motion/react";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type ApplyPopupProps = {
  isOpen: boolean;
  onClose: () => void;
};

type FormData = {
  fullName: string;
  phone: string;
  email: string;
  companyName: string;
  businessCategory: string;
  annualTurnover: string;
};

const initialFormData: FormData = {
  fullName: "",
  phone: "",
  email: "",
  companyName: "",
  businessCategory: "",
  annualTurnover: "",
};

export default function ApplyPopup({
  isOpen,
  onClose,
}: ApplyPopupProps) {
  const router = useRouter();

  const [formData, setFormData] =
    useState<FormData>(initialFormData);

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", closeWithEscape);

    return () => {
      window.removeEventListener("keydown", closeWithEscape);
    };
  }, [onClose]);

  const updateField = (
    field: keyof FormData,
    value: string,
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    setErrorMessage("");
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const cleanPhone = formData.phone.replace(/\D/g, "");

    if (
      !formData.fullName.trim() ||
      cleanPhone.length < 10 ||
      !formData.email.trim() ||
      !formData.companyName.trim() ||
      !formData.businessCategory ||
      !formData.annualTurnover
    ) {
      setErrorMessage(
        "Please complete all details correctly.",
      );
      return;
    }

    setIsSubmitting(true);

    sessionStorage.setItem(
      "rpiansApplicationData",
      JSON.stringify({
        ...formData,
        bookingAmount: 999,
        submittedAt: new Date().toISOString(),
      }),
    );

    setTimeout(() => {
      router.push("/payment");
    }, 700);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={onClose}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 px-4 py-8 backdrop-blur-md"
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 70,
              scale: 0.9,
              filter: "blur(10px)",
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
            }}
            exit={{
              opacity: 0,
              y: 50,
              scale: 0.94,
            }}
            transition={{
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
            onMouseDown={(event) => event.stopPropagation()}
            className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-[#3b82f6]/35 bg-white p-6 text-[#0f172a] shadow-[0_30px_120px_rgba(0,0,0,0.8)] md:p-10"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close application form"
              className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/5 text-xl text-gray-600 transition hover:border-[#3b82f6]/50 hover:text-[#3b82f6]"
            >
              ×
            </button>

            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#3b82f6]">
                RPIANS Business Diagnostic
              </p>

              <h2 className="mt-4 font-serif text-3xl md:text-5xl">
                Apply for Your
                <span className="mt-2 block text-[#1d4ed8]">
                  Business Growth Session
                </span>
              </h2>

              <p className="mx-auto mt-5 max-w-xl leading-7 text-gray-600">
                Complete your details to continue to the
                secure ₹999 booking-payment page.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-9">
              <div className="grid gap-5 md:grid-cols-2">
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(event) =>
                    updateField(
                      "fullName",
                      event.target.value,
                    )
                  }
                  placeholder="Full Name"
                  className="rounded-xl border border-black/10 bg-black/[0.04] px-4 py-4 outline-none transition placeholder:text-gray-600 focus:border-[#3b82f6]"
                />

                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(event) =>
                    updateField(
                      "phone",
                      event.target.value,
                    )
                  }
                  placeholder="WhatsApp Number"
                  className="rounded-xl border border-black/10 bg-black/[0.04] px-4 py-4 outline-none transition placeholder:text-gray-600 focus:border-[#3b82f6]"
                />

                <input
                  type="email"
                  value={formData.email}
                  onChange={(event) =>
                    updateField(
                      "email",
                      event.target.value,
                    )
                  }
                  placeholder="Email Address"
                  className="rounded-xl border border-black/10 bg-black/[0.04] px-4 py-4 outline-none transition placeholder:text-gray-600 focus:border-[#3b82f6]"
                />

                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(event) =>
                    updateField(
                      "companyName",
                      event.target.value,
                    )
                  }
                  placeholder="Company Name"
                  className="rounded-xl border border-black/10 bg-black/[0.04] px-4 py-4 outline-none transition placeholder:text-gray-600 focus:border-[#3b82f6]"
                />

                <select
                  value={formData.businessCategory}
                  onChange={(event) =>
                    updateField(
                      "businessCategory",
                      event.target.value,
                    )
                  }
                  className="rounded-xl border border-black/10 bg-white px-4 py-4 outline-none transition focus:border-[#3b82f6]"
                >
                  <option value="">
                    Select Business Category
                  </option>
                  <option value="Retail">Retail</option>
                  <option value="Wholesale">
                    Wholesale
                  </option>
                  <option value="Distribution">
                    Distribution
                  </option>
                  <option value="Manufacturing">
                    Manufacturing
                  </option>
                  <option value="Service">
                    Service Business
                  </option>
                  <option value="Project">
                    Project / Construction
                  </option>
                </select>

                <select
                  value={formData.annualTurnover}
                  onChange={(event) =>
                    updateField(
                      "annualTurnover",
                      event.target.value,
                    )
                  }
                  className="rounded-xl border border-black/10 bg-white px-4 py-4 outline-none transition focus:border-[#3b82f6]"
                >
                  <option value="">
                    Select Annual Turnover
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

              {errorMessage && (
                <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={
                  isSubmitting
                    ? undefined
                    : { scale: 1.015 }
                }
                whileTap={
                  isSubmitting
                    ? undefined
                    : { scale: 0.98 }
                }
                className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#2563eb] px-7 py-4 font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? "Opening Payment Details..."
                  : "Continue to Payment – ₹999"}
              </motion.button>

              <p className="mt-4 text-center text-xs leading-6 text-gray-500">
                Your information remains confidential and is
                used only for your business diagnostic.
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}