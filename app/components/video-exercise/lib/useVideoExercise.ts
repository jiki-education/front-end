import { markLessonComplete, fetchUserLesson } from "@/lib/api/lessons";
import type { MuxPlayerRefAttributes } from "@mux/mux-player-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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
      .catch(() => {});

    setIsInitializing(false);
    playerRef.current?.play().catch((error) => {
      console.warn("Autoplay was prevented:", error.message);
      setIsVideoVisible(true);
    });
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
    if (isAlreadyCompleted || !playerRef.current) {
      return;
    }
    const currentTime = playerRef.current.currentTime || 0;
    const duration = playerRef.current.duration || 1;
    setVideoProgress(Math.min((currentTime / duration) * 100, 100));
  };

  const autoplay = () => {
    if (!hasAutoPlayedRef.current && playerRef.current?.currentTime === 0) {
      hasAutoPlayedRef.current = true;
      void playerRef.current.play();
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
    try {
      setIsMarking(true);
      const response = await markLessonComplete(lessonSlug);
      const unlockedEvent = response?.meta?.events?.find((e: any) => e.type === "lesson_unlocked");
      const unlocked = unlockedEvent?.data?.lesson_slug;
      router.push(
        unlocked ? `/dashboard?completed=${lessonSlug}&unlocked=${unlocked}` : `/dashboard?completed=${lessonSlug}`
      );
    } catch (error) {
      console.error("Failed to mark lesson as complete:", error);
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
    handleVideoEnd,
    handleVideoPlay,
    handleTimeUpdate,
    autoplay,
    handleContinue
  };
}
