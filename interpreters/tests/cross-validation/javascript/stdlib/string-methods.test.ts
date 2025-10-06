import { describe } from "vitest";
import { testJavaScript } from "../../utils/test-runner";

describe("JavaScript string methods cross-validation", () => {
  describe("string.toUpperCase()", () => {
    testJavaScript(
      "lowercase to uppercase",
      `
let s = "hello";
let result = s.toUpperCase();
    `,
      { expectedValue: "HELLO" }
    );

    testJavaScript(
      "already uppercase",
      `
let s = "WORLD";
let result = s.toUpperCase();
    `,
      { expectedValue: "WORLD" }
    );

    testJavaScript(
      "mixed case",
      `
let s = "Hello World";
let result = s.toUpperCase();
    `,
      { expectedValue: "HELLO WORLD" }
    );

    testJavaScript(
      "with numbers and symbols",
      `
let s = "hello123!@#";
let result = s.toUpperCase();
    `,
      { expectedValue: "HELLO123!@#" }
    );

    testJavaScript(
      "empty string",
      `
let s = "";
let result = s.toUpperCase();
    `,
      { expectedValue: "" }
    );

    testJavaScript(
      "with spaces",
      `
let s = "hello world";
let result = s.toUpperCase();
    `,
      { expectedValue: "HELLO WORLD" }
    );
  });

  describe("string.toLowerCase()", () => {
    testJavaScript(
      "uppercase to lowercase",
      `
let s = "HELLO";
let result = s.toLowerCase();
    `,
      { expectedValue: "hello" }
    );

    testJavaScript(
      "already lowercase",
      `
let s = "world";
let result = s.toLowerCase();
    `,
      { expectedValue: "world" }
    );

    testJavaScript(
      "mixed case",
      `
let s = "Hello World";
let result = s.toLowerCase();
    `,
      { expectedValue: "hello world" }
    );

    testJavaScript(
      "with numbers and symbols",
      `
let s = "HELLO123!@#";
let result = s.toLowerCase();
    `,
      { expectedValue: "hello123!@#" }
    );

    testJavaScript(
      "empty string",
      `
let s = "";
let result = s.toLowerCase();
    `,
      { expectedValue: "" }
    );

    testJavaScript(
      "with spaces",
      `
let s = "HELLO WORLD";
let result = s.toLowerCase();
    `,
      { expectedValue: "hello world" }
    );
  });

  describe("string.length", () => {
    testJavaScript(
      "empty string",
      `
let s = "";
let result = s.length;
    `,
      { expectedValue: 0 }
    );

    testJavaScript(
      "single character",
      `
let s = "a";
let result = s.length;
    `,
      { expectedValue: 1 }
    );

    testJavaScript(
      "multiple characters",
      `
let s = "hello";
let result = s.length;
    `,
      { expectedValue: 5 }
    );

    testJavaScript(
      "with spaces",
      `
let s = "hello world";
let result = s.length;
    `,
      { expectedValue: 11 }
    );

    testJavaScript(
      "with special characters",
      `
let s = "hello!@#$%";
let result = s.length;
    `,
      { expectedValue: 10 }
    );

    testJavaScript(
      "with escape sequences",
      `
let s = "hello\\nworld";
let result = s.length;
    `,
      { expectedValue: 11 }
    );

    testJavaScript(
      "template literal",
      `
let s = \`hello world\`;
let result = s.length;
    `,
      { expectedValue: 11 }
    );
  });
});
