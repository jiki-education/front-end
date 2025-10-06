import { test, expect } from "vitest";
import { interpret as interpretPython } from "../../../src/python/interpreter";
import { interpret as interpretJS } from "../../../src/javascript/interpreter";
import { executeNativePython, executeNativeJS } from "./native-executor";
import { extractOutput, normalizeOutput, extractLastValue, hasError, extractError } from "./output-helpers";

export interface CrossValidationTest {
  name: string;
  code: string;
  expectedOutput?: string;
  expectedValue?: any;
  shouldError?: boolean;
}

/**
 * Test Python code against native Python interpreter
 */
export function testPython(
  name: string,
  code: string,
  options?: {
    expectedOutput?: string;
    expectedValue?: any;
    shouldError?: boolean;
    only?: boolean;
    skip?: boolean;
  }
) {
  const testFn = options?.only ? test.only : options?.skip ? test.skip : test;

  testFn(name, async () => {
    // Execute with Jiki Python interpreter
    const jikiResult = interpretPython(code);

    // Prepare code for native Python execution
    // When testing expectedValue, wrap code with print() to capture the result
    let nativeCode = code;
    if (options?.expectedValue !== undefined) {
      nativeCode = wrapPythonWithPrint(code);
    }

    // Execute with native Python
    const nativeOutput = await executeNativePython(nativeCode);

    if (options?.shouldError) {
      // Verify both produce errors
      expect(hasError(jikiResult)).toBe(true);
      // Native Python errors usually go to stderr and are captured
      expect(nativeOutput).toMatch(/Error|error|Traceback/);
    } else {
      // For successful execution, compare outputs
      if (options?.expectedOutput !== undefined) {
        // Compare against expected output
        const jikiOutput = extractOutput(jikiResult);
        expect(normalizeOutput(jikiOutput)).toBe(normalizeOutput(options.expectedOutput));
        expect(normalizeOutput(nativeOutput)).toBe(normalizeOutput(options.expectedOutput));
      } else if (options?.expectedValue !== undefined) {
        // Compare final values
        const jikiValue = extractLastValue(jikiResult);
        expect(jikiValue).toBe(options.expectedValue);

        // For native, we need to parse the output
        // This is simplified - may need enhancement for complex types
        const nativeValue = parseValue(nativeOutput.trim());
        expect(nativeValue).toBe(options.expectedValue);
      } else {
        // Direct output comparison
        const jikiOutput = extractOutput(jikiResult);
        expect(normalizeOutput(jikiOutput)).toBe(normalizeOutput(nativeOutput));
      }
    }
  });
}

/**
 * Test JavaScript code against native Node.js
 */
export function testJavaScript(
  name: string,
  code: string,
  options?: {
    expectedOutput?: string;
    expectedValue?: any;
    shouldError?: boolean;
    only?: boolean;
    skip?: boolean;
  }
) {
  const testFn = options?.only ? test.only : options?.skip ? test.skip : test;

  testFn(name, async () => {
    // Execute with Jiki JavaScript interpreter
    const jikiResult = interpretJS(code);

    // Prepare code for native JavaScript execution
    // When testing expectedValue, wrap code with console.log() to capture the result
    let nativeCode = code;
    if (options?.expectedValue !== undefined) {
      nativeCode = wrapJavaScriptWithConsoleLog(code);
    }

    // Execute with native Node.js
    const nativeOutput = await executeNativeJS(nativeCode);

    if (options?.shouldError) {
      // Verify both produce errors
      expect(hasError(jikiResult)).toBe(true);
      expect(nativeOutput).toMatch(/Error|error/);
    } else {
      // For successful execution, compare outputs
      if (options?.expectedOutput !== undefined) {
        // Compare against expected output
        const jikiOutput = extractOutput(jikiResult);
        expect(normalizeOutput(jikiOutput)).toBe(normalizeOutput(options.expectedOutput));
        expect(normalizeOutput(nativeOutput)).toBe(normalizeOutput(options.expectedOutput));
      } else if (options?.expectedValue !== undefined) {
        // Compare final values
        const jikiValue = extractLastValue(jikiResult);
        expect(jikiValue).toBe(options.expectedValue);

        // For native, parse the output
        const nativeValue = parseValue(nativeOutput.trim());
        expect(nativeValue).toBe(options.expectedValue);
      } else {
        // Direct output comparison
        const jikiOutput = extractOutput(jikiResult);
        expect(normalizeOutput(jikiOutput)).toBe(normalizeOutput(nativeOutput));
      }
    }
  });
}

/**
 * Wrap Python code to print the last value for native execution
 * Handles both expressions and statements with variable assignments
 */
function wrapPythonWithPrint(code: string): string {
  const trimmedCode = code.trim();

  // Check if code contains a variable assignment to "result" anywhere
  // Pattern: result = <expression>
  if (trimmedCode.includes("result")) {
    return `${trimmedCode}\nprint(result)`;
  }

  // For simple expressions (no assignment), wrap in print()
  // This handles cases like "2 + 3" or "(2 + 3) * 4"
  return `print(${trimmedCode})`;
}

/**
 * Wrap JavaScript code to console.log the last value for native execution
 * Handles both expressions and statements with variable assignments
 */
function wrapJavaScriptWithConsoleLog(code: string): string {
  const trimmedCode = code.trim();

  // Check if code contains a variable declaration/assignment to "result" anywhere
  // Pattern: let result = <expression> or const result = <expression> or result = <expression>
  if (trimmedCode.includes("result")) {
    return `${trimmedCode}\nconsole.log(result);`;
  }

  // For simple expressions (no assignment), wrap in console.log()
  // This handles cases like "2 + 3" or "(2 + 3) * 4"
  return `console.log(${trimmedCode});`;
}

/**
 * Parse a string value to appropriate JavaScript type
 * Helper for comparing native output to expected values
 */
function parseValue(str: string): any {
  // Handle empty string
  if (str === "") return "";

  // Boolean
  if (str === "true" || str === "True") return true;
  if (str === "false" || str === "False") return false;

  // Null/None
  if (str === "null" || str === "None") return null;
  if (str === "undefined") return undefined;

  // Number
  const num = Number(str);
  if (!isNaN(num)) return num;

  // String (default)
  return str;
}

/**
 * Batch test runner for multiple test cases
 */
export function crossValidate(tests: CrossValidationTest[], language: "python" | "javascript") {
  const testFn = language === "python" ? testPython : testJavaScript;

  tests.forEach(t => {
    testFn(t.name, t.code, {
      expectedOutput: t.expectedOutput,
      expectedValue: t.expectedValue,
      shouldError: t.shouldError,
    });
  });
}
