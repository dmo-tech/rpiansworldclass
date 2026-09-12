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
  imagePosition?: string;
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
      "Cleared approx 30% of the ₹35 Cr inventory — around ₹10 Cr of stock.",
      "This unlocked working capital and made the company debt-free.",
      "Added new product categories and appointed 150 new dealers.",
      "Team accountability and ownership improved, significantly reducing the owner's daily follow-up.",
      "The business shifted to a once-a-week leadership mode, and the owner's role moved from Operator to CEO Mode.",
      "The business became more stable, scalable, profitable, and system-driven.",
    ],
    tagline:
      "Inventory Control • Debt-Free • More Dealers • Scalable Growth • System-Driven Business",
    image: "/case-studies/ajay-laddha-shree-jee-hardware.jpg",
    imagePosition: "object-top",
  },
  {
    id: "khandelwal-general-stores",
    who: "Mr. Saransh Khandelwal and Pratibha Khandelwal",
    business:
      "Owners of Khandelwal General Stores and Splash Box | Retailer and Wholesaler of Books, Stationery & Gift Items",
    headline: "From 3,000 Non-Performing Products to 2X Profit & System-Driven Growth",
    bullets: [
      "Closed out 3,000 non-performing products, reducing inventory by around 40% and releasing blocked working capital.",
      "Removed low-GP products and focused on high-GP & fast-moving products, doubling profit!",
      "Completely closed a ₹60 Lakh bank CC limit.",
      "The owner shifted from daily firefighting to CEO Mode, gaining time, freedom, and mental peace.",
      "The business became more stable, scalable, and system-driven.",
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
      "Identified 32 kg of non-moving gold jewellery, unlocking approx ₹40 Cr in inventory value.",
      "Improved inventory visibility and control.",
      "Started daily GP tracking.",
      "Tracked product-wise contribution ratio.",
      "Started MoM & YoY comparisons, making decisions data-based.",
      "A customer objection-handling SOP increased the conversion ratio.",
      "A hiring + onboarding + training system ended individual HODs' leverage over the business.",
      "Set performance standards, and inventory, sales, margin & productivity dashboards went live.",
      "Improved team accountability.",
      "Started planning a new branch expansion in Chennai.",
      "The business now runs on systems, data, SOPs, and dashboards.",
    ],
    tagline:
      "Inventory Control • Higher Conversion • Data-Driven Decisions • Team Accountability • Expansion",
    image: "/case-studies/kishore-katariya.jpg",
  },
  {
    id: "pushpendra-jaiswal",
    who: "Mr. Pushpendra Jaiswal (Ganpati Laminates, Bhopal)",
    business:
      "Wholesaler of plywood, laminates, charcoal sheet, and all types of interior items",
    headline: "From Product-Wise GP Tracking to 2X Profit & Branch Expansion",
    bullets: [
      "Started product-wise Gross Profit tracking and Inventory Turnover Analysis.",
      "Closed out low-GP, low-rotation products and shifted focus to high-GP, high-rotation products.",
      "This doubled profit.",
      "Added new categories alongside laminates and plywood.",
      "Inventory discipline strengthened working capital control.",
      "Achieved 2X profit growth in the current year.",
      "Planned and opened the next branch expansion in Indore.",
      "Ganpati Laminates now runs on systems, high margins, and data.",
      "Created a strong market position compared to competitors.",
    ],
    tagline:
      "GP Tracking • 2X Profit • Working Capital Control • Branch Expansion • System-Driven Business",
    image: "/case-studies/pushpendra-jaiswal.jpg",
  },
];

function CaseStudyRow({ study }: { study: CaseStudy }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const isActive = useInView(ref, { margin: "-35% 0px -35% 0px" });

  return (
    <div
      ref={ref}
      className="overflow-hidden rounded-3xl border border-[#3b82f6]/25 bg-white/[0.02] transition-[opacity,filter] duration-500 ease-out"
      style={
        reduceMotion
          ? undefined
          : {
              opacity: isActive ? 1 : 0.18,
              filter: isActive ? "brightness(1)" : "brightness(0.35)",
            }
      }
    >
      <div className="grid gap-0 lg:grid-cols-2 lg:items-stretch">
        <div className="relative h-56 w-full bg-[#0a0e1a] sm:h-64 lg:h-auto">
          <Image
            src={study.image}
            alt={`${study.who} — ${study.business}`}
            fill
            className={`object-cover ${study.imagePosition ?? "object-center"}`}
          />
        </div>

        <div className="p-6 md:p-8">
          <p className="text-xs text-gray-400">
            Who — {study.who}, {study.business}
          </p>

          <h3 className="mt-2 font-serif text-lg leading-tight text-[#93c5fd] md:text-xl">
            {study.headline}
          </h3>

          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-white">
            After implementing the strategy
          </p>

          <ul className="mt-3 space-y-2">
            {study.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-2.5 text-sm leading-6 text-gray-300">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#3b82f6]" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#ef4444] via-[#22c55e] to-[#3b82f6] px-6 py-3 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-white">
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
          <p className="text-xs uppercase tracking-[0.35em] text-[#3b82f6]">
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
