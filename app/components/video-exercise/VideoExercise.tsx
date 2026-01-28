"use client";

import { LessonQuitButton } from "@/components/lesson/LessonQuitButton";
import { markLessonComplete, fetchUserLesson } from "@/lib/api/lessons";
import type { Lesson, VideoSource } from "@/types/lesson";
import type { MuxPlayerRefAttributes } from "@mux/mux-player-react";
import MuxPlayer from "@mux/mux-player-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, cloneElement, isValidElement } from "react";
import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  shift,
  useFloating,
  useHover,
  useInteractions,
  useRole,
  useDismiss
} from "@floating-ui/react";
import styles from "./VideoExercise.module.css";

type VideoLesson = Lesson & { type: "video"; data: { sources: VideoSource[] } };

interface VideoExerciseProps {
  lessonData: VideoLesson;
}

// Custom styled tooltip component for the continue button
function ContinueTooltip({ children, disabled }: { children: React.ReactElement; disabled: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "top",
    whileElementsMounted: autoUpdate,
    middleware: [offset(14), flip({ fallbackAxisSideDirection: "start" }), shift({ padding: 5 })]
  });

  const hover = useHover(context, {
    delay: { open: 0, close: 0 },
    enabled: !disabled
  });

  const role = useRole(context, { role: "tooltip" });
  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([hover, role, dismiss]);

  if (!isValidElement(children)) {
    return null;
  }

  const childrenWithRef = cloneElement(children, {
    ref: refs.setReference,
    ...getReferenceProps()
  } as any);

  return (
    <>
      {childrenWithRef}
      {!disabled && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={{
              ...floatingStyles,
              opacity: isOpen ? 1 : 0,
              visibility: isOpen ? "visible" : "hidden",
              transition: "opacity 200ms ease",
              pointerEvents: isOpen ? "auto" : "none"
            }}
            {...getFloatingProps()}
            className={styles.customTooltip}
            role="tooltip"
          >
            <span>Finish watching to continue</span>
            <div className={styles.tooltipArrow}></div>
          </div>
        </FloatingPortal>
      )}
    </>
  );
}

