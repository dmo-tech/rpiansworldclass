import WatchApplyButton from "./WatchApplyButton";

function SendIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      // The tab is turned 180°; turn the icon back so the plane points up-right.
      className="h-4 w-4 shrink-0 rotate-180 md-tall:h-[1.1rem] md-tall:w-[1.1rem]"
    >
      <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
      <path d="m21.854 2.147-10.94 10.939" />
    </svg>
  );
}

// "Enquire Now" tab stuck to the right edge, read bottom to top: vertical
// writing turned 180°. Physical paddings only (py/px are logical and swap in
// vertical text). Its edge-side padding (pl, which lands on the right once
// turned) runs 6px past the screen and slides out on hover.
// Same flow as "Start Your Business Transformation Today": /watch form → video.
// `from` names the page, e.g. "Home - Enquire Now", for the lead's source.
// It sits under the header, popups and WhatsApp/back-to-top buttons (z-40).
// Full size only on md screens taller than a landscape phone (md-tall, see
// globals.css). On short screens it stays compact and is centred between the
// header (up to 114px with the session ticker) and the back-to-top button
// (144px from the bottom).
export default function EnquireNowTab({ from }: { from: string }) {
  return (
    <WatchApplyButton
      from={from}
      icon={<SendIcon />}
      className="fixed right-0 top-1/2 z-40 flex -translate-y-1/2 translate-x-1.5 rotate-180 items-center gap-1.5 rounded-r-lg bg-gradient-to-t from-[#3b82f6] to-[#2563eb] pb-3.5 pl-3.5 pr-2 pt-3.5 text-[13px] font-bold leading-4 tracking-wide text-white! shadow-[0_0_22px_rgba(37,99,235,0.35)] transition duration-200 [writing-mode:vertical-rl] hover:translate-x-0 hover:shadow-[0_0_28px_rgba(37,99,235,0.5)] focus-visible:translate-x-0 md-tall:gap-2 md-tall:pb-5 md-tall:pl-4.5 md-tall:pr-3 md-tall:pt-5 md-tall:text-base md-tall:leading-5 [@media(max-height:500px)]:top-[calc(50%-15px)] [@media(max-height:500px)]:pb-3 [@media(max-height:500px)]:pt-3"
    >
      Enquire Now
    </WatchApplyButton>
  );
}
