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

  describe("array.indexOf()", () => {
    testJavaScript(
      "finds element at start",
      `
let arr = [10, 20, 30];
let result = arr.indexOf(10);
    `,
      { expectedValue: 0 }
    );

    testJavaScript(
      "finds element in middle",
      `
let arr = [10, 20, 30];
let result = arr.indexOf(20);
    `,
      { expectedValue: 1 }
    );

    testJavaScript(
      "finds element at end",
      `
let arr = [10, 20, 30];
let result = arr.indexOf(30);
    `,
      { expectedValue: 2 }
    );

    testJavaScript(
      "returns -1 when not found",
      `
let arr = [10, 20, 30];
let result = arr.indexOf(99);
    `,
      { expectedValue: -1 }
    );

    testJavaScript(
      "finds first occurrence",
      `
let arr = [10, 20, 30, 20];
let result = arr.indexOf(20);
    `,
      { expectedValue: 1 }
    );

    testJavaScript(
      "with fromIndex",
      `
let arr = [10, 20, 30, 20];
let result = arr.indexOf(20, 2);
    `,
      { expectedValue: 3 }
    );

    testJavaScript(
      "with negative fromIndex",
      `
let arr = [10, 20, 30, 40];
let result = arr.indexOf(30, -2);
    `,
      { expectedValue: 2 }
    );

    testJavaScript(
      "with strings",
      `
let arr = ["a", "b", "c"];
let result = arr.indexOf("b");
    `,
      { expectedValue: 1 }
    );

    testJavaScript(
      "on empty array",
      `
let arr = [];
let result = arr.indexOf(1);
    `,
      { expectedValue: -1 }
    );

    testJavaScript(
      "with fromIndex beyond array length",
      `
let arr = [1, 2, 3];
let result = arr.indexOf(2, 10);
    `,
      { expectedValue: -1 }
    );

    testJavaScript(
      "with very negative fromIndex",
      `
let arr = [1, 2, 3];
let result = arr.indexOf(1, -1000);
    `,
      { expectedValue: 0 }
    );
  });

  describe("array.includes()", () => {
    testJavaScript(
      "returns true when found",
      `
let arr = [10, 20, 30];
let result = arr.includes(20);
    `,
      { expectedValue: true }
    );

    testJavaScript(
      "returns false when not found",
      `
let arr = [10, 20, 30];
let result = arr.includes(99);
    `,
      { expectedValue: false }
    );

    testJavaScript(
      "with fromIndex",
      `
let arr = [10, 20, 30, 20];
let result = arr.includes(20, 2);
    `,
      { expectedValue: true }
    );

    testJavaScript(
      "with negative fromIndex",
      `
let arr = [10, 20, 30, 40];
let result = arr.includes(20, -2);
    `,
      { expectedValue: false }
    );

    testJavaScript(
      "with strings",
      `
let arr = ["a", "b", "c"];
let result = arr.includes("b");
    `,
      { expectedValue: true }
    );

    testJavaScript(
      "on empty array",
      `
let arr = [];
let result = arr.includes(1);
    `,
      { expectedValue: false }
    );

    testJavaScript(
      "with boolean true",
      `
let arr = [true, false, true];
let result = arr.includes(true);
    `,
      { expectedValue: true }
    );

    testJavaScript(
      "with fromIndex beyond array length",
      `
let arr = [1, 2, 3];
let result = arr.includes(2, 10);
    `,
      { expectedValue: false }
    );

    testJavaScript(
      "with very negative fromIndex",
      `
let arr = [1, 2, 3];
let result = arr.includes(1, -1000);
    `,
      { expectedValue: true }
    );
  });

  describe("array.slice()", () => {
    testJavaScript(
      "with start and end",
      `
let arr = [10, 20, 30, 40, 50];
let sliced = arr.slice(1, 3);
let result = sliced.length;
    `,
      { expectedValue: 2 }
    );

    testJavaScript(
      "with only start",
      `
let arr = [10, 20, 30, 40];
let sliced = arr.slice(2);
let result = sliced.length;
    `,
      { expectedValue: 2 }
    );

    testJavaScript(
      "with no arguments",
      `
let arr = [10, 20, 30];
let sliced = arr.slice();
let result = sliced.length;
    `,
      { expectedValue: 3 }
    );

    testJavaScript(
      "with negative start",
      `
let arr = [10, 20, 30, 40, 50];
let sliced = arr.slice(-3);
let result = sliced[0];
    `,
      { expectedValue: 30 }
    );

    testJavaScript(
      "with negative start and end",
      `
let arr = [10, 20, 30, 40, 50];
let sliced = arr.slice(-3, -1);
let result = sliced.length;
    `,
      { expectedValue: 2 }
    );

    testJavaScript(
      "returns correct elements",
      `
let arr = [10, 20, 30, 40];
let sliced = arr.slice(1, 3);
let result = sliced[0];
    `,
      { expectedValue: 20 }
    );

    testJavaScript(
      "does not mutate original",
      `
let arr = [10, 20, 30];
let sliced = arr.slice(1);
let result = arr.length;
    `,
      { expectedValue: 3 }
    );
  });

  describe("array.concat()", () => {
    testJavaScript(
      "concatenates two arrays",
      `
let arr1 = [1, 2];
let arr2 = [3, 4];
let concatenated = arr1.concat(arr2);
let result = concatenated.length;
    `,
      { expectedValue: 4 }
    );

    testJavaScript(
      "concatenates multiple arrays",
      `
let arr1 = [1];
let arr2 = [2];
let arr3 = [3];
let concatenated = arr1.concat(arr2, arr3);
let result = concatenated.length;
    `,
      { expectedValue: 3 }
    );

    testJavaScript(
      "concatenates with values",
      `
let arr = [1, 2];
let concatenated = arr.concat(3, 4);
let result = concatenated.length;
    `,
      { expectedValue: 4 }
    );

    testJavaScript(
      "with no arguments",
      `
let arr = [1, 2, 3];
let concatenated = arr.concat();
let result = concatenated.length;
    `,
      { expectedValue: 3 }
    );

    testJavaScript(
      "returns correct values",
      `
let arr1 = [1, 2];
let arr2 = [3, 4];
let concatenated = arr1.concat(arr2);
let result = concatenated[2];
    `,
      { expectedValue: 3 }
    );

    testJavaScript(
      "does not mutate original",
      `
let arr1 = [1, 2];
let arr2 = [3, 4];
let concatenated = arr1.concat(arr2);
let result = arr1.length;
    `,
      { expectedValue: 2 }
    );

    testJavaScript(
      "mixed arrays and values",
      `
let arr = [1];
let concatenated = arr.concat([2, 3], 4, [5]);
let result = concatenated.length;
    `,
      { expectedValue: 5 }
    );
  });

  describe("array.join()", () => {
    testJavaScript(
      "with default separator",
      `
let arr = [1, 2, 3];
let result = arr.join();
    `,
      { expectedValue: "1,2,3" }
    );

    testJavaScript(
      "with custom separator",
      `
let arr = [1, 2, 3];
let result = arr.join("-");
    `,
      { expectedValue: "1-2-3" }
    );

    testJavaScript(
      "with empty separator",
      `
let arr = ["a", "b", "c"];
let result = arr.join("");
    `,
      { expectedValue: "abc" }
    );

    testJavaScript(
      "with space separator",
      `
let arr = ["hello", "world"];
let result = arr.join(" ");
    `,
      { expectedValue: "hello world" }
    );

    testJavaScript(
      "empty array",
      `
let arr = [];
let result = arr.join(",");
    `,
      { expectedValue: "" }
    );

    testJavaScript(
      "single element string",
      `
let arr = ["hello"];
let result = arr.join(",");
    `,
      { expectedValue: "hello" }
    );

    testJavaScript(
      "with numbers",
      `
let arr = [1, 2, 3, 4, 5];
let result = arr.join(" + ");
    `,
      { expectedValue: "1 + 2 + 3 + 4 + 5" }
    );

    testJavaScript(
      "with mixed types",
      `
let arr = [1, "two", 3];
let result = arr.join(", ");
    `,
      { expectedValue: "1, two, 3" }
    );

    testJavaScript(
      "with null and undefined",
      `
let arr = [1, null, undefined, 2];
let result = arr.join(",");
    `,
      { expectedValue: "1,,,2" }
    );
  });
});
