import type { TestSuiteResult, TestResult } from "@/components/coding-exercise/lib/test-results-types";

/**
 * Creates a mock TestSuiteResult from an array of test results
 */
export function createMockTestSuiteResult(tests: TestResult[] = []): TestSuiteResult {
  const hasFailures = tests.some((t) => t.status === "fail");
  return {
    tests,
    status: hasFailures ? "fail" : "pass"
  };
}
