import { interpret } from "@javascript/interpreter";
import { JSNumber } from "@javascript/jikiObjects";

describe("arithmetic interpreter", () => {
  describe("execute", () => {
    describe("literals", () => {
      test("integer", () => {
        const { frames, error } = interpret("42;");
        expect(error).toBeNull();
        expect(frames).toBeArrayOfSize(1);
        expect(frames[0].status).toBe("SUCCESS");
        expect(frames[0].result?.jikiObject).toBeInstanceOf(JSNumber);
        expect(frames[0].result?.jikiObject.value).toBe(42);
      });

      test("floating point", () => {
        const { frames, error } = interpret("3.14;");
        expect(error).toBeNull();
        expect(frames).toBeArrayOfSize(1);
        expect(frames[0].status).toBe("SUCCESS");
        expect(frames[0].result?.jikiObject.value).toBe(3.14);
      });
    });

    describe("binary operations", () => {
      test("addition", () => {
        const { frames, error } = interpret("1 + 2;");
        expect(error).toBeNull();
        expect(frames).toBeArrayOfSize(1);
        expect(frames[0].status).toBe("SUCCESS");
        expect(frames[0].result?.jikiObject.value).toBe(3);
      });

      test("subtraction", () => {
        const { frames, error } = interpret("5 - 2;");
        expect(error).toBeNull();
        expect(frames).toBeArrayOfSize(1);
        expect(frames[0].status).toBe("SUCCESS");
        expect(frames[0].result?.jikiObject.value).toBe(3);
      });

      test("multiplication", () => {
        const { frames, error } = interpret("3 * 4;");
        expect(error).toBeNull();
        expect(frames).toBeArrayOfSize(1);
        expect(frames[0].status).toBe("SUCCESS");
        expect(frames[0].result?.jikiObject.value).toBe(12);
      });

      test("division", () => {
        const { frames, error } = interpret("10 / 2;");
        expect(error).toBeNull();
        expect(frames).toBeArrayOfSize(1);
        expect(frames[0].status).toBe("SUCCESS");
        expect(frames[0].result?.jikiObject.value).toBe(5);
      });

      test("modulo", () => {
        const { frames, error } = interpret("10 % 3;");
        expect(error).toBeNull();
        expect(frames).toBeArrayOfSize(1);
        expect(frames[0].status).toBe("SUCCESS");
        expect(frames[0].result?.jikiObject.value).toBe(1);
      });

      test("modulo with no remainder", () => {
        const { frames, error } = interpret("10 % 5;");
        expect(error).toBeNull();
        expect(frames).toBeArrayOfSize(1);
        expect(frames[0].status).toBe("SUCCESS");
        expect(frames[0].result?.jikiObject.value).toBe(0);
      });

      test("modulo has same precedence as multiplication", () => {
        const { frames, error } = interpret("1 + 10 % 3;");
        expect(error).toBeNull();
        expect(frames).toBeArrayOfSize(1);
        expect(frames[0].status).toBe("SUCCESS");
        expect(frames[0].result?.jikiObject.value).toBe(2);
      });

      test("exponentiation", () => {
        const { frames, error } = interpret("2 ** 3;");
        expect(error).toBeNull();
        expect(frames).toBeArrayOfSize(1);
        expect(frames[0].status).toBe("SUCCESS");
        expect(frames[0].result?.jikiObject.value).toBe(8);
      });

      test("exponentiation with decimal result", () => {
        const { frames, error } = interpret("4 ** 0.5;");
        expect(error).toBeNull();
        expect(frames).toBeArrayOfSize(1);
        expect(frames[0].status).toBe("SUCCESS");
        expect(frames[0].result?.jikiObject.value).toBe(2);
      });

      test("exponentiation is right-associative", () => {
        // 2 ** 3 ** 2 = 2 ** (3 ** 2) = 2 ** 9 = 512
        const { frames, error } = interpret("2 ** 3 ** 2;");
        expect(error).toBeNull();
        expect(frames).toBeArrayOfSize(1);
        expect(frames[0].status).toBe("SUCCESS");
        expect(frames[0].result?.jikiObject.value).toBe(512);
      });

      test("exponentiation has higher precedence than multiplication", () => {
        // 2 * 3 ** 2 = 2 * (3 ** 2) = 2 * 9 = 18
        const { frames, error } = interpret("2 * 3 ** 2;");
        expect(error).toBeNull();
        expect(frames).toBeArrayOfSize(1);
        expect(frames[0].status).toBe("SUCCESS");
        expect(frames[0].result?.jikiObject.value).toBe(18);
      });

      test("results are rounded to 5 decimal places", () => {
        const { frames, error } = interpret("1 / 3;");
        expect(error).toBeNull();
        expect(frames).toBeArrayOfSize(1);
        expect(frames[0].status).toBe("SUCCESS");
        expect(frames[0].result?.jikiObject.value).toBe(0.33333);
      });

      test("complex expression", () => {
        const { frames, error } = interpret("1 + 2 * 3;");
        expect(error).toBeNull();
        expect(frames).toBeArrayOfSize(1);
        expect(frames[0].status).toBe("SUCCESS");
        expect(frames[0].result?.jikiObject.value).toBe(7);
      });
    });

    describe("unary operations", () => {
      test("negative number", () => {
        const { frames, error } = interpret("-5;");
        expect(error).toBeNull();
        expect(frames).toBeArrayOfSize(1);
        expect(frames[0].status).toBe("SUCCESS");
        expect(frames[0].result?.jikiObject.value).toBe(-5);
      });

      test("positive number", () => {
        const { frames, error } = interpret("+7;");
        expect(error).toBeNull();
        expect(frames).toBeArrayOfSize(1);
        expect(frames[0].status).toBe("SUCCESS");
        expect(frames[0].result?.jikiObject.value).toBe(7);
      });
    });

    describe("grouping", () => {
      test("parentheses change precedence", () => {
        const { frames, error } = interpret("(1 + 2) * 3;");
        expect(error).toBeNull();
        expect(frames).toBeArrayOfSize(1);
        expect(frames[0].status).toBe("SUCCESS");
        expect(frames[0].result?.jikiObject.value).toBe(9);
      });
    });
  });
});
