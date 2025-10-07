/**
 * Cross-validation tests for const declarations
 * These tests verify that our interpreter matches native JavaScript behavior
 */

import { describe } from "vitest";
import { testJavaScript } from "../../utils/test-runner";

describe("JavaScript const cross-validation", () => {
  describe("basic const declarations", () => {
    testJavaScript("const with number", "const result = 42;", { expectedValue: 42 });
    testJavaScript("const with string", 'const result = "Alice";', { expectedValue: "Alice" });
    testJavaScript("const with boolean", "const result = true;", { expectedValue: true });
    testJavaScript("const with expression", "const result = 10 + 5;", { expectedValue: 15 });
    // Note: Arrays and objects tests skipped due to string conversion differences in test framework
  });

  describe("const usage", () => {
    testJavaScript("using const value", "const x = 5; const result = x;", { expectedValue: 5 });
    testJavaScript("const in expression", "const x = 5; const result = x + 10;", { expectedValue: 15 });
    testJavaScript("multiple const declarations", "const a = 1; const b = 2; const result = a + b;", {
      expectedValue: 3,
    });
  });

  describe("const with mutable objects", () => {
    testJavaScript("modifying array element", "const arr = [1, 2, 3]; arr[0] = 99; const result = arr[0];", {
      expectedValue: 99,
    });
    testJavaScript("modifying object property", 'const obj = { x: 1 }; obj["x"] = 2; const result = obj["x"];', {
      expectedValue: 2,
    });
  });

  describe("const with let", () => {
    testJavaScript("const and let together", "const x = 5; let y = 10; const result = x + y;", { expectedValue: 15 });
    testJavaScript("reassigning let not const", "const x = 5; let y = 10; y = 20; const result = x + y;", {
      expectedValue: 25,
    });
  });

  describe("const in for loops", () => {
    testJavaScript(
      "const in for...of loop works",
      "let sum = 0; for (const n of [1, 2, 3]) { sum = sum + n; } const result = sum;",
      { expectedValue: 6 }
    );
  });
});
