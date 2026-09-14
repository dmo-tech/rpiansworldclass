import BackToTop from "./BackToTop";

const whatsappUrl =
  "https://wa.me/917389638105?text=Namaste%20RPIANS%20Team,%20mujhe%20Business%20Automation%20aur%20Profit%20Growth%20ke%20baare%20mein%20jankari%20chahiye.";

/*
  TODO: In teeno links ko apne real Instagram, LinkedIn aur Facebook
  page ke URLs se replace kar dijiye jab wo available hon.
*/
const socialLinks = [
  {
    href: "#",
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.9.2 2.3.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.3 1.1.4 2.3.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.9-.4 2.3-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1.1.3-2.3.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.9-.2-2.3-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.3-1.1-.4-2.3C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.2-1.9.4-2.3.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1.1-.3 2.3-.4C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.1-1 .1-1.6.2-1.9.3-.5.2-.8.4-1.2.8-.4.4-.6.7-.8 1.2-.1.3-.3.9-.3 1.9-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c.1 1 .2 1.6.3 1.9.2.5.4.8.8 1.2.4.4.7.6 1.2.8.3.1.9.3 1.9.3 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1-.1 1.6-.2 1.9-.3.5-.2.8-.4 1.2-.8.4-.4.6-.7.8-1.2.1-.3.3-.9.3-1.9.1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.1-1-.2-1.6-.3-1.9-.2-.5-.4-.8-.8-1.2-.4-.4-.7-.6-1.2-.8-.3-.1-.9-.3-1.9-.3-1.2-.1-1.6-.1-4.7-.1zm0 3.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zm0 1.8a3.7 3.7 0 1 0 0 7.4 3.7 3.7 0 0 0 0-7.4zm5.7-2a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6z" />
      </svg>
    ),
  },
  {
    href: "#",
    label: "LinkedIn",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M20.4 20.4h-3.5v-5.5c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.6H9.5V9h3.4v1.6h.05c.5-.9 1.6-1.8 3.3-1.8 3.5 0 4.15 2.3 4.15 5.3v6.3zM5.3 7.4a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM7 20.4H3.6V9H7v11.4z" />
      </svg>
    ),
  },
  {
    href: "#",
    label: "Facebook",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M13.5 21v-8.1h2.7l.4-3.2h-3.1V7.7c0-.9.3-1.6 1.6-1.6h1.7V3.2C16.5 3.1 15.5 3 14.4 3c-2.4 0-4 1.5-4 4.1v2.6H7.7v3.2h2.7V21h3.1z" />
      </svg>
    ),
  },
];

export default function SiteFooter() {
  return (
    <>
      <footer className="border-t border-black/10 px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 text-sm text-gray-500 md:flex-row">
          <div>
            <p className="font-semibold tracking-[0.2em] text-[#3b82f6]">
              RPIANS
            </p>

            <p className="mt-2">RPIANS World Class Business Coaching LLP</p>
          </div>

          <div className="flex flex-col gap-5 md:items-end">
            <div className="flex flex-wrap gap-5">
              <a
                href="/privacy-policy"
                className="transition hover:text-[#3b82f6]"
              >
                Privacy Policy
              </a>

              <a href="/terms" className="transition hover:text-[#3b82f6]">
                Terms and Conditions
              </a>

              <a
                href="/refund-policy"
                className="transition hover:text-[#3b82f6]"
              >
                Refund Policy
              </a>
            </div>

            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-gray-500 transition hover:border-[#3b82f6]/50 hover:text-[#3b82f6]"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-7xl border-t border-black/10 pt-6 text-sm text-gray-600">
          © 2026 RPIANS World Class Business Coaching LLP. All Rights Reserved.
        </div>
      </footer>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact RPIANS on WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-2xl text-white shadow-[0_10px_35px_rgba(34,197,94,0.45)] transition hover:scale-110"
      >
        💬
      </a>

      <BackToTop />
    </>
  );
}
