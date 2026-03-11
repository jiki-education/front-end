import { assembleClassNames } from "@/lib/assemble-classnames";
import type { VisualExerciseDefinition } from "@jiki/curriculum";
import { marked } from "marked";
import styles from "../../../CodingExercise.module.css";
import { useOrchestratorStore } from "../../../lib/Orchestrator";
import { useOrchestrator } from "../../../lib/OrchestratorContext";
import type { VisualTestResult } from "../../../lib/test-results-types";

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

  const statusClass = status === "fail" ? styles.stateFailed : status === "pending" ? styles.statePending : "";

  return (
    <div data-ci="inspected-test-result-view" className={styles.leftColumnContent}>
      <div className={assembleClassNames(styles.testDescription, statusClass)}>
        <span className={styles.instructionLabel}>{name}</span>
        {scenario.description && (
          <div className="my-8">
            <div
              className="ui-textual-content ui-textual-content-compact"
              dangerouslySetInnerHTML={{ __html: marked.parse(scenario.description, { async: false }) }}
            />
          </div>
        )}
        {children}
      </div>
      {footer}
    </div>
  );
}
