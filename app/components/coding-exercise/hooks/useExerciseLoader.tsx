import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { exercises, type ExerciseSlug, type ExerciseDefinition, type Language } from "@jiki/curriculum";
import Orchestrator from "../lib/Orchestrator";
import type { ExerciseContext } from "../lib/types";
import { findFileForLanguage, hasPlaceholders, interpolateStub } from "../lib/stubInterpolation";
import { fetchExerciseContent, fetchExerciseMessages, fetchInterpreterCatalog } from "@/lib/api/exercise-meta";
import { localizeExerciseDefinition } from "@/lib/i18n/localizeExercise";
import type { LastSubmissionData } from "@/lib/api/types/conversation";

interface UseExerciseLoaderProps {
  language: "javascript" | "jikiscript" | "python";
  exerciseSlug: ExerciseSlug;
  context: ExerciseContext;
  levelId?: string;
  isCompleted: boolean;
  serverSubmission?: LastSubmissionData | null;
  onGoToDashboard: () => void;
}

export function useExerciseLoader({
  language,
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

  // Active UI locale. Drives both the runtime message dict AND the content fetch
  // (instructions/stub/solution). No fallback: an exercise without a content blob
  // for this locale fails to load (only dnd-roll ships non-en content in the pilot).
  const uiLocale = useLocale();

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

        // Load exercise module (shared), static content, the curriculum message
        // dict, and the interpreter's message catalog for the active locale — all
        // in parallel. Both dicts are a required part of the load (not best-effort
        // add-ons): neither the exercise nor the interpreter runs until they
        // resolve, so diagnostics always render in-locale. Content follows the
        // active UI locale with NO fallback: an exercise that lacks a blob for this
        // locale simply fails to load (only dnd-roll ships non-en content during
        // the pilot).
        const [exerciseModule, content, exerciseLocaleMessages, interpreterLocaleMessages] = await Promise.all([
          loader().then((m) => m.default),
          fetchExerciseContent(exerciseSlug, uiLocale, language),
          fetchExerciseMessages(exerciseSlug, uiLocale),
          fetchInterpreterCatalog(language, uiLocale)
        ]);

        // Assemble into full ExerciseDefinition.
        // Only the active language's stub/solution are loaded; the cast is safe because
        // all downstream consumers (Orchestrator, store) only access exercise.stubs[language].
        // Static display strings (task/scenario name+description, hints, function
        // description+category) are keyed in the curriculum and resolved here against
        // the fetched dict; the runtime dict is injected via the Orchestrator rail below.
        const localizedModule = localizeExerciseDefinition(exerciseModule, exerciseLocaleMessages);
        const exercise: ExerciseDefinition = {
          ...localizedModule,
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
          interpreterLocaleMessages,
          exerciseLocaleMessages,
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
