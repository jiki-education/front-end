import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function useLessonNavigation() {
  const router = useRouter();
  const [clickedLessonSlug, setClickedLessonSlug] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Navigation only. Starting the lesson (creating the UserLesson row) is owned by
  // the lesson page itself, which ensures it on mount for every entry path — see
  // components/lesson/Lesson.tsx. Doing it here too was redundant and, because the
  // fire-and-forget request could be aborted by the navigation, unreliable.
  const handleLessonNavigation = (lessonRoute: string) => {
    startTransition(() => {
      router.push(lessonRoute);
    });
  };

  return {
    handleLessonNavigation,
    clickedLessonSlug,
    setClickedLessonSlug,
    isPending
  };
}
