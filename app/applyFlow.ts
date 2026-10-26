// "Start Your Business Transformation Today" and "Enquire Now" (every
// WatchApplyButton), and Book a Call below the /watch video, open the "One
// Important Thing" popup (ApplyCheckPopup) on the page they are on. `from`
// names the button's page or place and goes into the lead source.

// The popup's "No, take me back to the video": the video on /watch, ready to
// play. `from` stays in the URL, which the watch tracking saves. Also the
// buttons' href, used when one is opened in a new tab.
export const watchVideoHref = (from: string) =>
  `/watch?from=${encodeURIComponent(from)}`;

// The video on /watch, for the popup's "No" there to scroll back to.
export const WATCH_VIDEO_ID = "watch-video";

export const OPEN_APPLY_CHECK_EVENT = "rpians-open-apply-check";

export type OpenApplyCheckDetail = { from: string };

// Asks the popup to open; false if it isn't on the page (the button then
// follows its href instead).
export function openApplyCheck(from: string): boolean {
  const event = new CustomEvent<OpenApplyCheckDetail>(OPEN_APPLY_CHECK_EVENT, {
    detail: { from },
    cancelable: true,
  });

  // The popup calls preventDefault() when it opens.
  return !window.dispatchEvent(event);
}
