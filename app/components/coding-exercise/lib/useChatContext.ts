import { useMemo } from "react";
import type Orchestrator from "./Orchestrator";

export interface ChatContext {
  exerciseSlug: string;
  contextSlug: string; // The slug used for backend API calls (lessonSlug or projectSlug)
  exerciseTitle: string;
  exerciseInstructions: string;
  currentTaskId: string | null;
  currentCode: string;
  language: string;
  exercise: any; // Full exercise object
}

export function useChatContext(orchestrator: Orchestrator): ChatContext {
  return useMemo(() => {
    const exercise = orchestrator.getExercise();
    const storeState = orchestrator.getStore().getState();
    const currentCode = orchestrator.getCurrentEditorValue() || storeState.code || "";

    return {
      exerciseSlug: exercise.slug,
      contextSlug: storeState.context.slug,
      exerciseTitle: orchestrator.getExerciseTitle(),
      exerciseInstructions: orchestrator.getExerciseInstructions(),
      currentTaskId: storeState.currentTaskId,
      currentCode,
      language: storeState.language,
      exercise
    };
  }, [orchestrator]);
}
