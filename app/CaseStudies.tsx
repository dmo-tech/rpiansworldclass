"use client";

import { useRef } from "react";

import Image from "next/image";
import { useInView, useReducedMotion } from "motion/react";

import Reveal from "./Reveal";

type CaseStudy = {
  id: string;
  who: string;
  business: string;
  headline: string;
  bullets: string[];
  tagline: string;
  image: string;
};

const caseStudies: CaseStudy[] = [
  {
    id: "mamaji-jewellers",
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
    image: "/case-studies/mamaji-jewellers-owners.jpg",
  },
  {
    id: "shree-jee-hardware",
    who: "Mr. Ajay Laddha (Shree Jee Hardware)",
    business:
      "Distributor of EBCO Hardware for Madhya Pradesh and Chhattisgarh",
    headline: "From ₹35 Cr Inventory to Debt-Free & Scalable Business",
    bullets: [
      "₹35 Cr की Inventory में से approx 30% यानी करीब ₹10 Cr का stock clear हुआ.",
      "इससे working capital unlock हुई और company Debt-Free हो गई.",
      "Business में new product categories add की और 150 new dealers appoint किये.",
      "Team accountability और ownership improve हुई, जिससे owner का daily follow-up significantly reduce हुआ.",
      "Business Once-a-Week Leadership Mode की तरफ shift हुआ और owner का role Operator से CEO Mode में आया.",
      "Business more Stable, Scalable, Profitable and System-Driven बना.",
    ],
    tagline:
      "Inventory Control • Debt-Free • More Dealers • Scalable Growth • System-Driven Business",
    image: "/case-studies/ajay-laddha-shree-jee-hardware.jpg",
  },
  {
    id: "khandelwal-general-stores",
    who: "Mr. Saransh Khandelwal and Pratibha Khandelwal",
    business:
      "Owners of Khandelwal General Stores and Splash Box | Retailer and Wholesaler of Books, Stationery & Gift Items",
    headline: "From 3,000 Non-Performing Products to 2X Profit & System-Driven Growth",
    bullets: [
      "3,000 non-performing products ki selling close ki, jisse inventory around 40% reduce hui aur blocked working capital release hua.",
      "Low-GP products hata kar High-GP & Fast-Moving Products par focus kiya, aur Profit 2X ho gaya!",
      "₹60 Lakh ki Bank CC Limit completely close ho gayi.",
      "Owner Daily Firefighting se CEO Mode mein shift hue, jisse Time, Freedom aur Mental Peace mila.",
      "Business more Stable, Scalable & System-Driven bana.",
    ],
    tagline:
      "Inventory Optimization • 2X Profit • CC Limit Closed • CEO Mode • System-Driven Business",
    image: "/case-studies/saransh-khandelwal.jpg",
  },
  {
    id: "kishore-katariya",
    who: "Mr. Kishore Katariya & Karan Katariya (Chennai)",
    business: "Gold and Diamond Jewellery Business",
    headline: "₹40 Cr Inventory Unlocked with a Data-Driven Approach",
    bullets: [
      "32 kg non-moving gold jewellery identify hua, approx ₹40 Cr inventory value unlocked hui.",
      "Inventory visibility aur control improve hua.",
      "Daily GP tracking start hui.",
      "Product-wise contribution ratio track hua.",
      "MoM & YoY comparison start hua jisse decisions data-based hone lage.",
      "Customer objection handling SOP se conversion ratio badh gaya.",
      "Hiring + onboarding + training system implement hone se HOD ka blackmailing khatam ho gaya.",
      "Performance standards set hue saath hi Inventory, sales, margin & productivity dashboards live hue.",
      "Team accountability improve hui.",
      "Chennai mein new branch expansion planning start hui.",
      "Ab unka business systems, data, SOPs and dashboards par run hone laga.",
    ],
    tagline:
      "Inventory Control • Higher Conversion • Data-Driven Decisions • Team Accountability • Expansion",
    image: "/case-studies/kishore-katariya.jpg",
  },
];

function CaseStudyRow({ study }: { study: CaseStudy }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const isActive = useInView(ref, { margin: "-35% 0px -35% 0px" });

  return (
    <div
      ref={ref}
      className="overflow-hidden rounded-3xl border border-[#d9a441]/25 bg-white/[0.02] transition-[opacity,filter] duration-500 ease-out"
      style={
        reduceMotion
          ? undefined
          : {
              opacity: isActive ? 1 : 0.18,
              filter: isActive ? "brightness(1)" : "brightness(0.35)",
            }
      }
    >
      <div className="grid gap-0 lg:grid-cols-2">
        <div className="relative h-72 lg:h-full lg:min-h-[420px]">
          <Image
            src={study.image}
            alt={`${study.who} — ${study.business}`}
            fill
            className="object-cover"
          />
        </div>

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
              <li key={bullet} className="flex gap-3 leading-7 text-gray-300">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d9a441]" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#b67b20] via-[#f1c363] to-[#bd8126] px-8 py-4 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-black">
          {study.tagline}
        </p>
      </div>
    </div>
  );
}

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
            <CaseStudyRow key={study.id} study={study} />
          ))}
        </div>
      </div>
    </section>
  );
}
