import { assembleClassNames } from "@/lib/assemble-classnames";
import type { VisualExerciseDefinition } from "@jiki/curriculum";
import styles from "../../../CodingExercise.module.css";
import { useOrchestratorStore } from "../../../lib/Orchestrator";
import { useOrchestrator } from "../../../lib/OrchestratorContext";
import type { VisualTestResult } from "../../../lib/test-results-types";
import { ScenarioHeader } from "../ScenarioHeader";

export function VisualTestLHS({
  name,
  status,
  children,
  footer
}: {
  name: string;
  status?: VisualTestResult["status"] | "pending";
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const orchestrator = useOrchestrator();
  const { currentTestIdx } = useOrchestratorStore(orchestrator);
  const exercise = orchestrator.getExercise() as VisualExerciseDefinition;
  const scenario = exercise.scenarios[currentTestIdx];

  const statusClass =
    status === "fail"
      ? styles.stateFailed
      : status === "lint_warning"
        ? styles.stateLintWarning
        : status === "pending"
          ? styles.statePending
          : "";

  return (
    <div data-ci="inspected-test-result-view" className={styles.leftColumnContent}>
      <div className={assembleClassNames(styles.testDescription, statusClass)}>
        <ScenarioHeader name={name} description={scenario.description} />
        {children}
      </div>
      {footer}
    </div>
  );
}
