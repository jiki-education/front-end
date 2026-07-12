"use client";

import Link from "next/link";
import { ConceptsLayout } from "@/components/concepts";
import ConceptLayout from "@/components/concepts/ConceptLayout";
import MarkdownContent from "@/components/content/MarkdownContent";
import { localePath } from "@/lib/i18n/routes";
import type { GuideMeta, ProcessedEpisode, ProjectMeta } from "@/lib/content/types";
import EpisodeSummary from "./EpisodeSummary";
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

  const sidebar =
    episode.summary || guides.length > 0 ? (
      <div className={styles.sidebar}>
        {episode.summary && <EpisodeSummary summary={episode.summary} />}
        {guides.length > 0 && (
          <GuidesSidebar guides={guides} locale={locale} description="Guides useful for you in this episode" />
        )}
      </div>
    ) : undefined;

  return (
    <ConceptsLayout>
      <ConceptLayout rightPanel={sidebar}>
        <Link href={projectPath} className={styles.backLink}>
          ← Back to {project.title}
        </Link>

        <h1 className={styles.title}>{episode.title}</h1>
        <p className={styles.excerpt}>{episode.excerpt}</p>

        <EpisodeVideo
          uuid={episode.uuid}
          projectPath={projectPath}
          videoProvider={episode.videoProvider}
          videoKey={episode.videoKey}
          premium={episode.premium}
        />

        <hr className="ui-chevron-divider" />

        <section className={styles.transcript}>
          <MarkdownContent content={episode.content} variant="base" />
        </section>
      </ConceptLayout>
    </ConceptsLayout>
  );
}
