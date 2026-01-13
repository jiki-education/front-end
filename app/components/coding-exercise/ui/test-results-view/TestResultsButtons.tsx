"use client";

import { assembleClassNames } from "@/lib/assemble-classnames";
import styles from "../../CodingExercise.module.css";
import { useOrchestratorStore } from "../../lib/Orchestrator";
import { useOrchestrator } from "../../lib/OrchestratorContext";
import type { TestResult } from "../../lib/test-results-types";

export function TestResultsButtons() {
  const orchestrator = useOrchestrator();
  const { testSuiteResult, currentTestIdx } = useOrchestratorStore(orchestrator);
  const scenarios = orchestrator.getExercise().scenarios;

  const handleSelection = (idx: number, test?: TestResult) => {
    if (test) {
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
    } else {
      orchestrator.setCurrentTestIdx(idx);
    }
  };

  const statusLineStatus = testSuiteResult?.tests[currentTestIdx]?.status ?? "idle";

  return (
    <div className={styles.DotsSection}>
      <div className={styles.Dots} data-testid="test-selector-buttons">
        {scenarios.map((scenario, idx) => {
          const test = testSuiteResult?.tests[idx];
          const status = test?.status ?? "idle";

          return (
            <button
              key={scenario.slug + idx}
              onClick={() => handleSelection(idx, test)}
              className={assembleClassNames(
                styles.Dot,
                styles[`${status}ed`],
                currentTestIdx === idx ? styles.active : ""
              )}
            />
          );
        })}
      </div>
      <div className={assembleClassNames(styles.StatusLine, styles[`${statusLineStatus}ed`])} />
    </div>
  );
}
