"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ApplyButton from "./ApplyButton";
import BookCallButton from "./BookCallButton";

// Self-hosted video that asks for name / mobile / email before it plays,
// can't be paused or skipped forward, and reports how much each viewer
// watched to the "Video Views" tab of the Google Sheet (/api/video-views).

const VIDEO_URL =
  "https://worldclassbc.com/media/rpians-transformation-web.mp4";
const POSTER_URL =
  "https://worldclassbc.com/media/rpians-transformation-poster.jpg";

// Used for the time label until the browser has read the real duration.
const FALLBACK_DURATION = 1373;

// Viewer may jump at most this far past the furthest point already watched
// (covers normal timeupdate jitter).
const SKIP_TOLERANCE_SECONDS = 2;

const HEARTBEAT_MS = 60_000;
const SAVE_PROGRESS_EVERY_SECONDS = 3;

const VIEWER_KEY = "rpiansVideoViewer";
const PROGRESS_KEY = "rpiansVideoProgress";

const MILESTONES = [25, 50, 75];

const BLOCKED_KEYS = new Set([
  " ",
  "Spacebar",
  "Enter",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "Home",
  "End",
  "PageUp",
  "PageDown",
  "j",
  "J",
  "k",
  "K",
  "l",
  "L",
  ",",
  ".",
  "<",
  ">",
  "MediaPlayPause",
  "MediaPause",
  "MediaStop",
  "MediaTrackNext",
  "MediaTrackPrevious",
  "MediaFastForward",
  "MediaRewind",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
]);

type Viewer = {
  fullName: string;
  phone: string;
  email: string;
};

type SavedProgress = {
  sessionId: string;
  position: number;
  maxWatched: number;
  watchedSeconds: number;
  milestones: number[];
};

type FormErrors = Partial<Record<keyof Viewer, string>>;

type Phase = "idle" | "playing" | "ended";

type WebkitVideo = HTMLVideoElement & {
  webkitEnterFullscreen?: () => void;
};

const readStorage = <T,>(key: string): T | null => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
};

const writeStorage = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Private mode / storage full: the player still works without it.
  }
};

const removeStorage = (key: string) => {
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore — see writeStorage.
  }
};

const createSessionId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;

const formatTime = (seconds: number) => {
  const safe = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safe / 60);
  const rest = safe % 60;

  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
};

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

const normalizePhone = (value: string) => {
  const digits = value.replace(/\D/g, "");
  return digits.length === 12 && digits.startsWith("91")
    ? digits.slice(2)
    : digits.slice(0, 10);
};

const validateViewer = (viewer: Viewer): FormErrors => {
  const errors: FormErrors = {};

  if (viewer.fullName.trim().length < 2) {
    errors.fullName = "Kripya apna naam likhiye.";
  }

  if (!viewer.phone) {
    errors.phone = "Kripya apna mobile number likhiye.";
  } else if (!/^[6-9]\d{9}$/.test(viewer.phone)) {
    errors.phone =
      "Mobile number 10 digit ka hona chahiye aur 6, 7, 8 ya 9 se shuru hona chahiye.";
  }

  if (!viewer.email.trim()) {
    errors.email = "Kripya apna email likhiye.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(viewer.email.trim())) {
    errors.email = "Kripya sahi email likhiye (jaise naam@gmail.com).";
  }

  return errors;
};

function PlayIcon({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M8 5.14v13.72a1 1 0 0 0 1.52.85l10.79-6.86a1 1 0 0 0 0-1.7L9.52 4.29A1 1 0 0 0 8 5.14Z" />
    </svg>
  );
}

function VolumeIcon({ muted }: { muted: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
      {muted ? (
        <path d="m23 9-6 6M17 9l6 6" />
      ) : (
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" />
      )}
    </svg>
  );
}

function FullscreenIcon({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-5 w-5"
    >
      {active ? (
        <path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3" />
      ) : (
        <path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" />
      )}
    </svg>
  );
}

