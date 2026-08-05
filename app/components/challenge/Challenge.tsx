"use client";

import LessonLoadingModal from "@/components/common/LessonLoadingModal/LessonLoadingModal";
import { fetchChallenge, fetchUserChallenge, startChallenge, type ChallengeData } from "@/lib/api/challenges";
import { ApiError, getApiErrorType, NotFoundError } from "@/lib/api/client";
import { fetchUserCourse } from "@/lib/api/courses";
import type { LastSubmissionData } from "@/lib/api/types/conversation";
import type { UserCourse } from "@/types/course";
import dynamic from "next/dynamic";
import { useTranslations, useLocale } from "next-intl";
import { fetchCurriculumCopy, resolveCopy, type CurriculumCopy } from "@/lib/api/curriculum-copy";
import { useCallback, useEffect, useState } from "react";
import ChallengeError from "./ChallengeError";
import ChallengeLocked from "./ChallengeLocked";
import ChallengePremiumRequired from "./ChallengePremiumRequired";

const CodingExercise = dynamic(() => import("@/components/coding-exercise/CodingExercise"), { ssr: false });

type LockState = "locked" | "premium" | null;

interface ChallengeProps {
  slug: string;
}

export default function Challenge({ slug }: ChallengeProps) {
  const t = useTranslations("challenge");
  const locale = useLocale();
  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [copy, setCopy] = useState<CurriculumCopy | null>(null);
  const [userCourse, setUserCourse] = useState<UserCourse | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [serverSubmission, setServerSubmission] = useState<LastSubmissionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lockState, setLockState] = useState<LockState>(null);
  const [innerReady, setInnerReady] = useState(false);

  const handleReady = useCallback(() => setInnerReady(true), []);

  // Update document title once copy resolves, so the tab never shows the slug
  useEffect(() => {
    if (copy) {
      document.title = t("documentTitle", { title: copy.title });
    }
  }, [copy, t]);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        setLoading(true);

        // Start tracking first — this is the lock-enforcement gate. It rejects
        // with a 403 (challenge_locked / premium_required) or 404 when the user
        // may not access this challenge.
        await startChallenge(slug);
        if (cancelled) {
          return;
        }

        const [challengeData, userCourseData, userChallenge, catalog] = await Promise.all([
          fetchChallenge(slug),
          fetchUserCourse(),
          fetchUserChallenge(slug).catch((err: unknown) => {
            // No user_challenge record yet just means "not started" — that's fine.
            if (err instanceof NotFoundError) {
              return null;
            }
            throw err;
          }),
          fetchCurriculumCopy(locale)
        ]);

        // `cancelled` is mutated by the cleanup function across the awaits above;
        // ESLint's static analysis can't see that and thinks it's always false.
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (cancelled) {
          return;
        }

        setChallenge(challengeData);
        setCopy(resolveCopy(catalog, slug));
        setUserCourse(userCourseData);
        setIsCompleted(userChallenge?.status === "completed");
        setServerSubmission(userChallenge?.data?.last_submission ?? null);
      } catch (err) {
        if (cancelled) {
          return;
        }

        // The /start gate rejects locked/premium access with a 403.
        if (err instanceof ApiError && err.status === 403) {
          const type = getApiErrorType(err);
          if (type === "premium_required") {
            setLockState("premium");
            return;
          }
          setLockState("locked");
          return;
        }

        console.error("Failed to load challenge:", err);
        setError(err instanceof Error ? err.message : t("loadError"));
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      cancelled = true;
    };
  }, [slug, t, locale]);

  if (error) {
    return <ChallengeError error={error} />;
  }

  if (lockState === "locked") {
    return <ChallengeLocked />;
  }

  if (lockState === "premium") {
    return <ChallengePremiumRequired />;
  }

  const showModal = loading || !challenge || !innerReady;

  // CodingExercise must mount *underneath* the modal (not behind an early return) so its
  // dynamic chunk and exercise loader can run in the background. The child fires onReady
  // when truly ready, which flips innerReady and unmounts the modal in a single render —
  // keeping one modal instance alive across the whole load so its CSS animations don't restart.
  return (
    <>
      {challenge && (
        <CodingExercise
          language={userCourse?.language || "javascript"}
          context={{ type: "challenge", slug: challenge.slug }}
          levelId={userCourse?.current_level_slug ?? undefined}
          isCompleted={isCompleted}
          serverSubmission={serverSubmission}
          onReady={handleReady}
        />
      )}
      {showModal && <LessonLoadingModal />}
    </>
  );
}
