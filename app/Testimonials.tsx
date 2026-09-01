import Link from "next/link";

const testimonials = [
  {
    name: "Khandelwal General Stores",
    location: "Betul, Madhya Pradesh",
    result: "Inventory reduced by 30–40%",
    review:
      "RPIANS systems helped us identify non-moving inventory, improve stock control and release blocked working capital.",
  },
  {
    name: "Ganpati Laminates",
    location: "Madhya Pradesh",
    result: "₹1 Crore+ monthly sales",
    review:
      "SKU-wise profit tracking and inventory analysis helped us focus on high-margin and fast-moving product categories.",
  },
  {
    name: "Panawa Boutique",
    location: "Nagpur, Maharashtra",
    result: "Owner dependency reduced",
    review:
      "After implementing delegation and accountability systems, most non-revenue activities were successfully transferred to the team.",
  },
];

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="border-y border-white/10 bg-white/[0.02] px-6 py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-[#d9a441]">
            Client Testimonials
          </p>

          <h2 className="mt-5 font-serif text-4xl md:text-6xl">
            What Business Owners Say
            <br />
            About RPIANS
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-400">
            Real business owners sharing the results achieved through
            structured systems, implementation and full hand-holding.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.name}
              className="rounded-2xl border border-white/10 bg-black p-8 transition hover:-translate-y-1 hover:border-[#d9a441]/50"
            >
              <div className="text-4xl text-[#d9a441]">“</div>

              <p className="mt-4 leading-8 text-gray-300">
                {testimonial.review}
              </p>

              <div className="mt-7 border-t border-white/10 pt-6">
                <h3 className="text-lg font-bold text-white">
                  {testimonial.name}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {testimonial.location}
                </p>

                <p className="mt-4 text-sm font-semibold text-[#edc66d]">
                  {testimonial.result}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/register"
            className="inline-block rounded-lg bg-gradient-to-r from-[#b67b20] via-[#f1c363] to-[#bd8126] px-10 py-4 font-bold text-black transition hover:scale-105"
          >
            Start Your Business Transformation
          </Link>
        </div>
      </div>
    </section>
  );
}