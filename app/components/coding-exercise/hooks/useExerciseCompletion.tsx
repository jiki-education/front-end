import { useRouter } from "next/navigation";
import { showModal } from "@/lib/modal/store";
import { markLessonComplete } from "@/lib/api/lessons";
import type Orchestrator from "../lib/Orchestrator";

interface UseExerciseCompletionProps {
  orchestrator: Orchestrator;
  exerciseTitle: string;
  exerciseSlug: string;
}

export function useExerciseCompletion({ orchestrator, exerciseTitle, exerciseSlug }: UseExerciseCompletionProps) {
  const router = useRouter();

  const handleCompleteExercise = () => {
    showModal("exercise-completion-modal", {
      exerciseTitle: exerciseTitle,
      exerciseSlug: exerciseSlug,
      initialStep: "confirmation",
      onCompleteExercise: async () => {
        // Use the same completion logic as the store
        const state = orchestrator.store.getState();
        try {
          const response = await markLessonComplete(state.exerciseSlug);
          const events = response?.meta?.events || [];
          state.setCompletionResponse(events);
          state.setIsExerciseCompleted(true);

          // Re-show modal with completion response data
          showModal("exercise-completion-modal", {
            exerciseTitle: exerciseTitle,
            exerciseSlug: exerciseSlug,
            completionResponse: events,
            initialStep: "completed",
            onTidyCode: () => {
              state.setShouldShowCompleteButton(true);
            },
            onCompleteExercise: () => {}, // No-op since already completed
            onGoToDashboard: () => {
              // Check for unlocked lesson in the stored events
              const unlockedEvent = events.find((e: any) => e.type === "lesson_unlocked");
              const unlockedLessonSlug = unlockedEvent?.data?.lesson_slug;

              // Navigate to dashboard with completed and optionally unlocked lesson
              if (unlockedLessonSlug) {
                router.push(`/dashboard?completed=${state.exerciseSlug}&unlocked=${unlockedLessonSlug}`);
              } else {
                router.push(`/dashboard?completed=${state.exerciseSlug}`);
              }
            }
          });

          console.warn("Exercise completed successfully!");
        } catch (error) {
          console.error("Failed to mark lesson as complete:", error);
        }
      }
    });
  };

  return {
    handleCompleteExercise
  };
}
