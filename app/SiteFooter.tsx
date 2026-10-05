import { WHATSAPP_URL } from "./siteConfig";
import WhatsAppChat from "./WhatsAppChat";


const socialLinks = [
  {
    href: "https://www.instagram.com/worldclass_104?stkn=MXVnMWVnY3QyczV0cg==",
    label: "Instagram",
    color: "#E4405F",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.9.2 2.3.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.3 1.1.4 2.3.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.9-.4 2.3-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1.1.3-2.3.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.9-.2-2.3-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.3-1.1-.4-2.3C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.2-1.9.4-2.3.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1.1-.3 2.3-.4C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.1-1 .1-1.6.2-1.9.3-.5.2-.8.4-1.2.8-.4.4-.6.7-.8 1.2-.1.3-.3.9-.3 1.9-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c.1 1 .2 1.6.3 1.9.2.5.4.8.8 1.2.4.4.7.6 1.2.8.3.1.9.3 1.9.3 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1-.1 1.6-.2 1.9-.3.5-.2.8-.4 1.2-.8.4-.4.6-.7.8-1.2.1-.3.3-.9.3-1.9.1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.1-1-.2-1.6-.3-1.9-.2-.5-.4-.8-.8-1.2-.4-.4-.7-.6-1.2-.8-.3-.1-.9-.3-1.9-.3-1.2-.1-1.6-.1-4.7-.1zm0 3.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zm0 1.8a3.7 3.7 0 1 0 0 7.4 3.7 3.7 0 0 0 0-7.4zm5.7-2a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6z" />
      </svg>
    ),
  },
  {
    href: "https://www.linkedin.com/in/rajesh-kumar-kare?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    label: "LinkedIn",
    color: "#0A66C2",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M20.4 20.4h-3.5v-5.5c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.6H9.5V9h3.4v1.6h.05c.5-.9 1.6-1.8 3.3-1.8 3.5 0 4.15 2.3 4.15 5.3v6.3zM5.3 7.4a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM7 20.4H3.6V9H7v11.4z" />
      </svg>
    ),
  },
  {
    href: "https://www.facebook.com/share/1G9F9aoJEz/",
    label: "Facebook",
    color: "#1877F2",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M13.5 21v-8.1h2.7l.4-3.2h-3.1V7.7c0-.9.3-1.6 1.6-1.6h1.7V3.2C16.5 3.1 15.5 3 14.4 3c-2.4 0-4 1.5-4 4.1v2.6H7.7v3.2h2.7V21h3.1z" />
      </svg>
    ),
  },
  {
    href: "https://youtube.com/@businessbyrajesh?si=Lw5O9Z-hTf8KdLIP",
    label: "YouTube",
    color: "#FF0000",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path d="M21.6 7.2c-.2-1-1-1.7-1.9-1.9C18 5 12 5 12 5s-6 0-7.7.3c-1 .2-1.7 1-1.9 1.9C2 8.9 2 12 2 12s0 3.1.4 4.8c.2 1 1 1.7 1.9 1.9C6 19 12 19 12 19s6 0 7.7-.3c1-.2 1.7-1 1.9-1.9.4-1.7.4-4.8.4-4.8s0-3.1-.4-4.8zM10 15.5v-7l6 3.5-6 3.5z" />
      </svg>
    ),
  },
];

export default function SiteFooter() {
  return (
    <>
      <footer className="border-t border-black/10 py-10">
        <div className="site-container flex flex-col justify-between gap-6 text-sm text-gray-500 md:flex-row">
          <div>
            <p className="font-semibold tracking-[0.2em] text-[#3b82f6]">
              RPIANS
            </p>

            <p className="mt-2">RPIANS World Class Business Coaching LLP</p>
          </div>

          <div className="flex flex-col items-start gap-5">
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

              <a
                href="/book-call"
                className="transition hover:text-[#3b82f6]"
              >
                Book a Call
              </a>

              <a
                href="/contact"
                className="transition hover:text-[#3b82f6]"
              >
                Contact Details
              </a>
            </div>

            <div className="flex items-center gap-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  style={{ color: social.color }}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#3b82f6]/60 transition hover:scale-110"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="site-container mt-8 text-sm text-gray-600">
          <div className="border-t border-black/10 pt-6">
            © 2026 RPIANS World Class Business Coaching LLP. All Rights Reserved.
          </div>
        </div>
      </footer>

      <WhatsAppChat href={WHATSAPP_URL} />
    </>
  );
}
