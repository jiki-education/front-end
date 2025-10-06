import { describe } from "vitest";
import { testPython } from "../../utils/test-runner";

describe("Python basic operations cross-validation", () => {
  describe("arithmetic", () => {
    testPython("addition", "2 + 3", { expectedValue: 5 });
    testPython("subtraction", "10 - 4", { expectedValue: 6 });
    testPython("multiplication", "3 * 4", { expectedValue: 12 });
    testPython("division", "10 / 2", { expectedValue: 5 });
    testPython("integer division", "10 // 3", { expectedValue: 3 });
    testPython("modulo", "10 % 3", { expectedValue: 1 });
    testPython("power", "2 ** 3", { expectedValue: 8 });
    testPython("order of operations", "2 + 3 * 4", { expectedValue: 14 });
    testPython("parentheses", "(2 + 3) * 4", { expectedValue: 20 });
  });

  describe("variable assignment", () => {
    testPython(
      "single assignment",
      `
x = 5
result = x
    `,
      { expectedValue: 5 }
    );

    testPython(
      "multiple assignments",
      `
x = 5
y = 10
result = x + y
    `,
      { expectedValue: 15 }
    );

    testPython(
      "reassignment",
      `
x = 5
x = 10
result = x
    `,
      { expectedValue: 10 }
    );
  });

  describe("boolean operations", () => {
    testPython("and true", "result = True and True", { expectedValue: true });
    testPython("and false", "result = True and False", { expectedValue: false });
    testPython("or true", "result = False or True", { expectedValue: true });
    testPython("or false", "result = False or False", { expectedValue: false });
    testPython("not true", "result = not True", { expectedValue: false });
    testPython("not false", "result = not False", { expectedValue: true });
  });

  describe("comparison operations", () => {
    testPython("equal true", "result = 5 == 5", { expectedValue: true });
    testPython("equal false", "result = 5 == 3", { expectedValue: false });
    testPython("not equal true", "result = 5 != 3", { expectedValue: true });
    testPython("not equal false", "result = 5 != 5", { expectedValue: false });
    testPython("less than true", "result = 3 < 5", { expectedValue: true });
    testPython("less than false", "result = 5 < 3", { expectedValue: false });
    testPython("less than or equal", "result = 5 <= 5", { expectedValue: true });
    testPython("greater than", "result = 5 > 3", { expectedValue: true });
    testPython("greater than or equal", "result = 5 >= 5", { expectedValue: true });
  });

  describe("string operations", () => {
    testPython("string concatenation", `result = "hello" + " " + "world"`, {
      expectedValue: "hello world",
    });

    testPython("string repetition", `result = "ab" * 3`, {
      expectedValue: "ababab",
    });
  });

  describe("list operations", () => {
    testPython(
      "list creation",
      `
lst = [1, 2, 3]
result = lst[0]
    `,
      { expectedValue: 1 }
    );

    testPython(
      "list indexing",
      `
lst = [10, 20, 30]
result = lst[1]
    `,
      { expectedValue: 20 }
    );

    testPython(
      "negative indexing",
      `
lst = [10, 20, 30]
result = lst[-1]
    `,
      { expectedValue: 30 }
    );

    testPython(
      "list assignment",
      `
lst = [1, 2, 3]
lst[1] = 5
result = lst[1]
    `,
      { expectedValue: 5 }
    );
  });

  describe("numeric types", () => {
    testPython("integer", "result = 42", { expectedValue: 42 });
    testPython("float", "result = 3.14", { expectedValue: 3.14 });
    testPython("scientific notation", "result = 1e3", { expectedValue: 1000 });
    testPython("negative scientific", "result = 1e-2", { expectedValue: 0.01 });
  });
});
