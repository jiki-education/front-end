import { assembleClassNames } from "@/utils/assemble-classnames";
import { useOrchestratorStore } from "../../lib/Orchestrator";
import { useOrchestrator } from "../../lib/OrchestratorContext";
import type { IOTestResult, IOTestExpect } from "../../lib/test-results-types";
import { PassMessage } from "./PassMessage";
import { TestResultInfo } from "./TestResultInfo";

export function InspectedIOTestResultView() {
  const orchestrator = useOrchestrator();
  const { currentTest } = useOrchestratorStore(orchestrator);

  const result = currentTest as IOTestResult | null;
  const firstExpect = orchestrator.getFirstExpect() as IOTestExpect | null;

  if (!result) {
    return null;
  }

  return (
    <div className={assembleClassNames("c-scenario", result.status === "fail" ? "fail" : "pass")}>
      <div data-ci="inspected-test-result-view" className="scenario-lhs">
        <div className="scenario-lhs-content">
          <h3>
            <strong>Scenario: </strong>
            {result.name}
          </h3>

          {result.status === "pass" && <PassMessage testIdx={0} />}
          <TestResultInfo firstExpect={firstExpect} />
        </div>
      </div>
    </div>
  );
}
