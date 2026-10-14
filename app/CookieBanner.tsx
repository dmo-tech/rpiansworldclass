"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import {
  type KeyboardEvent,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";

import {
  ALL_ACCEPTED,
  type ConsentCategory,
  type CookieConsent,
  ONLY_ESSENTIAL,
  OPEN_COOKIE_SETTINGS_EVENT,
  saveCookieConsent,
  useCookieConsent,
} from "./cookieConsent";

const CATEGORIES: {
  key: "essential" | ConsentCategory;
  title: string;
  description: string;
  examples: string;
}[] = [
  {
    key: "essential",
    title: "Essential",
    description:
      "Needed for the site to work, so they can't be turned off.",
    examples:
      "Login, secure payments with Razorpay, form security and remembering where you stopped in the video.",
  },
  {
    key: "analytics",
    title: "Analytics",
    description:
      "Show us how visitors use the site (pages seen, clicks), so we can improve it.",
    examples: "Google Analytics, Microsoft Clarity",
  },
  {
    key: "marketing",
    title: "Marketing",
    description:
      "Measure how our ads perform and show you relevant ads on other sites.",
    examples: "Meta Pixel (Facebook / Instagram), Google Ads",
  },
];

const buttonBase =
  "cursor-pointer whitespace-nowrap rounded-lg px-3 py-3 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-2 max-[359px]:px-2 max-[359px]:text-[13px] sm:px-5";

const primaryButton = `${buttonBase} bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white shadow-[0_10px_24px_rgba(37,99,235,0.3)] hover:brightness-110`;

const outlineButton = `${buttonBase} border border-[#3b82f6]/60 text-[#1d4ed8] hover:bg-[#3b82f6]/10`;

const quietButton = `${buttonBase} border border-black/15 text-[#0f172a] hover:border-[#3b82f6]/50 hover:text-[#1d4ed8]`;

const policyLinkClass =
  "whitespace-nowrap font-semibold text-[#1d4ed8]! underline underline-offset-2 transition-colors hover:text-[#2563eb]!";

function CookieIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="#2563eb"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-5 w-5 shrink-0"
    >
      <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
      <path d="M8.5 8.5v.01M16 15.5v.01M12 12v.01M11 17v.01M7 14v.01" />
    </svg>
  );
}

