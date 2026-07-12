"use client";

import Link from "next/link";
import { ConceptsLayout } from "@/components/concepts";
import ConceptLayout from "@/components/concepts/ConceptLayout";
import MarkdownContent from "@/components/content/MarkdownContent";
import { localePath } from "@/lib/i18n/routes";
import type { GuideMeta, ProcessedEpisode, ProjectMeta } from "@/lib/content/types";
import EpisodeSummary from "./EpisodeSummary";
import EpisodeVideo from "./EpisodeVideo";
import RelevantGuidesSection from "./RelevantGuidesSection";
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
      <Link href={projectPath} className={styles.backLink}>
        ← Back to <span className={styles.backLinkProject}>{project.title}</span>
      </Link>

      <ConceptLayout rightPanel={episode.summary ? <EpisodeSummary summary={episode.summary} /> : undefined}>
        <h1 className={styles.title}>{episode.title}</h1>
        <p className={styles.excerpt}>{episode.excerpt}</p>

        <EpisodeVideo
          uuid={episode.uuid}
          projectPath={projectPath}
          videoProvider={episode.videoProvider}
          videoKey={episode.videoKey}
          premium={episode.premium}
        />
      </ConceptLayout>

      {guides.length > 0 && (
        <>
          <hr className="ui-chevron-divider" />
          <RelevantGuidesSection
            guides={guides}
            locale={locale}
            description="Guides that might be useful to you when solving this step in the process."
          />
        </>
      )}

      <hr className="ui-chevron-divider" />

      <section className={styles.transcript}>
        <MarkdownContent content={episode.content} variant="base" />
      </section>
    </ConceptsLayout>
  );
}
