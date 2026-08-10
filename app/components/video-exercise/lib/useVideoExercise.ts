import { markLessonComplete, fetchUserLesson } from "@/lib/api/lessons";
import { reportError } from "@/lib/reportError";
import { showLessonSaveErrorToast } from "@/lib/toasts/lessonSaveError";
import type { JikiVideoPlayerHandle } from "@/components/ui/JikiVideoPlayer";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// Tolerance (in seconds) on the max-watched ceiling so `timeupdate` granularity doesn't fight a user resuming playback.
const SEEK_TOLERANCE_SECONDS = 0.5;

// How long the "can't skip ahead" hint stays visible after a blocked seek.
const SKIP_HINT_DURATION_MS = 2500;

export function useVideoExercise(lessonSlug: string) {
  const router = useRouter();
  const [videoWatched, setVideoWatched] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [isMarking, setIsMarking] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isInitializing, setIsInitializing] = useState(true);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [isAlreadyCompleted, setIsAlreadyCompleted] = useState(false);
  // On a first watch, forward seeking is capped at the furthest point reached so far (tracked in `maxWatchedRef`) until the cap is lifted, and `showSkipHint` surfaces a transient message when a skip is blocked.
  const [showSkipHint, setShowSkipHint] = useState(false);
  const maxWatchedRef = useRef(0);
  const skipHintTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playerRef = useRef<JikiVideoPlayerHandle>(null);
  const hasAutoPlayedRef = useRef(false);

  useEffect(() => {
    return () => {
      if (skipHintTimeoutRef.current) {
        clearTimeout(skipHintTimeoutRef.current);
      }
    };
  }, []);

  const handleAutoplayFailure = (error: Error) => {
    const expected = error.name === "NotAllowedError" || error.name === "AbortError";
    if (!expected) reportError(error);
    console.warn("Autoplay was prevented:", error.message);
    setIsVideoVisible(true);
  };

  useEffect(() => {
    fetchUserLesson(lessonSlug)
      .then((userLesson) => {
        if (userLesson.status === "completed") {
          setIsAlreadyCompleted(true);
          setVideoWatched(true);
          setVideoProgress(100);
          setShowCheckmark(true);
          // Subsequent watches get a normal, fully-scrubbable seek bar.
          maxWatchedRef.current = Infinity;
        }
      })
      // A not-started lesson 404s here; that's expected (no UserLesson row yet)
      // and suppressed by the client. Genuine failures are reported centrally.
      .catch(() => {})
      .finally(() => setIsInitializing(false));
  }, [lessonSlug]);

  const handleVideoEnd = () => {
    if (isAlreadyCompleted) {
      return;
    }
    setVideoWatched(true);
    setVideoProgress(100);
    // The whole video has now been watched, so lift the seek cap.
    maxWatchedRef.current = Infinity;
    setTimeout(() => setShowCheckmark(true), 100);
  };

  const handleVideoPlay = () => setIsVideoVisible(true);

  const handleTimeUpdate = () => {
    if (isAlreadyCompleted || videoWatched || !playerRef.current) {
      return;
    }
    const currentTime = playerRef.current.currentTime || 0;
    const duration = playerRef.current.duration || 1;
    setVideoProgress(Math.min((currentTime / duration) * 100, 100));

    // Advance the watched ceiling only during natural playback, since a forward scrub past the cap is snapped back by `handleSeeking` before it can reach here.
    if (currentTime > maxWatchedRef.current) {
      maxWatchedRef.current = currentTime;
    }
  };

  const flashSkipHint = () => {
    setShowSkipHint(true);
    if (skipHintTimeoutRef.current) {
      clearTimeout(skipHintTimeoutRef.current);
    }
    skipHintTimeoutRef.current = setTimeout(() => setShowSkipHint(false), SKIP_HINT_DURATION_MS);
  };

  // On a first watch, clamp forward seeks to the furthest-watched point and flash a hint to explain it. The snap-back is corrective, not preventive: v10's `seek()` commits asynchronously, so the scrubbed-to position is briefly live. What keeps it from counting as watched is the bridge firing `onSeeking` before `onTimeUpdate` and suppressing `onTimeUpdate` mid-seek.
  const handleSeeking = () => {
    if (isAlreadyCompleted || videoWatched || !playerRef.current) {
      return;
    }
    const ceiling = maxWatchedRef.current + SEEK_TOLERANCE_SECONDS;
    if (playerRef.current.currentTime > ceiling) {
      playerRef.current.currentTime = maxWatchedRef.current;
      flashSkipHint();
    }
  };

  const autoplay = () => {
    if (hasAutoPlayedRef.current || !playerRef.current) return;
    hasAutoPlayedRef.current = true;
    playerRef.current.play().catch(handleAutoplayFailure);
  };

  const handleContinue = async () => {
    if (isMarking) {
      return;
    }
    if (isAlreadyCompleted) {
      router.push(`/dashboard`);
      return;
    }
    try {
      setIsMarking(true);
      const response = await markLessonComplete(lessonSlug);
      const unlockedEvent = response?.meta?.events?.find((e: any) => e.type === "lesson_unlocked");
      const unlocked = unlockedEvent?.data?.lesson_slug;
      router.push(
        unlocked ? `/dashboard?completed=${lessonSlug}&unlocked=${unlocked}` : `/dashboard?completed=${lessonSlug}`
      );
    } catch {
      // The API client reports unexpected /internal failures to Sentry centrally;
      // here we only own the UX (surface the failure and release the button).
      showLessonSaveErrorToast();
    } finally {
      setIsMarking(false);
    }
  };

  return {
    playerRef,
    videoWatched,
    isVideoVisible,
    isMarking,
    videoProgress,
    isInitializing,
    showCheckmark,
    isAlreadyCompleted,
    showSkipHint,
    handleVideoEnd,
    handleVideoPlay,
    handleTimeUpdate,
    handleSeeking,
    autoplay,
    handleContinue
  };
}
