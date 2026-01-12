import type { TestResult, TestSuiteResult } from "@/components/coding-exercise/lib/test-results-types";

/**
 * Creates a mock TestSuiteResult from an array of test results
 */
export function createMockTestSuiteResult(tests: TestResult[] = []): TestSuiteResult {
  return {
    tests,
    passed: tests.every((t) => t.status === "pass")
  };
}
