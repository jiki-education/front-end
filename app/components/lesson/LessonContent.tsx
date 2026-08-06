"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import type { UserCourse } from "@/types/course";
import type { Lesson, VideoSource } from "@/types/lesson";
import type { LastSubmissionData } from "@/lib/api/types/conversation";
import { useLocaleRoutes } from "@/lib/i18n/useLocaleRoutes";
import styles from "./LessonContent.module.css";

const CodingExercise = dynamic(() => import("@/components/coding-exercise/CodingExercise"), { ssr: false });
const VideoExercise = dynamic(() => import("@/components/video-exercise/VideoExercise"), { ssr: false });
const ChooseLanguage = dynamic(() => import("@/components/choose-language/ChooseLanguage"), { ssr: false });

interface LessonContentProps {
  lesson: Lesson;
  // Curriculum copy resolved by the parent during the page load phase. The
  // video is already resolved for the active locale; absent for non-video lessons.
  lessonTitle: string;
  video?: VideoSource;
  userCourse: UserCourse | null;
  isCompleted: boolean;
  serverSubmission: LastSubmissionData | null;
  onReady: () => void;
}

export default function LessonContent({
  lesson,
  lessonTitle,
  video,
  userCourse,
  isCompleted,
  serverSubmission,
  onReady
}: LessonContentProps) {
  if (lesson.type === "video") {
    return <VideoExercise lessonData={lesson} lessonTitle={lessonTitle} video={video} onReady={onReady} />;
  }

  if (lesson.type === "exercise") {
    return (
      <CodingExercise
        language={userCourse?.language || "javascript"}
        context={{ type: "lesson", slug: lesson.slug }}
        isCompleted={isCompleted}
        serverSubmission={serverSubmission}
        onReady={onReady}
      />
    );
  }

  if (lesson.type === "choose_language") {
    return <ChooseLanguage lessonData={lesson} video={video} onReady={onReady} />;
  }

  // Quiz type - not yet implemented
  return <QuizNotImplemented onReady={onReady} />;
}

function QuizNotImplemented({ onReady }: { onReady: () => void }) {
  const router = useRouter();
  const routes = useLocaleRoutes();
  const t = useTranslations("lesson");

  useEffect(() => {
    onReady();
  }, [onReady]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <p className={styles.message}>{t("quizNotImplemented")}</p>
        <button onClick={() => router.push(routes.dashboard())} className={styles.button}>
          {t("backToDashboard")}
        </button>
      </div>
    </div>
  );
}
