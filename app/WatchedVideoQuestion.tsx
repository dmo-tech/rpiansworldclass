// "One Important Thing": asks whether the visitor has watched the full video
// before booking. Shown by Book a Call below the /watch video
// (WatchExperience) and by every "Start Your Business Transformation Today" /
// "Enquire Now" button (ApplyCheckPopup). The dialog around it is the
// caller's; titleId and textId label it.

function WarningIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-7 w-7"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  );
}

type WatchedVideoQuestionProps = {
  titleId: string;
  textId: string;
  onYes: () => void;
  onNo: () => void;
};

export default function WatchedVideoQuestion({
  titleId,
  textId,
  onYes,
  onNo,
}: WatchedVideoQuestionProps) {
  return (
    <>
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-500 ring-1 ring-amber-200">
        <WarningIcon />
      </div>

      <h2
        id={titleId}
        className="mt-5 font-serif text-2xl font-bold text-gray-900 sm:text-3xl"
      >
        One Important Thing
      </h2>

      <p id={textId} className="mt-3 text-base leading-relaxed text-gray-600">
        Before you go ahead, please watch the{" "}
        <strong className="font-semibold text-[#2563eb]">full video</strong>{" "}
        above. Only then will you know which plan is right for your business.
      </p>

      <button
        type="button"
        onClick={onYes}
        autoFocus
        className="mt-6 w-full text-balance rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#2563eb] px-5 py-4 text-base font-bold text-white shadow-lg shadow-blue-600/25 transition hover:scale-[1.02]"
      >
        Yes, I&apos;ve watched the full video
      </button>

      <button
        type="button"
        onClick={onNo}
        className="mt-3 w-full text-balance rounded-xl border border-gray-300 px-5 py-3.5 text-base font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
      >
        No, I haven&apos;t watched it. Take me back to the video
      </button>
    </>
  );
}
