"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import SidebarLayout from "@/components/layout/SidebarLayout";
import SidebarLayoutContent from "@/components/layout/SidebarLayoutContent";
import { LessonIcon } from "@/components/icons/LessonIcon";
import MarkdownContent from "@/components/content/MarkdownContent";
import { RelatedConceptsPills } from "@/components/concepts/ConceptPill";
import { UpgradeCard } from "@/components/ui/UpgradeCard/UpgradeCard";
import { ExerciseVideoCard } from "@/components/exercises/ExerciseVideoCard";
import { ExerciseFunctionsCard } from "@/components/exercises/ExerciseFunctionsCard";
import { useAuthStore } from "@/lib/auth/authStore";
import { fetchLessonStatusesBySlugs } from "@/lib/api/lesson-progress";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import type { ConceptAncestor } from "@/types/concepts";
import type { VideoSource } from "@/types/lesson";
import styles from "./PublicExercisePage.module.css";

interface PublicExercisePageProps {
  slug: string;
  title: string;
  description: string;
  instructionsHtml: string;
  video: VideoSource | null;
  concepts: ConceptAncestor[];
}

export default function PublicExercisePage(props: PublicExercisePageProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isRedirecting = useSignedInRedirect(props.slug, isAuthenticated);

  // Signed-in visitors never see this page: they are on their way to the
  // exercise or to the dashboard. Blanking rather than rendering the teaser
  // keeps them from reading a "sign up" pitch they've already answered.
  if (isAuthenticated || isRedirecting) {
    return null;
  }

  return (
    <SidebarLayout activeItem="exercises">
      <SidebarLayoutContent>
        <ExerciseTeaser {...props} />
      </SidebarLayoutContent>
      {/* Outside the padded container so the band bleeds to the viewport edges,
          exactly as the concept page's sign-up CTA does. */}
      <SignupCta />
    </SidebarLayout>
  );
}

function ExerciseTeaser({ slug, title, description, instructionsHtml, video, concepts }: PublicExercisePageProps) {
  return (
    <div className={styles.grid}>
      <main className={styles.main}>
        <ExerciseHero slug={slug} title={title} description={description} />
        {instructionsHtml && <MarkdownContent content={instructionsHtml} variant="base" />}
      </main>
      <aside className={styles.aside}>
        <UpgradeCard />
        {video && <ExerciseVideoCard slug={slug} video={video} />}
        {/* Every concept is readable logged-out, so nothing here is ever locked. */}
        <RelatedConceptsPills concepts={concepts} isUnlocked={() => true} />
        <ExerciseFunctionsCard slug={slug} />
      </aside>
    </div>
  );
}

function ExerciseHero({ slug, title, description }: { slug: string; title: string; description: string }) {
  const t = useTranslations("exercises.public");
  return (
    <header className={styles.hero}>
      <div className={styles.icon}>
        <LessonIcon slug={slug} width={72} height={72} />
      </div>
      <p className={styles.eyebrow}>{t("eyebrow")}</p>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.description}>{description}</p>
    </header>
  );
}

function SignupCta() {
  const t = useTranslations("exercises.public");
  const routes = useLocaleRoutes();
  return (
    <div className={styles.cta}>
      <h2 className={styles.ctaTitle}>{t("ctaTitle")}</h2>
      <p className={styles.ctaSubtitle}>{t("ctaSubtitle")}</p>
      <Link href={routes.authSignup()} className={styles.ctaButton}>
        {t("ctaButton")}
      </Link>
      <p className={styles.ctaFootnote}>
        {t.rich("ctaFootnote", {
          login: (chunks) => (
            <Link href={routes.authLogin()} className={styles.ctaLink}>
              {chunks}
            </Link>
          )
        })}
      </p>
    </div>
  );
}

/**
 * Sends a signed-in visitor where they actually belong.
 *
 * Their progress decides which: an exercise they've unlocked opens directly,
 * anything else drops them on the dashboard rather than teasing content they
 * already have an account for. A failed lookup falls back to the dashboard,
 * since the alternative is stranding a logged-in user on a signup pitch.
 */
function useSignedInRedirect(slug: string, isAuthenticated: boolean): boolean {
  const router = useRouter();
  const routes = useLocaleRoutes();
  const dashboardPath = routes.dashboard();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    let cancelled = false;
    setIsRedirecting(true);

    const go = async () => {
      let destination = dashboardPath;
      try {
        const statuses = await fetchLessonStatusesBySlugs([slug]);
        if (statuses[slug] !== "locked") {
          destination = `/lesson/${slug}`;
        }
      } catch {
        // Fall through to the dashboard.
      }
      if (!cancelled) {
        router.replace(destination);
      }
    };

    void go();

    return () => {
      cancelled = true;
    };
  }, [slug, isAuthenticated, router, dashboardPath]);

  return isRedirecting;
}
