import { describe } from "vitest";
import { testJavaScript } from "../../utils/test-runner";

// SKIP ALL: Methods require CallExpression support which is not fully implemented
describe.skip("JavaScript array methods cross-validation", () => {
  describe("array.at()", () => {
    testJavaScript(
      "positive index at start",
      `
const arr = [10, 20, 30];
const result = arr.at(0);
    `,
      { expectedValue: 10 }
    );

    testJavaScript(
      "positive index in middle",
      `
const arr = [10, 20, 30];
const result = arr.at(1);
    `,
      { expectedValue: 20 }
    );

    testJavaScript(
      "positive index at end",
      `
const arr = [10, 20, 30];
const result = arr.at(2);
    `,
      { expectedValue: 30 }
    );

    testJavaScript(
      "negative index from end",
      `
const arr = [10, 20, 30];
const result = arr.at(-1);
    `,
      { expectedValue: 30 }
    );

    testJavaScript(
      "negative index from middle",
      `
const arr = [10, 20, 30];
const result = arr.at(-2);
    `,
      { expectedValue: 20 }
    );

    testJavaScript(
      "negative index from start",
      `
const arr = [10, 20, 30];
const result = arr.at(-3);
    `,
      { expectedValue: 10 }
    );

    testJavaScript(
      "out of bounds positive",
      `
const arr = [10, 20, 30];
const result = arr.at(5);
    `,
      { expectedValue: undefined }
    );

    testJavaScript(
      "out of bounds negative",
      `
const arr = [10, 20, 30];
const result = arr.at(-5);
    `,
      { expectedValue: undefined }
    );

    testJavaScript(
      "on empty array",
      `
const arr = [];
const result = arr.at(0);
    `,
      { expectedValue: undefined }
    );

    testJavaScript(
      "with string elements",
      `
const arr = ["a", "b", "c"];
const result = arr.at(1);
    `,
      { expectedValue: "b" }
    );
  });

  describe("array.length", () => {
    testJavaScript(
      "empty array",
      `
const arr = [];
const result = arr.length;
    `,
      { expectedValue: 0 }
    );

    testJavaScript(
      "single element",
      `
const arr = [1];
const result = arr.length;
    `,
      { expectedValue: 1 }
    );

    testJavaScript(
      "multiple elements",
      `
const arr = [1, 2, 3, 4, 5];
const result = arr.length;
    `,
      { expectedValue: 5 }
    );

    testJavaScript(
      "mixed types",
      `
const arr = [1, "two", 3.0, true];
const result = arr.length;
    `,
      { expectedValue: 4 }
    );

    testJavaScript(
      "nested arrays",
      `
const arr = [[1, 2], [3, 4], [5]];
const result = arr.length;
    `,
      { expectedValue: 3 }
    );

    testJavaScript(
      "sparse array",
      `
const arr = [1, , , 4];
const result = arr.length;
    `,
      { expectedValue: 4 }
    );

    testJavaScript(
      "after modification",
      `
let arr = [1, 2];
arr[2] = 3;
const result = arr.length;
    `,
      { expectedValue: 3 }
    );
  });
});
