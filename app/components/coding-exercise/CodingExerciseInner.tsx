"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CloseButton } from "@/components/ui-kit";
import { useOrchestratorContext } from "./lib/OrchestratorProvider";
import { useResizablePanels, Resizer } from "./useResize";
import { useOrchestratorStore } from "./lib/orchestrator/store";
import { useExerciseCompletion } from "./hooks/useExerciseCompletion";
import CodeEditor from "./ui/CodeEditor";
import RunButton from "./ui/RunButton";
import ScenariosPanel from "./ui/test-results-view/ScenariosPanel";
import { RHS } from "./RHS";
import styles from "./CodingExercise.module.css";
import "../../app/styles/components/ui-components.css";
import JikiLogo from "@static/icons/jiki-logo.svg";

export default function CodingExerciseInner() {
  const { containerRef, verticalDividerRef, horizontalDividerRef, handleVerticalMouseDown, handleHorizontalMouseDown } =
    useResizablePanels();

  const orchestrator = useOrchestratorContext();
  const { shouldShowCompleteButton, exerciseTitle, isExerciseCompleted } = useOrchestratorStore(orchestrator);
  const router = useRouter();

  const { handleCompleteExercise } = useExerciseCompletion({
    orchestrator,
    exerciseTitle
  });

  // Update document title when exerciseTitle loads
  useEffect(() => {
    if (exerciseTitle) {
      document.title = `${exerciseTitle} - Jiki`;
    }
  }, [exerciseTitle]);

  return (
    <div className="c-coding-exercise flex flex-col h-screen bg-gray-50">
      <div className={styles.topBar}>
        <div className={styles.logo}>
          <JikiLogo />
        </div>
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
          <CloseButton
            onClick={() => router.push("/dashboard")}
            variant="light"
            size="small"
            aria-label="Close exercise"
          />
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
        <RHS orchestrator={orchestrator} />
      </div>
    </div>
  );
}
