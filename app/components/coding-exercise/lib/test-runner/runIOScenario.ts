import type { IOScenario, Language, CodeCheckExpect, InterpreterOptions } from "@jiki/curriculum";
import type { IOTestResult, IOTestExpect } from "../test-results-types";
import isEqual from "lodash/isEqual";
import { diffChars, diffWords, type Change } from "diff";
import type { Frame } from "@jiki/interpreters";
import { formatInterpreterObject } from "./formatInterpreterObject";
import { jikiscript, javascript, python } from "@jiki/interpreters";

const interpreters = {
  javascript,
  python,
  jikiscript
};

function getInterpreter(language: Language) {
  const interpreter = interpreters[language as keyof typeof interpreters];
  // Defensive check (TypeScript guarantees this, but good for runtime safety)
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!interpreter) {
    throw new Error(`Unknown language: ${language}`);
  }
  return interpreter;
}

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
  interpreterOptions?: InterpreterOptions
): IOTestResult {
  // Execute student code and call the function with scenario args
  const interpreter = getInterpreter(language);

  let actual: any;
  let errorHtml: string | undefined;
  let functionalPass = false;
  let frames: Frame[] = [];
  let logLines: Array<{ time: number; output: string }> = [];

  let interpretResult: any;

  try {
    interpretResult = interpreter.evaluateFunction(
      studentCode,
      {
        externalFunctions: availableFunctions,
        languageFeatures: {
          timePerFrame: 1,
          ...interpreterOptions
        }
      },
      scenario.functionName,
      ...scenario.args
    );

    if (interpretResult.error) {
      errorHtml = `<p>Error: ${interpretResult.error.message}</p>`;
      actual = undefined;
    } else {
      actual = interpretResult.value;
    }

    // Capture frames and logs from execution
    frames = interpretResult.frames;
    logLines = interpretResult.logLines;
  } catch (error) {
    errorHtml = `<p>Error: ${error instanceof Error ? error.message : String(error)}</p>`;
    actual = undefined;
  }

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
  const codeRun = `${scenario.functionName}(${argsStr})`;

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

  const status = overallPass ? "pass" : "fail";

  return {
    type: "io",
    slug: scenario.slug,
    name: scenario.name,
    status,
    expects: [expect],
    functionName: scenario.functionName,
    args: scenario.args,
    frames,
    logLines
  };
}
