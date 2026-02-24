import { useEffect, useRef, useState } from "react";
import { exercises, type ExerciseSlug } from "@jiki/curriculum";
import Orchestrator from "../lib/Orchestrator";
import type { ExerciseContext } from "../lib/types";
import { hasPlaceholders, interpolateStub } from "../lib/stubInterpolation";

interface UseExerciseLoaderProps {
  language: "javascript" | "jikiscript" | "python";
  exerciseSlug: ExerciseSlug;
  context: ExerciseContext;
  levelId?: string;
  isCompleted?: boolean;
}

export function useExerciseLoader({ language, exerciseSlug, context, levelId, isCompleted }: UseExerciseLoaderProps) {
  const orchestratorRef = useRef<Orchestrator | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const loadExercise = async () => {
      try {
        // Check if exercise exists
        const loader = exercises[exerciseSlug];
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!loader) {
          throw new Error(
            `Exercise "${exerciseSlug}" not found in curriculum. Available exercises: ${Object.keys(exercises).join(", ")}`
          );
        }

        // Load the exercise module
        const loadedExercise = (await loader()).default;

        // Override levelId if provided (used for projects where level comes from the API)
        const exercise = levelId ? { ...loadedExercise, levelId } : { ...loadedExercise };

        // Interpolate stub placeholders with student's previous exercise code
        const rawStub = loadedExercise.stubs[language];
        if (hasPlaceholders(rawStub)) {
          const interpolatedCode = await interpolateStub(rawStub, language);
          exercise.stubs = { ...exercise.stubs, [language]: interpolatedCode };
        }

        // Create orchestrator with exercise, language, and context
        orchestratorRef.current = new Orchestrator(exercise, language, context);

        // Set completion status - use pre-fetched value if available, otherwise fetch
        if (isCompleted !== undefined) {
          orchestratorRef.current.setIsExerciseCompleted(isCompleted);
        } else {
          try {
            const { fetchUserLesson } = await import("@/lib/api/lessons");
            const userLesson = await fetchUserLesson(context.slug);
            orchestratorRef.current.setIsExerciseCompleted(userLesson.status === "completed");
          } catch (error) {
            // If we can't fetch user lesson (not logged in, no internet, etc.), assume not completed
            console.warn("Could not fetch user lesson status:", error);
            orchestratorRef.current.setIsExerciseCompleted(false);
          }
        }

        setIsLoading(false);
      } catch (error) {
        setLoadError(error instanceof Error ? error.message : "Unknown error");
        setIsLoading(false);
      }
    };

    void loadExercise();

    // Cleanup function to destroy orchestrator when component unmounts
    return () => {
      if (orchestratorRef.current) {
        orchestratorRef.current.destroy();
        orchestratorRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    orchestrator: orchestratorRef.current,
    isLoading,
    loadError
  };
}
