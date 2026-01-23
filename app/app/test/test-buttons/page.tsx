"use client";

import Orchestrator, { useOrchestratorStore } from "@/components/coding-exercise/lib/Orchestrator";
import OrchestratorProvider from "@/components/coding-exercise/lib/OrchestratorProvider";
// TestResultsButtons component is not used - we're rendering buttons inline for this test
// import { TestResultsButtons } from "@/components/coding-exercise/ui/test-results-view/TestResultsButtons";
import styles from "@/components/coding-exercise/CodingExercise.module.css";
import { InspectedTestResultView } from "@/components/coding-exercise/ui/test-results-view/InspectedTestResultView";
import { assembleClassNames } from "@/lib/assemble-classnames";
import { createMockExercise } from "@/tests/mocks/exercise";
import { useEffect, useRef } from "react";

const initialCode = `move()
move()
move()
move()
move()`;

export default function TestButtonsTestPage() {
  // Create orchestrator once using useRef (prevents re-creation on re-renders)
  const exercise = createMockExercise({
    slug: "test-buttons-e2e-id",
    stubs: { javascript: initialCode, python: initialCode, jikiscript: initialCode },
    title: "Test Buttons E2E Test"
  });
  const orchestratorRef = useRef<Orchestrator>(
    new Orchestrator(exercise, "jikiscript", { type: "lesson", slug: "test-lesson" })
  );
  const orchestrator = orchestratorRef.current;

  // Use the orchestrator store hook
  const { testSuiteResult, currentTest } = useOrchestratorStore(orchestrator);

  // Initialize test state in useEffect
  useEffect(() => {
    // Expose orchestrator to window for E2E testing
    (window as any).testOrchestrator = orchestrator;

    // Run tests to generate mock test results
    void orchestrator.runCode().then(() => {
      // Mark as ready for testing
      (window as any).testsReady = true;
    });

    return () => {
      delete (window as any).testOrchestrator;
      delete (window as any).testsReady;
    };
  }, [orchestrator]);

  return (
    <OrchestratorProvider orchestrator={orchestrator}>
      <div data-testid="test-buttons-container" style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        <h1>Test Buttons E2E Test Page</h1>

        <div style={{ marginBottom: "20px" }}>
          <h2>Test Results</h2>
          <div data-testid="test-buttons">
            {/* Regular tests */}
            <div style={{ marginBottom: "10px" }}>
              <p data-testid="regular-tests-count">
                Regular tests: {testSuiteResult?.tests.filter((t) => !t.slug || !t.slug.includes("bonus")).length || 0}
              </p>
              <div data-testid="regular-test-buttons" style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {testSuiteResult?.tests
                  .filter((t) => !t.slug || !t.slug.includes("bonus"))
                  .map((test, idx) => (
                    <button
                      key={test.slug}
                      onClick={() => orchestrator.setCurrentTest(test)}
                      className={assembleClassNames(
                        styles.testButton,
                        test.status,
                        currentTest?.slug === test.slug ? "selected" : ""
                      )}
                      style={{
                        padding: "8px 12px",
                        border: `1px solid ${test.status === "pass" ? "var(--color-green-500)" : "#ef4444"}`,
                        borderRadius: "6px",
                        backgroundColor: currentTest === test ? "#3b82f6" : "#fff",
                        color:
                          currentTest === test ? "#fff" : test.status === "pass" ? "var(--color-green-500)" : "#ef4444",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "500"
                      }}
                    >
                      {idx + 1}
                    </button>
                  ))}
              </div>
            </div>

            {/* Bonus tests */}
            <div>
              <p data-testid="bonus-tests-count">
                Bonus tests: {testSuiteResult?.tests.filter((t) => t.slug && t.slug.includes("bonus")).length || 0}
              </p>
              <div data-testid="bonus-test-buttons" style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {testSuiteResult?.tests
                  .filter((t) => t.slug && t.slug.includes("bonus"))
                  .map((test) => (
                    <button
                      key={test.slug}
                      onClick={() => orchestrator.setCurrentTest(test)}
                      className={assembleClassNames(
                        styles.testButton,
                        test.status,
                        currentTest?.slug === test.slug ? "selected" : ""
                      )}
                      style={{
                        padding: "8px 12px",
                        border: `1px solid ${test.status === "pass" ? "var(--color-green-500)" : "#ef4444"}`,
                        borderRadius: "6px",
                        backgroundColor: currentTest === test ? "#3b82f6" : "#fff",
                        color:
                          currentTest === test ? "#fff" : test.status === "pass" ? "var(--color-green-500)" : "#ef4444",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "500"
                      }}
                    >
                      ★
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {currentTest && (
          <div style={{ marginTop: "30px" }}>
            <h2>Inspected Test Result</h2>
            <div data-testid="inspected-test-result">
              <InspectedTestResultView />
            </div>
          </div>
        )}

        {/* Debug info for E2E tests */}
        <div
          data-testid="debug-info"
          style={{ marginTop: "30px", padding: "10px", background: "#f5f5f5", borderRadius: "4px" }}
        >
          <h3>Debug Info</h3>
          <p data-testid="tests-count">Tests: {testSuiteResult?.tests.length || 0}</p>
          <p data-testid="inspected-test-name">Inspected test: {currentTest ? currentTest.slug : "None"}</p>
          <p data-testid="inspected-test-status">Inspected test status: {currentTest ? currentTest.status : "None"}</p>
        </div>
      </div>
    </OrchestratorProvider>
  );
}
