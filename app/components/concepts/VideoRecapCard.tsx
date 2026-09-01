import { useTranslations } from "next-intl";
import { showVideoWalkthrough } from "@/lib/modal/app";
import type { VideoSource } from "@/types/lesson";
import { videoThumbnailUrl } from "@/lib/videos/thumbnail";
import styles from "./VideoRecapCard.module.css";

interface VideoRecapCardProps {
  conceptSlug: string;
  video: VideoSource;
  isAuthenticated: boolean;
}

export function VideoRecapCard({ conceptSlug, video, isAuthenticated }: VideoRecapCardProps) {
  if (isAuthenticated) {
    return <LoggedInVideoRecapCard conceptSlug={conceptSlug} video={video} />;
  }

  return <ExternalVideoRecapCard conceptSlug={conceptSlug} video={video} />;
}

function LoggedInVideoRecapCard({ conceptSlug, video }: { conceptSlug: string; video: VideoSource }) {
  const t = useTranslations("concepts.videoRecap");
  return (
    <VideoRecapCardShell
      conceptSlug={conceptSlug}
      video={video}
      header={t("loggedInHeader")}
      description={t("loggedInDescription")}
    />
  );
}

function ExternalVideoRecapCard({ conceptSlug, video }: { conceptSlug: string; video: VideoSource }) {
  const t = useTranslations("concepts.videoRecap");
  return (
    <VideoRecapCardShell
      conceptSlug={conceptSlug}
      video={video}
      header={t("loggedOutHeader")}
      description={t("loggedOutDescription")}
    />
  );
}

interface VideoRecapCardShellProps {
  conceptSlug: string;
  video: VideoSource;
  header: string;
  description: string;
}

function VideoRecapCardShell({ conceptSlug, video, header, description }: VideoRecapCardShellProps) {
  const t = useTranslations("concepts.videoRecap");
  const thumbnailUrl = videoThumbnailUrl(video, 640, 360);

  const handleClick = () => {
    showVideoWalkthrough({ video, lessonSlug: conceptSlug });
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
