"use client";

import { useRef, useState, useEffect } from "react";
import type { Lesson, VideoSource } from "@/types/lesson";
import type { ProgrammingLanguage } from "@/types/course";
import MuxPlayer from "@mux/mux-player-react";
import type { MuxPlayerRefAttributes } from "@mux/mux-player-react";
import styles from "../ChooseLanguage.module.css";

type ChooseLanguageLesson = Lesson & {
  type: "choose_language";
  data: {
    sources: VideoSource[];
    language_options: ProgrammingLanguage[];
  };
};

interface VideoStepProps {
  lessonData: ChooseLanguageLesson;
  onReady: () => void;
  onProceedToSelector: () => void;
  hasVisitedSelector: boolean;
}

export function VideoStep({ lessonData, onReady, onProceedToSelector, hasVisitedSelector }: VideoStepProps) {
  const videoSource = lessonData.data.sources[0] as VideoSource | undefined;
  const playbackId = videoSource?.id ?? "";

  const playerRef = useRef<MuxPlayerRefAttributes>(null);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const hasAutoPlayedRef = useRef(false);

  useEffect(() => {
    onReady();
    playerRef.current?.play().catch((error) => {
      console.warn("Autoplay was prevented:", error.message);
      setIsVideoVisible(true);
    });
  }, [onReady]);

  const handleVideoPlay = () => {
    setIsVideoVisible(true);
  };

  const handleVideoEnd = () => {
    onProceedToSelector();
  };

  const handleSkip = () => {
    onProceedToSelector();
  };

  const autoplay = () => {
    if (!hasAutoPlayedRef.current && playerRef.current?.currentTime === 0) {
      hasAutoPlayedRef.current = true;
      void playerRef.current.play();
    }
  };

  return (
    <>
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
              onCanPlay={autoplay}
            />
          ) : (
            <div className={styles.muxPlayer}>
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "rgb(17, 24, 39)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white"
                }}
              >
                No video available
              </div>
            </div>
          )}
        </div>
      </div>

      {!hasVisitedSelector && (
        <p className={styles.videoInstruction}>
          Watch the video then choose your language. Already know?{" "}
          <button className={styles.skipButton} onClick={handleSkip}>
            Skip the video
          </button>
        </p>
      )}
    </>
  );
}
