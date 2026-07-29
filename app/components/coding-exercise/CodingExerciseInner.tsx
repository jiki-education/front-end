"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useOrchestratorContext } from "./lib/OrchestratorProvider";
import { useResizablePanels, Resizer } from "./useResize";
import { useOrchestratorStore } from "./lib/orchestrator/store";
import CodeEditor from "./ui/CodeEditor";
import ScenariosPanel from "./ui/test-results-view/ScenariosPanel";
import { RHS } from "./RHS";
import styles from "./CodingExercise.module.css";
import "../../app/styles/components/ui-components.css";

export default function CodingExerciseInner() {
  const { containerRef, verticalDividerRef, horizontalDividerRef, handleVerticalMouseDown, handleHorizontalMouseDown } =
    useResizablePanels();

  const orchestrator = useOrchestratorContext();
  const { exerciseTitle, context, isSpotlightActive } = useOrchestratorStore(orchestrator);
  const tLesson = useTranslations("lesson");
  const tChallenge = useTranslations("challenge");

  // Update document title when exerciseTitle loads. This runs after the exercise
  // loads and so wins over the title set by the Lesson/Challenge page wrappers;
  // branch on the context type to keep the "Exercise" vs "Challenge" wording.
  useEffect(() => {
    if (exerciseTitle) {
      document.title =
        context.type === "challenge"
          ? tChallenge("documentTitle", { title: exerciseTitle })
          : tLesson("documentTitle", { title: exerciseTitle });
    }
  }, [exerciseTitle, context.type, tLesson, tChallenge]);

  return (
    <div className={`c-coding-exercise ${styles.rootWrapper}`}>
      <div ref={containerRef} className={`${styles.exerciseContainer}`} inert={isSpotlightActive}>
        {/* LHS */}
        <div className={styles.codeEditor}>
          <CodeEditor />
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
