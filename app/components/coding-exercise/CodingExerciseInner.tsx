"use client";

import { useEffect } from "react";
import { useOrchestratorContext } from "./lib/OrchestratorProvider";
import { useResizablePanels, Resizer } from "./useResize";
import { useOrchestratorStore } from "./lib/orchestrator/store";
import CodeEditor from "./ui/CodeEditor";
import RunButton from "./ui/RunButton";
import ScenariosPanel from "./ui/test-results-view/ScenariosPanel";
import { RHS } from "./RHS";
import styles from "./CodingExercise.module.css";
import "../../app/styles/components/ui-components.css";

export default function CodingExerciseInner() {
  const { containerRef, verticalDividerRef, horizontalDividerRef, handleVerticalMouseDown, handleHorizontalMouseDown } =
    useResizablePanels();

  const orchestrator = useOrchestratorContext();
  const { exerciseTitle } = useOrchestratorStore(orchestrator);

  // Update document title when exerciseTitle loads
  useEffect(() => {
    if (exerciseTitle) {
      document.title = `${exerciseTitle} - Jiki`;
    }
  }, [exerciseTitle]);

  return (
    <div className="c-coding-exercise flex flex-col h-screen bg-gray-50">
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
