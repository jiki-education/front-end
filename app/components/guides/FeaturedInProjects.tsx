import Image from "next/image";
import Link from "next/link";
import { localePath } from "@/lib/i18n/routes";
import styles from "./FeaturedInProjects.module.css";
import relatedStyles from "../articles/RelatedArticles.module.css";

export interface FeaturedInEpisode {
  projectSlug: string;
  projectTitle: string;
  episodeSlug: string;
  episodeTitle: string;
  episodeImage: string;
  episodeExcerpt: string;
}

interface FeaturedInProjectsProps {
  episodes: FeaturedInEpisode[];
  locale: string;
}

/**
 * Sidebar block on guide pages listing the project episodes that reference
 * this guide.
 */
export default function FeaturedInProjects({ episodes, locale }: FeaturedInProjectsProps) {
  if (episodes.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      <h3 className={relatedStyles.relatedArticlesTitle}>Featured in Projects</h3>
      <div className={styles.list}>
        {episodes.map((episode) => (
          <Link
            key={`${episode.projectSlug}/${episode.episodeSlug}`}
            href={localePath(`/projects/${episode.projectSlug}/episodes/${episode.episodeSlug}`, locale)}
            className={styles.card}
          >
            <Image
              src={`/static/images/projects/episodes/${episode.episodeImage}`}
              alt=""
              width={80}
              height={45}
              className={styles.episodeImage}
            />
            <div className={styles.cardText}>
              <span className={styles.projectTitle}>{episode.projectTitle}</span>
              <span className={styles.episodeTitle}>{episode.episodeTitle}</span>
              <p className={styles.episodeExcerpt}>{episode.episodeExcerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
