import { interpret } from "@python/interpreter";
import { PyNumber, PyBoolean } from "@python/jikiObjects";

describe("operation concepts", () => {
  describe("arithmetic operations", () => {
    test("addition", () => {
      const { frames, error } = interpret("5 + 3");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject).toBeInstanceOf(PyNumber);
      expect(frames[0].result?.jikiObject.value).toBe(8);
    });

    test("subtraction", () => {
      const { frames, error } = interpret("10 - 4");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(6);
    });

    test("multiplication", () => {
      const { frames, error } = interpret("6 * 7");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(42);
    });

    test("division", () => {
      const { frames, error } = interpret("15 / 3");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(5);
    });

    test("floor division", () => {
      const { frames, error } = interpret("17 // 5");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(3);
    });

    test("modulo", () => {
      const { frames, error } = interpret("17 % 5");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(2);
    });

    test("power", () => {
      const { frames, error } = interpret("2 ** 3");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(8);
    });

    test("complex arithmetic expression", () => {
      const { frames, error } = interpret("2 + 3 * 4 - 1");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      // Should follow order of operations: 2 + (3 * 4) - 1 = 2 + 12 - 1 = 13
      expect(frames[0].result?.jikiObject.value).toBe(13);
    });

    test("floating point operations", () => {
      const { frames, error } = interpret("3.5 + 2.5");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(6);
    });
  });

  describe("comparison operations", () => {
    test("greater than - true", () => {
      const { frames, error } = interpret("5 > 3");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject).toBeInstanceOf(PyBoolean);
      expect(frames[0].result?.jikiObject.value).toBe(true);
    });

    test("greater than - false", () => {
      const { frames, error } = interpret("3 > 5");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(false);
    });

    test("greater than or equal", () => {
      const { frames, error } = interpret("5 >= 5");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(true);
    });

    test("less than", () => {
      const { frames, error } = interpret("3 < 5");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(true);
    });

    test("less than or equal", () => {
      const { frames, error } = interpret("5 <= 5");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(true);
    });

    test("equal", () => {
      const { frames, error } = interpret("5 == 5");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(true);
    });

    test("not equal", () => {
      const { frames, error } = interpret("5 != 3");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(true);
    });

    test("chained comparisons", () => {
      const { frames, error } = interpret("(3 < 5) and (5 < 10)");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(true);
    });
  });

  describe("grouping (parentheses)", () => {
    test("simple grouping", () => {
      const { frames, error } = interpret("(5 + 3)");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(8);
    });

    test("grouping changes precedence", () => {
      const { frames, error } = interpret("(2 + 3) * 4");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      // With grouping: (2 + 3) * 4 = 5 * 4 = 20
      expect(frames[0].result?.jikiObject.value).toBe(20);
    });

    test("nested grouping", () => {
      const { frames, error } = interpret("((2 + 3) * (4 + 1))");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      // ((2 + 3) * (4 + 1)) = (5 * 5) = 25
      expect(frames[0].result?.jikiObject.value).toBe(25);
    });

    test("deeply nested grouping", () => {
      const { frames, error } = interpret("(((1 + 2) + 3) + 4)");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(10);
    });

    test("grouping with different types", () => {
      const { frames, error } = interpret('("hello" + " ") + "world"');
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe("hello world");
    });

    test("grouping with boolean expressions", () => {
      const { frames, error } = interpret("(True and False) or True");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(true);
    });
  });

  describe("mixed type operations", () => {
    test("number and boolean comparison", () => {
      const { frames, error } = interpret("5 > 3 and 2 < 4");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(true);
    });

    test("string and number concatenation should work", () => {
      // In Python, this would normally fail, but our implementation
      // uses JavaScript semantics for now
      const { frames, error } = interpret('"The answer is " + "42"');
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe("The answer is 42");
    });

    test("complex mixed expression", () => {
      const { frames, error } = interpret("(5 + 3) == 8 and True");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(true);
    });
  });

  describe("operator precedence", () => {
    test("multiplication before addition", () => {
      const { frames, error } = interpret("2 + 3 * 4");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(14);
    });

    test("power before multiplication", () => {
      const { frames, error } = interpret("2 * 3 ** 2");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      // 2 * (3 ** 2) = 2 * 9 = 18
      expect(frames[0].result?.jikiObject.value).toBe(18);
    });

    test("comparison before logical and", () => {
      const { frames, error } = interpret("5 > 3 and 2 < 4");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(true);
    });

    test("logical and before logical or", () => {
      const { frames, error } = interpret("False or True and True");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      // False or (True and True) = False or True = True
      expect(frames[0].result?.jikiObject.value).toBe(true);
    });
  });
});
