import { assembleClassNames } from "@/lib/assemble-classnames";
import type { IOExerciseDefinition } from "@jiki/curriculum";
import { useMemo } from "react";
import styles from "../../../CodingExercise.module.css";
import { useOrchestratorStore } from "../../../lib/Orchestrator";
import { useOrchestrator } from "../../../lib/OrchestratorContext";
import type { IOTestExpect } from "../../../lib/test-results-types";
import { IOTestResultView } from "../IOTestResultView";
import { PassMessage } from "../PassMessage";

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
  const { currentTestIdx } = useOrchestratorStore(orchestrator);
  const exercise = orchestrator.getExercise() as IOExerciseDefinition;
  const scenario = exercise.scenarios[currentTestIdx];

  const argsStr = scenario.args.map((arg) => JSON.stringify(arg)).join(", ");
  const codeRun = `${scenario.functionName}(${argsStr})`;
  const expectedStr = JSON.stringify(scenario.expected);

  return (
    <div className={styles.scenario}>
      <div className="flex-grow overflow-scroll">
        <div className={styles.scenarioLhsContent}>
          <h3>
            <strong>Scenario: </strong>
            {scenario.name}
          </h3>

          <div className="p-4 rounded-lg border bg-gray-50 border-gray-200">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-gray-200">
                  <th className="py-2 px-3 text-left font-medium text-gray-700 bg-gray-100">Code run:</th>
                  <td className="py-2 px-3 font-mono text-sm">{codeRun}</td>
                </tr>
                <tr>
                  <th className="py-2 px-3 text-left font-medium text-gray-700 bg-gray-100">Expected:</th>
                  <td className="py-2 px-3 font-mono text-sm">{expectedStr}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function IOInspectedResultView() {
  const orchestrator = useOrchestrator();
  const { currentTest } = useOrchestratorStore(orchestrator);

  // eslint-disable-next-line react-hooks/exhaustive-deps -- orchestrator is stable from context, including it causes React Compiler over-optimization
  const firstExpect = useMemo(() => orchestrator.getFirstExpect() as IOTestExpect | null, [currentTest]);

  if (!currentTest || currentTest.type !== "io") {
    return null;
  }

  return (
    <div className={assembleClassNames(styles.scenario, currentTest.status === "fail" ? "fail" : "pass")}>
      <div data-ci="inspected-test-result-view" className="flex-grow overflow-scroll">
        <div className={styles.scenarioLhsContent}>
          <h3>
            <strong>Scenario: </strong>
            {currentTest.name}
          </h3>

          {currentTest.status === "pass" && <PassMessage testIdx={0} />}
          {currentTest.status === "lint_warning" && (
            <p className={styles.message}>
              Your code worked correctly, but you need to fix your formatting. Look for orange underlines in your code.
            </p>
          )}
          {firstExpect ? <IOTestResultView expect={firstExpect} /> : null}
        </div>
      </div>
    </div>
  );
}
