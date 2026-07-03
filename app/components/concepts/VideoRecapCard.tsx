import { useTranslations } from "next-intl";
import { showVideoWalkthrough } from "@/lib/modal/app";
import type { VideoSource } from "@/types/lesson";
import styles from "./VideoRecapCard.module.css";

interface VideoRecapCardProps {
  conceptSlug: string;
  videoData: VideoSource[];
  isAuthenticated: boolean;
}

export function VideoRecapCard({ conceptSlug, videoData, isAuthenticated }: VideoRecapCardProps) {
  const playbackId = videoData[0].id;

  if (isAuthenticated) {
    return <LoggedInVideoRecapCard conceptSlug={conceptSlug} playbackId={playbackId} />;
  }

  return <ExternalVideoRecapCard conceptSlug={conceptSlug} playbackId={playbackId} />;
}

function LoggedInVideoRecapCard({ conceptSlug, playbackId }: { conceptSlug: string; playbackId: string }) {
  const t = useTranslations("concepts.videoRecap");
  return (
    <VideoRecapCardShell
      conceptSlug={conceptSlug}
      playbackId={playbackId}
      header={t("loggedInHeader")}
      description={t("loggedInDescription")}
    />
  );
}

function ExternalVideoRecapCard({ conceptSlug, playbackId }: { conceptSlug: string; playbackId: string }) {
  const t = useTranslations("concepts.videoRecap");
  return (
    <VideoRecapCardShell
      conceptSlug={conceptSlug}
      playbackId={playbackId}
      header={t("loggedOutHeader")}
      description={t("loggedOutDescription")}
    />
  );
}

interface VideoRecapCardShellProps {
  conceptSlug: string;
  playbackId: string;
  header: string;
  description: string;
}

function VideoRecapCardShell({ conceptSlug, playbackId, header, description }: VideoRecapCardShellProps) {
  const t = useTranslations("concepts.videoRecap");
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
      <div className={styles.header}>{header}</div>
      <p className={styles.description}>{description}</p>
      <div
        className={styles.thumbnail}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={t("playAriaLabel")}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={thumbnailUrl} alt={t("thumbnailAlt")} />
        <div className={styles.playBtn}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <polygon points="6,4 20,12 6,20" />
          </svg>
        </div>
      </div>
    </div>
  );
}
