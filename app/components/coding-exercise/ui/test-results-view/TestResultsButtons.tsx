"use client";

import { assembleClassNames } from "@/lib/assemble-classnames";
import styles from "../../CodingExercise.module.css";
import { useOrchestratorStore } from "../../lib/Orchestrator";
import { useOrchestrator } from "../../lib/OrchestratorContext";
import type { TestResult } from "../../lib/test-results-types";

export function TestResultsButtons() {
  const orchestrator = useOrchestrator();
  const { testSuiteResult, currentTest } = useOrchestratorStore(orchestrator);

  const handleTestResultSelection = (test: TestResult) => {
    if (!testSuiteResult) {
      return;
    }

    // Pass TestResult directly
    orchestrator.setCurrentTest(test);

    // Set information widget data for single frame tests
    if (test.frames.length === 1) {
      const frame = test.frames[0];
      orchestrator.setInformationWidgetData({
        html: frame.generateDescription() || "",
        line: frame.line,
        status: frame.status
      });
    }
  };

  if (!testSuiteResult) {
    return null;
  }

  return (
    <div className={styles.v14DotsSection}>
      <div className={styles.v14Dots} data-testid="test-selector-buttons">
        {testSuiteResult.tests.map((test, idx) => {
          return (
            <button
              key={test.slug + idx}
              onClick={() => handleTestResultSelection(test)}
              style={{}}
              className={assembleClassNames(
                styles.v14Dot,
                styles[`${test.status}ed`],
                currentTest?.slug === test.slug ? styles.active : ""
              )}
            />
          );
        })}
      </div>
      <div className={assembleClassNames(styles.v14StatusLine, styles[`${currentTest?.status}ed`])}></div>
    </div>
  );
}
