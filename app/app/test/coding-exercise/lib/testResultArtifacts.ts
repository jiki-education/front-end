import type { VisualExercise } from "@jiki/curriculum";
import { TestExercise } from "@jiki/curriculum";
import type { InterpretResult } from "@jiki/interpreters/shared";

// Dev/test pages drive the scrubber and editor UI with hand-built
// TestResults. These build the run artifacts the domain type requires
// (jest-free, unlike tests/mocks).

export function buildStubExercise(): VisualExercise {
  return new TestExercise();
}

export function buildStubInterpretResult(): InterpretResult {
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
    }
  };
}
