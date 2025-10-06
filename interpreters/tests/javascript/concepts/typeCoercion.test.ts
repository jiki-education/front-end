import { describe, test, expect } from "vitest";
import { interpret } from "@javascript/interpreter";

describe("JavaScript Type Coercion", () => {
  describe("with allowTypeCoercion disabled (default)", () => {
    const languageFeatures = {
      allowTypeCoercion: false,
    };

    describe("arithmetic operations", () => {
      test("number + boolean throws error", () => {
        const result = interpret("5 + true;", { languageFeatures });
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("ERROR");
        expect(result.frames[0].error?.message).toBe(
          "TypeCoercionNotAllowed: operator: +: left: number: right: boolean"
        );
      });

      test("boolean + number throws error", () => {
        const result = interpret("true + 5;", { languageFeatures });
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("ERROR");
        expect(result.frames[0].error?.message).toBe(
          "TypeCoercionNotAllowed: operator: +: left: boolean: right: number"
        );
      });

      test("string + number throws error", () => {
        const result = interpret('"hello" + 5;', { languageFeatures });
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("ERROR");
        expect(result.frames[0].error?.message).toBe(
          "TypeCoercionNotAllowed: operator: +: left: string: right: number"
        );
      });

      test("number + string throws error", () => {
        const result = interpret('5 + "hello";', { languageFeatures });
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("ERROR");
        expect(result.frames[0].error?.message).toBe(
          "TypeCoercionNotAllowed: operator: +: left: number: right: string"
        );
      });

      test("number - boolean throws error", () => {
        const result = interpret("10 - true;", { languageFeatures });
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("ERROR");
        expect(result.frames[0].error?.message).toBe("TypeCoercionNotAllowed: operator: -: right: boolean");
      });

      test("boolean - number throws error", () => {
        const result = interpret("false - 3;", { languageFeatures });
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("ERROR");
        expect(result.frames[0].error?.message).toBe("TypeCoercionNotAllowed: operator: -: left: boolean");
      });

      test("string - number throws error", () => {
        const result = interpret('"10" - 5;', { languageFeatures });
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("ERROR");
        expect(result.frames[0].error?.message).toBe("TypeCoercionNotAllowed: operator: -: left: string");
      });

      test("number * boolean throws error", () => {
        const result = interpret("5 * true;", { languageFeatures });
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("ERROR");
        expect(result.frames[0].error?.message).toBe("TypeCoercionNotAllowed: operator: *: right: boolean");
      });

      test("string * number throws error", () => {
        const result = interpret('"2" * 3;', { languageFeatures });
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("ERROR");
        expect(result.frames[0].error?.message).toBe("TypeCoercionNotAllowed: operator: *: left: string");
      });

      test("number / boolean throws error", () => {
        const result = interpret("10 / false;", { languageFeatures });
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("ERROR");
        expect(result.frames[0].error?.message).toBe("TypeCoercionNotAllowed: operator: /: right: boolean");
      });

      test("boolean / number throws error", () => {
        const result = interpret("true / 2;", { languageFeatures });
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("ERROR");
        expect(result.frames[0].error?.message).toBe("TypeCoercionNotAllowed: operator: /: left: boolean");
      });
    });

    describe("allowed operations", () => {
      test("number + number works", () => {
        const result = interpret("5 + 3;", { languageFeatures });
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[0].result?.jikiObject.value).toBe(8);
      });

      test("string + string works (concatenation)", () => {
        const result = interpret('"hello" + " world";', { languageFeatures });
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[0].result?.jikiObject.value).toBe("hello world");
      });

      test("number - number works", () => {
        const result = interpret("10 - 3;", { languageFeatures });
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[0].result?.jikiObject.value).toBe(7);
      });

      test("number * number works", () => {
        const result = interpret("4 * 5;", { languageFeatures });
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[0].result?.jikiObject.value).toBe(20);
      });

      test("number / number works", () => {
        const result = interpret("10 / 2;", { languageFeatures });
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[0].result?.jikiObject.value).toBe(5);
      });
    });

    describe("with variables", () => {
      test("number variable + boolean throws error", () => {
        const result = interpret(
          `
          let x = 5;
          x + true;
        `,
          { languageFeatures }
        );
        expect(result.error).toBe(null);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[1].status).toBe("ERROR");
        expect(result.frames[1].error?.message).toBe(
          "TypeCoercionNotAllowed: operator: +: left: number: right: boolean"
        );
      });

      test("boolean variable + number throws error", () => {
        const result = interpret(
          `
          let b = false;
          b + 10;
        `,
          { languageFeatures }
        );
        expect(result.error).toBe(null);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[1].status).toBe("ERROR");
        expect(result.frames[1].error?.message).toBe(
          "TypeCoercionNotAllowed: operator: +: left: boolean: right: number"
        );
      });

      test("string variable + number throws error", () => {
        const result = interpret(
          `
          let s = "test";
          s + 42;
        `,
          { languageFeatures }
        );
        expect(result.error).toBe(null);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[1].status).toBe("ERROR");
        expect(result.frames[1].error?.message).toBe(
          "TypeCoercionNotAllowed: operator: +: left: string: right: number"
        );
      });
    });

    describe("complex expressions", () => {
      test("nested expression with type coercion throws error", () => {
        const result = interpret("(5 + 3) * true;", { languageFeatures });
        expect(result.error).toBe(null);
        expect(result.frames[0].status).toBe("ERROR");
        expect(result.frames[0].error?.message).toBe("TypeCoercionNotAllowed: operator: *: right: boolean");
      });

      test("multiple operations with type coercion throws error at first issue", () => {
        const result = interpret("5 + true - 2;", { languageFeatures });
        expect(result.error).toBe(null);
        expect(result.frames[0].status).toBe("ERROR");
        expect(result.frames[0].error?.message).toBe(
          "TypeCoercionNotAllowed: operator: +: left: number: right: boolean"
        );
      });
    });
  });

  describe("with allowTypeCoercion enabled", () => {
    const languageFeatures = {
      allowTypeCoercion: true,
    };

    describe("arithmetic operations with coercion", () => {
      test("number + boolean coerces (5 + true = 6)", () => {
        const result = interpret("5 + true;", { languageFeatures });
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[0].result?.jikiObject.value).toBe(6);
      });

      test("boolean + number coerces (true + 5 = 6)", () => {
        const result = interpret("true + 5;", { languageFeatures });
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[0].result?.jikiObject.value).toBe(6);
      });

      test("boolean + boolean coerces (true + false = 1)", () => {
        const result = interpret("true + false;", { languageFeatures });
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[0].result?.jikiObject.value).toBe(1);
      });

      test("string + number coerces to string concatenation", () => {
        const result = interpret('"hello" + 5;', { languageFeatures });
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[0].result?.jikiObject.value).toBe("hello5");
      });

      test("number + string coerces to string concatenation", () => {
        const result = interpret('5 + "hello";', { languageFeatures });
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[0].result?.jikiObject.value).toBe("5hello");
      });

      test("number - boolean coerces (10 - true = 9)", () => {
        const result = interpret("10 - true;", { languageFeatures });
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[0].result?.jikiObject.value).toBe(9);
      });

      test("boolean - number coerces (false - 3 = -3)", () => {
        const result = interpret("false - 3;", { languageFeatures });
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[0].result?.jikiObject.value).toBe(-3);
      });

      test("string - number coerces string to number", () => {
        const result = interpret('"10" - 5;', { languageFeatures });
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[0].result?.jikiObject.value).toBe(5);
      });

      test("number * boolean coerces (5 * true = 5)", () => {
        const result = interpret("5 * true;", { languageFeatures });
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[0].result?.jikiObject.value).toBe(5);
      });

      test("number * false coerces (5 * false = 0)", () => {
        const result = interpret("5 * false;", { languageFeatures });
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[0].result?.jikiObject.value).toBe(0);
      });

      test("string * number coerces string to number", () => {
        const result = interpret('"2" * 3;', { languageFeatures });
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[0].result?.jikiObject.value).toBe(6);
      });

      test("number / boolean coerces (10 / true = 10)", () => {
        const result = interpret("10 / true;", { languageFeatures });
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[0].result?.jikiObject.value).toBe(10);
      });

      test("boolean / number coerces (true / 2 = 0.5)", () => {
        const result = interpret("true / 2;", { languageFeatures });
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[0].result?.jikiObject.value).toBe(0.5);
      });

      test("division by false results in Infinity", () => {
        const result = interpret("10 / false;", { languageFeatures });
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[0].result?.jikiObject.value).toBe(Infinity);
      });
    });

    describe("complex expressions with coercion", () => {
      test("nested expression with type coercion works", () => {
        const result = interpret("(5 + 3) * true;", { languageFeatures });
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[0].result?.jikiObject.value).toBe(8);
      });

      test("chained operations with mixed types", () => {
        const result = interpret("5 + true - false;", { languageFeatures });
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[0].result?.jikiObject.value).toBe(6);
      });

      test("string concatenation with coercion", () => {
        const result = interpret('"Result: " + (10 + true);', { languageFeatures });
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[0].result?.jikiObject.value).toBe("Result: 11");
      });
    });

    describe("with variables", () => {
      test("number variable + boolean coerces", () => {
        const result = interpret(
          `
          let x = 5;
          x + true;
        `,
          { languageFeatures }
        );
        expect(result.error).toBe(null);
        expect(result.frames[1].status).toBe("SUCCESS");
        expect(result.frames[1].result?.jikiObject.value).toBe(6);
      });

      test("boolean variable operations with coercion", () => {
        const result = interpret(
          `
          let b = false;
          b + 10;
        `,
          { languageFeatures }
        );
        expect(result.error).toBe(null);
        expect(result.frames[1].status).toBe("SUCCESS");
        expect(result.frames[1].result?.jikiObject.value).toBe(10);
      });

      test("string variable concatenation with number", () => {
        const result = interpret(
          `
          let s = "test";
          s + 42;
        `,
          { languageFeatures }
        );
        expect(result.error).toBe(null);
        expect(result.frames[1].status).toBe("SUCCESS");
        expect(result.frames[1].result?.jikiObject.value).toBe("test42");
      });
    });

    describe("edge cases", () => {
      test("null coercion in arithmetic", () => {
        const result = interpret("null + 5;", { languageFeatures });
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[0].result?.jikiObject.value).toBe(5);
      });

      test("undefined + number results in NaN", () => {
        const result = interpret(
          `
          let x;
          x + 5;
        `,
          { languageFeatures: { ...languageFeatures, requireVariableInstantiation: false } }
        );
        expect(result.error).toBe(null);
        // First frame is variable declaration
        expect(result.frames[0].status).toBe("SUCCESS");
        // Variable declaration in JS with requireVariableInstantiation: false sets value to undefined
        expect(result.frames[0].result?.jikiObject.value).toBe(undefined);
        // Second frame is the addition
        expect(result.frames[1].status).toBe("SUCCESS");
        expect(Number.isNaN(result.frames[1].result?.jikiObject.value)).toBe(true);
      });
    });
  });

  describe("comparison with default flag", () => {
    test("default flag value is false", () => {
      const result = interpret("5 + true;");
      expect(result.error).toBe(null);
      expect(result.frames).toHaveLength(1);
      expect(result.frames[0].status).toBe("ERROR");
      expect(result.frames[0].error?.message).toBe("TypeCoercionNotAllowed: operator: +: left: number: right: boolean");
    });
  });
});
