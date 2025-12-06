"use client";

import CodingExercise from "@/components/coding-exercise/CodingExercise";
import LessonLoadingPage from "@/components/lesson/LessonLoadingPage";
import VideoExercise from "@/components/video-exercise/VideoExercise";
import { fetchLesson, type LessonData } from "@/lib/api/lessons";
import type { ExerciseSlug } from "@jiki/curriculum";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function LessonPage({ params }: PageProps) {
  const router = useRouter();
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Update document title when lesson loads
  useEffect(() => {
    if (lesson) {
      document.title = `${lesson.title} - Jiki`;
    }
  }, [lesson]);

  // Load lesson on mount
  useEffect(() => {
    let cancelled = false;

    async function loadLesson() {
      try {
        setLoading(true);
        const resolvedParams = await params;

        if (cancelled) {
          return;
        }

        const lessonData = await fetchLesson(resolvedParams.slug);

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!cancelled) {
          setLesson(lessonData);
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

    void loadLesson();

    return () => {
      cancelled = true;
    };
  }, [params]);

  if (loading) {
    // Show loading page - will default to exercise type if not specified
    return <LessonLoadingPage type={lesson?.type} />;
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

  // // Default to coding exercise for "exercise" type
  // // TODO: Map lesson slug to exercise slug from curriculum
  // // For now, use a simple mapping to available exercises
  // const exerciseSlugMap: Record<string, any> = {
  //   "solve-a-maze": "basic-movement",
  //   "win-space-invaders": "basic-movement",
  //   "solve-a-maze-with-numbers": "basic-movement"
  // };

  // const exerciseSlug = exerciseSlugMap[lesson.slug] || "basic-movement";

  return <CodingExercise exerciseSlug={lesson.slug as ExerciseSlug} />;
}
