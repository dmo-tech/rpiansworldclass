export type WhoIsThisForSegment = {
  slug: string;
  label: string;
  eyebrow: string;
  headingLine1: string;
  headingLine2: string;
  description: string;
  audience: string;
  painPoints: string[];
  solutions: string[];
};

export const whoIsThisForSegments: WhoIsThisForSegment[] = [
  {
    slug: "retailer",
    label: "Retailer",
    eyebrow: "For Retail Business Owners",
    headingLine1: "Turn Your Retail Store Into",
    headingLine2: "A Profit Machine",
    description:
      "Stop losing money to stock-outs, shrinkage and untrained staff. Build a retail business that runs and grows even when you are not on the floor.",
    audience: "Retail Store Owners & Chains",
    painPoints: [
      "Inventory shrinkage and stock-outs",
      "Billing and cash counter mismatches",
      "Staff not accountable for sales targets",
      "Low footfall-to-sale conversion",
      "No visibility on daily profit",
    ],
    solutions: [
      "Inventory control system",
      "Daily sales & cash dashboard",
      "Staff KRA and incentive structure",
      "Customer conversion SOPs",
      "Store-wise profit tracking",
    ],
  },
  {
    slug: "distributors",
    label: "Distributors",
    eyebrow: "For Distributors",
    headingLine1: "Build a Distribution Business",
    headingLine2: "That Runs Without You",
    description:
      "Control your stockist network, receivables and delivery cycle with systems that keep your business predictable and profitable.",
    audience: "Distributors & Stockists",
    painPoints: [
      "Delayed payments from retailers",
      "Poor visibility on stockist performance",
      "Warehouse and dispatch delays",
      "Scheme and margin leakage",
      "Sales team not following route plans",
    ],
    solutions: [
      "Credit control & receivables system",
      "Stockist performance dashboard",
      "Warehouse & dispatch SOPs",
      "Scheme tracking system",
      "Beat plan & route accountability",
    ],
  },
  {
    slug: "wholesalers",
    label: "Wholesalers",
    eyebrow: "For Wholesalers",
    headingLine1: "Scale Your Wholesale Business",
    headingLine2: "With Predictable Systems",
    description:
      "Move from managing chaos to managing a system — control bulk inventory, credit risk and order cycles with clarity.",
    audience: "Wholesale Traders",
    painPoints: [
      "Bulk inventory turnover issues",
      "Credit risk with retail buyers",
      "Margin erosion on bulk orders",
      "Slow order-to-delivery cycle",
      "No real-time stock visibility",
    ],
    solutions: [
      "Bulk inventory management system",
      "Buyer credit-limit controls",
      "Margin protection pricing rules",
      "Order fulfilment SOPs",
      "Real-time stock dashboard",
    ],
  },
  {
    slug: "manufacturers",
    label: "Manufacturers",
    eyebrow: "For Manufacturers",
    headingLine1: "Automate Your Factory",
    headingLine2: "Floor to Boardroom",
    description:
      "Build production, procurement and quality systems that keep output, cost and quality under control — without you firefighting daily.",
    audience: "Manufacturing Business Owners",
    painPoints: [
      "Unplanned machine downtime",
      "Raw material procurement delays",
      "Inconsistent product quality",
      "Shop floor staff not accountable",
      "No clear cost-per-unit visibility",
    ],
    solutions: [
      "Production planning system",
      "Raw material inventory control",
      "Quality control checkpoints",
      "Shop floor KRA & KPI system",
      "Cost-per-unit tracking dashboard",
    ],
  },
  {
    slug: "project-based",
    label: "Project Based",
    eyebrow: "For Project-Based Businesses",
    headingLine1: "Run Every Project",
    headingLine2: "On Time and On Budget",
    description:
      "For construction, contracting and project businesses — control costing, vendors and cash flow across multiple sites at once.",
    audience: "Construction & Project-Based Businesses",
    painPoints: [
      "Cost overruns on projects",
      "Milestone billing delays",
      "Vendor and subcontractor mismanagement",
      "Site-to-office communication gaps",
      "Cash flow stress across projects",
    ],
    solutions: [
      "Project costing & budget tracking",
      "Milestone-based billing system",
      "Vendor & subcontractor SOPs",
      "Site progress reporting system",
      "Multi-project cash flow dashboard",
    ],
  },
  {
    slug: "service-based",
    label: "Service Based",
    eyebrow: "For Service-Based Businesses",
    headingLine1: "Deliver Consistent Service",
    headingLine2: "Without Doing It All Yourself",
    description:
      "Standardise delivery, free yourself from daily operations and build a service business that keeps clients coming back.",
    audience: "Service & Consulting Businesses",
    painPoints: [
      "Inconsistent service delivery",
      "Founder involved in every client",
      "Low team utilization",
      "Client churn and poor retention",
      "No clear pricing or scope control",
    ],
    solutions: [
      "Service delivery SOPs",
      "Client onboarding system",
      "Team utilization dashboard",
      "Retention & follow-up system",
      "Scope and pricing framework",
    ],
  },
  {
    slug: "export-import",
    label: "Export - Import",
    eyebrow: "For Export-Import Businesses",
    headingLine1: "Systemise Your",
    headingLine2: "Global Trade Operations",
    description:
      "Handle documentation, compliance and working capital with systems built for the complexity of international trade.",
    audience: "Export & Import Businesses",
    painPoints: [
      "Documentation and compliance errors",
      "Forex fluctuation risk",
      "Delayed payment cycles",
      "Logistics and customs delays",
      "Working capital pressure",
    ],
    solutions: [
      "Documentation & compliance checklist system",
      "Forex risk tracking",
      "Payment cycle & LC management",
      "Logistics coordination SOPs",
      "Working capital planning system",
    ],
  },
];

export function getWhoIsThisForSegment(slug: string) {
  return whoIsThisForSegments.find((segment) => segment.slug === slug);
}
