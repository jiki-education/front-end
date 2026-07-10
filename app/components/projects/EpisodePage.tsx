"use client";

import Link from "next/link";
import { ConceptsLayout } from "@/components/concepts";
import ConceptLayout from "@/components/concepts/ConceptLayout";
import MarkdownContent from "@/components/content/MarkdownContent";
import { localePath } from "@/lib/i18n/routes";
import type { GuideMeta, ProcessedEpisode, ProjectMeta } from "@/lib/content/types";
import EpisodeVideo from "./EpisodeVideo";
import GuidesSidebar from "./GuidesSidebar";
import styles from "./EpisodePage.module.css";

interface EpisodePageProps {
  project: ProjectMeta;
  episode: ProcessedEpisode;
  guides: GuideMeta[];
  locale: string;
}

export default function EpisodePage({ project, episode, guides, locale }: EpisodePageProps) {
  const projectPath = localePath(`/projects/${project.slug}`, locale);

  return (
    <ConceptsLayout>
      <ConceptLayout
        rightPanel={
          guides.length > 0 ? (
            <GuidesSidebar
              guides={guides}
              locale={locale}
              description="Written guides covering what we use in this episode."
            />
          ) : undefined
        }
      >
        <Link href={projectPath} className={styles.backLink}>
          ← Back to {project.title}
        </Link>

        <h1 className={styles.title}>{episode.title}</h1>
        <p className={styles.excerpt}>{episode.excerpt}</p>

        {episode.summary && <EpisodeSummaryBox summary={episode.summary} />}

        <EpisodeVideo
          uuid={episode.uuid}
          projectPath={projectPath}
          videoProvider={episode.videoProvider}
          videoKey={episode.videoKey}
          premium={episode.premium}
        />

        <section className={styles.transcript}>
          <h2 className={styles.transcriptHeading}>Transcript</h2>
          <MarkdownContent content={episode.content} variant="base" />
        </section>
      </ConceptLayout>
    </ConceptsLayout>
  );
}

function EpisodeSummaryBox({ summary }: { summary: NonNullable<ProcessedEpisode["summary"]> }) {
  return (
    <div className={styles.summaryBox}>
      <div className={styles.summaryJourney}>
        <div className={styles.summaryStop}>
          <span className={styles.summaryLabel}>Where we start</span>
          <span className={styles.summaryText}>{summary.from}</span>
        </div>
        <span className={styles.summaryArrow} aria-hidden="true">
          →
        </span>
        <div className={styles.summaryStop}>
          <span className={styles.summaryLabel}>Where we end up</span>
          <span className={styles.summaryText}>{summary.to}</span>
        </div>
      </div>
      {summary.keyConcepts.length > 0 && (
        <div className={styles.summaryConcepts}>
          <span className={styles.summaryLabel}>Key concepts</span>
          <div className={styles.summaryConceptPills}>
            {summary.keyConcepts.map((concept) => (
              <span key={concept} className={styles.summaryConceptPill}>
                {concept}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
