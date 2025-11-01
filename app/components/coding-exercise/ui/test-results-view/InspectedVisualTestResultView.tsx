import { assembleClassNames } from "@/utils/assemble-classnames";
import { useEffect, useRef } from "react";
import { useOrchestratorStore } from "../../lib/Orchestrator";
import { useOrchestrator } from "../../lib/OrchestratorContext";
import type { VisualTestExpect, VisualTestResult } from "../../lib/test-results-types";
import { PassMessage } from "./PassMessage";
import { TestResultInfo } from "./TestResultInfo";

export function InspectedVisualTestResultView() {
  const orchestrator = useOrchestrator();
  const { currentTest, isSpotlightActive } = useOrchestratorStore(orchestrator);

  const result = currentTest as VisualTestResult | null;
  const viewContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!result) {
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
    result.view.classList.add(
      "container-size",
      "aspect-square",
      "max-h-[100cqh]",
      "max-w-[100cqw]",
      "bg-white",
      "relative"
    );
    viewContainerRef.current.appendChild(result.view);
    result.view.style.display = "block";
  }, [result]);

  const firstExpect = orchestrator.getFirstExpect() as VisualTestExpect | null;

  if (!result) {
    return null;
  }

  return (
    <div className={assembleClassNames("c-scenario", result.status === "fail" ? "fail" : "pass")}>
      <InspectedVisualTestResultViewLHS
        // if tests pass, this will be first processed `expect`, otherwise first failing `expect`.
        firstExpect={firstExpect}
        result={result}
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
  result,
  firstExpect
}: {
  result: VisualTestResult;
  firstExpect: VisualTestExpect | null;
}) {
  return (
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
  );
}
