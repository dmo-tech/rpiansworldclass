import BookCallButton, { CalendarIcon } from "./BookCallButton";
import Reveal from "./Reveal";

type BookCallBannerProps = {
  from: string;
  title?: string;
  description?: string;
};

export default function BookCallBanner({
  from,
  title = "Not Sure Which Program Is Right for You?",
  description = "Book a call with the RPIANS team. We will understand your business and guide you on the right next step.",
}: BookCallBannerProps) {
  return (
    <section className="py-20">
      <Reveal direction="up" className="site-container">
        <div className="flex flex-col items-center gap-8 rounded-3xl border border-[#3b82f6]/25 bg-gradient-to-br from-[#3b82f6]/10 to-white p-8 text-center md:flex-row md:p-12 md:text-left">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white">
            <CalendarIcon className="h-8 w-8" />
          </span>

          <div className="flex-1">
            <h2 className="font-serif text-3xl md:text-4xl">{title}</h2>

            <p className="mt-3 leading-7 text-gray-600">{description}</p>
          </div>

          <BookCallButton
            from={from}
            className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#2563eb] px-8 py-4 font-bold text-white transition hover:scale-105 md:w-auto"
          />
        </div>
      </Reveal>
    </section>
  );
}
