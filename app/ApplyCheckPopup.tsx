"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  type FormEvent,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";

import {
  OPEN_APPLY_CHECK_EVENT,
  type OpenApplyCheckDetail,
  WATCH_VIDEO_ID,
  watchVideoHref,
} from "./applyFlow";
import { CalendarIcon } from "./BookCallButton";
import { saveStrategyCallBooking } from "./strategyCallBooking";
import ViewerDetailsForm, {
  cleanViewer,
  EMPTY_VIEWER,
  type FormErrors,
  readSavedViewer,
  validateViewer,
  type Viewer,
  VIEWER_KEY,
} from "./ViewerDetailsForm";
import WatchedVideoQuestion from "./WatchedVideoQuestion";

// The popup behind every "Start Your Business Transformation Today" and
// "Enquire Now" button (WatchApplyButton) and Book a Call below the /watch
// video, mounted once for the whole site in the root layout so it stays open
// when the mobile menu closes.
//
// 1. "One Important Thing": has the visitor watched the full video?
// 2. "Yes": the /watch details form (prefilled from the last details saved
//    on this browser), saved as a lead in "video form data". Then straight to
//    /payment for the ₹999 strategy call, with the name, WhatsApp and email
//    filled in; the call time and the application form come after paying.
//    Without storage it opens /book-call instead.
//    "No": /watch?from=… — the video, ready to play without the details
//    form. Already on /watch, it just closes and scrolls to the video.
//
// A page opened with ?enquire=1&from=… opens it on load (worldclassbc.com/
// training lands on the homepage this way, see next.config.ts).

const PAYMENT_HREF = "/payment?plan=strategy-call";

type Step = "question" | "form";

// `from` arriving in a URL: printable and short, as on /watch.
const cleanFrom = (value: string | null) =>
  (value ?? "").replace(/[\u0000-\u001f]/g, "").trim().slice(0, 80);

export default function ApplyCheckPopup() {
  const router = useRouter();
  const pathname = usePathname();

  // The button's page or place while open; null when closed.
  const [from, setFrom] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("question");
  const [formData, setFormData] = useState<Viewer>(EMPTY_VIEWER);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shownPathname, setShownPathname] = useState(pathname);

  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  // Closing on the backdrop needs the press to start there too, so text
  // selected by dragging out of a field doesn't close the form.
  const pressedBackdropRef = useRef(false);

  // "Yes" / "No" go to another page; the popup stays up until it opens.
  if (pathname !== shownPathname) {
    setShownPathname(pathname);
    setFrom(null);
  }

  const isOpen = from !== null;

  const open = (nextFrom: string) => {
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    setStep("question");
    setFormErrors({});
    setIsSubmitting(false);
    setFrom(nextFrom);
  };

  const close = () => {
    setFrom(null);
    returnFocusRef.current?.focus({ preventScroll: true });
  };

  const onOpenEvent = useEffectEvent((event: Event) => {
    // Tells the button the popup took the click (see openApplyCheck).
    event.preventDefault();
    open((event as CustomEvent<OpenApplyCheckDetail>).detail.from);
  });

  const onEnquireLink = useEffectEvent(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("enquire") !== "1") {
      return;
    }

    const linkFrom = cleanFrom(params.get("from")) || "Link";

    // Off the address bar, so a reload or Back doesn't ask again.
    params.delete("enquire");
    params.delete("from");
    const query = params.toString();
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`,
    );

    open(linkFrom);
  });

  useEffect(() => {
    window.addEventListener(OPEN_APPLY_CHECK_EVENT, onOpenEvent);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the URL is only readable after mount
    onEnquireLink();

    return () => {
      window.removeEventListener(OPEN_APPLY_CHECK_EVENT, onOpenEvent);
    };
  }, []);

  const onEscape = useEffectEvent(close);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    document.body.style.overflow = "hidden";

    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onEscape();
      }
    };

    window.addEventListener("keydown", closeWithEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeWithEscape);
    };
  }, [isOpen]);

  // The "Yes" button that had focus is gone; keyboard users start again at
  // the top of the form.
  useEffect(() => {
    if (isOpen && step === "form") {
      dialogRef.current?.focus();
    }
  }, [isOpen, step]);

  const showForm = () => {
    const savedViewer = readSavedViewer();

    if (savedViewer) {
      setFormData(savedViewer);
    }

    setFormErrors({});
    setStep("form");
  };

  const backToVideo = () => {
    if (from === null) {
      return;
    }

    if (pathname !== "/watch") {
      router.push(watchVideoHref(from));
      return;
    }

    close();

    // On the next frame, once the popup has closed and the page can scroll.
    requestAnimationFrame(() => {
      document.getElementById(WATCH_VIDEO_ID)?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
          .matches
          ? "auto"
          : "smooth",
        block: "center",
      });
    });
  };

  // Typing in a field clears that field's error straight away.
  const updateField = (field: keyof Viewer, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setFormErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (from === null || isSubmitting) {
      return;
    }

    const cleaned = cleanViewer(formData);
    const errors = validateViewer(cleaned);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    const source = `RPIANS Website - Apply (Watched Video: Yes) - ${from}`;

    // Prefills the /watch form (and this one) next time.
    try {
      localStorage.setItem(VIEWER_KEY, JSON.stringify(cleaned));
    } catch {
      // Private mode: nothing to prefill next time.
    }

    // A lead in "video form data", like the /watch form. Never holds the
    // visitor up.
    fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        formType: "Video Form",
        ...cleaned,
        submittedAt: new Date().toISOString(),
        source,
      }),
      keepalive: true,
    }).catch((error) => {
      console.error("Apply form lead error (non-blocking):", error);
    });

    if (saveStrategyCallBooking(cleaned, source)) {
      router.push(PAYMENT_HREF);
    } else {
      setFrom(null);
      router.push(`/book-call?from=${encodeURIComponent(from)}`);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onPointerDown={(event) => {
        pressedBackdropRef.current = event.target === event.currentTarget;
      }}
      onClick={(event) => {
        if (pressedBackdropRef.current && event.target === event.currentTarget) {
          close();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={
          step === "question" ? "apply-check-title" : "apply-check-form-title"
        }
        aria-describedby={step === "question" ? "apply-check-text" : undefined}
        tabIndex={-1}
        className={`relative max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto overscroll-contain rounded-3xl bg-white p-6 shadow-2xl outline-none sm:p-8 ${
          step === "question" ? "text-center" : "text-left"
        }`}
      >
        {step === "question" ? (
          <WatchedVideoQuestion
            titleId="apply-check-title"
            textId="apply-check-text"
            onYes={showForm}
            onNo={backToVideo}
          />
        ) : (
          <>
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            >
              ×
            </button>

            <h2
              id="apply-check-form-title"
              className="pr-8 font-serif text-2xl font-bold leading-snug text-gray-900"
            >
              Enter your details to book your strategy call
            </h2>

            <ViewerDetailsForm
              idPrefix="apply-check"
              viewer={formData}
              errors={formErrors}
              onFieldChange={updateField}
              onSubmit={handleSubmit}
              submitLabel="Continue to Book Your Call"
              submitIcon={<CalendarIcon className="h-5 w-5 shrink-0" />}
              isSubmitting={isSubmitting}
            />
          </>
        )}
      </div>
    </div>
  );
}
