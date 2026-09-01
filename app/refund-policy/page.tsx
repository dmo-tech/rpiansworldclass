export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-20 text-white">
      <div className="mx-auto max-w-4xl">
        <a href="/" className="text-[#d9a441]">
          ← Return to Home
        </a>

        <p className="mt-12 text-xs uppercase tracking-[0.35em] text-[#d9a441]">
          Legal Information
        </p>

        <h1 className="mt-5 font-serif text-4xl md:text-6xl">
          Refund Policy
        </h1>

        <p className="mt-5 text-gray-400">
          Last Updated: 22 July 2026
        </p>

        <div className="mt-12 space-y-10 leading-8 text-gray-300">
          <section>
            <h2 className="text-2xl font-bold text-white">
              1. Masterclass Registration
            </h2>

            <p className="mt-4">
              Masterclass or consultation booking fees may be non-refundable
              unless otherwise mentioned at the time of payment.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">
              2. Program Enrolment
            </h2>

            <p className="mt-4">
              Refund eligibility for paid coaching programs will depend on the
              written proposal, agreement, offer terms and implementation
              commitments shared during enrolment.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">
              3. Implementation Requirements
            </h2>

            <p className="mt-4">
              Any result-based or money-back commitment is subject to the
              participant attending sessions, completing assignments,
              providing required data, involving the team and implementing the
              recommended systems within the agreed timeline.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">
              4. Refund Request
            </h2>

            <p className="mt-4">
              Refund requests must be submitted in writing with payment
              details, program information and the reason for the request.
              Requests will be reviewed according to the agreed program terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">
              5. Processing Time
            </h2>

            <p className="mt-4">
              Approved refunds, where applicable, will be processed through the
              original payment method within the communicated processing
              period.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}