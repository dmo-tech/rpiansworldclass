"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import BackToTop from "./BackToTop";

type WhatsAppChatProps = {
  href: string;
};

const tailPath = "M0 0 L11 14 L22 0";

function WhatsAppIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884M20.463 3.488A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413" />
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
