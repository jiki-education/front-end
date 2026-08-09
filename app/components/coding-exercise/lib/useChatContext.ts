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
  // The exercise's content is two artifacts, so it takes two hashes to name it:
  // prose (instructions, per locale) and code (stub/solution, per language).
  proseHash: string;
  codeHash: string;
  exercise: any; // Full exercise object
}

export function useChatContext(orchestrator: Orchestrator): ChatContext {
  // The orchestrator's proseHash was resolved for the active UI locale (see
  // useExerciseLoader), so the same locale must accompany it to the proxy. The
  // codeHash carries no locale at all; `language` is what names it.
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
      proseHash: orchestrator.proseHash,
      codeHash: orchestrator.codeHash,
      exercise
    };
  }, [orchestrator, locale]);
}
