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
      className="border-y border-black/10 bg-black/[0.02] px-6 py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-[#3b82f6]">
            Client Testimonials
          </p>

          <h2 className="mt-5 font-serif text-4xl md:text-6xl">
            What Business Owners Say
            <br />
            About RPIANS
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600">
            Real business owners sharing the results achieved through
            structured systems, implementation and full hand-holding.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.name}
              className="rounded-2xl border border-black/10 bg-white p-8 transition hover:-translate-y-1 hover:border-[#3b82f6]/50"
            >
              <div className="text-4xl text-[#3b82f6]">“</div>

              <p className="mt-4 leading-8 text-gray-600">
                {testimonial.review}
              </p>

              <div className="mt-7 border-t border-black/10 pt-6">
                <h3 className="text-lg font-bold text-[#0f172a]">
                  {testimonial.name}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {testimonial.location}
                </p>

                <p className="mt-4 text-sm font-semibold text-[#1d4ed8]">
                  {testimonial.result}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/register"
            className="inline-block rounded-lg bg-gradient-to-r from-[#86efac] to-[#16a34a] px-10 py-4 font-bold text-white transition hover:scale-105"
          >
            Start Your Business Transformation
          </Link>
        </div>
      </div>
    </section>
  );
}