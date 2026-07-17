import type { InterpretResult } from "@jiki/interpreters/shared";

/**
 * Creates a mock InterpretResult with sensible defaults and optional overrides.
 * Used for the run artifacts attached to TestResults for the progression evaluator.
 */
export function createMockInterpretResult(overrides: Partial<InterpretResult> = {}): InterpretResult {
  return {
    frames: [],
    logLines: [],
    success: true,
    error: null,
    lintErrors: [],
    meta: { functionCallLog: [], statements: [], sourceCode: "" },
    assertors: {
      assertAllArgumentsAreVariables: () => true,
      assertSomeArgumentsAreVariablesForFunction: () => true,
      assertNoLiteralNumberAssignments: () => true,
      assertNoLiteralNumbersInAssignments: () => true,
      countLinesOfCode: () => 0,
      assertMaxLinesOfCode: () => true,
      assertFunctionDefined: () => true,
      assertMethodCalled: () => true,
      countArrayLiterals: () => 0,
      assertFunctionCalledOutsideOwnDefinition: () => true,
      numFunctionCallsInCode: () => 0,
      assertOperatorUsed: () => true,
      assertStatement: () => true
    },
    ...overrides
  };
}
