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
