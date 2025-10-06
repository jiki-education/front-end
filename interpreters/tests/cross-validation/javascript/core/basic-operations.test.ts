import { describe } from "vitest";
import { testJavaScript } from "../../utils/test-runner";

describe.skip("JavaScript basic operations cross-validation", () => {
  describe("arithmetic", () => {
    testJavaScript("addition", "let result = 2 + 3;", { expectedValue: 5 });
    testJavaScript("subtraction", "let result = 10 - 4;", { expectedValue: 6 });
    testJavaScript("multiplication", "let result = 3 * 4;", { expectedValue: 12 });
    testJavaScript("division", "let result = 10 / 2;", { expectedValue: 5 });
    testJavaScript("modulo", "let result = 10 % 3;", { expectedValue: 1 });
    testJavaScript("exponentiation", "let result = 2 ** 3;", { expectedValue: 8 });

    testJavaScript("order of operations", "let result = 2 + 3 * 4;", { expectedValue: 14 });
    testJavaScript("parentheses", "let result = (2 + 3) * 4;", { expectedValue: 20 });
  });

  describe("variable declarations", () => {
    testJavaScript(
      "let declaration",
      `
let x = 5;
let result = x;
    `,
      { expectedValue: 5 }
    );

    testJavaScript(
      "const declaration",
      `
const x = 5;
const result = x;
    `,
      { expectedValue: 5 }
    );

    testJavaScript(
      "var declaration",
      `
var x = 5;
var result = x;
    `,
      { expectedValue: 5 }
    );

    testJavaScript(
      "multiple declarations",
      `
let x = 5;
let y = 10;
let result = x + y;
    `,
      { expectedValue: 15 }
    );

    testJavaScript(
      "reassignment",
      `
let x = 5;
x = 10;
let result = x;
    `,
      { expectedValue: 10 }
    );
  });

  describe("boolean operations", () => {
    testJavaScript("and true", "let result = true && true;", { expectedValue: true });
    testJavaScript("and false", "let result = true && false;", { expectedValue: false });
    testJavaScript("or true", "let result = false || true;", { expectedValue: true });
    testJavaScript("or false", "let result = false || false;", { expectedValue: false });
    testJavaScript("not true", "let result = !true;", { expectedValue: false });
    testJavaScript("not false", "let result = !false;", { expectedValue: true });
  });

  describe("comparison operations", () => {
    testJavaScript("strict equal true", "let result = 5 === 5;", { expectedValue: true });
    testJavaScript("strict equal false", "let result = 5 === '5';", { expectedValue: false });
    testJavaScript("loose equal true", "let result = 5 == '5';", { expectedValue: true });
    testJavaScript("strict not equal", "let result = 5 !== '5';", { expectedValue: true });
    testJavaScript("loose not equal", "let result = 5 != 3;", { expectedValue: true });
    testJavaScript("less than", "let result = 3 < 5;", { expectedValue: true });
    testJavaScript("less than or equal", "let result = 5 <= 5;", { expectedValue: true });
    testJavaScript("greater than", "let result = 5 > 3;", { expectedValue: true });
    testJavaScript("greater than or equal", "let result = 5 >= 5;", { expectedValue: true });
  });

  describe("string operations", () => {
    testJavaScript("string concatenation", `let result = "hello" + " " + "world";`, {
      expectedValue: "hello world",
    });

    testJavaScript("template literal", `let result = \`hello world\`;`, {
      expectedValue: "hello world",
    });

    testJavaScript(
      "template literal with expression",
      `
let x = 5;
let result = \`value: \${x}\`;
    `,
      { expectedValue: "value: 5" }
    );
  });

  describe("array operations", () => {
    testJavaScript(
      "array creation",
      `
let arr = [1, 2, 3];
let result = arr[0];
    `,
      { expectedValue: 1 }
    );

    testJavaScript(
      "array indexing",
      `
let arr = [10, 20, 30];
let result = arr[1];
    `,
      { expectedValue: 20 }
    );

    testJavaScript(
      "array assignment",
      `
let arr = [1, 2, 3];
arr[1] = 5;
let result = arr[1];
    `,
      { expectedValue: 5 }
    );

    testJavaScript(
      "array length",
      `
let arr = [1, 2, 3];
let result = arr.length;
    `,
      { expectedValue: 3 }
    );
  });

  describe("numeric types", () => {
    testJavaScript("integer", "let result = 42;", { expectedValue: 42 });
    testJavaScript("float", "let result = 3.14;", { expectedValue: 3.14 });
    testJavaScript("scientific notation", "let result = 1e3;", { expectedValue: 1000 });
    testJavaScript("negative scientific", "let result = 1e-2;", { expectedValue: 0.01 });
    testJavaScript("NaN", "let result = NaN;", { expectedValue: NaN });
    testJavaScript("Infinity", "let result = Infinity;", { expectedValue: Infinity });
  });

  describe("undefined and null", () => {
    testJavaScript("undefined", "let x; let result = x;", { expectedValue: undefined });
    testJavaScript("null", "let result = null;", { expectedValue: null });
  });
});
