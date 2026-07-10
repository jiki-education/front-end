import { assembleClassNames } from "@/lib/assemble-classnames";
import type { IOExerciseDefinition } from "@jiki/curriculum";
import { formatIdentifier } from "@jiki/interpreters/shared";
import { useMemo } from "react";
import styles from "../../../CodingExercise.module.css";
import { useOrchestratorStore } from "../../../lib/Orchestrator";
import { useOrchestrator } from "../../../lib/OrchestratorContext";
import type { IOTestExpect } from "../../../lib/test-results-types";
import { IOTestResultView } from "../IOTestResultView";
import { HighlightedCode } from "../HighlightedCode";
import { ScenarioHeader } from "../ScenarioHeader";
import CheckCircleIcon from "@/icons/check-circle.svg";
import CrossCircleIcon from "@/icons/cross-circle.svg";
import ExclamationCircleIcon from "@/icons/exclamation-circle.svg";
import tableStyles from "./IOScenarioTable.module.css";

export function IOInspectedView() {
  const orchestrator = useOrchestrator();
  const { currentTest } = useOrchestratorStore(orchestrator);

  if (currentTest && currentTest.type === "io") {
    return <IOInspectedResultView />;
  }

  return <IOInspectedPreviewView />;
}

function IOInspectedPreviewView() {
  const orchestrator = useOrchestrator();
  const { currentTestIdx, language } = useOrchestratorStore(orchestrator);
  const exercise = orchestrator.getExercise() as IOExerciseDefinition;
  const scenario = exercise.scenarios[currentTestIdx];

  const argsStr = scenario.args.map((arg) => JSON.stringify(arg)).join(", ");
  const codeRun = `${formatIdentifier(scenario.functionName, language)}(${argsStr})`;
  const expectedStr = JSON.stringify(scenario.expected);

  return (
    <div data-ci="inspected-test-result-view" className={styles.leftColumnContent}>
      <div className={assembleClassNames(styles.testDescription, styles.statePending)}>
        <ScenarioHeader name={scenario.name} description={scenario.description} />
        <div className={tableStyles.wrapper}>
          <table className={tableStyles.table}>
            <tbody>
              <tr>
                <th>Code run</th>
                <td>
                  <div className={tableStyles.cellScroll}>
                    <HighlightedCode code={codeRun} language={language} />
                  </div>
                </td>
              </tr>
              <tr>
                <th>Expected</th>
                <td>
                  <div className={tableStyles.cellScroll}>{expectedStr}</div>
                </td>
              </tr>
              <tr>
                <th>Actual</th>
                <td className={tableStyles.pendingMessage}>
                  <div className={tableStyles.cellScroll}>Click &ldquo;Run Code&rdquo; to see what your code does.</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function IOInspectedResultView() {
  const orchestrator = useOrchestrator();
  const { currentTest, currentTestIdx, language } = useOrchestratorStore(orchestrator);
  const exercise = orchestrator.getExercise() as IOExerciseDefinition;
  const scenario = exercise.scenarios[currentTestIdx];

  // eslint-disable-next-line react-hooks/exhaustive-deps -- orchestrator is stable from context, including it causes React Compiler over-optimization
  const firstExpect = useMemo(() => orchestrator.getFirstExpect() as IOTestExpect | null, [currentTest]);

  if (!currentTest || currentTest.type !== "io") {
    return null;
  }

  const statusClass =
    currentTest.status === "fail"
      ? styles.stateFailed
      : currentTest.status === "lint_warning"
        ? styles.stateLintWarning
        : currentTest.status === "pass"
          ? styles.statePassed
          : "";

  return (
    <div data-ci="inspected-test-result-view" className={styles.leftColumnContent}>
      <div className={assembleClassNames(styles.testDescription, statusClass)}>
        {currentTest.status === "lint_warning" && (
          <div className={tableStyles.lintWarningMessage}>
            <ExclamationCircleIcon className={tableStyles.lintWarningIcon} />
            <span>
              <strong>Nearly there...</strong> Your code worked correctly, but you need to fix your formatting. Look for
              orange underlines in your code.
            </span>
          </div>
        )}
        <ScenarioHeader
          name={currentTest.name}
          description={scenario.description}
          statusIcon={
            currentTest.status === "pass" ? (
              <CheckCircleIcon className={styles.testStatusIcon} />
            ) : currentTest.status === "fail" ? (
              <CrossCircleIcon className={styles.testStatusIcon} />
            ) : currentTest.status === "lint_warning" ? (
              <CheckCircleIcon className={styles.testStatusIcon} />
            ) : null
          }
        />
        {firstExpect ? <IOTestResultView expect={firstExpect} language={language} /> : null}
      </div>
    </div>
  );
}
