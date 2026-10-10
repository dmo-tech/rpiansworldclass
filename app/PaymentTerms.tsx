import { formatInr, plans } from "./plans";
import { CONTACT_PHONE, CONTACT_PHONE_TEL } from "./siteConfig";

// Terms shown on /payment (left column on desktop, below the payment card on
// phones). Edit the wording here.

const COMPANY_NAME = "RPIANS World Class Business Coaching LLP";
const CONTACT_EMAIL = "info@worldclassbc.com";

// The strategy-call fee, read from plans.ts so the text follows the price.
const STRATEGY_CALL_AMOUNT = plans.find((plan) => plan.id === "strategy-call")?.amount;
const FEE = STRATEGY_CALL_AMOUNT != null ? formatInr(STRATEGY_CALL_AMOUNT) : "the application fee";

const STRATEGY_CALL_TERMS = [
  `Please note that the application fee of ${FEE} is necessary to reserve your spot and book a call.`,
  `If your application is not accepted, we will refund your ${FEE}.`,
  `If your application is accepted, we will refund your ${FEE} after the call.`,
  "Please note that we will not refund the application fee if you fail to show up for the scheduled call or cancel without providing at least 24 hours' notice.",
  "After paying the application fee, our team will share a short application form with you on WhatsApp. Please submit it within 48 hours; otherwise, you may risk forfeiting your deposit.",
];

const linkClass = "font-bold text-[#1d4ed8]! hover:underline";

// Same tab; ?from=payment shows a "Back to Payment" button on /refund-policy,
// and /payment re-reads the booking from sessionStorage when the visitor returns.
function RefundPolicyNotice() {
  return (
    <>
      Before making a payment, please carefully read our{" "}
      <a href="/refund-policy?from=payment" className={linkClass}>
        refund policy
      </a>{" "}
      and only proceed with the payment if you agree to these terms.
    </>
  );
}

const headingClass = "text-base font-bold text-[#0f172a] md:text-lg";

export default function PaymentTerms({
  planId,
  className = "",
}: {
  planId?: string;
  className?: string;
}) {
  const terms = planId === "strategy-call" ? STRATEGY_CALL_TERMS : [];

  return (
    <div
      className={`space-y-6 rounded-2xl border border-[#1d4ed8]/20 bg-white/70 p-6 text-left text-sm font-medium leading-relaxed text-gray-600 md:p-7 md:text-[15px] md:leading-7 ${className}`}
    >
      <div>
        <h3 className={headingClass}>Terms &amp; Conditions</h3>

        <ul className="mt-3 list-disc space-y-2 pl-5 marker:text-[#3b82f6]">
          {terms.map((term) => (
            <li key={term}>{term}</li>
          ))}

          <li>
            <RefundPolicyNotice />
          </li>
        </ul>
      </div>

      <div>
        <h3 className={headingClass}>Information Sharing &amp; Consent</h3>

        <p className="mt-3">
          You agree to share the information entered on this page with{" "}
          {COMPANY_NAME} (owner of this page) and Razorpay, in accordance with
          applicable laws.
        </p>
      </div>

      <div>
        <h3 className={headingClass}>Contact Us</h3>

        <p className="mt-3">{COMPANY_NAME}</p>

        <p>
          Email:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className={`${linkClass} break-all`}>
            {CONTACT_EMAIL}
          </a>
        </p>

        <p>
          Contact Number:{" "}
          <a href={CONTACT_PHONE_TEL} className={linkClass}>
            {CONTACT_PHONE}
          </a>
        </p>
      </div>
    </div>
  );
}
