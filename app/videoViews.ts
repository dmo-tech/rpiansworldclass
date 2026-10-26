import { EMPTY_VIEWER, readSavedViewer, type Viewer } from "./ViewerDetailsForm";

// Watch tracking for the /watch video (GatedVideoPlayer). Each update goes to
// /api/video-views, which keeps ONE row per sessionId in the "video watch
// data" tab. Updates carry the details saved on this browser by the
// strategy-call form; a viewer without them is tracked without name / phone,
// and their name joins the same row once they fill the form
// (linkVideoViewToViewer).

// Versioned so progress saved on an older video doesn't resume the new one.
export const PROGRESS_KEY = "rpiansVideoProgressV20";

// The last update sent from this browser, with the details it carried. Kept
// after the video ends, so a finished viewing still gets the name.
const LAST_VIEW_KEY = `${PROGRESS_KEY}:lastView`;

// Sent when the strategy-call form saves new details; the player on /watch
// answers it (preventDefault) by sending them with its live figures.
export const VIEWER_DETAILS_EVENT = "rpians-viewer-details";

export type VideoView = {
  event: string;
  sessionId: string;
  maxPercent: number;
  minutesWatched: number;
  completed: boolean;
  pageUrl: string;
};

type LastView = { view: VideoView; viewer: Viewer };

const getDevice = () =>
  /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    ? "Mobile"
    : "Desktop";

const getBrowser = () => {
  const ua = navigator.userAgent;

  if (/Edg\//.test(ua)) return "Edge";
  if (/OPR\/|Opera/.test(ua)) return "Opera";
  if (/SamsungBrowser/.test(ua)) return "Samsung Internet";
  if (/FxiOS|Firefox\//.test(ua)) return "Firefox";
  if (/CriOS|Chrome\//.test(ua)) return "Chrome";
  if (/Safari\//.test(ua)) return "Safari";

  return "Other";
};

const readLastView = (): LastView | null => {
  try {
    const last = JSON.parse(
      localStorage.getItem(LAST_VIEW_KEY) ?? "null",
    ) as LastView | null;

    return last?.view?.sessionId ? last : null;
  } catch {
    return null;
  }
};

// beacon: when the page is closing (navigator.sendBeacon sends text/plain).
export function sendVideoView(view: VideoView, { beacon = false } = {}) {
  const viewer = readSavedViewer() ?? EMPTY_VIEWER;

  try {
    localStorage.setItem(LAST_VIEW_KEY, JSON.stringify({ view, viewer }));
  } catch {
    // Private mode: the name can't be linked later.
  }

  const payload = JSON.stringify({
    ...view,
    ...viewer,
    device: getDevice(),
    browser: getBrowser(),
  });

  if (beacon && navigator.sendBeacon) {
    navigator.sendBeacon(
      "/api/video-views",
      new Blob([payload], { type: "text/plain;charset=UTF-8" }),
    );
    return;
  }

  fetch("/api/video-views", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch((error) => {
    console.error("Video view tracking error:", error);
  });
}

// Call once the strategy-call form has saved new details: they go onto this
// browser's latest viewing in "video watch data". The player sends them
// itself while it is on the page; otherwise the last update is sent again
// with them (skipped if it already carried the same details).
export function linkVideoViewToViewer() {
  const sentByPlayer = !window.dispatchEvent(
    new Event(VIEWER_DETAILS_EVENT, { cancelable: true }),
  );

  if (sentByPlayer) {
    return;
  }

  const last = readLastView();
  const viewer = readSavedViewer();

  if (!last || !viewer) {
    return;
  }

  const fields = Object.keys(viewer) as (keyof Viewer)[];

  if (fields.every((field) => last.viewer?.[field] === viewer[field])) {
    return;
  }

  sendVideoView({ ...last.view, event: "details" });
}
