"use client";

// Test page initializes orchestrator in useEffect for E2E testing
/* eslint-disable react-hooks/set-state-in-effect */

import Orchestrator from "@/components/coding-exercise/lib/Orchestrator";
import OrchestratorProvider from "@/components/coding-exercise/lib/OrchestratorProvider";
import { CodeMirror } from "@/components/coding-exercise/ui/codemirror/CodeMirror";
import { createMockExercise } from "@/tests/mocks/exercise";
import { useEffect, useState } from "react";

export default function OrchestratorCodeMirrorTestPage() {
  const [orchestrator, setOrchestrator] = useState<Orchestrator | null>(null);

  useEffect(() => {
    const exercise = createMockExercise({
      slug: "test-exercise",
      stubs: {
        javascript: "// Initial code\nconst x = 42;",
        python: "// Initial code\nconst x = 42;",
        jikiscript: "// Initial code\nconst x = 42;"
      }
    });
    const orch = new Orchestrator(exercise, "jikiscript");
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