function Switch({
  checked,
  disabled = false,
  labelledBy,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  labelledBy: string;
  onChange?: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelledBy}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${
        checked ? "bg-[#2563eb]" : "bg-gray-300"
      }`}
    >
      <span
        aria-hidden="true"
        className={`inline-block h-5 w-5 rounded-full bg-white shadow-[0_2px_6px_rgba(15,23,42,0.25)] transition-transform duration-200 ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

// Cookie banner on the first visit, and the Customize panel (also opened by
// "Cookie Settings" in the footer and on /cookie-policy). The banner is above
// everything on the page, including the video details form that /watch opens
// on load (z-[120]) and the apply popup (z-[200]), so it can always be
// answered; the panel is above the banner.
export default function CookieBanner() {
  const consent = useCookieConsent();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [draft, setDraft] = useState<CookieConsent>(ONLY_ESSENTIAL);
  const [bannerHeight, setBannerHeight] = useState(0);
  const bannerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const showBanner = consent === null;

  const openSettings = () => {
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    // Unticked until the visitor turns a category on.
    setDraft(consent ?? ONLY_ESSENTIAL);
    setIsSettingsOpen(true);
  };

  const closeSettings = () => {
    setIsSettingsOpen(false);
    returnFocusRef.current?.focus();
  };

  const choose = (choice: CookieConsent) => {
    saveCookieConsent(choice);
    setIsSettingsOpen(false);
  };

  const onOpenSettingsEvent = useEffectEvent(openSettings);

  useEffect(() => {
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, onOpenSettingsEvent);

    return () => {
      window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, onOpenSettingsEvent);
    };
  }, []);

  useEffect(() => {
    if (!isSettingsOpen) return;

    panelRef.current?.focus();
    document.body.style.overflow = "hidden";

    const closeWithEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSettingsOpen(false);
        returnFocusRef.current?.focus();
      }
    };

    window.addEventListener("keydown", closeWithEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeWithEscape);
    };
  }, [isSettingsOpen]);

  // A spacer as tall as the banner at the end of the page, so the bottom of
  // the page (footer links, the end of /cookie-policy) can still be scrolled
  // into view above it.
  useEffect(() => {
    const banner = bannerRef.current;

    if (!showBanner || !banner) return;

    const observer = new ResizeObserver(() => {
      setBannerHeight(banner.offsetHeight);
    });

    observer.observe(banner);

    return () => {
      observer.disconnect();
    };
  }, [showBanner]);

  // Keeps Tab inside the open panel.
  const keepFocusInPanel = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab" || !panelRef.current) return;

    const focusable = panelRef.current.querySelectorAll<HTMLElement>(
      "button:not([disabled]), a[href]",
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (!first || !last) return;

    if (
      event.shiftKey &&
      (document.activeElement === first ||
        document.activeElement === panelRef.current)
    ) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <>
      {showBanner && <div aria-hidden="true" style={{ height: bannerHeight }} />}

      <AnimatePresence>
        {showBanner && (
          <motion.div
            ref={bannerRef}
            role="region"
            aria-labelledby="cookie-banner-title"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 z-[205] border-t border-black/10 bg-white text-[#0f172a] shadow-[0_-16px_50px_rgba(15,23,42,0.14)]"
          >
            <div
              aria-hidden="true"
              className="h-[3px] bg-gradient-to-r from-[#1d4ed8] via-[#3b82f6] to-[#60a5fa]"
            />

            <div className="site-container flex flex-col gap-4 py-4 sm:py-5 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
              <div className="lg:max-w-3xl">
                <p
                  id="cookie-banner-title"
                  className="flex items-center gap-2 text-base font-bold"
                >
                  <CookieIcon />
                  We value your privacy
                </p>

                <p className="mt-1.5 text-sm font-medium leading-6 text-gray-600">
                  We use essential cookies to run this site: login, payments,
                  form security and saving your video progress. With your OK,
                  we&rsquo;d also like to use analytics and marketing cookies
                  to improve the site and our ads.{" "}
                  <Link href="/cookie-policy" className={policyLinkClass}>
                    Cookie Policy
                  </Link>
                </p>
              </div>

              {/* Phones: Customize on top, then Reject / Accept side by side. */}
              <div className="grid grid-cols-2 gap-2.5 sm:flex sm:shrink-0 sm:items-center sm:justify-end">
                <button
                  type="button"
                  onClick={openSettings}
                  className={`col-span-2 ${quietButton}`}
                >
                  Customize
                </button>

                <button
                  type="button"
                  onClick={() => choose(ONLY_ESSENTIAL)}
                  className={outlineButton}
                >
                  Reject Non-Essential
                </button>

                <button
                  type="button"
                  onClick={() => choose(ALL_ACCEPTED)}
                  className={primaryButton}
                >
                  Accept All
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={closeSettings}
            className="fixed inset-0 z-[210] flex items-end justify-center bg-[#0f172a]/60 backdrop-blur-sm sm:items-center sm:px-4 sm:py-8"
          >
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="cookie-settings-title"
              tabIndex={-1}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onMouseDown={(event) => event.stopPropagation()}
              onKeyDown={keepFocusInPanel}
              className="relative max-h-[92dvh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 text-[#0f172a] shadow-[0_30px_100px_rgba(0,0,0,0.35)] outline-none sm:max-w-xl sm:rounded-2xl sm:p-8"
            >
              <button
                type="button"
                onClick={closeSettings}
                aria-label="Close cookie settings"
                className="absolute right-4 top-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-black/10 text-xl text-gray-600 transition hover:border-[#3b82f6]/50 hover:text-[#3b82f6] sm:right-5 sm:top-5"
              >
                ×
              </button>

              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#3b82f6]">
                Cookie Settings
              </p>

              <h2
                id="cookie-settings-title"
                className="mt-2 pr-10 text-2xl font-bold sm:text-3xl"
              >
                Choose your cookies
              </h2>

              <p className="mt-2 text-sm font-medium leading-6 text-gray-600">
                Essential cookies are always on. Turn the others on or off and
                save. You can change this any time from &ldquo;Cookie
                Settings&rdquo; at the bottom of the page.
              </p>

              <ul className="mt-5 space-y-3">
                {CATEGORIES.map((category) => {
                  const isEssential = category.key === "essential";
                  const titleId = `cookie-category-${category.key}`;

                  return (
                    <li
                      key={category.key}
                      className="rounded-xl border border-black/10 bg-[#f8fafc] p-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <h3 id={titleId} className="text-base font-bold">
                          {category.title}
                          {isEssential && (
                            <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 align-middle text-[11px] font-semibold uppercase tracking-[0.12em] text-green-700">
                              Always on
                            </span>
                          )}
                        </h3>

                        {category.key === "essential" ? (
                          <Switch checked disabled labelledBy={titleId} />
                        ) : (
                          <Switch
                            checked={draft[category.key]}
                            labelledBy={titleId}
                            onChange={(checked) =>
                              setDraft((current) => ({
                                ...current,
                                [category.key]: checked,
                              }))
                            }
                          />
                        )}
                      </div>

                      <p className="mt-1.5 text-sm font-medium leading-6 text-gray-600">
                        {category.description}
                      </p>

                      <p className="mt-1 text-xs font-medium leading-5 text-gray-500">
                        {category.examples}
                      </p>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-6 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Link
                  href="/cookie-policy"
                  onClick={() => setIsSettingsOpen(false)}
                  className={`self-center text-sm ${policyLinkClass}`}
                >
                  Read the Cookie Policy
                </Link>

                <div className="grid grid-cols-2 gap-2.5 sm:flex">
                  <button
                    type="button"
                    onClick={() => choose(ALL_ACCEPTED)}
                    className={outlineButton}
                  >
                    Accept All
                  </button>

                  <button
                    type="button"
                    onClick={() => choose(draft)}
                    className={primaryButton}
                  >
                    Save My Choices
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
