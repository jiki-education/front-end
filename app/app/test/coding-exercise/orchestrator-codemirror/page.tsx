"use client";

// Test page initializes orchestrator in useEffect for E2E testing

import Orchestrator from "@/components/coding-exercise/lib/Orchestrator";
import OrchestratorProvider from "@/components/coding-exercise/lib/OrchestratorProvider";
import { CodeMirror } from "@/components/coding-exercise/ui/codemirror/CodeMirror";
import { createMockExercise } from "@/tests/mocks/exercise";
import { useEffect, useState } from "react";
import styles from "../harness.module.css";
import { useTranslations } from "next-intl";

export default function OrchestratorCodeMirrorTestPage() {
  const t = useTranslations("codingExercise");
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
    const orch = new Orchestrator({
      exercise: exercise,
      language: "jikiscript",
      context: { type: "lesson", slug: "maze-solve-basic" },
      interpreterLocaleMessages: {},
      exerciseLocaleMessages: {},
      t: t,
      contentHash: "",
      onGoToDashboard: () => {},
      levelTitle: "",
      isCompleted: false
    });
    setOrchestrator(orch);

    // Expose orchestrator to window for E2E testing
    (window as any).testOrchestrator = orch;

    return () => {
      delete (window as any).testOrchestrator;
    };
  }, [t]);

  if (!orchestrator) {
    return <div>Loading...</div>;
  }

  return (
    <OrchestratorProvider orchestrator={orchestrator}>
      <div className={styles.page}>
        <h1 className={styles.pageTitle}>CodeMirror E2E Test Page</h1>
        <div id="editor-container" className={styles.editorBox} data-testid="editor-container">
          <CodeMirror />
        </div>
      </div>
    </OrchestratorProvider>
  );
}
