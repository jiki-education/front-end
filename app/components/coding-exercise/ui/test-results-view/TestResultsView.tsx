"use client";

import { useOrchestratorStore } from "../../lib/Orchestrator";
import { useOrchestrator } from "../../lib/OrchestratorContext";
import { InspectedTestResultView } from "./InspectedTestResultView";
import { TestResultsButtons as OrchestratorTestResultsButtons } from "./TestResultsButtons";

export default function TestResultsView() {
  const orchestrator = useOrchestrator();
  const { testSuiteResult, currentTest } = useOrchestratorStore(orchestrator);

  if (!testSuiteResult) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-sm text-gray-600">Run your code to see test results</p>
      </div>
    );
  }

  const hasTests = testSuiteResult.tests.length > 0;
  const allTestsPassed = testSuiteResult.tests.every((test) => test.status === "pass");

  return (
    <div className="bg-white border border-gray-200 rounded-lg flex flex-col overflow-hidden">
      <div className="border-b border-gray-200 px-4 py-2">
        <h3 className="text-lg font-semibold text-gray-700">Test Results</h3>
      </div>

      <div className="p-4 space-y-4 flex flex-col overflow-hidden">
        {/* Main test results */}
        {hasTests && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h4 className="font-medium text-gray-700">Tests</h4>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  allTestsPassed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {testSuiteResult.tests.filter((t) => t.status === "pass").length} / {testSuiteResult.tests.length}{" "}
                passed
              </span>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <OrchestratorTestResultsButtons />
            </div>
          </div>
        )}

        {/* Test result details */}
        {currentTest && <InspectedTestResultView />}
      </div>
    </div>
  );
}
