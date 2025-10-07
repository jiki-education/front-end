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

  describe("array.push()", () => {
    testJavaScript(
      "push single element",
      `
let arr = [1, 2, 3];
let result = arr.push(4);
    `,
      { expectedValue: 4 }
    );

    testJavaScript(
      "push multiple elements",
      `
let arr = [1, 2];
let result = arr.push(3, 4, 5);
    `,
      { expectedValue: 5 }
    );

    testJavaScript(
      "push to empty array",
      `
let arr = [];
let result = arr.push(1);
    `,
      { expectedValue: 1 }
    );

    testJavaScript(
      "push modifies original array",
      `
let arr = [1, 2];
arr.push(3);
let result = arr.length;
    `,
      { expectedValue: 3 }
    );

    testJavaScript(
      "push with no arguments returns current length",
      `
let arr = [1, 2, 3];
let result = arr.push();
    `,
      { expectedValue: 3, languageFeatures: { nativeJSMode: true } }
    );
  });

  describe("array.pop()", () => {
    testJavaScript(
      "pop from array with elements",
      `
let arr = [1, 2, 3];
let result = arr.pop();
    `,
      { expectedValue: 3 }
    );

    testJavaScript(
      "pop from empty array",
      `
let arr = [];
let result = arr.pop();
    `,
      { expectedValue: undefined }
    );

    testJavaScript(
      "pop modifies original array",
      `
let arr = [1, 2, 3];
arr.pop();
let result = arr.length;
    `,
      { expectedValue: 2 }
    );

    testJavaScript(
      "pop single element array",
      `
let arr = [42];
let result = arr.pop();
    `,
      { expectedValue: 42 }
    );
  });

  describe("array.shift()", () => {
    testJavaScript(
      "shift from array with elements",
      `
let arr = [1, 2, 3];
let result = arr.shift();
    `,
      { expectedValue: 1 }
    );

    testJavaScript(
      "shift from empty array",
      `
let arr = [];
let result = arr.shift();
    `,
      { expectedValue: undefined }
    );

    testJavaScript(
      "shift modifies original array",
      `
let arr = [1, 2, 3];
arr.shift();
let result = arr.length;
    `,
      { expectedValue: 2 }
    );

    testJavaScript(
      "shift updates indices",
      `
let arr = [1, 2, 3];
arr.shift();
let result = arr[0];
    `,
      { expectedValue: 2 }
    );
  });

  describe("array.unshift()", () => {
    testJavaScript(
      "unshift single element",
      `
let arr = [2, 3, 4];
let result = arr.unshift(1);
    `,
      { expectedValue: 4 }
    );

    testJavaScript(
      "unshift multiple elements",
      `
let arr = [4, 5];
let result = arr.unshift(1, 2, 3);
    `,
      { expectedValue: 5 }
    );

    testJavaScript(
      "unshift to empty array",
      `
let arr = [];
let result = arr.unshift(1);
    `,
      { expectedValue: 1 }
    );

    testJavaScript(
      "unshift updates indices",
      `
let arr = [2, 3];
arr.unshift(1);
let result = arr[0];
    `,
      { expectedValue: 1 }
    );

    testJavaScript(
      "unshift preserves order",
      `
let arr = [4];
arr.unshift(1, 2, 3);
let result = arr[2];
    `,
      { expectedValue: 3 }
    );

    testJavaScript(
      "unshift with no arguments returns current length",
      `
let arr = [1, 2, 3];
let result = arr.unshift();
    `,
      { expectedValue: 3, languageFeatures: { nativeJSMode: true } }
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
