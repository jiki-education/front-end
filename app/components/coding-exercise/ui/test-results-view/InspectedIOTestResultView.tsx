import { assembleClassNames } from "@/lib/assemble-classnames";
import { useMemo } from "react";
import styles from "../../CodingExercise.module.css";
import { useOrchestratorStore } from "../../lib/Orchestrator";
import { useOrchestrator } from "../../lib/OrchestratorContext";
import type { IOTestExpect } from "../../lib/test-results-types";
import { IOTestResultView } from "./IOTestResultView";
import { PassMessage } from "./PassMessage";

export function InspectedIOTestResultView() {
  const orchestrator = useOrchestrator();
  const { currentTest } = useOrchestratorStore(orchestrator);

  // Recompute firstExpect whenever currentTest changes
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
          {firstExpect ? <IOTestResultView expect={firstExpect} /> : null}
        </div>
      </div>
    </div>
  );
}