export default function GatedVideoPlayer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<WebkitVideo>(null);

  const [phase, setPhase] = useState<Phase>("idle");
  const [viewer, setViewer] = useState<Viewer | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<Viewer>({
    fullName: "",
    phone: "",
    email: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(FALLBACK_DURATION);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Refs mirror the state the media event listeners need, so the listeners
  // can be attached once and never read stale values.
  const phaseRef = useRef<Phase>("idle");
  const viewerRef = useRef<Viewer | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const maxWatchedRef = useRef(0);
  const watchedSecondsRef = useRef(0);
  const lastTimeRef = useRef(0);
  const lastSavedAtRef = useRef(0);
  const milestonesRef = useRef<Set<number>>(new Set());
  const resumeAtRef = useRef(0);
  // True only while WE pause the video (tab hidden, "Not you?").
  const allowPauseRef = useRef(false);

  const updatePhase = (next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  };

  const getDuration = () => {
    const value = videoRef.current?.duration;
    return value && Number.isFinite(value) ? value : FALLBACK_DURATION;
  };

  const saveProgress = useCallback(() => {
    const video = videoRef.current;

    if (!sessionIdRef.current || !video || phaseRef.current !== "playing") {
      return;
    }

    const progress: SavedProgress = {
      sessionId: sessionIdRef.current,
      position: Math.min(video.currentTime, maxWatchedRef.current),
      maxWatched: maxWatchedRef.current,
      watchedSeconds: watchedSecondsRef.current,
      milestones: [...milestonesRef.current],
    };

    writeStorage(PROGRESS_KEY, progress);
  }, []);

  const sendUpdate = useCallback(
    (
      event: string,
      options: { beacon?: boolean; completed?: boolean } = {},
    ) => {
      const currentViewer = viewerRef.current;

      if (!sessionIdRef.current || !currentViewer) {
        return;
      }

      const completed = options.completed ?? false;

      const payload = JSON.stringify({
        event,
        sessionId: sessionIdRef.current,
        ...currentViewer,
        maxPercent: completed
          ? 100
          : Math.min(100, (maxWatchedRef.current / getDuration()) * 100),
        minutesWatched: watchedSecondsRef.current / 60,
        completed,
        device: getDevice(),
        browser: getBrowser(),
        pageUrl: window.location.href,
      });

      if (options.beacon && navigator.sendBeacon) {
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
    },
    [],
  );

  const resetSession = () => {
    sessionIdRef.current = null;
    maxWatchedRef.current = 0;
    watchedSecondsRef.current = 0;
    lastTimeRef.current = 0;
    milestonesRef.current = new Set();
    resumeAtRef.current = 0;
    removeStorage(PROGRESS_KEY);
  };

  // Restore the saved viewer and, after a refresh, the last position.
  useEffect(() => {
    const savedViewer = readStorage<Viewer>(VIEWER_KEY);

    if (savedViewer?.fullName && savedViewer.phone && savedViewer.email) {
      viewerRef.current = savedViewer;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is only readable after mount
      setViewer(savedViewer);
      setFormData(savedViewer);
    }

    const progress = readStorage<SavedProgress>(PROGRESS_KEY);

    if (progress?.sessionId) {
      sessionIdRef.current = progress.sessionId;
      maxWatchedRef.current = progress.maxWatched || 0;
      watchedSecondsRef.current = progress.watchedSeconds || 0;
      milestonesRef.current = new Set(progress.milestones || []);
      resumeAtRef.current = progress.position || 0;
      lastTimeRef.current = progress.position || 0;
      setCurrentTime(progress.position || 0);
    }
  }, []);

  const startPlayback = () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (!sessionIdRef.current) {
      sessionIdRef.current = createSessionId();
    }

    const resumeAt = resumeAtRef.current;
    resumeAtRef.current = 0;

    const applyResume = () => {
      if (resumeAt > 0 && resumeAt < video.duration - 1) {
        video.currentTime = resumeAt;
      }
      lastTimeRef.current = video.currentTime;
    };

    if (video.readyState >= 1) {
      applyResume();
    } else {
      video.addEventListener("loadedmetadata", applyResume, { once: true });
    }

    allowPauseRef.current = false;
    video.playbackRate = 1;
    updatePhase("playing");

    // play() must be called straight from the click / submit so mobile
    // browsers treat it as user-initiated.
    video.play().catch((error) => {
      console.error("Video play error:", error);
      // Show the Play button again so the visitor can retry with a tap.
      updatePhase("idle");
    });

    sendUpdate("start");
  };

  const handlePlayClick = () => {
    if (viewerRef.current) {
      startPlayback();
    } else {
      setFormErrors({});
      setIsFormOpen(true);
    }
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleaned: Viewer = {
      fullName: formData.fullName.trim(),
      phone: normalizePhone(formData.phone),
      email: formData.email.trim().toLowerCase(),
    };

    const errors = validateViewer(cleaned);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    viewerRef.current = cleaned;
    setViewer(cleaned);
    writeStorage(VIEWER_KEY, cleaned);
    setIsFormOpen(false);

    startPlayback();
  };

  const handleNotYou = () => {
    const video = videoRef.current;

    if (video) {
      allowPauseRef.current = true;
      video.pause();
      video.currentTime = 0;
    }

    resetSession();
    removeStorage(VIEWER_KEY);
    viewerRef.current = null;
    setViewer(null);
    setFormData({ fullName: "", phone: "", email: "" });
    setFormErrors({});
    setCurrentTime(0);
    updatePhase("idle");
    setIsFormOpen(true);
  };

  const handleReplay = () => {
    resetSession();
    setCurrentTime(0);

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }

    startPlayback();
  };

  const toggleMute = () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.muted = !video.muted;

    if (!video.muted && video.volume === 0) {
      video.volume = 1;
    }
  };

  const handleVolumeChange = (value: number) => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.volume = value;
    video.muted = value === 0;
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    const video = videoRef.current;

    if (!container || !video) {
      return;
    }

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
      return;
    }

    if (document.fullscreenEnabled && container.requestFullscreen) {
      container.requestFullscreen().catch(() => {});
    } else if (video.webkitEnterFullscreen) {
      // iPhone Safari has no element fullscreen, only the native player.
      // Pausing / seeking there is still undone by the listeners below.
      video.webkitEnterFullscreen();
    }
  };

  // Media listeners: no pausing, no skipping ahead, playback speed fixed at 1.
  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    const snapBackIfSkipped = () => {
      if (video.currentTime > maxWatchedRef.current + SKIP_TOLERANCE_SECONDS) {
        video.currentTime = maxWatchedRef.current;
        return true;
      }
      return false;
    };

    const handleTimeUpdate = () => {
      if (phaseRef.current !== "playing" || snapBackIfSkipped()) {
        return;
      }

      const time = video.currentTime;
      const delta = time - lastTimeRef.current;

      if (!video.paused && delta > 0 && delta <= 1.5) {
        watchedSecondsRef.current += delta;
      }

      lastTimeRef.current = time;
      maxWatchedRef.current = Math.max(maxWatchedRef.current, time);
      setCurrentTime(time);

      const percent = (maxWatchedRef.current / getDuration()) * 100;

      for (const milestone of MILESTONES) {
        if (percent >= milestone && !milestonesRef.current.has(milestone)) {
          milestonesRef.current.add(milestone);
          sendUpdate(`${milestone}%`);
        }
      }

      if (time - lastSavedAtRef.current >= SAVE_PROGRESS_EVERY_SECONDS) {
        lastSavedAtRef.current = time;
        saveProgress();
      }
    };

    const handleSeeking = () => {
      if (!snapBackIfSkipped()) {
        lastTimeRef.current = video.currentTime;
      }
    };

    const handlePause = () => {
      if (
        phaseRef.current === "playing" &&
        !video.ended &&
        !allowPauseRef.current &&
        document.visibilityState === "visible"
      ) {
        video.play().catch(() => {});
      }
    };

    const handleRateChange = () => {
      if (video.playbackRate !== 1) {
        video.playbackRate = 1;
      }
      if (video.defaultPlaybackRate !== 1) {
        video.defaultPlaybackRate = 1;
      }
    };

    const handleEnded = () => {
      maxWatchedRef.current = getDuration();
      setCurrentTime(getDuration());
      sendUpdate("100%", { completed: true });

      sessionIdRef.current = null;
      removeStorage(PROGRESS_KEY);
      updatePhase("ended");

      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };

    const handleDurationChange = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        setDuration(video.duration);
      }
    };

    const handleVolume = () => {
      setIsMuted(video.muted);
      setVolume(video.volume);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("seeking", handleSeeking);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ratechange", handleRateChange);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("durationchange", handleDurationChange);
    video.addEventListener("loadedmetadata", handleDurationChange);
    video.addEventListener("volumechange", handleVolume);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("seeking", handleSeeking);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ratechange", handleRateChange);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("durationchange", handleDurationChange);
      video.removeEventListener("loadedmetadata", handleDurationChange);
      video.removeEventListener("volumechange", handleVolume);
    };
  }, [saveProgress, sendUpdate]);

  // Tab hidden / phone locked: pause and save. Back again: carry on from the
  // same spot. Page closing: last update via sendBeacon.
  useEffect(() => {
    const handleVisibility = () => {
      const video = videoRef.current;

      if (!video || phaseRef.current !== "playing") {
        return;
      }

      if (document.visibilityState === "hidden") {
        allowPauseRef.current = true;
        video.pause();
        saveProgress();
        sendUpdate("hidden", { beacon: true });
      } else {
        allowPauseRef.current = false;
        video.play().catch(() => {});
      }
    };

    const handlePageHide = () => {
      if (phaseRef.current === "playing") {
        saveProgress();
        sendUpdate("close", { beacon: true });
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [saveProgress, sendUpdate]);

  // Heartbeat every minute while the video is actually playing.
  useEffect(() => {
    if (phase !== "playing") {
      return;
    }

    const interval = window.setInterval(() => {
      if (videoRef.current && !videoRef.current.paused) {
        sendUpdate("heartbeat");
      }
    }, HEARTBEAT_MS);

    return () => window.clearInterval(interval);
  }, [phase, sendUpdate]);

  // Keyboard shortcuts (space, arrows, J/K/L, numbers) must not pause or
  // seek while the player has focus or is fullscreen.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const container = containerRef.current;

      if (!container || !BLOCKED_KEYS.has(event.key)) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const isVolumeSlider = target?.dataset.volumeSlider === "true";
      const isPlayerFocused =
        container.contains(document.activeElement) ||
        document.fullscreenElement === container;

      if (
        !isPlayerFocused ||
        (isVolumeSlider && event.key.startsWith("Arrow"))
      ) {
        return;
      }

      // Enter / Space on our own buttons (Play, Mute, Fullscreen, CTA) never
      // pause or seek the video, so let them work.
      if (
        target?.tagName === "BUTTON" &&
        (event.key === "Enter" || event.key === " ")
      ) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
    };

    window.addEventListener("keydown", handleKeyDown, true);

    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, []);

  // Hardware / lock-screen media keys: ignore pause and seek.
  useEffect(() => {
    if (!("mediaSession" in navigator)) {
      return;
    }

    const actions: MediaSessionAction[] = [
      "pause",
      "stop",
      "seekbackward",
      "seekforward",
      "seekto",
      "previoustrack",
      "nexttrack",
    ];

    for (const action of actions) {
      try {
        navigator.mediaSession.setActionHandler(action, () => {});
      } catch {
        // Action not supported by this browser.
      }
    }

    return () => {
      for (const action of actions) {
        try {
          navigator.mediaSession.setActionHandler(action, null);
        } catch {
          // Ignore.
        }
      }
    };
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (!isFormOpen) {
      return;
    }

    document.body.style.overflow = "hidden";

    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFormOpen(false);
      }
    };

    window.addEventListener("keydown", closeWithEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeWithEscape);
    };
  }, [isFormOpen]);

  const progressPercent = Math.min(100, (currentTime / duration) * 100);

  return (
    <>
      <div className="mx-auto mt-12 max-w-5xl overflow-hidden rounded-3xl border border-[#3b82f6]/30 bg-neutral-900">
        <div
          ref={containerRef}
          onContextMenu={(event) => event.preventDefault()}
          className={`relative aspect-video w-full select-none bg-black ${
            isFullscreen ? "flex items-center justify-center" : ""
          }`}
        >
          <video
            ref={videoRef}
            src={VIDEO_URL}
            poster={POSTER_URL}
            preload="metadata"
            playsInline
            controlsList="nodownload noplaybackrate noremoteplayback"
            disablePictureInPicture
            disableRemotePlayback
            tabIndex={-1}
            className="absolute inset-0 h-full w-full bg-black object-contain"
          />

          {/* Swallows clicks / taps / double-taps on the picture itself. */}
          <div aria-hidden="true" className="absolute inset-0" />

          {phase !== "ended" && (
            <p className="pointer-events-none absolute left-2 right-2 top-2 mx-auto w-fit rounded-full bg-black/65 px-3 py-1 text-center text-[10px] font-medium leading-snug text-white sm:left-4 sm:right-auto sm:top-4 sm:mx-0 sm:text-xs">
              Poora video dekhiye — beech mein rok ya aage nahi kar sakte
            </p>
          )}

          {phase === "idle" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/35">
              <button
                type="button"
                onClick={handlePlayClick}
                aria-label="Play video"
                className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-[#3b82f6] to-[#2563eb] pl-1 text-white shadow-xl shadow-blue-900/40 transition hover:scale-110 sm:h-24 sm:w-24"
              >
                <PlayIcon className="h-7 w-7 sm:h-10 sm:w-10" />
              </button>

              <p className="mt-3 text-xs font-medium text-white [text-shadow:0_1px_4px_rgb(0_0_0/0.8)] sm:mt-4 sm:text-sm">
                {currentTime > 0
                  ? `Wahin se dekhiye jahan chhoda tha (${formatTime(currentTime)})`
                  : "Video dekhne ke liye Play dabaiye"}
              </p>
            </div>
          )}

          {phase === "playing" && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-3 pb-2 pt-6 sm:px-5 sm:pb-3">
              <div
                role="progressbar"
                aria-label="Video progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progressPercent)}
                className="pointer-events-none h-1 w-full overflow-hidden rounded-full bg-white/25"
              >
                <div
                  className="h-full rounded-full bg-[#3b82f6]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="mt-2 flex items-center justify-between gap-3 text-white">
                <span className="text-xs font-medium tabular-nums sm:text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>

                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={toggleMute}
                    aria-label={isMuted ? "Unmute" : "Mute"}
                    className="rounded-md p-1.5 transition hover:bg-white/15"
                  >
                    <VolumeIcon muted={isMuted} />
                  </button>

                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={isMuted ? 0 : volume}
                    onChange={(event) =>
                      handleVolumeChange(Number(event.target.value))
                    }
                    aria-label="Volume"
                    data-volume-slider="true"
                    className="hidden w-20 accent-[#3b82f6] sm:block"
                  />

                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                    className="rounded-md p-1.5 transition hover:bg-white/15"
                  >
                    <FullscreenIcon active={isFullscreen} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {phase === "ended" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center overflow-y-auto bg-neutral-950/90 px-4 py-3 text-center text-white">
              <p className="font-serif text-base sm:text-3xl">
                Ab aapki baari hai
              </p>

              <p className="mt-1 hidden max-w-md text-sm text-white/70 sm:block">
                Apne business ko system-driven banane ke liye agla kadam
                uthaiye.
              </p>

              <div className="mt-3 flex w-full flex-col items-center justify-center gap-2 sm:mt-6 sm:flex-row sm:gap-4">
                <ApplyButton className="w-full max-w-xs rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#2563eb] px-6 py-2 text-sm font-bold text-white transition hover:scale-105 sm:w-auto sm:px-9 sm:py-4 sm:text-base">
                  Apply to Work With Us
                </ApplyButton>

                <BookCallButton
                  from="Home - Video End"
                  className="inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-lg border border-white/50 px-6 py-2 text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto sm:px-9 sm:py-4 sm:text-base"
                />
              </div>

              <button
                type="button"
                onClick={handleReplay}
                className="mt-2 text-xs text-white/60 underline underline-offset-4 hover:text-white sm:mt-5 sm:text-sm"
              >
                Video dobara dekhein
              </button>
            </div>
          )}
        </div>
      </div>

      {viewer && (
        <p className="mt-3 text-center text-xs text-gray-500">
          Aap{" "}
          <span className="font-semibold text-gray-700">{viewer.fullName}</span>{" "}
          ke naam se dekh rahe hain.{" "}
          <button
            type="button"
            onClick={handleNotYou}
            className="font-semibold text-[#1d4ed8] underline underline-offset-2"
          >
            Not you?
          </button>
        </p>
      )}

      {isFormOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[120] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
            onClick={() => setIsFormOpen(false)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="video-gate-title"
              onClick={(event) => event.stopPropagation()}
              className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-6 text-left shadow-2xl sm:rounded-3xl sm:p-8"
            >
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                aria-label="Close"
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                ×
              </button>

              <p className="text-xs uppercase tracking-[0.25em] text-[#3b82f6]">
                RPIANS Video
              </p>

              <h3
                id="video-gate-title"
                className="mt-2 pr-8 font-serif text-2xl text-gray-900"
              >
                Video dekhne se pehle apni details bhariye
              </h3>

              <form
                onSubmit={handleFormSubmit}
                noValidate
                className="mt-6 space-y-4"
              >
                <div>
                  <label
                    htmlFor="video-gate-name"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Naam
                  </label>
                  <input
                    id="video-gate-name"
                    type="text"
                    autoComplete="name"
                    value={formData.fullName}
                    onChange={(event) =>
                      setFormData({ ...formData, fullName: event.target.value })
                    }
                    placeholder="Aapka poora naam"
                    className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 outline-none transition focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20"
                  />
                  {formErrors.fullName && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="video-gate-phone"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Mobile
                  </label>
                  <div className="mt-1 flex rounded-xl border border-gray-300 transition focus-within:border-[#3b82f6] focus-within:ring-2 focus-within:ring-[#3b82f6]/20">
                    <span className="flex items-center border-r border-gray-200 px-3 text-base text-gray-500">
                      +91
                    </span>
                    <input
                      id="video-gate-phone"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      maxLength={10}
                      value={formData.phone}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          phone: normalizePhone(event.target.value),
                        })
                      }
                      placeholder="10 digit mobile number"
                      className="w-full rounded-r-xl px-4 py-3 text-base text-gray-900 outline-none"
                    />
                  </div>
                  {formErrors.phone && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="video-gate-email"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    id="video-gate-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={(event) =>
                      setFormData({ ...formData, email: event.target.value })
                    }
                    placeholder="naam@gmail.com"
                    className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-900 outline-none transition focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20"
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.email}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#2563eb] px-6 py-4 font-bold text-white transition hover:scale-[1.02]"
                >
                  <PlayIcon className="h-5 w-5" />
                  Video Dekhein
                </button>

                <p className="text-center text-xs text-gray-400">
                  Aapki details sirf RPIANS team ke paas surakshit rahengi.
                </p>
              </form>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
