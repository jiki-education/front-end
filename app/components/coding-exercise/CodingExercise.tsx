"use client";

import LessonLoadingPage from "@/components/lesson/LessonLoadingPage";
import { markLessonComplete } from "@/lib/api/lessons";
import { showModal } from "@/lib/modal/store";
import { exercises, type ExerciseSlug } from "@jiki/curriculum";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import "../../app/styles/components/ui-components.css";
import "./codemirror.css";
import styles from "./CodingExercise.module.css";
import Orchestrator from "./lib/Orchestrator";
import { useOrchestratorStore } from "./lib/orchestrator/store";
import OrchestratorProvider, { useOrchestratorContext } from "./lib/OrchestratorProvider";
import { RHS } from "./RHS";
import CodeEditor from "./ui/CodeEditor";
import RunButton from "./ui/RunButton";
import ScenariosPanel from "./ui/test-results-view/ScenariosPanel";
import { Resizer, useResizablePanels } from "./useResize";

interface CodingExerciseProps {
  exerciseSlug: ExerciseSlug;
  projectSlug?: string;
  isProject?: boolean;
}

export default function CodingExercise({ exerciseSlug, projectSlug, isProject = false }: CodingExerciseProps) {
  // Use ref to store the orchestrator instance to prevent recreation
  const orchestratorRef = useRef<Orchestrator | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Load the exercise and create orchestrator on mount
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

        orchestratorRef.current = new Orchestrator(exercise, "jikiscript", context);

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

  // Error state
  if (loadError) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-lg text-red-600">Error loading exercise: {loadError}</div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return <LessonLoadingPage type="exercise" />;
  }

  // At this point, orchestratorRef.current is guaranteed to be set
  return <CodingExerciseContent orchestrator={orchestratorRef.current!} />;
}

// Separate component that assumes orchestrator is loaded
function CodingExerciseContent({ orchestrator }: { orchestrator: Orchestrator }) {
  return (
    <OrchestratorProvider orchestrator={orchestrator}>
      <CodingExerciseInner />
    </OrchestratorProvider>
  );
}

function CodingExerciseInner() {
  const { containerRef, verticalDividerRef, horizontalDividerRef, handleVerticalMouseDown, handleHorizontalMouseDown } =
    useResizablePanels();

  const orchestrator = useOrchestratorContext();
  const { shouldShowCompleteButton, exerciseTitle, isExerciseCompleted } = useOrchestratorStore(orchestrator);
  const router = useRouter();

  // Update document title when exerciseTitle loads
  useEffect(() => {
    if (exerciseTitle) {
      document.title = `${exerciseTitle} - Jiki`;
    }
  }, [exerciseTitle]);

  const handleCompleteExercise = () => {
    showModal("exercise-completion-modal", {
      exerciseTitle: exerciseTitle,
      exerciseIcon: "/static/images/project-icons/icon-space-invaders.png",
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
            exerciseIcon: "/static/images/project-icons/icon-space-invaders.png",
            completionResponse: events,
            initialStep: "completed",
            onTidyCode: () => {
              state.setShouldShowCompleteButton(true);
            },
            onCompleteExercise: () => {}, // No-op since already completed
            onGoToProject: () => {
              router.push("/projects");
            },
            onGoToDashboard: () => {
              router.push("/dashboard");
            }
          });

          console.warn("Exercise completed successfully!");
        } catch (error) {
          console.error("Failed to mark lesson as complete:", error);
        }
      }
    });
  };

  return (
    <div className="c-coding-exercise flex flex-col h-screen bg-gray-50">
      <div className={styles.topBar}>
        <div className={styles.logo}>{String(exerciseTitle)}</div>
        <div className={styles.topBarActions}>
          {isExerciseCompleted && (
            <div className={styles.completedTag}>
              <div className={styles.completedTick}>✓</div>
              Completed!
            </div>
          )}
          {shouldShowCompleteButton && !isExerciseCompleted && (
            <button onClick={handleCompleteExercise} className="ui-btn ui-btn-primary ui-btn-small">
              Complete Exercise
            </button>
          )}
          <button onClick={() => router.push("/dashboard")} className={styles.closeButton}>
            ×
          </button>
        </div>
      </div>

      <div ref={containerRef} className={`${styles.exerciseContainer}`}>
        {/* LHS */}
        <div className={styles.codeEditor}>
          <CodeEditor />
          <RunButton />
        </div>

        <Resizer
          ref={horizontalDividerRef}
          handleMouseDown={handleHorizontalMouseDown}
          direction="horizontal"
          className={`${styles.horizontalDivider}`}
        />

        <ScenariosPanel />

        <Resizer
          ref={verticalDividerRef}
          handleMouseDown={handleVerticalMouseDown}
          direction="vertical"
          className={`${styles.verticalDivider}`}
        />

        {/* RHS - need to get orchestrator from context */}
        <RHSWithOrchestrator />
      </div>
    </div>
  );
}

function RHSWithOrchestrator() {
  const orchestrator = useOrchestratorContext();
  return <RHS orchestrator={orchestrator} />;
}
