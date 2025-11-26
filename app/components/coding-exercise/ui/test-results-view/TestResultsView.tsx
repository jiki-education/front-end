"use client";

import { useOrchestratorStore } from "../../lib/Orchestrator";
import { useOrchestrator } from "../../lib/OrchestratorContext";
import { InspectedTestResultView } from "./InspectedTestResultView";
import { TestResultsButtons as OrchestratorTestResultsButtons } from "./TestResultsButtons";
import styles from "../../CodingExercise.module.css";

export default function TestResultsView() {
  const orchestrator = useOrchestrator();
  const { testSuiteResult, currentTest } = useOrchestratorStore(orchestrator);

  if (!testSuiteResult) {
    return (
      <div className="bg-bg-secondary border border-border-primary rounded-lg p-4">
        <p className="text-sm text-text-secondary">Run your code to see test results</p>
      </div>
    );
  }

  const hasTests = testSuiteResult.tests.length > 0;

  return (
    <div className={styles.testResultsArea}>
      {/* Main test results */}
      {hasTests && <OrchestratorTestResultsButtons />}

      {currentTest && <InspectedTestResultView />}
    </div>
  );
}
