import type { ProcessedGuide } from "@/lib/content/types";
import { formatBlogDate } from "@/lib/utils";
import CalendarIcon from "@/icons/calendar.svg";
import ClockIcon from "@/icons/clock.svg";
import shared from "@/components/landing-page/shared.module.css";
import styles from "@/components/blog/BlogPostHeader.module.css";

interface GuideHeaderProps {
  guide: ProcessedGuide;
}

export default function GuideHeader({ guide }: GuideHeaderProps) {
  return (
    <header className={styles.articleHeader}>
      <div className={`${shared["lg-container"]} ${styles.articleHeaderInner}`}>
        <div
          className={styles.articleHeaderImage}
          style={guide.coverImage ? { backgroundImage: `url(${guide.coverImage})` } : undefined}
        />
        <div className={styles.articleHeaderContent}>
          <h1 className={styles.articleTitle}>{guide.title}</h1>
          <p className={styles.articleSubtitle}>{guide.excerpt}</p>
          <div className={styles.articleMeta}>
            <div className={styles.metaItem}>
              <span className={styles.metaIcon}>
                <CalendarIcon />
              </span>
              <span>Last updated {formatBlogDate(guide.date)}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaIcon}>
                <ClockIcon />
              </span>
              <span>{guide.readingTime} minute read</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
