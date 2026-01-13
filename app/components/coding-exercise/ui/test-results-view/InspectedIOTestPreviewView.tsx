import type { IOExerciseDefinition } from "@jiki/curriculum";
import styles from "../../CodingExercise.module.css";
import { useOrchestratorStore } from "../../lib/Orchestrator";
import { useOrchestrator } from "../../lib/OrchestratorContext";

export function InspectedIOTestPreviewView() {
  const orchestrator = useOrchestrator();
  const { currentTestIdx } = useOrchestratorStore(orchestrator);
  const exercise = orchestrator.getExercise() as IOExerciseDefinition;
  const scenario = exercise.scenarios[currentTestIdx];

  // Build codeRun from scenario
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

          {/* Preview table - same structure as results but no actual/diff */}
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
