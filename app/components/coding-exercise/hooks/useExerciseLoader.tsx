import { useEffect, useRef, useState } from "react";
import { exercises, type ExerciseSlug } from "@jiki/curriculum";
import Orchestrator from "../lib/Orchestrator";

interface UseExerciseLoaderProps {
  language: "javascript" | "jikiscript" | "python";
  exerciseSlug: ExerciseSlug;
  projectSlug?: string;
  isProject?: boolean;
}

export function useExerciseLoader({ language, exerciseSlug, projectSlug, isProject = false }: UseExerciseLoaderProps) {
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
        const exercise = (await loader()).default;

        // Create orchestrator only once and store in ref
        // Pass hardcoded jikiscript language and exercise context
        const context =
          isProject && projectSlug
            ? { type: "project" as const, slug: projectSlug }
            : { type: "lesson" as const, slug: exerciseSlug };

        orchestratorRef.current = new Orchestrator(exercise, language, context);

        // Fetch completion status
        try {
          const { fetchUserLesson } = await import("@/lib/api/lessons");
          const userLesson = await fetchUserLesson(exerciseSlug);
          const isCompleted = userLesson.status === "completed";
          orchestratorRef.current.setIsExerciseCompleted(isCompleted);
        } catch (error) {
          // If we can't fetch user lesson (not logged in, no internet, etc.), assume not completed
          console.warn("Could not fetch user lesson status:", error);
          orchestratorRef.current.setIsExerciseCompleted(false);
        }

        setIsLoading(false);
      } catch (error) {
        setLoadError(error instanceof Error ? error.message : "Unknown error");
        setIsLoading(false);
      }
    };

    void loadExercise();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    orchestrator: orchestratorRef.current,
    isLoading,
    loadError
  };
}
