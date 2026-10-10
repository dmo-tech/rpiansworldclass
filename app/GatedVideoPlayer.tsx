"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ApplyButton from "./ApplyButton";
import BookCallButton from "./BookCallButton";
import { VIDEO_POSTER_URL, VIDEO_URL } from "./siteConfig";

// Self-hosted video that asks for the viewer's details before it plays (on
// every visit, then resumes from where they left off), can't be paused or
// skipped forward, and reports how much each viewer
// watched to the "video watch data" tab of the Google Sheet (/api/video-views).
// The details form itself is saved as a lead in "video form data" (/api/leads).

// Used for the time label until the browser has read the real duration.
const FALLBACK_DURATION = 1375;

// Viewer may jump at most this far past the furthest point already watched
// (covers normal timeupdate jitter).
const SKIP_TOLERANCE_SECONDS = 2;

const HEARTBEAT_MS = 60_000;
const SAVE_PROGRESS_EVERY_SECONDS = 1;

// A saved position this close to the end starts the video again from 0:00.
const RESTART_NEAR_END_SECONDS = 5;

// Last details entered on this browser, used to prefill the form.
const VIEWER_KEY = "rpiansVideoViewer";
// Versioned so progress saved on an older video doesn't resume the new one.
const PROGRESS_KEY = "rpiansVideoProgressV20";

// Progress is saved per email, so each viewer resumes their own position.
const progressKey = (email: string) =>
  `${PROGRESS_KEY}:${email.trim().toLowerCase()}`;

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

export const OCCUPATION_OPTIONS = [
  "Retailer",
  "Wholesaler",
  "Distributor",
  "Manufacturer",
  "Service business",
  "Other",
];

export const REVENUE_OPTIONS = [
  "₹3 Cr – ₹5 Cr",
  "₹5 Cr – ₹50 Cr",
  "₹50 Cr – ₹500 Cr",
];

type Viewer = {
  fullName: string;
  phone: string;
  email: string;
  // Missing on viewers saved before these questions were added.
  occupation: string;
  revenue: string;
};

const EMPTY_VIEWER: Viewer = {
  fullName: "",
  phone: "",
  email: "",
  occupation: "",
  revenue: "",
};

