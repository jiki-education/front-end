"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ConceptsLayout } from "@/components/concepts";
import ConceptLayout from "@/components/concepts/ConceptLayout";
import { fetchUserVideos } from "@/lib/api/user-videos";
import { trackEvent } from "@/lib/analytics";
import { useAuthStore } from "@/lib/auth/authStore";
import { localePath } from "@/lib/i18n/routes";
import { tierIncludes } from "@/lib/pricing";
import type { EpisodeMeta, GuideMeta, ProjectMeta } from "@/lib/content/types";
import { UpcomingStreams } from "@/components/build/UpcomingStreams";
import { EpisodeCard } from "./EpisodeCard";
import GuidesSidebar from "./GuidesSidebar";
import styles from "./ProjectPage.module.css";

const WATCHED_THRESHOLD = 95;

interface ProjectPageProps {
  project: ProjectMeta;
  episodes: EpisodeMeta[];
  guides: GuideMeta[];
  locale: string;
}

export default function ProjectPage({ project, episodes, guides, locale }: ProjectPageProps) {
  const sorted = [...episodes].sort((a, b) => a.order - b.order);
  const [progressByUuid, setProgressByUuid] = useState<Record<string, number>>({});
  const [progressLoaded, setProgressLoaded] = useState(false);
  const user = useAuthStore((state) => state.user);
  const userIsPremium = !!user && tierIncludes(user.membership_type, "premium");

  // Watch progress is per-user state: logged-out visitors (this is a public
  // page) get no fetch and no progress bars.
  useEffect(() => {
    if (!user) {
      return;
    }

    let cancelled = false;
    void fetchUserVideos().then((videos) => {
      if (cancelled) {
        return;
      }
      const map: Record<string, number> = {};
      for (const video of videos) {
        map[video.uuid] = video.watched_percentage;
      }
      setProgressByUuid(map);
      setProgressLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, [user]);

  // If a free user has watched all the free episodes in this project and only
  // premium ones remain, the page is effectively a paywall for them. Wait for
  // progress to load so we don't false-positive before we know what's watched.
  useEffect(() => {
    if (!progressLoaded || userIsPremium) return;
    const remainingFree = episodes.filter((ep) => !ep.premium && (progressByUuid[ep.uuid] ?? 0) < WATCHED_THRESHOLD);
    const remainingPremium = episodes.filter((ep) => ep.premium && (progressByUuid[ep.uuid] ?? 0) < WATCHED_THRESHOLD);
    if (remainingFree.length === 0 && remainingPremium.length > 0) {
      trackEvent("premium_feature_blocked", {
        feature: "project_page_all_locked",
        context_type: "project",
        context_slug: project.slug
      });
    }
  }, [progressLoaded, userIsPremium, episodes, progressByUuid, project.slug]);

  const sidebar = (
    <div className={styles.sidebar}>
      <UpcomingStreams projects={[project]} />
      {guides.length > 0 && (
        <GuidesSidebar guides={guides} locale={locale} description="Guides useful for you in this project" />
      )}
    </div>
  );

  return (
    <ConceptsLayout>
      <ConceptLayout rightPanel={sidebar}>
        <Link href={localePath("/build", locale)} className={styles.backLink}>
          ← Back to all Projects
        </Link>
        <h1 className={styles.title}>{project.title}</h1>
        <p className={styles.description}>{project.description}</p>
        {project.tags.length > 0 && (
          <div className={styles.pillRow}>
            {project.tags.map((tag) => (
              <span key={tag} className={styles.pill}>
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className={styles.episodesList}>
          {sorted.map((episode) => (
            <EpisodeCard
              key={episode.uuid}
              project={project}
              episode={episode}
              locale={locale}
              watchedPercentage={progressByUuid[episode.uuid]}
            />
          ))}
        </div>
      </ConceptLayout>
    </ConceptsLayout>
  );
}
