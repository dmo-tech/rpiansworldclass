// "Start Your Business Transformation Today" and "Enquire Now" (every
// WatchApplyButton), and Book a Call below the /watch video, open the "One
// Important Thing" popup (ApplyCheckPopup) on the page they are on. `from`
// names the button's page or place and goes into the lead source.

// The popup's "No, take me back to the video": /watch with the video ready to
// play, without its details form (GatedVideoPlayer). Also the buttons' href,
// used when one is opened in a new tab.
export const watchVideoHref = (from: string) =>
  `/watch?from=${encodeURIComponent(from)}`;

// A /watch visit made through watchVideoHref. Plain /watch (the homepage
// video card) and older /watch?apply=1&from=… links still ask for the details
// first.
export function isVideoOnlyVisit(search: string): boolean {
  const params = new URLSearchParams(search);
  return params.has("from") && params.get("apply") !== "1";
}

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