export default function VideoExercise({ lessonData }: VideoExerciseProps) {
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

  // Extract video source from lesson data
  // Backend returns: data.sources[0] = {host: 'mux', id: 'playbackId'}
  const videoSource = lessonData.data.sources[0] as VideoSource | undefined;
  const playbackId = videoSource?.id ?? "";

  useEffect(() => {
    // Check if lesson is already completed
    fetchUserLesson(lessonData.slug)
      .then((userLesson) => {
        if (userLesson.status === "completed") {
          setIsAlreadyCompleted(true);
          setVideoWatched(true);
          setVideoProgress(100);
          setShowCheckmark(true);
        }
      })
      .catch(() => {
        // User lesson doesn't exist yet, that's fine
      });

    // Start playing immediately when component mounts
    setIsInitializing(false);
    if (playerRef.current) {
      playerRef.current.play().catch((error) => {
        // Autoplay failed, but still show the video so user can manually play
        console.warn("Autoplay was prevented:", error.message);
        setIsVideoVisible(true);
      });
    }
  }, [lessonData.slug]);

  const handleVideoEnd = () => {
    // If already completed, don't re-trigger animations
    if (isAlreadyCompleted) {
      return;
    }

    setVideoWatched(true);
    setVideoProgress(100);
    // Delay the checkmark animation slightly
    setTimeout(() => setShowCheckmark(true), 100);
  };

  const handleVideoPlay = () => {
    setIsVideoVisible(true);
  };

  const handleTimeUpdate = () => {
    // Don't update progress if lesson was already completed
    if (isAlreadyCompleted) {
      return;
    }

    if (playerRef.current) {
      const currentTime = playerRef.current.currentTime || 0;
      const duration = playerRef.current.duration || 1;
      const progress = (currentTime / duration) * 100;
      setVideoProgress(Math.min(progress, 100));
    }
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

    // If already completed, just navigate to dashboard
    if (isAlreadyCompleted) {
      router.push(`/dashboard`);
      return;
    }

    try {
      setIsMarking(true);
      const response = await markLessonComplete(lessonData.slug);

      // Check for unlocked lesson in the API response
      const unlockedEvent = response?.meta?.events?.find((e: any) => e.type === "lesson_unlocked");
      const unlockedLessonSlug = unlockedEvent?.data?.lesson_slug;

      // Navigate to dashboard with completed and optionally unlocked lesson
      if (unlockedLessonSlug) {
        router.push(`/dashboard?completed=${lessonData.slug}&unlocked=${unlockedLessonSlug}`);
      } else {
        router.push(`/dashboard?completed=${lessonData.slug}`);
      }
    } catch (error) {
      console.error("Failed to mark lesson as complete:", error);
    } finally {
      setIsMarking(false);
    }
  };

  return (
    <div
      className={`${styles.container} ${styles.gridBackground} ${
        isInitializing ? styles.initializing : styles.visible
      }`}
    >
      <LessonQuitButton className={styles.closeButton} variant="default" />

      <div className={styles.videoContainer}>
        {/* Reserve space with aspect ratio to prevent layout shift */}
        <div className={styles.videoAspectRatio}>
          {playbackId ? (
            <MuxPlayer
              ref={playerRef}
              playbackId={playbackId}
              streamType="on-demand"
              autoPlay={true}
              loop={false}
              muted={false}
              volume={0.5}
              className={`${styles.muxPlayer} ${isVideoVisible ? styles.muxPlayerVisible : styles.muxPlayerHidden}`}
              onPlay={handleVideoPlay}
              onEnded={handleVideoEnd}
              onTimeUpdate={handleTimeUpdate}
              onCanPlay={autoplay}
            />
          ) : (
            <div className={styles.noVideoPlaceholder}>
              <div className={styles.noVideoContent}>
                <svg className={styles.noVideoIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className={styles.noVideoText}>No video source available</p>
                {videoSource && <p className={styles.noVideoHost}>Host: {videoSource.host}</p>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Pill */}
      <div className={`${styles.floatingPill} ${!videoWatched ? styles.floatingPillDisabled : ""}`}>
        <div className={styles.pillInfo}>
          <div className={styles.pillRing}>
            <svg width="72" height="72" viewBox="0 0 72 72">
              <circle className={styles.pillRingBg} cx="36" cy="36" r="28" />
              <circle
                className={`${styles.pillRingFill} ${videoWatched ? styles.pillRingComplete : ""}`}
                cx="36"
                cy="36"
                r="28"
                style={{ strokeDashoffset: isAlreadyCompleted ? 0 : 176 * (1 - videoProgress / 100) }}
              />
            </svg>
            <span className={`${styles.pillPercentage} ${showCheckmark ? styles.hidden : ""}`}>
              {videoWatched ? "100%" : `${Math.round(videoProgress)}%`}
            </span>
            <div className={`${styles.pillCheck} ${showCheckmark ? styles.visible : ""}`}>
              <svg viewBox="0 0 24 24">
                <path d="M6 12l4 4 8-8" />
              </svg>
            </div>
          </div>
          <div className={styles.pillText}>
            <span className={styles.label}>{videoWatched ? "Lesson Complete" : "Lesson Progress"}</span>
            <span className={styles.value}>
              {videoWatched ? "Finished" : "Watching"} <span className={styles.videoTitle}>{lessonData.title}</span>
            </span>
          </div>
        </div>

        <div className={styles.continueWrapper}>
          <ContinueTooltip disabled={videoWatched}>
            <button
              className={`ui-btn ui-btn-default ${
                videoWatched ? "ui-btn-primary ui-btn-green" : "ui-btn-secondary ui-btn-gray"
              } ${isMarking ? "ui-btn-loading" : ""}`}
              onClick={handleContinue}
              disabled={!videoWatched || isMarking}
            >
              {isMarking ? "Saving..." : isAlreadyCompleted ? "Continue to Dashboard" : "Continue"}
              {!isMarking && (
                <svg viewBox="0 0 24 24" className={styles.buttonIcon}>
                  <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
                </svg>
              )}
            </button>
          </ContinueTooltip>
        </div>
      </div>
    </div>
  );
}
