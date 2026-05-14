import { useMemo } from "react";
import type Orchestrator from "./Orchestrator";
import type { ExerciseContext } from "./types";

export interface ChatContext {
  exerciseSlug: string;
  context: ExerciseContext; // Lesson/project context used for backend API calls
  exerciseTitle: string;
  exerciseInstructions: string;
  currentTaskId: string | null;
  language: string;
  contentHash: string; // Hash for fetching exercise content from static files
  exercise: any; // Full exercise object
}

export function useChatContext(orchestrator: Orchestrator): ChatContext {
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
      contentHash: orchestrator.contentHash,
      exercise
    };
  }, [orchestrator]);
}
