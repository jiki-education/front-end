import { describe, test, expect } from "vitest";
import { executeNativePython, executeNativeJS } from "./utils/native-executor";
import { interpret as interpretPython } from "@python/interpreter";
import { interpret as interpretJS } from "@javascript/interpreter";
import { extractLastValue } from "./utils/output-helpers";

describe("Cross-validation framework validation", () => {
  describe("native executors", () => {
    test("executeNativePython works", async () => {
      const result = await executeNativePython("print(42)");
      expect(result.trim()).toBe("42");
    });

    test("executeNativeJS works", async () => {
      const result = await executeNativeJS("console.log(42)");
      expect(result.trim()).toBe("42");
    });
  });

  describe("Jiki interpreters", () => {
    test("Python interpreter returns values", () => {
      const result = interpretPython("2 + 3");
      const value = extractLastValue(result);
      expect(value).toBe(5);
    });

    test("JavaScript interpreter returns values", () => {
      const result = interpretJS("2 + 3;");
      const value = extractLastValue(result);
      expect(value).toBe(5);
    });
  });

  describe("cross-validation concept", () => {
    test("Python: expressions evaluate to same value", () => {
      // Test that our interpreter gives correct results
      // Note: Can't compare with native Python without print()
      const jikiResult = interpretPython("10 * 5");
      const value = extractLastValue(jikiResult);
      expect(value).toBe(50);
    });

    test("JavaScript: expressions evaluate to same value", async () => {
      // JavaScript can output the last expression in some contexts
      // but for consistency we'll use console.log in real tests
      const jikiResult = interpretJS("10 * 5;");
      const value = extractLastValue(jikiResult);
      expect(value).toBe(50);
    });
  });
});

// NOTE: Full cross-validation tests require print() implementation in Python interpreter
// or console.log() implementation in JavaScript interpreter to properly compare outputs
