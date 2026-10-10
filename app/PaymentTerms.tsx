import { formatInr, plans } from "./plans";

// Terms shown under the payment buttons on /payment. Edit the wording here.

const COMPANY_NAME = "RPIANS World Class Business Coaching LLP";
const CONTACT_EMAIL = "info@worldclassbc.com";
const CONTACT_PHONE = "+91 70495 61975";
const CONTACT_PHONE_TEL = "+917049561975";

// The strategy-call fee, read from plans.ts so the text follows the price.
const STRATEGY_CALL_AMOUNT = plans.find((plan) => plan.id === "strategy-call")?.amount;
const FEE = STRATEGY_CALL_AMOUNT != null ? formatInr(STRATEGY_CALL_AMOUNT) : "the application fee";

const STRATEGY_CALL_TERMS = [
  `Please note that the application fee of ${FEE} is necessary to reserve your spot and book a call.`,
  `If your application is not accepted, we will refund your ${FEE}.`,
  `If your application is accepted, we will refund your ${FEE} after the call.`,
  "Please note that we will not refund the application fee if you fail to show up for the scheduled call or cancel without providing at least 24 hours' notice.",
  "Upon paying the application fee, you will have 48 hours to submit your application form; otherwise, you may risk forfeiting your deposit.",
];

const linkClass = "font-bold text-[#1d4ed8]! hover:underline";

// Opens in a new tab so the visitor keeps their filled-in payment page.
function PolicyLink({ href, children }: { href: string; children: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
      {children}
    </a>
  );
}

function RefundPolicyNotice() {
  return (
    <>
      Before making a payment, please carefully read our{" "}
      <PolicyLink href="/refund-policy">refund policy</PolicyLink> and only
      proceed with the payment if you agree to our{" "}
      <PolicyLink href="/terms">Terms &amp; Conditions</PolicyLink>.
    </>
  );
}

const headingClass = "text-[13px] font-bold text-[#0f172a] sm:text-sm";

export default function PaymentTerms({ planId }: { planId?: string }) {
  const terms = planId === "strategy-call" ? STRATEGY_CALL_TERMS : [];

  return (
    <div className="mt-6 space-y-5 border-t border-black/10 pt-5 text-left text-[13px] font-medium leading-relaxed text-gray-600 sm:text-sm">
      <div>
        <h3 className={headingClass}>Terms &amp; Conditions</h3>

        <ul className="mt-2 list-disc space-y-1.5 pl-4 marker:text-[#3b82f6]">
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

        <p className="mt-2">
          You agree to share the information entered on this page with{" "}
          {COMPANY_NAME} (owner of this page) and Razorpay, in accordance with
          applicable laws.
        </p>
      </div>

      <div>
        <h3 className={headingClass}>Contact Us</h3>

        <p className="mt-2">{COMPANY_NAME}</p>

        <p>
          Email:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className={`${linkClass} break-all`}>
            {CONTACT_EMAIL}
          </a>
        </p>

        <p>
          Contact Number:{" "}
          <a href={`tel:${CONTACT_PHONE_TEL}`} className={linkClass}>
            {CONTACT_PHONE}
          </a>
        </p>
      </div>
    </div>
  );
}
