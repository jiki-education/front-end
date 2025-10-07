"use client";

import React, { useEffect, useState } from "react";
import { CodeMirror } from "@/components/coding-exercise/ui/codemirror/CodeMirror";
import Orchestrator from "@/components/coding-exercise/lib/Orchestrator";
import OrchestratorProvider from "@/components/coding-exercise/lib/OrchestratorProvider";
import { createTestExercise } from "@/tests/mocks/createTestExercise";

export default function OrchestratorCodeMirrorTestPage() {
  const [orchestrator, setOrchestrator] = useState<Orchestrator | null>(null);

  useEffect(() => {
    const exercise = createTestExercise({ slug: "test-exercise", initialCode: "// Initial code\nconst x = 42;" });
    const orch = new Orchestrator(exercise);
    setOrchestrator(orch);

    // Expose orchestrator to window for E2E testing
    (window as any).testOrchestrator = orch;

    return () => {
      delete (window as any).testOrchestrator;
    };
  }, []);

  if (!orchestrator) {
    return <div>Loading...</div>;
  }

  return (
    <OrchestratorProvider orchestrator={orchestrator}>
      <div className="p-8">
        <h1 className="text-2xl mb-4">CodeMirror E2E Test Page</h1>
        <div id="editor-container" className="border border-gray-300 rounded" data-testid="editor-container">
          <CodeMirror />
        </div>
      </div>
    </OrchestratorProvider>
  );
}
