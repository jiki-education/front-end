import { describe, test, expect } from "vitest";
import { interpret } from "@python/interpreter";

describe("Python Type Coercion", () => {
  describe("with allowTypeCoercion disabled (default)", () => {
    const languageFeatures = {
      languageFeatures: {
        allowTypeCoercion: false,
      },
    };

    describe("arithmetic operations", () => {
      test("number + boolean throws error", () => {
        const result = interpret("5 + True", languageFeatures);
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("ERROR");
        expect(result.frames[0].error?.message).toBe(
          "TypeCoercionNotAllowed: operator: +: left: number: right: boolean"
        );
      });

      test("boolean + number throws error", () => {
        const result = interpret("True + 5", languageFeatures);
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("ERROR");
        expect(result.frames[0].error?.message).toBe(
          "TypeCoercionNotAllowed: operator: +: left: boolean: right: number"
        );
      });

      test("string + number throws error", () => {
        const result = interpret('"hello" + 5', languageFeatures);
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("ERROR");
        expect(result.frames[0].error?.message).toBe(
          "TypeCoercionNotAllowed: operator: +: left: string: right: number"
        );
      });

      test("number + string throws error", () => {
        const result = interpret('5 + "hello"', languageFeatures);
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("ERROR");
        expect(result.frames[0].error?.message).toBe(
          "TypeCoercionNotAllowed: operator: +: left: number: right: string"
        );
      });

      test("number - boolean throws error", () => {
        const result = interpret("10 - True", languageFeatures);
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("ERROR");
        expect(result.frames[0].error?.message).toBe("TypeCoercionNotAllowed: operator: -: right: boolean");
      });

      test("boolean - number throws error", () => {
        const result = interpret("False - 3", languageFeatures);
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("ERROR");
        expect(result.frames[0].error?.message).toBe("TypeCoercionNotAllowed: operator: -: left: boolean");
      });

      test("string - number throws error", () => {
        const result = interpret('"10" - 5', languageFeatures);
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("ERROR");
        expect(result.frames[0].error?.message).toBe("TypeCoercionNotAllowed: operator: -: left: string");
      });

      test("number * boolean throws error", () => {
        const result = interpret("5 * True", languageFeatures);
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("ERROR");
        expect(result.frames[0].error?.message).toBe("TypeCoercionNotAllowed: operator: *: right: boolean");
      });

      test("string * number works (string repetition)", () => {
        const result = interpret('"hello" * 3', languageFeatures);
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[0].result?.jikiObject.value).toBe("hellohellohello");
      });

      test("number * string works (string repetition)", () => {
        const result = interpret('3 * "hello"', languageFeatures);
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[0].result?.jikiObject.value).toBe("hellohellohello");
      });

      test("number / boolean throws error", () => {
        const result = interpret("10 / False", languageFeatures);
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("ERROR");
        expect(result.frames[0].error?.message).toBe("TypeCoercionNotAllowed: operator: /: right: boolean");
      });

      test("boolean / number throws error", () => {
        const result = interpret("True / 2", languageFeatures);
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("ERROR");
        expect(result.frames[0].error?.message).toBe("TypeCoercionNotAllowed: operator: /: left: boolean");
      });

      test("number // boolean throws error", () => {
        const result = interpret("10 // True", languageFeatures);
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("ERROR");
        expect(result.frames[0].error?.message).toBe("TypeCoercionNotAllowed: operator: //: right: boolean");
      });

      test("number % boolean throws error", () => {
        const result = interpret("10 % True", languageFeatures);
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("ERROR");
        expect(result.frames[0].error?.message).toBe("TypeCoercionNotAllowed: operator: %: right: boolean");
      });

      test("number ** boolean throws error", () => {
        const result = interpret("5 ** True", languageFeatures);
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("ERROR");
        expect(result.frames[0].error?.message).toBe("TypeCoercionNotAllowed: operator: **: right: boolean");
      });
    });

    describe("allowed operations", () => {
      test("number + number works", () => {
        const result = interpret("5 + 3", languageFeatures);
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[0].result?.jikiObject.value).toBe(8);
      });

      test("string + string works (concatenation)", () => {
        const result = interpret('"hello" + " world"', languageFeatures);
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[0].result?.jikiObject.value).toBe("hello world");
      });

      test("number - number works", () => {
        const result = interpret("10 - 3", languageFeatures);
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[0].result?.jikiObject.value).toBe(7);
      });

      test("number * number works", () => {
        const result = interpret("4 * 5", languageFeatures);
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[0].result?.jikiObject.value).toBe(20);
      });

      test("number / number works", () => {
        const result = interpret("10 / 2", languageFeatures);
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[0].result?.jikiObject.value).toBe(5);
      });

      test("number // number works (floor division)", () => {
        const result = interpret("10 // 3", languageFeatures);
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[0].result?.jikiObject.value).toBe(3);
      });

      test("number % number works (modulo)", () => {
        const result = interpret("10 % 3", languageFeatures);
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[0].result?.jikiObject.value).toBe(1);
      });

      test("number ** number works (power)", () => {
        const result = interpret("2 ** 3", languageFeatures);
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[0].result?.jikiObject.value).toBe(8);
      });

      test("string * number works (string repetition)", () => {
        const result = interpret('"hi" * 2', languageFeatures);
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[0].result?.jikiObject.value).toBe("hihi");
      });

      test("number * string works (string repetition)", () => {
        const result = interpret('2 * "hi"', languageFeatures);
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[0].result?.jikiObject.value).toBe("hihi");
      });
    });

    describe("with variables", () => {
      test("number variable + boolean throws error", () => {
        const result = interpret(
          `x = 5
x + True`,
          languageFeatures
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
          `b = False
b + 10`,
          languageFeatures
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
          `s = "test"
s + 42`,
          languageFeatures
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
        const result = interpret("(5 + 3) * True", languageFeatures);
        expect(result.error).toBe(null);
        expect(result.frames[0].status).toBe("ERROR");
        expect(result.frames[0].error?.message).toBe("TypeCoercionNotAllowed: operator: *: right: boolean");
      });

      test("multiple operations with type coercion throws error at first issue", () => {
        const result = interpret("5 + True - 2", languageFeatures);
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
      languageFeatures: {
        allowTypeCoercion: true,
      },
    };

    describe("arithmetic operations with coercion", () => {
      test("number + boolean coerces (5 + True = 6)", () => {
        const result = interpret("5 + True", languageFeatures);
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[0].result?.jikiObject.value).toBe(6);
      });

      test("boolean + number coerces (True + 5 = 6)", () => {
        const result = interpret("True + 5", languageFeatures);
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[0].result?.jikiObject.value).toBe(6);
      });

      test("boolean + boolean coerces (True + False = 1)", () => {
        const result = interpret("True + False", languageFeatures);
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[0].result?.jikiObject.value).toBe(1);
      });

      test("string + number still throws error (Python doesn't coerce)", () => {
        const result = interpret('"hello" + 5', languageFeatures);
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("ERROR");
        expect(result.frames[0].error?.message).toBe(
          "TypeCoercionNotAllowed: operator: +: left: string: right: number"
        );
      });

      test("number + string still throws error (Python doesn't coerce)", () => {
        const result = interpret('5 + "hello"', languageFeatures);
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("ERROR");
        expect(result.frames[0].error?.message).toBe(
          "TypeCoercionNotAllowed: operator: +: left: number: right: string"
        );
      });

      test("number - boolean coerces (10 - True = 9)", () => {
        const result = interpret("10 - True", languageFeatures);
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[0].result?.jikiObject.value).toBe(9);
      });

      test("boolean - number coerces (False - 3 = -3)", () => {
        const result = interpret("False - 3", languageFeatures);
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[0].result?.jikiObject.value).toBe(-3);
      });

      test("number * boolean coerces (5 * True = 5)", () => {
        const result = interpret("5 * True", languageFeatures);
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[0].result?.jikiObject.value).toBe(5);
      });

      test("number * False coerces (5 * False = 0)", () => {
        const result = interpret("5 * False", languageFeatures);
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[0].result?.jikiObject.value).toBe(0);
      });

      test("number / boolean coerces (10 / True = 10)", () => {
        const result = interpret("10 / True", languageFeatures);
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[0].result?.jikiObject.value).toBe(10);
      });

      test("boolean / number coerces (True / 2 = 0.5)", () => {
        const result = interpret("True / 2", languageFeatures);
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[0].result?.jikiObject.value).toBe(0.5);
      });

      test("division by False results in Infinity", () => {
        const result = interpret("10 / False", languageFeatures);
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[0].result?.jikiObject.value).toBe(Infinity);
      });

      test("floor division with booleans (10 // True = 10)", () => {
        const result = interpret("10 // True", languageFeatures);
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[0].result?.jikiObject.value).toBe(10);
      });

      test("modulo with booleans (10 % True = 0)", () => {
        const result = interpret("10 % True", languageFeatures);
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[0].result?.jikiObject.value).toBe(0);
      });

      test("power with booleans (5 ** True = 5)", () => {
        const result = interpret("5 ** True", languageFeatures);
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[0].result?.jikiObject.value).toBe(5);
      });

      test("string * number works (string repetition)", () => {
        const result = interpret('"py" * 3', languageFeatures);
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[0].result?.jikiObject.value).toBe("pypypy");
      });

      test("number * string works (string repetition)", () => {
        const result = interpret('3 * "py"', languageFeatures);
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[0].result?.jikiObject.value).toBe("pypypy");
      });
    });

    describe("complex expressions with coercion", () => {
      test("nested expression with type coercion works", () => {
        const result = interpret("(5 + 3) * True", languageFeatures);
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[0].result?.jikiObject.value).toBe(8);
      });

      test("chained operations with mixed types", () => {
        const result = interpret("5 + True - False", languageFeatures);
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[0].result?.jikiObject.value).toBe(6);
      });

      test("power operations with boolean", () => {
        const result = interpret("2 ** True + 1", languageFeatures);
        expect(result.error).toBe(null);
        expect(result.frames).toHaveLength(1);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[0].result?.jikiObject.value).toBe(3);
      });
    });

    describe("with variables", () => {
      test("number variable + boolean coerces", () => {
        const result = interpret(
          `x = 5
x + True`,
          languageFeatures
        );
        expect(result.error).toBe(null);
        expect(result.frames[1].status).toBe("SUCCESS");
        expect(result.frames[1].result?.jikiObject.value).toBe(6);
      });

      test("boolean variable operations with coercion", () => {
        const result = interpret(
          `b = False
b + 10`,
          languageFeatures
        );
        expect(result.error).toBe(null);
        expect(result.frames[1].status).toBe("SUCCESS");
        expect(result.frames[1].result?.jikiObject.value).toBe(10);
      });

      test("string variable + number still throws error", () => {
        const result = interpret(
          `s = "test"
s + 42`,
          languageFeatures
        );
        expect(result.error).toBe(null);
        expect(result.frames[0].status).toBe("SUCCESS");
        expect(result.frames[1].status).toBe("ERROR");
        expect(result.frames[1].error?.message).toBe(
          "TypeCoercionNotAllowed: operator: +: left: string: right: number"
        );
      });
    });
  });

  describe("comparison with default flag", () => {
    test("default flag value is false", () => {
      const result = interpret("5 + True");
      expect(result.error).toBe(null);
      expect(result.frames).toHaveLength(1);
      expect(result.frames[0].status).toBe("ERROR");
      expect(result.frames[0].error?.message).toBe("TypeCoercionNotAllowed: operator: +: left: number: right: boolean");
    });
  });
});
