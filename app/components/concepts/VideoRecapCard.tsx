import { showVideoWalkthrough } from "@/lib/modal/store";
import type { VideoData } from "@/types/lesson";
import styles from "./VideoRecapCard.module.css";

interface VideoRecapCardProps {
  conceptSlug: string;
  videoData: VideoData[];
}

export function VideoRecapCard({ conceptSlug, videoData }: VideoRecapCardProps) {
  const playbackId = videoData[0].id;
  const thumbnailUrl = `https://image.mux.com/${playbackId}/thumbnail.jpg?width=640&height=360`;

  const handleClick = () => {
    showVideoWalkthrough({ playbackId, lessonSlug: conceptSlug });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>Rewatch the Lesson</div>
      <p className={styles.description}>
        Remind yourself of when you learned this concept by watching back the teaching session
      </p>
      <div
        className={styles.thumbnail}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label="Play lesson recap video"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={thumbnailUrl} alt="Lesson recap thumbnail" />
        <div className={styles.playBtn}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <polygon points="6,4 20,12 6,20" />
          </svg>
        </div>
      </div>
    </div>
  );
}
