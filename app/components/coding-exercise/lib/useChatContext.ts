import { useMemo } from "react";
import type Orchestrator from "./Orchestrator";

export interface ChatContext {
  exerciseSlug: string;
  exerciseTitle: string;
  exerciseInstructions: string;
  currentTaskId: string | null;
  currentCode: string;
  exercise: any; // Full exercise object
}

export function useChatContext(orchestrator: Orchestrator): ChatContext {
  return useMemo(() => {
    const exercise = orchestrator.getExercise();
    const storeState = orchestrator.getStore().getState();
    const currentCode = orchestrator.getCurrentEditorValue() || storeState.code || "";

    return {
      exerciseSlug: exercise.slug,
      exerciseTitle: orchestrator.getExerciseTitle(),
      exerciseInstructions: orchestrator.getExerciseInstructions(),
      currentTaskId: storeState.currentTaskId,
      currentCode,
      exercise
    };
  }, [orchestrator]);
}
