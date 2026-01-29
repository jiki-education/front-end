"use client";

import CodingExercise from "@/components/coding-exercise/CodingExercise";
import LanguageChoiceLesson from "@/components/language-choice/LanguageChoiceLesson";
import LessonLoadingModal from "@/components/common/LessonLoadingModal/LessonLoadingModal";
import VideoExercise from "@/components/video-exercise/VideoExercise";
import { fetchUserCourse } from "@/lib/api/courses";
import { fetchLesson } from "@/lib/api/lessons";
import type { UserCourse } from "@/types/course";
import type { LessonWithData } from "@/types/lesson";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function LessonPage({ params }: PageProps) {
  const router = useRouter();
  const [lesson, setLesson] = useState<LessonWithData | null>(null);
  const [userCourse, setUserCourse] = useState<UserCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Update document title when lesson loads
  useEffect(() => {
    if (lesson) {
      document.title = `${lesson.title} - Jiki`;
    }
  }, [lesson]);

  // Load lesson and user course on mount
  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        setLoading(true);
        const resolvedParams = await params;

        if (cancelled) {
          return;
        }

        const [lessonData, userCourseData] = await Promise.all([fetchLesson(resolvedParams.slug), fetchUserCourse()]);

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!cancelled) {
          setLesson(lessonData);
          setUserCourse(userCourseData);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to fetch lesson:", err);
          // Auth/network/rate-limit errors never reach here (handled globally)
          // Only application errors (404, 500, validation) reach this catch block
          setError(err instanceof Error ? err.message : "Failed to load lesson");
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
  }, [params]);

  if (loading) {
    return <LessonLoadingModal />;
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error || "Lesson not found"}</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Render appropriate component based on lesson type
  if (lesson.type === "video") {
    return <VideoExercise lessonData={lesson} />;
  }

  if (lesson.type === "exercise") {
    return (
      <CodingExercise
        language={userCourse?.language || "javascript"}
        exerciseSlug={lesson.data.slug}
        context={{ type: "lesson", slug: lesson.slug }}
      />
    );
  }

  if (lesson.type === "choose_language") {
    return <LanguageChoiceLesson lessonData={lesson} />;
  }

  // Quiz type - not yet implemented
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-gray-600 mb-4">Quiz lessons are not yet implemented</p>
        <button
          onClick={() => router.push("/dashboard")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
