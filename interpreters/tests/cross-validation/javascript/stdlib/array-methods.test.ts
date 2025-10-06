import { describe } from "vitest";
import { testJavaScript } from "../../utils/test-runner";

describe("JavaScript array methods cross-validation", () => {
  describe("array.at()", () => {
    testJavaScript(
      "positive index at start",
      `
let arr = [10, 20, 30];
let result = arr.at(0);
    `,
      { expectedValue: 10 }
    );

    testJavaScript(
      "positive index in middle",
      `
let arr = [10, 20, 30];
let result = arr.at(1);
    `,
      { expectedValue: 20 }
    );

    testJavaScript(
      "positive index at end",
      `
let arr = [10, 20, 30];
let result = arr.at(2);
    `,
      { expectedValue: 30 }
    );

    testJavaScript(
      "negative index from end",
      `
let arr = [10, 20, 30];
let result = arr.at(-1);
    `,
      { expectedValue: 30 }
    );

    testJavaScript(
      "negative index from middle",
      `
let arr = [10, 20, 30];
let result = arr.at(-2);
    `,
      { expectedValue: 20 }
    );

    testJavaScript(
      "negative index from start",
      `
let arr = [10, 20, 30];
let result = arr.at(-3);
    `,
      { expectedValue: 10 }
    );

    testJavaScript(
      "out of bounds positive",
      `
let arr = [10, 20, 30];
let result = arr.at(5);
    `,
      { expectedValue: undefined }
    );

    testJavaScript(
      "out of bounds negative",
      `
let arr = [10, 20, 30];
let result = arr.at(-5);
    `,
      { expectedValue: undefined }
    );

    testJavaScript(
      "on empty array",
      `
let arr = [];
let result = arr.at(0);
    `,
      { expectedValue: undefined }
    );

    testJavaScript(
      "with string elements",
      `
let arr = ["a", "b", "c"];
let result = arr.at(1);
    `,
      { expectedValue: "b" }
    );
  });

  describe("array.length", () => {
    testJavaScript(
      "empty array",
      `
let arr = [];
let result = arr.length;
    `,
      { expectedValue: 0 }
    );

    testJavaScript(
      "single element",
      `
let arr = [1];
let result = arr.length;
    `,
      { expectedValue: 1 }
    );

    testJavaScript(
      "multiple elements",
      `
let arr = [1, 2, 3, 4, 5];
let result = arr.length;
    `,
      { expectedValue: 5 }
    );

    testJavaScript(
      "mixed types",
      `
let arr = [1, "two", 3.0, true];
let result = arr.length;
    `,
      { expectedValue: 4 }
    );

    testJavaScript(
      "nested arrays",
      `
let arr = [[1, 2], [3, 4], [5]];
let result = arr.length;
    `,
      { expectedValue: 3 }
    );

    testJavaScript(
      "after modification",
      `
let arr = [1, 2];
arr[2] = 3;
let result = arr.length;
    `,
      { expectedValue: 3 }
    );
  });
});
