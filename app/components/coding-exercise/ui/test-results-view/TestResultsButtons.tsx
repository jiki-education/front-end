"use client";

import { assembleClassNames } from "../../../../utils/assemble-classnames";
import { useOrchestratorStore } from "../../lib/Orchestrator";
import { useOrchestrator } from "../../lib/OrchestratorContext";
import type { TestResult } from "../../lib/test-results-types";
import styles from "../../CodingExercise.module.css";

const TRANSITION_DELAY = 0.1;

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
    <div
      className={styles.testSelectorButtons}
      style={{
        display: "flex",
        gap: "8px",
        flexWrap: "wrap"
      }}
    >
      {testSuiteResult.tests.map((test, idx) => (
        <button
          key={test.slug + idx}
          onClick={() => handleTestResultSelection(test)}
          style={{
            transitionDelay: `${idx * TRANSITION_DELAY}s`,
            padding: "8px 12px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
            transition: "all 0.2s ease"
          }}
          className={assembleClassNames(
            styles.testButton,
            "bg-bg-primary border border-border-primary text-text-secondary hover:bg-bg-secondary",
            test.status,
            currentTest?.slug === test.slug ? "selected" : ""
          )}
        >
          {idx + 1}
        </button>
      ))}

      <style jsx>{`
        .test-button.pass {
          border-color: var(--color-success-border);
          color: var(--color-success-text);
        }
        .test-button.fail {
          border-color: var(--color-error-border);
          color: var(--color-error-text);
        }
        .test-button.selected {
          background-color: var(--color-link-primary) !important;
          border-color: var(--color-link-primary);
          color: var(--color-button-primary-text);
        }
        .test-button.selected:hover {
          background-color: var(--color-link-hover) !important;
        }
      `}</style>
    </div>
  );
}
