import { describe, test, expect } from "vitest";
import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

describe("JavaScript 'in' Operator", () => {
  describe("basic key existence checks", () => {
    test("returns true when key exists in dictionary", () => {
      const { frames, error } = interpret('"name" in { name: "Alice" };');
      expect(error).toBeNull();
      expect(frames).toHaveLength(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(true);
    });

    test("returns false when key does not exist in dictionary", () => {
      const { frames, error } = interpret('"age" in { name: "Alice" };');
      expect(error).toBeNull();
      expect(frames[0].result?.jikiObject.value).toBe(false);
    });

    test("returns false for empty dictionary", () => {
      const { frames, error } = interpret('"key" in {};');
      expect(error).toBeNull();
      expect(frames[0].result?.jikiObject.value).toBe(false);
    });

    test("checks multiple keys in dictionary", () => {
      const code = `
        let obj = { a: 1, b: 2, c: 3 }
        let hasA = "a" in obj
        let hasD = "d" in obj
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.variables.hasA?.value).toBe(true);
      expect(lastFrame.variables.hasD?.value).toBe(false);
    });
  });

  describe("with variables", () => {
    test("works with dictionary variable", () => {
      const code = `
        let obj = { x: 1, y: 2 }
        "x" in obj
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1];
      expect(lastFrame.result?.jikiObject.value).toBe(true);
    });

    test("works with string variable as key", () => {
      const code = `
        let key = "name"
        let obj = { name: "Bob" }
        key in obj
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1];
      expect(lastFrame.result?.jikiObject.value).toBe(true);
    });
  });

  describe("in conditions", () => {
    test("works in if statement", () => {
      const code = `
        let obj = { name: "Alice" }
        let result = "not found"
        if ("name" in obj) {
          result = "found"
        }
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.variables.result?.value).toBe("found");
    });
  });

  describe("with string literal keys", () => {
    test("works with quoted string keys in dictionary", () => {
      const { frames, error } = interpret('"first name" in { "first name": "Jane" };');
      expect(error).toBeNull();
      expect(frames[0].result?.jikiObject.value).toBe(true);
    });
  });

  describe("runtime errors", () => {
    test("errors when right-hand side is a number", () => {
      const { frames, error } = interpret('"key" in 42;');
      expect(error).toBeNull();
      expect(frames[0].status).toBe("ERROR");
      expect(frames[0].error?.type).toBe("InOperatorRequiresObject");
    });

    test("errors when right-hand side is a string", () => {
      const { frames, error } = interpret('"key" in "hello";');
      expect(error).toBeNull();
      expect(frames[0].status).toBe("ERROR");
      expect(frames[0].error?.type).toBe("InOperatorRequiresObject");
    });

    test("errors when right-hand side is a boolean", () => {
      const { frames, error } = interpret('"key" in true;');
      expect(error).toBeNull();
      expect(frames[0].status).toBe("ERROR");
      expect(frames[0].error?.type).toBe("InOperatorRequiresObject");
    });

    test("errors when right-hand side is null", () => {
      const { frames, error } = interpret('"key" in null;');
      expect(error).toBeNull();
      expect(frames[0].status).toBe("ERROR");
      expect(frames[0].error?.type).toBe("InOperatorRequiresObject");
    });

    test("errors when left-hand side is a number", () => {
      const { frames, error } = interpret("42 in { a: 1 };");
      expect(error).toBeNull();
      expect(frames[0].status).toBe("ERROR");
      expect(frames[0].error?.type).toBe("InOperatorRequiresStringKey");
    });

    test("errors when left-hand side is a boolean", () => {
      const { frames, error } = interpret("true in { a: 1 };");
      expect(error).toBeNull();
      expect(frames[0].status).toBe("ERROR");
      expect(frames[0].error?.type).toBe("InOperatorRequiresStringKey");
    });
  });

  describe("arrays (default: not allowed)", () => {
    test("errors when right-hand side is an array by default", () => {
      const { frames, error } = interpret('"key" in [1, 2, 3];');
      expect(error).toBeNull();
      expect(frames[0].status).toBe("ERROR");
      expect(frames[0].error?.type).toBe("InWithArrayNotAllowed");
    });
  });

  describe("arrays (allowInWithArrays enabled)", () => {
    test("checks index existence when enabled", () => {
      const { frames, error } = interpret("0 in [10, 20, 30];", {
        languageFeatures: { allowInWithArrays: true },
      });
      expect(error).toBeNull();
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(true);
    });

    test("returns false for out-of-range index", () => {
      const { frames, error } = interpret("5 in [10, 20, 30];", {
        languageFeatures: { allowInWithArrays: true },
      });
      expect(error).toBeNull();
      expect(frames[0].result?.jikiObject.value).toBe(false);
    });

    test("returns false for negative index", () => {
      const { frames, error } = interpret("-1 in [10, 20];", {
        languageFeatures: { allowInWithArrays: true },
      });
      expect(error).toBeNull();
      expect(frames[0].result?.jikiObject.value).toBe(false);
    });
  });

  describe("descriptions", () => {
    test("generates correct description", () => {
      const { frames } = interpret('"name" in { name: "Alice" };');
      const frame = frames[0] as TestAugmentedFrame;
      expect(frame.description).toContain("in");
      expect(frame.description).toContain("true");
    });
  });
});