type GatedVideoPlayerProps = {
  // Opens the details form as soon as the page loads (prefilled for a
  // returning viewer) instead of waiting for the Play button.
  openFormOnLoad?: boolean;
  // Called with how many seconds of the video the viewer has really watched:
  // the furthest point reached, capped by the time actually spent playing
  // it, so jumping ahead, re-watching or leaving the page open doesn't count.
  // Also called once on load with the figure from saved progress
  // (fromSavedProgress = true).
  onWatchTime?: (seconds: number, fromSavedProgress: boolean) => void;
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
    errors.fullName = "Please enter your name.";
  }

  if (!viewer.phone) {
    errors.phone = "Please enter your mobile number.";
  } else if (!/^[6-9]\d{9}$/.test(viewer.phone)) {
    errors.phone =
      "Mobile number must be 10 digits and start with 6, 7, 8 or 9.";
  }

  if (!viewer.email.trim()) {
    errors.email = "Please enter your email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(viewer.email.trim())) {
    errors.email = "Please enter a valid email (e.g. name@gmail.com).";
  }

  if (!OCCUPATION_OPTIONS.includes(viewer.occupation)) {
    errors.occupation = "Please choose what you currently do.";
  }

  if (!REVENUE_OPTIONS.includes(viewer.revenue)) {
    errors.revenue = "Please choose your annual turnover.";
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

function IndiaFlag() {
  return (
    <svg
      viewBox="0 0 30 20"
      aria-hidden="true"
      className="h-4 w-6 shrink-0 rounded-sm ring-1 ring-black/10"
    >
      <rect width="30" height="20" fill="#fff" />
      <rect width="30" height="6.67" fill="#FF9933" />
      <rect y="13.33" width="30" height="6.67" fill="#138808" />
      <circle
        cx="15"
        cy="10"
        r="2.6"
        fill="none"
        stroke="#000080"
        strokeWidth="0.8"
      />
    </svg>
  );
}

const fieldBaseClass =
  "mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none transition focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20";

const fieldClass = `${fieldBaseClass} text-gray-900`;

function SelectField({
  id,
  label,
  value,
  options,
  error,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: string[];
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-gray-700">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`${fieldBaseClass} appearance-none bg-white pr-10 ${
            value ? "text-gray-900" : "text-gray-400"
          }`}
        >
          <option value="" disabled>
            Select an option
          </option>
          {options.map((option) => (
            <option key={option} value={option} className="text-gray-900">
              {option}
            </option>
          ))}
        </select>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 mt-0.5 h-4 w-4 -translate-y-1/2 text-gray-500"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default function GatedVideoPlayer({
  openFormOnLoad = false,
  onWatchTime,
}: GatedVideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<WebkitVideo>(null);

  const [phase, setPhase] = useState<Phase>("idle");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<Viewer>(EMPTY_VIEWER);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(FALLBACK_DURATION);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Refs mirror the state the media event listeners need, so the listeners
  // can be attached once and never read stale values.
  const phaseRef = useRef<Phase>("idle");
  // Whoever submitted the form on this visit (tracking and progress use it).
  const viewerRef = useRef<Viewer | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const maxWatchedRef = useRef(0);
  const watchedSecondsRef = useRef(0);
  const lastTimeRef = useRef(0);
  const lastSavedAtRef = useRef(0);
  const milestonesRef = useRef<Set<number>>(new Set());
  const resumeAtRef = useRef(0);
  // True only while WE pause the video (tab hidden).
  const allowPauseRef = useRef(false);
  // Latest onWatchTime, for the media listeners attached once below.
  const onWatchTimeRef = useRef(onWatchTime);

  useEffect(() => {
    onWatchTimeRef.current = onWatchTime;
  });

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
    const email = viewerRef.current?.email;

    if (
      !sessionIdRef.current ||
      !video ||
      !email ||
      phaseRef.current !== "playing"
    ) {
      return;
    }

    const progress: SavedProgress = {
      sessionId: sessionIdRef.current,
      position: Math.min(video.currentTime, maxWatchedRef.current),
      maxWatched: maxWatchedRef.current,
      watchedSeconds: watchedSecondsRef.current,
      milestones: [...milestonesRef.current],
    };

    writeStorage(progressKey(email), progress);
  }, []);

  // Picks up the saved position for this email; none means a fresh start.
  const loadProgress = useCallback((email: string) => {
    const progress = readStorage<SavedProgress>(progressKey(email));
    const position = progress?.position || 0;

    sessionIdRef.current = progress?.sessionId || null;
    maxWatchedRef.current = progress?.maxWatched || 0;
    watchedSecondsRef.current = progress?.watchedSeconds || 0;
    milestonesRef.current = new Set(progress?.milestones || []);
    resumeAtRef.current = position;
    lastTimeRef.current = position;
    lastSavedAtRef.current = position;
    setCurrentTime(position);

    return progress;
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
    lastSavedAtRef.current = 0;
    milestonesRef.current = new Set();
    resumeAtRef.current = 0;

    if (viewerRef.current) {
      removeStorage(progressKey(viewerRef.current.email));
    }
  };

  // Prefill the form with the last details entered on this browser and show
  // that email's saved position on the Play button. Nothing plays until the
  // form is submitted.
  useEffect(() => {
    const stored = readStorage<Partial<Viewer>>(VIEWER_KEY);

    // Viewers saved before occupation / revenue were asked are prefilled
    // with what they gave.
    if (stored?.fullName && stored.phone && stored.email) {
      const savedViewer = { ...EMPTY_VIEWER, ...stored };
      // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is only readable after mount
      setFormData(savedViewer);

      // Progress saved before it was kept per email belongs to this viewer.
      const legacyProgress = readStorage<SavedProgress>(PROGRESS_KEY);

      if (legacyProgress) {
        if (!readStorage(progressKey(savedViewer.email))) {
          writeStorage(progressKey(savedViewer.email), legacyProgress);
        }
        removeStorage(PROGRESS_KEY);
      }

      if (loadProgress(savedViewer.email)?.sessionId) {
        onWatchTimeRef.current?.(
          Math.min(watchedSecondsRef.current, maxWatchedRef.current),
          true,
        );
      }
    }

    if (openFormOnLoad) {
      setIsFormOpen(true);
    }
  }, [loadProgress, openFormOnLoad]);

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

    // Seek to the resume point (0:00 for a fresh start) if not already there.
    const applyResume = () => {
      if (
        resumeAt < video.duration - 1 &&
        Math.abs(video.currentTime - resumeAt) > 0.5
      ) {
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

  // Play always asks for the details first (prefilled for a returning
  // viewer); the video starts when the form is submitted.
  const handlePlayClick = () => {
    setFormErrors({});
    setIsFormOpen(true);
  };

  // Typing in a field clears that field's error straight away.
  const updateField = (field: keyof Viewer, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setFormErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleaned: Viewer = {
      fullName: formData.fullName.trim(),
      phone: normalizePhone(formData.phone),
      email: formData.email.trim().toLowerCase(),
      occupation: formData.occupation,
      revenue: formData.revenue,
    };

    const errors = validateViewer(cleaned);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    // Resume where this email last stopped (an email with no saved progress
    // starts from 0:00, with its own tracking session). A position saved
    // right at the end starts the video over.
    viewerRef.current = cleaned;
    loadProgress(cleaned.email);

    if (resumeAtRef.current >= getDuration() - RESTART_NEAR_END_SECONDS) {
      resetSession();
      setCurrentTime(0);
    }

    writeStorage(VIEWER_KEY, cleaned);
    setIsFormOpen(false);

    startPlayback();

    // The details form is also a lead on its own ("video form data" tab);
    // watch progress is tracked separately through /api/video-views.
    fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        formType: "Video Form",
        ...cleaned,
        submittedAt: new Date().toISOString(),
        source: `RPIANS Website - Video Form (${window.location.pathname})`,
      }),
      keepalive: true,
    }).catch((error) => {
      console.error("Video form lead error (non-blocking):", error);
    });
  };

  // "Watch again" also goes through the form, then starts from 0:00.
  const handleReplay = () => {
    resetSession();
    setCurrentTime(0);

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }

    handlePlayClick();
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
      onWatchTimeRef.current?.(
        Math.min(watchedSecondsRef.current, maxWatchedRef.current),
        false,
      );

      const percent = (maxWatchedRef.current / getDuration()) * 100;

      for (const milestone of MILESTONES) {
        if (percent >= milestone && !milestonesRef.current.has(milestone)) {
          milestonesRef.current.add(milestone);
          sendUpdate(`${milestone}%`);
        }
      }

      if (
        Math.abs(time - lastSavedAtRef.current) >= SAVE_PROGRESS_EVERY_SECONDS
      ) {
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

      if (viewerRef.current) {
        removeStorage(progressKey(viewerRef.current.email));
      }

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
      <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-3xl border border-[#3b82f6]/30 bg-neutral-900 shadow-2xl shadow-blue-950/20">
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
            poster={VIDEO_POSTER_URL}
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
                  ? `Continue where you left off (${formatTime(currentTime)})`
                  : "Press Play to watch the video"}
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
              <p className="font-serif text-base sm:text-3xl">Your next step</p>

              <p className="mt-1 hidden max-w-md text-sm text-white/70 sm:block">
                Take the next step towards a system-driven business.
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
                Watch again
              </button>
            </div>
          )}
        </div>
      </div>

      {isFormOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setIsFormOpen(false)}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="video-gate-title"
              onClick={(event) => event.stopPropagation()}
              className="relative max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-6 text-left shadow-2xl sm:p-8"
            >
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                aria-label="Close"
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                ×
              </button>

              <h3
                id="video-gate-title"
                className="pr-8 font-serif text-2xl font-bold leading-snug text-gray-900"
              >
                Enter your details below to watch the full video
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
                    Name
                  </label>
                  <input
                    id="video-gate-name"
                    type="text"
                    autoComplete="name"
                    value={formData.fullName}
                    onChange={(event) =>
                      updateField("fullName", event.target.value)
                    }
                    placeholder="Your full name"
                    className={fieldClass}
                  />
                  {formErrors.fullName && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.fullName}
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
                      updateField("email", event.target.value)
                    }
                    placeholder="name@gmail.com"
                    className={fieldClass}
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.email}
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
                    <span className="flex items-center gap-2 border-r border-gray-200 px-3 text-base text-gray-600">
                      <IndiaFlag />
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
                        updateField("phone", normalizePhone(event.target.value))
                      }
                      placeholder="10 digit mobile number"
                      className="w-full min-w-0 rounded-r-xl px-4 py-3 text-base text-gray-900 outline-none"
                    />
                  </div>
                  {formErrors.phone && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.phone}
                    </p>
                  )}
                </div>

                <SelectField
                  id="video-gate-occupation"
                  label="What do you currently do?"
                  value={formData.occupation}
                  options={OCCUPATION_OPTIONS}
                  error={formErrors.occupation}
                  onChange={(occupation) =>
                    updateField("occupation", occupation)
                  }
                />

                <SelectField
                  id="video-gate-revenue"
                  label="Annual Turnover"
                  value={formData.revenue}
                  options={REVENUE_OPTIONS}
                  error={formErrors.revenue}
                  onChange={(revenue) => updateField("revenue", revenue)}
                />

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#3b82f6] to-[#2563eb] px-6 py-4 text-lg font-bold uppercase tracking-wide text-white shadow-lg shadow-blue-600/25 transition hover:scale-[1.02]"
                >
                  <PlayIcon className="h-5 w-5" />
                  Watch Now
                </button>

                <p className="text-center text-xs leading-5 text-gray-400">
                  By clicking Watch Now, you agree that the RPIANS team may
                  contact you by call, WhatsApp or email. See our{" "}
                  <a
                    href="/privacy-policy"
                    target="_blank"
                    className="underline underline-offset-2 hover:text-gray-600"
                  >
                    Privacy Policy
                  </a>
                  .
                </p>
              </form>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
