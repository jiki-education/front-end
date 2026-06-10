"use client";

import { LessonQuitButton } from "@/components/lesson/LessonQuitButton";
import type { Lesson, VideoSource } from "@/types/lesson";
import MuxPlayer from "@/components/ui/JikiMuxPlayer";
import { useEffect } from "react";
import { FloatingPill } from "./ui/FloatingPill";
import { NoVideoPlaceholder } from "./ui/NoVideoPlaceholder";
import { useVideoExercise } from "./lib/useVideoExercise";
import styles from "./VideoExercise.module.css";

type VideoLesson = Lesson & { type: "video"; data: { sources: VideoSource[] } };

export default function VideoExercise({ lessonData, onReady }: { lessonData: VideoLesson; onReady: () => void }) {
  const videoSource = lessonData.data.sources[0] as VideoSource | undefined;
  const playbackId = videoSource?.id ?? "";

  const {
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
  } = useVideoExercise(lessonData.slug);

  useEffect(() => {
    if (!isInitializing) {
      onReady();
    }
  }, [isInitializing, onReady]);

  return (
    <div
      className={`${styles.container} ${styles.gridBackgroundLight} ${isInitializing ? styles.initializing : styles.visible}`}
    >
      <LessonQuitButton className={styles.closeButton} variant="glass" />

      <div className={styles.videoContainer}>
        <div className={styles.videoAspectRatio}>
          {playbackId ? (
            <MuxPlayer
              ref={playerRef}
              playbackId={playbackId}
              className={`${videoWatched ? styles.muxPlayerCompleted : styles.muxPlayer} ${isVideoVisible ? styles.muxPlayerVisible : styles.muxPlayerHidden}`}
              onPlay={handleVideoPlay}
              onEnded={handleVideoEnd}
              onTimeUpdate={handleTimeUpdate}
              onCanPlay={autoplay}
            />
          ) : (
            <NoVideoPlaceholder videoSource={videoSource} />
          )}
        </div>
      </div>

      <FloatingPill
        videoWatched={videoWatched}
        videoProgress={videoProgress}
        showCheckmark={showCheckmark}
        isAlreadyCompleted={isAlreadyCompleted}
        lessonTitle={lessonData.title}
        isMarking={isMarking}
        onContinue={handleContinue}
      />
    </div>
  );
}
