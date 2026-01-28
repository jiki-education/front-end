"use client";

import { LessonQuitButton } from "@/components/lesson/LessonQuitButton";
import type { Lesson, VideoSource } from "@/types/lesson";
import MuxPlayer from "@mux/mux-player-react";
import { FloatingPill } from "./ui/FloatingPill";
import { NoVideoPlaceholder } from "./ui/NoVideoPlaceholder";
import { useVideoExercise } from "./lib/useVideoExercise";
import styles from "./VideoExercise.module.css";

type VideoLesson = Lesson & { type: "video"; data: { sources: VideoSource[] } };

export default function VideoExercise({ lessonData }: { lessonData: VideoLesson }) {
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

  return (
    <div
      className={`${styles.container} ${styles.gridBackground} ${isInitializing ? styles.initializing : styles.visible}`}
    >
      <LessonQuitButton className={styles.closeButton} variant="default" />

      <div className={styles.videoContainer}>
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
