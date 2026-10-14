// Questions for the one-question-at-a-time forms (QuestionFlow): the business
// details on /register and the application form after payment
// (/application). Validation lives here so the browser and /api/application
// check answers the same way.

export type Question<Id extends string = string> = {
  id: Id;
  // Shown as the question.
  label: string;
  // Short name for errors and the Google Sheet column; defaults to label.
  column?: string;
  maxLength?: number;
} & (
  | {
      kind: "input";
      type: "text" | "tel" | "email" | "number";
      placeholder?: string;
      autoComplete?: string;
    }
  | {
      kind: "select";
      options: string[];
    }
  | {
      kind: "textarea";
    }
);

export const questionName = (question: Question) =>
  question.column ?? question.label;

export function validateAnswer(question: Question, value: string): string {
  if (question.kind === "input" && question.type === "tel") {
    if (value.replace(/\D/g, "").length < 10) {
      return "Please enter a valid WhatsApp number.";
    }
  } else if (!value.trim()) {
    return `Please enter your ${questionName(question).toLowerCase()}.`;
  }

  if (
    question.kind === "input" &&
    question.type === "email" &&
    !value.includes("@")
  ) {
    return "Please enter a valid email address.";
  }

  if (question.kind === "select" && !question.options.includes(value)) {
    return "Please choose one of the options.";
  }

  if (question.maxLength && value.length > question.maxLength) {
    return `Please keep it under ${question.maxLength} characters.`;
  }

  return "";
}

export const BUSINESS_CATEGORY_OPTIONS = [
  "Retail",
  "Wholesale",
  "Distribution",
  "Manufacturing",
  "Service Business",
  "Construction / Project",
  "Other",
];

export const ANNUAL_TURNOVER_OPTIONS = [
  "Below ₹1 Crore",
  "₹1–5 Crore",
  "₹5–10 Crore",
  "₹10–25 Crore",
  "₹25–50 Crore",
  "₹50 Crore+",
];

// The application form after payment. The first four come pre-filled from
// the booking (sessionStorage) for the visitor to check; the rest are the
// application questions. Each answer goes to the "application form data"
// sheet under its column name, so renaming a column starts a new one there.
export const CONTACT_QUESTIONS = [
  {
    id: "fullName",
    label: "Full Name",
    kind: "input",
    type: "text",
    placeholder: "Enter your full name",
    autoComplete: "name",
    maxLength: 100,
  },
  {
    id: "phone",
    label: "WhatsApp Number",
    kind: "input",
    type: "tel",
    placeholder: "10 digit mobile number",
    autoComplete: "tel",
    maxLength: 20,
  },
  {
    id: "email",
    label: "Email Address",
    kind: "input",
    type: "email",
    placeholder: "name@company.com",
    autoComplete: "email",
    maxLength: 150,
  },
  {
    id: "companyName",
    label: "Company Name",
    kind: "input",
    type: "text",
    placeholder: "Enter company name",
    autoComplete: "organization",
    maxLength: 150,
  },
] as const satisfies Question[];

export type ContactId = (typeof CONTACT_QUESTIONS)[number]["id"];

export const APPLICATION_QUESTIONS: Question[] = [
  {
    id: "businessCategory",
    label: "Business Category",
    kind: "select",
    options: BUSINESS_CATEGORY_OPTIONS,
  },
  {
    id: "annualTurnover",
    label: "Annual Turnover",
    kind: "select",
    options: ANNUAL_TURNOVER_OPTIONS,
  },
  {
    id: "employeeCount",
    label: "Number of Employees",
    kind: "input",
    type: "number",
    placeholder: "Enter number of employees",
    maxLength: 7,
  },
  {
    id: "city",
    label: "City",
    kind: "input",
    type: "text",
    placeholder: "Enter your city",
    autoComplete: "address-level2",
    maxLength: 100,
  },
  {
    id: "yearsInBusiness",
    label: "Years in Business",
    kind: "select",
    options: [
      "Less than 2 years",
      "2–5 years",
      "5–10 years",
      "10–20 years",
      "20+ years",
    ],
  },
  {
    id: "biggestChallenge",
    label: "What is the biggest challenge in your business right now?",
    column: "Biggest Challenge",
    kind: "textarea",
    maxLength: 1000,
  },
  {
    id: "goal",
    label: "What do you want to achieve in the next 12 months?",
    column: "Goal for the Next 12 Months",
    kind: "textarea",
    maxLength: 1000,
  },
];
