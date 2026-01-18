import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { startLesson } from "@/lib/api/lessons";

export function useLessonNavigation() {
  const router = useRouter();
  const [clickedLessonSlug, setClickedLessonSlug] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleLessonNavigation = (lessonRoute: string) => {
    startTransition(() => {
      router.push(lessonRoute);

      const lessonSlug = lessonRoute.split("/").pop();
      if (lessonSlug) {
        startLesson(lessonSlug).catch((error) => {
          console.error("Failed to start lesson tracking:", error);
        });
      }
    });
  };

  return {
    handleLessonNavigation,
    clickedLessonSlug,
    setClickedLessonSlug,
    isPending
  };
}
