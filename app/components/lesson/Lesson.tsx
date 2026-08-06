"use client";

import LessonLoadingModal from "@/components/common/LessonLoadingModal/LessonLoadingModal";
import { fetchUserCourse } from "@/lib/api/courses";
import { ApiError } from "@/lib/api/client";
import { fetchLesson, startLesson } from "@/lib/api/lessons";
import type { UserCourse } from "@/types/course";
import type { Lesson } from "@/types/lesson";
import type { LastSubmissionData } from "@/lib/api/types/conversation";
import { useCallback, useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { fetchCurriculumCopy, resolveCopy, type CurriculumCopy } from "@/lib/api/curriculum-copy";
import LessonContent from "./LessonContent";
import LessonError from "./LessonError";

interface LessonProps {
  slug: string;
}

export default function Lesson({ slug }: LessonProps) {
  const t = useTranslations("lesson");
  const locale = useLocale();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [copy, setCopy] = useState<CurriculumCopy | null>(null);
  const [userCourse, setUserCourse] = useState<UserCourse | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [serverSubmission, setServerSubmission] = useState<LastSubmissionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [innerReady, setInnerReady] = useState(false);

  const handleReady = useCallback(() => setInnerReady(true), []);

  // Update document title when lesson loads. Waits for the resolved copy so the
  // tab never briefly shows the raw slug.
  useEffect(() => {
    if (copy) {
      document.title = t("documentTitle", { title: copy.title });
    }
  }, [copy, t]);

  // Load lesson and user course on mount
  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        setLoading(true);
        // Starting the lesson is idempotent and returns the user lesson (created
        // or existing), so a single request guarantees the row exists for every
        // entry path into the page (direct link, bookmark, new tab, dashboard)
        // and gives us its status — no read-404-start-reread dance.
        const [lessonData, userCourseData, userLesson, catalog] = await Promise.all([
          fetchLesson(slug),
          fetchUserCourse(),
          startLesson(slug),
          fetchCurriculumCopy(locale)
        ]);
        if (cancelled) {
          return;
        }

        setLesson(lessonData);
        setCopy(resolveCopy(catalog, slug));
        setUserCourse(userCourseData);
        setIsCompleted(userLesson.status === "completed");
        setServerSubmission(userLesson.data?.last_submission ?? null);
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to fetch lesson:", err);
          // Auth/network/rate-limit errors never reach here (handled globally)
          // Only application errors (404, 500, validation) reach this catch block.
          //
          // A 422 means this lesson can't be opened for this user (invalid/
          // unavailable state). Rather than stranding them on a dead error screen,
          // bounce back to the dashboard with a hard navigation so everything
          // reloads cleanly. `lessonError` is a presence-only flag that tells the
          // dashboard to surface a toast (see ExercisePath).
          if (err instanceof ApiError && err.status === 422) {
            window.location.href = "/dashboard?lessonError=1";
            return;
          }
          setError(err instanceof Error ? err.message : t("loadError"));
        }
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
    return <LessonError error={error} />;
  }

  const showModal = loading || !lesson || !innerReady;

  // LessonContent must mount *underneath* the modal (not behind an early return) so its
  // dynamic chunk and exercise loader can run in the background. The child fires onReady
  // when truly ready, which flips innerReady and unmounts the modal in a single render —
  // keeping one modal instance alive across the whole load so its CSS animations don't restart.
  return (
    <>
      {lesson && (
        <LessonContent
          lesson={lesson}
          lessonTitle={copy?.title ?? ""}
          video={copy?.video}
          walkthroughVideo={copy?.walkthroughVideo}
          userCourse={userCourse}
          isCompleted={isCompleted}
          serverSubmission={serverSubmission}
          onReady={handleReady}
        />
      )}
      {showModal && <LessonLoadingModal />}
    </>
  );
}
