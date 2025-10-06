"use client";

import { assembleClassNames } from "../../../../utils/assemble-classnames";
import { useOrchestratorStore } from "../../lib/Orchestrator";
import { useOrchestrator } from "../../lib/OrchestratorContext";
import type { TestResult } from "../../lib/test-results-types";

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
      className="test-selector-buttons"
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
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            backgroundColor: "#fff",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
            transition: "all 0.2s ease"
          }}
          className={assembleClassNames("test-button", test.status, currentTest?.slug === test.slug ? "selected" : "")}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#f3f4f6";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#fff";
          }}
        >
          {idx + 1}
        </button>
      ))}

      <style jsx>{`
        .test-button.pass {
          border-color: #10b981;
          color: #10b981;
        }
        .test-button.fail {
          border-color: #ef4444;
          color: #ef4444;
        }
        .test-button.selected {
          background-color: #3b82f6 !important;
          border-color: #3b82f6;
          color: white;
        }
        .test-button.selected:hover {
          background-color: #2563eb !important;
        }
      `}</style>
    </div>
  );
}
