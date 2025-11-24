"use client";

import { useEffect, useRef, useState } from "react";
import { exercises, type ExerciseSlug } from "@jiki/curriculum";
import LessonLoadingPage from "@/components/lesson/LessonLoadingPage";
import Orchestrator, { useOrchestratorStore } from "./lib/Orchestrator";
import OrchestratorProvider from "./lib/OrchestratorProvider";
import "./codemirror.css";
import CodeEditor from "./ui/CodeEditor";
import RunButton from "./ui/RunButton";
import ScenariosPanel from "./ui/test-results-view/ScenariosPanel";
import styles from "./CodingExercise.module.css";
import { RHS } from "./RHS";

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
  // Call the hook directly with the orchestrator
  const { status, error } = useOrchestratorStore(orchestrator);

  return (
    <OrchestratorProvider orchestrator={orchestrator}>
      <div className="flex flex-col h-screen bg-gray-50">
        <div className={styles.topBar}>
          <div className={styles.logo}>{orchestrator.getExerciseTitle()}</div>

          <div className={styles.topBarActions}>
            <button className={styles.closeButton}>×</button>
          </div>
        </div>

        <div className={styles.exerciseContainer}>
          <div className={styles.codeEditor}>
            <CodeEditor />
            <RunButton />
          </div>
          <ScenariosPanel />

          <RHS orchestrator={orchestrator} />
        </div>

        <div className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="text-sm">
              {status === "idle" && <span className="text-gray-600">Ready</span>}
              {status === "running" && <span className="text-blue-600">Running...</span>}
              {status === "success" && <span className="text-green-600">Success</span>}
              {status === "error" && <span className="text-red-600">Error</span>}
            </div>
            {error && <div className="text-sm text-red-600">{error}</div>}
          </div>
        </div>
      </div>
    </OrchestratorProvider>
  );
}
