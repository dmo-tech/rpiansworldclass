"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import BackToTop from "./BackToTop";
import { WHATSAPP_ICON_PATH } from "./socialLinks";

type WhatsAppChatProps = {
  href: string;
};

const tailPath = "M0 0 L11 14 L22 0";

function WhatsAppIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d={WHATSAPP_ICON_PATH} />
    </svg>
  );
}

export default function WhatsAppChat({ href }: WhatsAppChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const chatLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    chatLinkRef.current?.focus();

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <div ref={rootRef}>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="whatsapp-chat-popup"
              role="dialog"
              aria-label="Chat with RPIANS on WhatsApp"
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              style={{ transformOrigin: "calc(100% - 32px) 100%" }}
              className="fixed bottom-[112px] right-6 z-50 w-[280px] max-w-[calc(100vw-3rem-6px)]"
            >
              {/* Green offset of the tail, behind the card */}
              <svg
                viewBox="0 0 22 14"
                aria-hidden="true"
                className="absolute right-[21px] top-full h-[14px] w-[22px] translate-x-[6px] translate-y-[4.5px]"
              >
                <path d={tailPath} fill="#25D366" />
              </svg>

              <div className="relative rounded-[28px] border-[1.5px] border-[#111] bg-white p-5 shadow-[6px_6px_0_#25D366]">
                <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-[#25D366] bg-white">
                  <Image
                    src="/rpians-logo.png"
                    alt="RPIANS"
                    width={44}
                    height={33}
                    className="h-auto w-8"
                  />
                </span>

                <p className="mt-4 text-[17px] font-normal leading-6 text-[#111]">
                  Hi there!
                  <br />
                  How can I help you?
                </p>

                <a
                  ref={chatLinkRef}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  // Inline so the global `a { color: inherit }` rule can't override it
                  style={{ color: "#ffffff" }}
                  className="mt-5 flex w-full items-center gap-3 rounded-[10px] bg-[#1f1f1f] px-4 py-3 text-[15px] font-semibold shadow-[3px_3px_0_#25D366] outline-none transition hover:bg-black focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
                >
                  <WhatsAppIcon className="h-5 w-5 shrink-0" />
                  <span className="flex-1">Chat with us</span>
                  <span aria-hidden="true" className="text-lg leading-none">
                    &gt;
                  </span>
                </a>
              </div>

              {/* White tail, drawn over the card border so the two join */}
              <svg
                viewBox="0 0 22 14"
                aria-hidden="true"
                className="absolute right-[21px] top-[calc(100%-1.5px)] h-[14px] w-[22px]"
              >
                <path d={tailPath} fill="#ffffff" stroke="#111" strokeWidth="1.5" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          ref={toggleRef}
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-label="Chat on WhatsApp"
          aria-expanded={isOpen}
          aria-controls="whatsapp-chat-popup"
          className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white shadow-[0_10px_35px_rgba(34,197,94,0.45)] transition hover:scale-110"
        >
          {isOpen ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8"
              aria-hidden="true"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          ) : (
            <WhatsAppIcon className="h-8 w-8" />
          )}
        </button>
      </div>

      {/* The open popup sits where the back-to-top button is, so hide it meanwhile */}
      <BackToTop hidden={isOpen} />
    </>
  );
}
