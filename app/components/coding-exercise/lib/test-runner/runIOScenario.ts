import type { IOScenario, Language } from "@jiki/curriculum";
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
  language: Language
): IOTestResult {
  // Execute student code and call the function with scenario args
  const interpreter = getInterpreter(language);

  let actual: any;
  let errorHtml: string | undefined;
  let pass = false;
  let frames: Frame[] = [];
  let logLines: Array<{ time: number; output: string }> = [];

  try {
    const result = interpreter.evaluateFunction(
      studentCode,
      {
        externalFunctions: availableFunctions.map((func) => ({
          name: func.name,
          func: func.func
        })) as any,
        languageFeatures: {
          timePerFrame: 1,
          maxTotalLoopIterations: 1000
        }
      },
      scenario.functionName,
      ...scenario.args
    );

    if (result.error) {
      errorHtml = `<p>Error: ${result.error.message}</p>`;
      actual = undefined;
    } else {
      actual = result.value;
    }

    // Capture frames and logs from execution
    frames = result.frames;
    logLines = result.logLines;
  } catch (error) {
    errorHtml = `<p>Error: ${error instanceof Error ? error.message : String(error)}</p>`;
    actual = undefined;
  }

  // Compare actual vs expected
  const matcher = scenario.matcher || "toEqual";
  if (!errorHtml) {
    pass = compareValues(actual, scenario.expected, matcher);
  }

  // Generate diff
  const diff = generateDiff(scenario.expected, actual);

  // Format function call for display
  const argsStr = scenario.args.map((arg) => JSON.stringify(arg)).join(", ");
  const codeRun = `${scenario.functionName}(${argsStr})`;

  const expect: IOTestExpect = {
    pass,
    actual,
    expected: scenario.expected,
    diff,
    matcher,
    codeRun,
    errorHtml
  };

  const status = pass ? "pass" : "fail";

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
