import { markLessonComplete, fetchUserLesson } from "@/lib/api/lessons";
import { reportError } from "@/lib/reportError";
import { showConfirmation } from "@/lib/modal";
import type { MuxPlayerRefAttributes } from "@mux/mux-player-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// The very first video lesson new users see. We allow them to skip it
// (with a confirmation modal) so they're never blocked on the welcome video.
// Other video lessons keep the standard "must finish to continue" behaviour.
const FIRST_VIDEO_LESSON_SLUG = "welcome-to-jiki";

export function useVideoExercise(lessonSlug: string) {
  const router = useRouter();
  const [videoWatched, setVideoWatched] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [isMarking, setIsMarking] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isInitializing, setIsInitializing] = useState(true);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [isAlreadyCompleted, setIsAlreadyCompleted] = useState(false);
  const playerRef = useRef<MuxPlayerRefAttributes>(null);
  const hasAutoPlayedRef = useRef(false);

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
        }
      })
      .catch(reportError);

    setIsInitializing(false);
  }, [lessonSlug]);

  const handleVideoEnd = () => {
    if (isAlreadyCompleted) {
      return;
    }
    setVideoWatched(true);
    setVideoProgress(100);
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
  };

  const autoplay = () => {
    if (hasAutoPlayedRef.current || !playerRef.current) return;
    hasAutoPlayedRef.current = true;
    playerRef.current.play().catch(handleAutoplayFailure);
  };

  const isFirstVideoLesson = lessonSlug === FIRST_VIDEO_LESSON_SLUG;
  const canSkip = isFirstVideoLesson && !videoWatched && !isAlreadyCompleted;

  const completeAndNavigate = async () => {
    try {
      setIsMarking(true);
      const response = await markLessonComplete(lessonSlug);
      const unlockedEvent = response?.meta?.events?.find((e: any) => e.type === "lesson_unlocked");
      const unlocked = unlockedEvent?.data?.lesson_slug;
      router.push(
        unlocked ? `/dashboard?completed=${lessonSlug}&unlocked=${unlocked}` : `/dashboard?completed=${lessonSlug}`
      );
    } catch (error) {
      reportError(error);
    } finally {
      setIsMarking(false);
    }
  };

  const handleContinue = async () => {
    if (isMarking) {
      return;
    }
    if (isAlreadyCompleted) {
      router.push(`/dashboard`);
      return;
    }
    if (canSkip) {
      playerRef.current?.pause();
      showConfirmation({
        title: "Skip the welcome video?",
        message: "You haven't finished watching yet. Are you sure you want to skip the welcome video and continue?",
        confirmText: "Yes, skip it",
        cancelText: "Keep watching",
        onConfirm: () => {
          void completeAndNavigate();
        }
      });
      return;
    }
    await completeAndNavigate();
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
    canSkip,
    handleVideoEnd,
    handleVideoPlay,
    handleTimeUpdate,
    autoplay,
    handleContinue
  };
}
