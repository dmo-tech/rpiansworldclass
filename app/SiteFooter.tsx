import BackToTop from "./BackToTop";

const whatsappUrl =
  "https://wa.me/917389638105?text=Namaste%20RPIANS%20Team,%20mujhe%20Business%20Automation%20aur%20Profit%20Growth%20ke%20baare%20mein%20jankari%20chahiye.";

export default function SiteFooter() {
  return (
    <>
      <footer className="border-t border-white/10 px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 text-sm text-gray-500 md:flex-row">
          <div>
            <p className="font-semibold tracking-[0.2em] text-[#3b82f6]">
              RPIANS
            </p>

            <p className="mt-2">RPIANS World Class Business Coaching LLP</p>
          </div>

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
        </div>

        <div className="mx-auto mt-8 max-w-7xl border-t border-white/10 pt-6 text-sm text-gray-600">
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
