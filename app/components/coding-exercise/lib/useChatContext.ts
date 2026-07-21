import { useMemo } from "react";
import { useLocale } from "next-intl";
import type Orchestrator from "./Orchestrator";
import type { ExerciseContext } from "./types";

export interface ChatContext {
  exerciseSlug: string;
  context: ExerciseContext; // Lesson/challenge context used for backend API calls
  exerciseTitle: string;
  exerciseInstructions: string;
  currentTaskId: string | null;
  language: string;
  locale: string; // Locale the exercise content was loaded for (path segment of the content URL)
  contentHash: string; // Hash for fetching exercise content from static files
  exercise: any; // Full exercise object
}

export function useChatContext(orchestrator: Orchestrator): ChatContext {
  // The orchestrator's contentHash was resolved for the active UI locale (see
  // useExerciseLoader), so the same locale must accompany it to the proxy.
  const locale = useLocale();

  return useMemo(() => {
    const exercise = orchestrator.getExercise();
    const storeState = orchestrator.getStore().getState();

    return {
      exerciseSlug: exercise.slug,
      context: storeState.context,
      exerciseTitle: orchestrator.getExerciseTitle(),
      exerciseInstructions: orchestrator.getExerciseInstructions(),
      currentTaskId: storeState.currentTaskId,
      language: storeState.language,
      locale,
      contentHash: orchestrator.contentHash,
      exercise
    };
  }, [orchestrator, locale]);
}
