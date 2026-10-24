// "Start Your Business Transformation Today" and "Enquire Now" (every
// WatchApplyButton) open the "One Important Thing" popup (ApplyCheckPopup)
// on the page they are on. `from` names the button's page or place and goes
// into the lead source.

// The popup's "No, take me back to the video": /watch opens with its details
// form, then the video. Also the buttons' href, used when one is opened in a
// new tab.
export const watchApplyHref = (from: string) =>
  `/watch?apply=1&from=${encodeURIComponent(from)}`;

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
