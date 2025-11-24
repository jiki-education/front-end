import { assembleClassNames } from "@/utils/assemble-classnames";
import { useEffect, useMemo, useRef } from "react";
import { useOrchestratorStore } from "../../lib/Orchestrator";
import { useOrchestrator } from "../../lib/OrchestratorContext";
import type { TestExpect, VisualTestExpect, VisualTestResult } from "../../lib/test-results-types";
import { VisualTestResultView } from "./VisualTestResultView";
import styles from "../../CodingExercise.module.css";

export function InspectedVisualTestResultView() {
  const orchestrator = useOrchestrator();
  const { currentTest, isSpotlightActive } = useOrchestratorStore(orchestrator);

  const viewContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!currentTest || currentTest.type !== "visual") {
      return;
    }
    if (!viewContainerRef.current) {
      return;
    }

    if (viewContainerRef.current.children.length > 0) {
      const oldView = viewContainerRef.current.children[0] as HTMLElement;
      document.body.appendChild(oldView);
      oldView.style.display = "none";
    }

    viewContainerRef.current.innerHTML = "";
    currentTest.view.classList.add(
      "container-size",
      "aspect-square",
      "max-h-[100cqh]",
      "max-w-[100cqw]",
      "bg-white",
      "relative"
    );
    viewContainerRef.current.appendChild(currentTest.view);
    currentTest.view.style.display = "block";
  }, [currentTest]);

  // Recompute firstExpect whenever currentTest changes
  // eslint-disable-next-line react-hooks/exhaustive-deps -- orchestrator is stable from context, including it breaks everything.
  const firstExpect = useMemo(() => orchestrator.getFirstExpect() as VisualTestExpect | null, [currentTest]);

  if (!currentTest || currentTest.type !== "visual") {
    return null;
  }

  return (
    <div className={assembleClassNames(styles.scenario, currentTest.status === "fail" ? "fail" : "pass")}>
      <InspectedVisualTestResultViewLHS
        // if tests pass, this will be first processed `expect`, otherwise first failing `expect`.
        firstExpect={firstExpect}
        currentTest={currentTest}
      />

      <div
        className={assembleClassNames(
          "flex-grow relative p-2.5 bg-white [container-type:size] min-w-[300px] aspect-square flex-shrink",
          isSpotlightActive && "spotlight"
        )}
        ref={viewContainerRef}
      />
    </div>
  );
}

export function InspectedVisualTestResultViewLHS({
  currentTest,
  firstExpect
}: {
  currentTest: VisualTestResult;
  firstExpect: VisualTestExpect | null;
}) {
  return (
    <div data-ci="inspected-test-result-view" className={styles.leftColumnContent}>
      <div
        className={assembleClassNames(styles.testDescription, currentTest.status === "fail" ? styles.stateFailed : "")}
      >
        <p>
          <span className={styles.instructionLabel}>Scenario: </span>
          {currentTest.name}
        </p>

        <TestResultInfo firstExpect={firstExpect} />
      </div>
    </div>
  );
}

function TestResultInfo({ firstExpect }: { firstExpect: TestExpect | null }) {
  if (!firstExpect) {
    return null;
  }

  // Visual test
  let errorHtml = firstExpect.errorHtml || "";
  errorHtml = errorHtml.replace(/{value}/, String(firstExpect.actual));

  return <VisualTestResultView isPassing={firstExpect.pass} errorHtml={errorHtml} />;
}
