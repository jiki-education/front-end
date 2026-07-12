import type { ProcessedGuide } from "@/lib/content/types";
import { formatBlogDate } from "@/lib/utils";
import CalendarIcon from "@/icons/calendar.svg";
import ClockIcon from "@/icons/clock.svg";
import shared from "@/components/landing-page/shared.module.css";
import styles from "./LoggedInGuideHeader.module.css";

interface LoggedInGuideHeaderProps {
  guide: ProcessedGuide;
}

/**
 * Guide detail header for logged-in users: full width with the title on the
 * left and the cover illustration on the right, but app-scale — no purple
 * hero band (that's GuideHeader, shown to logged-out visitors).
 */
export default function LoggedInGuideHeader({ guide }: LoggedInGuideHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={`${shared["lg-container"]} ${styles.inner}`}>
        <div className={styles.content}>
          <h1 className={styles.title}>{guide.title}</h1>
          <p className={styles.excerpt}>{guide.excerpt}</p>
          <div className={styles.meta}>
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
        {guide.coverImage && <div className={styles.image} style={{ backgroundImage: `url(${guide.coverImage})` }} />}
      </div>
    </header>
  );
}
