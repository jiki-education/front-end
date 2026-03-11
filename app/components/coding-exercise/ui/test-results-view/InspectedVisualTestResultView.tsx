import { assembleClassNames } from "@/lib/assemble-classnames";
import type { VisualExerciseDefinition } from "@jiki/curriculum";
import { marked } from "marked";
import { useMemo } from "react";
import styles from "../../CodingExercise.module.css";
import { useOrchestratorStore } from "../../lib/Orchestrator";
import { useOrchestrator } from "../../lib/OrchestratorContext";
import type { TestExpect, VisualTestExpect, VisualTestResult } from "../../lib/test-results-types";
import Scrubber from "../scrubber/Scrubber";
import { VisualTestCanvas } from "./VisualTestCanvas";
import { VisualTestResultView } from "./VisualTestResultView";

export function InspectedVisualTestResultView() {
  const orchestrator = useOrchestrator();
  const { currentTest, isSpotlightActive } = useOrchestratorStore(orchestrator);

  // Recompute firstExpect whenever currentTest changes
  // eslint-disable-next-line react-hooks/exhaustive-deps -- orchestrator is stable from context, including it breaks everything.
  const firstExpect = useMemo(() => orchestrator.getFirstExpect() as VisualTestExpect | null, [currentTest]);

  if (!currentTest || currentTest.type !== "visual") {
    return null;
  }

  return (
    <div className={assembleClassNames(styles.visualPlayer, currentTest.status === "fail" ? "fail" : "pass")}>
      <div className={styles.playerCanvas}>
        <div className={styles.playerContentRow}>
          <div className={styles.contentBelowTabs}>
            <VisualTestLHS name={currentTest.name} status={currentTest.status}>
              <TestResultInfo firstExpect={firstExpect} />
              <Scrubber />
            </VisualTestLHS>

            <VisualTestCanvas view={currentTest.view} isSpotlightActive={isSpotlightActive} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function VisualTestLHS({
  name,
  status,
  children
}: {
  name: string;
  status?: VisualTestResult["status"] | "pending";
  children: React.ReactNode;
}) {
  const orchestrator = useOrchestrator();
  const { currentTestIdx } = useOrchestratorStore(orchestrator);
  const exercise = orchestrator.getExercise() as VisualExerciseDefinition;
  const scenario = exercise.scenarios[currentTestIdx];

  const statusClass = status === "fail" ? styles.stateFailed : status === "pending" ? styles.statePending : "";

  return (
    <div data-ci="inspected-test-result-view" className={styles.leftColumnContent}>
      <div className={assembleClassNames(styles.testDescription, statusClass)}>
        <span className={styles.instructionLabel}>{name}</span>
        {scenario.description && (
          <div className="my-8">
            <div
              className="ui-textual-content ui-textual-content-compact"
              dangerouslySetInnerHTML={{ __html: marked.parse(scenario.description) }}
            />
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

function TestResultInfo({ firstExpect }: { firstExpect: TestExpect | null }) {
  const orchestrator = useOrchestrator();
  const { currentTest, testSuiteResult } = useOrchestratorStore(orchestrator);

  if (!firstExpect) {
    return null;
  }

  // Get the current test index for the PassMessage by finding the test in the suite
  const testIdx =
    testSuiteResult && currentTest ? testSuiteResult.tests.findIndex((test) => test.slug === currentTest.slug) : 0;

  // Get error message
  let errorHtml = firstExpect.errorHtml || "";
  // Only replace {value} template for IO tests (which have actual property)
  if ("actual" in firstExpect) {
    errorHtml = errorHtml.replace(/{value}/, String(firstExpect.actual));
  }

  return <VisualTestResultView isPassing={firstExpect.pass} errorHtml={errorHtml} testIdx={Math.max(0, testIdx)} />;
}
