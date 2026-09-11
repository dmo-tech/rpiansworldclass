import Image from "next/image";

import Reveal from "./Reveal";

type CaseStudy = {
  who: string;
  business: string;
  headline: string;
  bullets: string[];
  tagline: string;
  peoplePhoto: string;
  showroomPhoto: string | null;
};

const caseStudies: CaseStudy[] = [
  {
    who: "Mr. Abhishek Tated and Abhinay Tated",
    business: "Mamaji Jewellers, (M.P.)",
    headline: "2 Showrooms Successfully Running with the Same Inventory",
    bullets: [
      "Data-driven decisions on sales, stock, margins, and performance review",
      "Built a World-Class Team Training Module",
      "Reduced dependency on HODs",
      "Daily firefighting significantly reduced",
      "Advanced Inventory Management System enabled 2 showrooms to run successfully with the same inventory",
      "3 new showroom expansion planning in Harda, Khandwa, and Chhindwara",
      "Now the business runs through a world-class dashboard",
      "Both business owners are focused on business growth and expansion",
    ],
    tagline: "System-Driven Business • Growth • Expansion",
    peoplePhoto: "/case-studies/mamaji-jewellers-owners.jpg",
    showroomPhoto: null,
  },
];

export default function CaseStudies() {
  return (
    <section id="case-studies" className="border-t border-white/10 px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal direction="up" className="mx-auto max-w-4xl text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-[#d9a441]">
            Client Case Studies
          </p>

          <h2 className="mt-5 font-serif text-4xl md:text-6xl">
            In-Depth Business Transformations
          </h2>
        </Reveal>

        <div className="mt-16 space-y-16">
          {caseStudies.map((study) => (
            <Reveal
              key={study.business}
              direction="up"
              className="overflow-hidden rounded-3xl border border-[#d9a441]/25 bg-white/[0.02]"
            >
              <div className="grid gap-0 lg:grid-cols-2">
                <div className="p-8 md:p-10">
                  <p className="text-sm text-gray-400">
                    Who — {study.who}, {study.business}
                  </p>

                  <h3 className="mt-3 font-serif text-2xl leading-tight text-[#edc66d] md:text-3xl">
                    {study.headline}
                  </h3>

                  <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-white">
                    After implementing the strategy
                  </p>

                  <ul className="mt-4 space-y-3">
                    {study.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex gap-3 leading-7 text-gray-300"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d9a441]" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-rows-2 gap-[1px] bg-white/10">
                  <div className="relative h-64 lg:h-full">
                    <Image
                      src={study.peoplePhoto}
                      alt={`${study.who} — ${study.business}`}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="relative h-64 lg:h-full">
                    {study.showroomPhoto ? (
                      <Image
                        src={study.showroomPhoto}
                        alt={`${study.business} showroom`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-neutral-900 p-6 text-center">
                        <p className="text-sm text-gray-500">
                          Showroom photo coming soon
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#b67b20] via-[#f1c363] to-[#bd8126] px-8 py-4 text-center">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-black">
                  {study.tagline}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
