"use client";

import { useEffect, useRef, useState } from "react";
import { exercises, type ExerciseSlug } from "@jiki/curriculum";
import LessonLoadingPage from "@/components/lesson/LessonLoadingPage";
import Orchestrator, { useOrchestratorStore } from "./lib/Orchestrator";
import OrchestratorProvider from "./lib/OrchestratorProvider";
import CodeEditor from "./ui/CodeEditor";
import HintsView from "./ui/HintsView";
import InstructionsPanel from "./ui/InstructionsPanel";
import RunButton from "./ui/RunButton";
import TabPanel from "./ui/TabPanel";
import TasksView from "./ui/TasksView";
import ScenariosPanel from "./ui/test-results-view/ScenariosPanel";
import ConsoleTab from "./ui/test-results-view/ConsoleTab";
import LanguageToggle from "./ui/LanguageToggle";
import FunctionsView from "./ui/FunctionsView";

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
        // Pass project context if this is a project
        orchestratorRef.current = new Orchestrator(exercise, isProject ? { projectSlug } : undefined);
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
      <div className="flex flex-col h-screen bg-gray-50 coding-exercise-container">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">{orchestrator.getExerciseTitle()}</h1>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 flex flex-col">
            <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-700">Code Editor</h2>
              <LanguageToggle />
            </div>
            <CodeEditor />
            <div className="bg-white border-t border-gray-200 px-4 py-3">
              <RunButton />
            </div>
            <ScenariosPanel />
          </div>

          <div className="w-1/3 border-l border-gray-200 flex flex-col bg-white">
            <InstructionsPanel
              instructions={orchestrator.getExerciseInstructions()}
              className="border-b border-gray-200"
            />

            <div className="flex-1 overflow-hidden">
              <TabPanel
                tabs={[
                  {
                    id: "tasks",
                    label: "Tasks",
                    content: <TasksView tasks={orchestrator.getExercise().tasks} orchestrator={orchestrator} />
                  },
                  {
                    id: "functions",
                    label: "Functions",
                    content: <FunctionsView functions={orchestrator.getExercise().functions} />
                  },
                  {
                    id: "hints",
                    label: "Hints",
                    content: <HintsView hints={orchestrator.getExercise().hints} />
                  },
                  {
                    id: "console",
                    label: "Console",
                    content: <ConsoleTab />
                  }
                ]}
                defaultActiveTab="tasks"
              />
            </div>
          </div>
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
