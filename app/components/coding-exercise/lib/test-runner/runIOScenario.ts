import type { IOScenario, Language, CodeCheckExpect } from "@jiki/curriculum";
import type { IOTestResult, IOTestExpect } from "../test-results-types";
import isEqual from "lodash/isEqual";
import { diffChars, diffWords, type Change } from "diff";
import type { Frame } from "@jiki/interpreters/shared";
import { evaluateIOFunction } from "./executeStudentCode";
import { formatInterpreterObject } from "./formatInterpreterObject";
import type { Interpreter } from "./getInterpreter";

// Compare values using the specified matcher
function compareValues(actual: any, expected: any, matcher: string): boolean {
  switch (matcher) {
    case "toBe":
      return actual === expected;
    case "toEqual":
      return isEqual(actual, expected);
    // Add more matchers as needed
    default:
      return isEqual(actual, expected); // Default to deep equality
  }
}

// Generate diff for displaying expected vs actual values
function generateDiff(expected: any, actual: any): Change[] {
  // Format values using JSON.stringify to properly show quotes around strings
  const expectedStr = formatInterpreterObject(expected);
  const actualStr = formatInterpreterObject(actual);

  // Use character-level diff for strings
  if (typeof expected === "string" && typeof actual === "string") {
    return diffChars(expectedStr, actualStr);
  }

  // Use word-level diff for other types
  return diffWords(expectedStr, actualStr);
}

export function runIOScenario(
  scenario: IOScenario,
  studentCode: string,
  availableFunctions: Array<{ name: string; func: any; description: string }>,
  language: Language,
  interpreter: Interpreter,
  languageFeatures?: Record<string, any>
): IOTestResult {
  let functionalPass = false;

  const { interpretResult, actual, errorMessage } = evaluateIOFunction(studentCode, {
    interpreter,
    availableFunctions,
    languageFeatures,
    functionName: scenario.functionName,
    args: scenario.args
  });

  const errorHtml = errorMessage === undefined ? undefined : `<p>Error: ${errorMessage}</p>`;

  // Capture frames and logs from execution
  const frames: Frame[] = interpretResult?.frames ?? [];
  const logLines: Array<{ time: number; output: string }> = interpretResult?.logLines ?? [];

  // Compare actual vs expected
  const matcher = scenario.matcher || "toEqual";
  if (!errorHtml) {
    functionalPass = compareValues(actual, scenario.expected, matcher);
  }

  // Execute code checks if present
  let codeCheckResults: CodeCheckExpect[] | undefined;
  let allCodeChecksPassed = true;

  if (scenario.codeChecks && scenario.codeChecks.length > 0 && interpretResult) {
    codeCheckResults = scenario.codeChecks.map((check) => {
      try {
        const checkPassed = check.pass(interpretResult, language);
        if (!checkPassed) {
          allCodeChecksPassed = false;
        }
        return {
          pass: checkPassed,
          errorHtml: checkPassed ? undefined : check.errorHtml
        };
      } catch (error) {
        allCodeChecksPassed = false;
        return {
          pass: false,
          errorHtml: `Code check error: ${error instanceof Error ? error.message : String(error)}`
        };
      }
    });
  }

  // Overall pass requires functional test, all code checks to pass, and no frame errors
  const hasFrameError = frames.some((f) => f.status === "ERROR");
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- functionalPass can be false when errorHtml is set
  const overallPass = functionalPass && allCodeChecksPassed && !hasFrameError;

  // Generate diff
  const diff = generateDiff(scenario.expected, actual);

  // Format function call for display
  const argsStr = scenario.args.map((arg) => JSON.stringify(arg)).join(", ");
  const codeRun = `${interpreter.formatIdentifier(scenario.functionName)}(${argsStr})`;

  // Determine which error to show:
  // - If functional test failed, show its error
  // - If functional passed but code check failed, show first failing code check's error
  let displayErrorHtml;
  if (functionalPass) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- allCodeChecksPassed can be false when code checks fail
    if (!allCodeChecksPassed) {
      displayErrorHtml = codeCheckResults?.find((r) => !r.pass)?.errorHtml;
    }
  } else {
    displayErrorHtml = errorHtml;
  }

  const expect: IOTestExpect = {
    pass: overallPass,
    actual,
    expected: scenario.expected,
    diff,
    matcher,
    codeRun,
    errorHtml: displayErrorHtml,
    codeCheckResults
  };

  const lintErrors = interpretResult?.lintErrors ?? [];
  const status = overallPass ? (lintErrors.length > 0 ? "lint_warning" : "pass") : "fail";

  // `result` is a run artifact for the progression evaluator (absent when
  // the interpreter threw); the store and the UI never read it.
  return {
    type: "io",
    slug: scenario.slug,
    name: scenario.name,
    status,
    expects: [expect],
    functionName: scenario.functionName,
    args: scenario.args,
    frames,
    logLines,
    lintErrors,
    result: interpretResult ?? undefined
  };
}
