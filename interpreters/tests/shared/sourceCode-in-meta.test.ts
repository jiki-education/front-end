import { describe, it, expect } from "vitest";
import { interpret as interpretJS, evaluateFunction as evaluateFunctionJS } from "@javascript/interpreter";
import { interpret as interpretPython, evaluateFunction as evaluateFunctionPython } from "@python/interpreter";
import { interpret as interpretJiki, evaluateFunction as evaluateFunctionJiki } from "@jikiscript/interpreter";

describe("sourceCode in meta", () => {
  describe("JavaScript", () => {
    it("returns sourceCode on successful execution", () => {
      const code = "let x = 5;";
      const result = interpretJS(code);
      expect(result.meta.sourceCode).toBe(code);
    });

    it("returns sourceCode on parse error", () => {
      const code = "let x = ;"; // Invalid syntax
      const result = interpretJS(code);
      expect(result.error).not.toBeNull();
      expect(result.meta.sourceCode).toBe(code);
    });

    it("returns sourceCode on runtime error", () => {
      const code = "undefinedVariable;";
      const result = interpretJS(code);
      expect(result.meta.sourceCode).toBe(code);
    });

    it("returns sourceCode from evaluateFunction", () => {
      const code = `function add(a, b) {
  return a + b;
}`;
      const result = evaluateFunctionJS(code, {}, "add", 2, 3);
      expect(result.meta.sourceCode).toBe(code);
    });
  });

  describe("Python", () => {
    it("returns sourceCode on successful execution", () => {
      const code = "x = 5";
      const result = interpretPython(code);
      expect(result.meta.sourceCode).toBe(code);
    });

    it("returns sourceCode on parse error", () => {
      const code = "x = "; // Invalid syntax
      const result = interpretPython(code);
      expect(result.error).not.toBeNull();
      expect(result.meta.sourceCode).toBe(code);
    });

    it("returns sourceCode on runtime error", () => {
      const code = "undefined_variable";
      const result = interpretPython(code);
      expect(result.meta.sourceCode).toBe(code);
    });

    it("returns sourceCode from evaluateFunction", () => {
      const code = `def add(a, b):
    return a + b`;
      const result = evaluateFunctionPython(code, {}, "add", 2, 3);
      expect(result.meta.sourceCode).toBe(code);
    });
  });

  describe("JikiScript", () => {
    it("returns sourceCode on successful execution", () => {
      const code = "set x to 5";
      const result = interpretJiki(code);
      expect(result.meta.sourceCode).toBe(code);
    });

    it("returns sourceCode on parse/compile error", () => {
      const code = "set x to "; // Invalid syntax
      const result = interpretJiki(code);
      expect(result.error).not.toBeNull();
      expect(result.meta.sourceCode).toBe(code);
    });

    it("returns sourceCode on runtime error", () => {
      const code = "log undefinedVariable";
      const result = interpretJiki(code);
      expect(result.meta.sourceCode).toBe(code);
    });

    it("returns sourceCode from evaluateFunction", () => {
      const code = `function add with a, b do
return a + b
end`;
      const result = evaluateFunctionJiki(code, {}, "add", 2, 3);
      expect(result.meta.sourceCode).toBe(code);
    });
  });
});
