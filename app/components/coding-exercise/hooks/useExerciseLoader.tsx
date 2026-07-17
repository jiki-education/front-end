import { useEffect, useRef, useState } from "react";
import { exercises, type ExerciseSlug, type ExerciseDefinition, type Language } from "@jiki/curriculum";
import Orchestrator from "../lib/Orchestrator";
import type { ExerciseContext } from "../lib/types";
import { findFileForLanguage, hasPlaceholders, interpolateStub } from "../lib/stubInterpolation";
import { fetchExerciseContent, fetchInterpreterCatalog } from "@/lib/api/exercise-meta";
import type { LastSubmissionData } from "@/lib/api/types/conversation";

interface UseExerciseLoaderProps {
  language: "javascript" | "jikiscript" | "python";
  locale: string;
  exerciseSlug: ExerciseSlug;
  context: ExerciseContext;
  levelId?: string;
  isCompleted: boolean;
  serverSubmission?: LastSubmissionData | null;
  onGoToDashboard: () => void;
}

export function useExerciseLoader({
  language,
  locale,
  exerciseSlug,
  context,
  levelId,
  isCompleted,
  serverSubmission,
  onGoToDashboard
}: UseExerciseLoaderProps) {
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

        // Load exercise module (shared), static content, and the interpreter's
        // message catalog for the active locale — all in parallel. The catalog is a
        // required part of the load (not a best-effort add-on): the interpreter is
        // never run until it resolves, so diagnostics always render in-locale (or,
        // for interpreters that don't yet localize, the catalog is simply ignored).
        const [exerciseModule, content, localeMessages] = await Promise.all([
          loader().then((m) => m.default),
          fetchExerciseContent(exerciseSlug, "en", language),
          fetchInterpreterCatalog(language, locale)
        ]);

        // Assemble into full ExerciseDefinition.
        // Only the active language's stub/solution are loaded; the cast is safe because
        // all downstream consumers (Orchestrator, store) only access exercise.stubs[language].
        const exercise: ExerciseDefinition = {
          ...exerciseModule,
          title: content.title,
          description: content.description,
          instructions: content.instructions,
          stubs: { [language]: content.stub } as Record<Language, string>,
          solutions: { [language]: content.solution } as Record<Language, string>
        };

        // Override levelId if provided (used for challenges where level comes from the API)
        if (levelId) {
          exercise.levelId = levelId;
        }

        // Interpolate stub placeholders with student's previous exercise code
        const rawStub = content.stub;
        if (hasPlaceholders(rawStub)) {
          const interpolatedCode = await interpolateStub(rawStub, language);
          exercise.stubs = { ...exercise.stubs, [language]: interpolatedCode };
        }

        // Map the server's last submission (if any) to the active language's code
        // so the orchestrator can merge it with localStorage on initialization.
        const serverData = serverSubmission
          ? {
              code: findFileForLanguage(serverSubmission.files, language)?.content ?? "",
              storedAt: serverSubmission.stored_at
            }
          : undefined;

        // Create orchestrator with exercise, language, and context
        orchestratorRef.current = new Orchestrator(
          exercise,
          language,
          context,
          localeMessages,
          content.contentHash,
          onGoToDashboard,
          serverData
        );

        orchestratorRef.current.setIsExerciseCompleted(isCompleted);

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
