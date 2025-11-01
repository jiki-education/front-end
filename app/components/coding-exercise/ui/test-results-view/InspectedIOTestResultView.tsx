import { assembleClassNames } from "@/utils/assemble-classnames";
import { useMemo } from "react";
import { useOrchestratorStore } from "../../lib/Orchestrator";
import { useOrchestrator } from "../../lib/OrchestratorContext";
import type { IOTestExpect } from "../../lib/test-results-types";
import { PassMessage } from "./PassMessage";
import { IOTestResultView } from "./IOTestResultView";

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
    <div className={assembleClassNames("c-scenario", currentTest.status === "fail" ? "fail" : "pass")}>
      <div data-ci="inspected-test-result-view" className="flex-grow overflow-scroll">
        <div className="scenario-lhs-content">
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
