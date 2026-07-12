import MarkdownContent from "@/components/content/MarkdownContent";
import type { ProcessedGuide, GuideMeta } from "@/lib/content/types";
import GuideDetailHeader from "./GuideDetailHeader";
import FeaturedInProjects, { type FeaturedInEpisode } from "./FeaturedInProjects";
import RelatedGuides from "./RelatedGuides";
import PremiumGuideGate from "./PremiumGuideGate";
import shared from "@/components/landing-page/shared.module.css";
import styles from "@/components/ui/ContentWithSidebar.module.css";

interface GuideDetailContentProps {
  guide: ProcessedGuide;
  relatedGuides?: GuideMeta[];
  featuredInEpisodes?: FeaturedInEpisode[];
  locale?: string;
}

export default function GuideDetailContent({
  guide,
  relatedGuides = [],
  featuredInEpisodes = [],
  locale = "en"
}: GuideDetailContentProps) {
  const hasSidebar = relatedGuides.length > 0 || featuredInEpisodes.length > 0;

  // Premium guides render through the gate (teaser + upgrade CTA for non-premium
  // viewers); free guides render in full for everyone.
  const body = guide.premium ? (
    <PremiumGuideGate slug={guide.slug} content={guide.content} />
  ) : (
    <MarkdownContent content={guide.content} />
  );

  return (
    <div className={styles.mainContent}>
      <GuideDetailHeader guide={guide} />
      {hasSidebar ? (
        <div className={styles.contentWrapper}>
          <div className={`${shared["lg-container"]} ${styles.contentWrapperInner}`}>
            <article className={styles.articleContent}>{body}</article>
            <aside className={styles.rightPanel}>
              <FeaturedInProjects episodes={featuredInEpisodes} locale={locale} />
              <RelatedGuides guides={relatedGuides} locale={locale} />
            </aside>
          </div>
        </div>
      ) : (
        <div className={styles.contentWrapperFull}>
          <div className={`${shared["lg-container"]} ${styles.contentWrapperFullInner}`}>
            <article className={styles.articleContent}>{body}</article>
          </div>
        </div>
      )}
    </div>
  );
}
