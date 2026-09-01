export default function TermsPage() {
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
          Terms and Conditions
        </h1>

        <p className="mt-5 text-gray-400">
          Last Updated: 22 July 2026
        </p>

        <div className="mt-12 space-y-10 leading-8 text-gray-300">
          <section>
            <h2 className="text-2xl font-bold text-white">
              1. Acceptance of Terms
            </h2>

            <p className="mt-4">
              By accessing this website, registering for a masterclass or
              enrolling in an RPIANS program, you agree to these Terms and
              Conditions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">
              2. Coaching and Educational Services
            </h2>

            <p className="mt-4">
              Our services provide business education, coaching,
              implementation frameworks, systems and strategic guidance.
              Results depend on the participant’s business situation,
              decisions, implementation and team involvement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">
              3. Payments
            </h2>

            <p className="mt-4">
              Program fees, payment schedules, taxes and instalment terms will
              be communicated before enrolment. Participants are responsible
              for making payments according to the agreed schedule.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">
              4. Intellectual Property
            </h2>

            <p className="mt-4">
              All training materials, templates, frameworks, recordings,
              dashboards and systems are the intellectual property of RPIANS
              World Class Business Coaching LLP. They may not be copied,
              resold or distributed without written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">
              5. Participant Responsibility
            </h2>

            <p className="mt-4">
              Participants are responsible for attending sessions,
              implementing recommendations, providing accurate business data
              and involving relevant team members.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white">
              6. Limitation of Liability
            </h2>

            <p className="mt-4">
              RPIANS is not responsible for losses caused by business
              decisions, non-implementation, market conditions, employee
              actions or third-party services.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}