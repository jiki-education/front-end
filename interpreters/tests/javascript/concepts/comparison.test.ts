import { describe, test, expect } from "vitest";
import { interpret } from "@javascript/interpreter";

describe("JavaScript Comparison Operators", () => {
  describe("Greater Than (>)", () => {
    test("compares numbers correctly", () => {
      const { frames, error } = interpret("5 > 3;");
      expect(error).toBeNull();
      expect(frames).toHaveLength(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(true);
    });

    test("returns false when left is less than right", () => {
      const { frames, error } = interpret("2 > 8;");
      expect(error).toBeNull();
      expect(frames[0].result?.jikiObject.value).toBe(false);
    });

    test("returns false when numbers are equal", () => {
      const { frames, error } = interpret("5 > 5;");
      expect(error).toBeNull();
      expect(frames[0].result?.jikiObject.value).toBe(false);
    });

    test("works with negative numbers", () => {
      const { frames, error } = interpret("-2 > -5;");
      expect(error).toBeNull();
      expect(frames[0].result?.jikiObject.value).toBe(true);
    });

    test("works with decimal numbers", () => {
      const { frames, error } = interpret("3.5 > 3.2;");
      expect(error).toBeNull();
      expect(frames[0].result?.jikiObject.value).toBe(true);
    });

    test("throws error when comparing non-numbers", () => {
      const { frames, error } = interpret('"hello" > 5;');
      expect(error).toBeNull();
      expect(frames[0].status).toBe("ERROR");
      expect(frames[0].error?.type).toBe("ComparisonRequiresNumber");
    });
  });

  describe("Greater Than or Equal (>=)", () => {
    test("returns true when left is greater", () => {
      const { frames, error } = interpret("7 >= 3;");
      expect(error).toBeNull();
      expect(frames[0].result?.jikiObject.value).toBe(true);
    });

    test("returns true when numbers are equal", () => {
      const { frames, error } = interpret("5 >= 5;");
      expect(error).toBeNull();
      expect(frames[0].result?.jikiObject.value).toBe(true);
    });

    test("returns false when left is less", () => {
      const { frames, error } = interpret("3 >= 7;");
      expect(error).toBeNull();
      expect(frames[0].result?.jikiObject.value).toBe(false);
    });

    test("throws error when comparing boolean with number", () => {
      const { frames, error } = interpret("true >= 5;");
      expect(error).toBeNull();
      expect(frames[0].status).toBe("ERROR");
      expect(frames[0].error?.type).toBe("ComparisonRequiresNumber");
    });
  });

  describe("Less Than (<)", () => {
    test("returns true when left is less", () => {
      const { frames, error } = interpret("3 < 7;");
      expect(error).toBeNull();
      expect(frames[0].result?.jikiObject.value).toBe(true);
    });

    test("returns false when left is greater", () => {
      const { frames, error } = interpret("8 < 2;");
      expect(error).toBeNull();
      expect(frames[0].result?.jikiObject.value).toBe(false);
    });

    test("returns false when numbers are equal", () => {
      const { frames, error } = interpret("5 < 5;");
      expect(error).toBeNull();
      expect(frames[0].result?.jikiObject.value).toBe(false);
    });

    test("works with negative numbers", () => {
      const { frames, error } = interpret("-5 < -2;");
      expect(error).toBeNull();
      expect(frames[0].result?.jikiObject.value).toBe(true);
    });
  });

  describe("Less Than or Equal (<=)", () => {
    test("returns true when left is less", () => {
      const { frames, error } = interpret("3 <= 7;");
      expect(error).toBeNull();
      expect(frames[0].result?.jikiObject.value).toBe(true);
    });

    test("returns true when numbers are equal", () => {
      const { frames, error } = interpret("5 <= 5;");
      expect(error).toBeNull();
      expect(frames[0].result?.jikiObject.value).toBe(true);
    });

    test("returns false when left is greater", () => {
      const { frames, error } = interpret("7 <= 3;");
      expect(error).toBeNull();
      expect(frames[0].result?.jikiObject.value).toBe(false);
    });
  });

  describe("Equality (==)", () => {
    test("returns true for equal numbers", () => {
      const { frames, error } = interpret("5 == 5;", { languageFeatures: { enforceStrictEquality: false } });
      expect(error).toBeNull();
      expect(frames[0].result?.jikiObject.value).toBe(true);
    });

    test("returns false for different numbers", () => {
      const { frames, error } = interpret("5 == 3;", { languageFeatures: { enforceStrictEquality: false } });
      expect(error).toBeNull();
      expect(frames[0].result?.jikiObject.value).toBe(false);
    });

    test("returns true for equal strings", () => {
      const { frames, error } = interpret('"hello" == "hello";', {
        languageFeatures: { enforceStrictEquality: false },
      });
      expect(error).toBeNull();
      expect(frames[0].result?.jikiObject.value).toBe(true);
    });

    test("returns true for equal booleans", () => {
      const { frames, error } = interpret("true == true;", { languageFeatures: { enforceStrictEquality: false } });
      expect(error).toBeNull();
      expect(frames[0].result?.jikiObject.value).toBe(true);
    });

    test("returns true for type coercion (5 == '5')", () => {
      const { frames, error } = interpret('5 == "5";', { languageFeatures: { enforceStrictEquality: false } });
      expect(error).toBeNull();
      // JavaScript's == does type coercion, so 5 == "5" is true
      expect(frames[0].result?.jikiObject.value).toBe(true);
    });
  });

  describe("Inequality (!=)", () => {
    test("returns false for equal numbers", () => {
      const { frames, error } = interpret("5 != 5;", { languageFeatures: { enforceStrictEquality: false } });
      expect(error).toBeNull();
      expect(frames[0].result?.jikiObject.value).toBe(false);
    });

    test("returns true for different numbers", () => {
      const { frames, error } = interpret("5 != 3;", { languageFeatures: { enforceStrictEquality: false } });
      expect(error).toBeNull();
      expect(frames[0].result?.jikiObject.value).toBe(true);
    });

    test("returns false for equal strings", () => {
      const { frames, error } = interpret('"hello" != "hello";', {
        languageFeatures: { enforceStrictEquality: false },
      });
      expect(error).toBeNull();
      expect(frames[0].result?.jikiObject.value).toBe(false);
    });

    test("returns false for type coercion (5 != '5')", () => {
      const { frames, error } = interpret('5 != "5";', { languageFeatures: { enforceStrictEquality: false } });
      expect(error).toBeNull();
      // JavaScript's != does type coercion, so 5 != "5" is false
      expect(frames[0].result?.jikiObject.value).toBe(false);
    });
  });

  describe("Comparison in expressions", () => {
    test("works with variables", () => {
      const code = `
        let x = 10;
        let y = 5;
        x > y;
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      expect(frames[frames.length - 1].result?.jikiObject.value).toBe(true);
    });

    test("works in if statements", () => {
      const code = `
        let result = "none";
        if (5 > 3) {
          result = "greater";
        }
        result;
      `;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1];
      expect(lastFrame.result?.jikiObject.value).toBe("greater");
    });

    test("works with complex expressions", () => {
      const code = `(10 + 5) > (20 - 10);`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      expect(frames[0].result?.jikiObject.value).toBe(true);
    });

    test("respects operator precedence", () => {
      const code = `5 + 3 > 2 * 3;`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      // 5 + 3 = 8, 2 * 3 = 6, 8 > 6 = true
      expect(frames[0].result?.jikiObject.value).toBe(true);
    });

    test("chaining comparisons with logical operators", () => {
      const code = `5 > 3 && 10 < 20;`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      expect(frames[0].result?.jikiObject.value).toBe(true);
    });
  });
});
