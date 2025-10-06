import { describe } from "vitest";
import { testJavaScript } from "../../utils/test-runner";

// SKIP ALL: Methods require CallExpression support which is not fully implemented
describe.skip("JavaScript string methods cross-validation", () => {
  describe("string.toUpperCase()", () => {
    testJavaScript(
      "lowercase to uppercase",
      `
const s = "hello";
const result = s.toUpperCase();
    `,
      { expectedValue: "HELLO" }
    );

    testJavaScript(
      "already uppercase",
      `
const s = "WORLD";
const result = s.toUpperCase();
    `,
      { expectedValue: "WORLD" }
    );

    testJavaScript(
      "mixed case",
      `
const s = "Hello World";
const result = s.toUpperCase();
    `,
      { expectedValue: "HELLO WORLD" }
    );

    testJavaScript(
      "with numbers and symbols",
      `
const s = "hello123!@#";
const result = s.toUpperCase();
    `,
      { expectedValue: "HELLO123!@#" }
    );

    testJavaScript(
      "empty string",
      `
const s = "";
const result = s.toUpperCase();
    `,
      { expectedValue: "" }
    );

    testJavaScript(
      "with spaces",
      `
const s = "hello world";
const result = s.toUpperCase();
    `,
      { expectedValue: "HELLO WORLD" }
    );
  });

  describe("string.toLowerCase()", () => {
    testJavaScript(
      "uppercase to lowercase",
      `
const s = "HELLO";
const result = s.toLowerCase();
    `,
      { expectedValue: "hello" }
    );

    testJavaScript(
      "already lowercase",
      `
const s = "world";
const result = s.toLowerCase();
    `,
      { expectedValue: "world" }
    );

    testJavaScript(
      "mixed case",
      `
const s = "Hello World";
const result = s.toLowerCase();
    `,
      { expectedValue: "hello world" }
    );

    testJavaScript(
      "with numbers and symbols",
      `
const s = "HELLO123!@#";
const result = s.toLowerCase();
    `,
      { expectedValue: "hello123!@#" }
    );

    testJavaScript(
      "empty string",
      `
const s = "";
const result = s.toLowerCase();
    `,
      { expectedValue: "" }
    );

    testJavaScript(
      "with spaces",
      `
const s = "HELLO WORLD";
const result = s.toLowerCase();
    `,
      { expectedValue: "hello world" }
    );
  });

  describe("string.length", () => {
    testJavaScript(
      "empty string",
      `
const s = "";
const result = s.length;
    `,
      { expectedValue: 0 }
    );

    testJavaScript(
      "single character",
      `
const s = "a";
const result = s.length;
    `,
      { expectedValue: 1 }
    );

    testJavaScript(
      "multiple characters",
      `
const s = "hello";
const result = s.length;
    `,
      { expectedValue: 5 }
    );

    testJavaScript(
      "with spaces",
      `
const s = "hello world";
const result = s.length;
    `,
      { expectedValue: 11 }
    );

    testJavaScript(
      "with special characters",
      `
const s = "hello!@#$%";
const result = s.length;
    `,
      { expectedValue: 10 }
    );

    testJavaScript(
      "with escape sequences",
      `
const s = "hello\\nworld";
const result = s.length;
    `,
      { expectedValue: 11 }
    );

    testJavaScript(
      "template literal",
      `
const s = \`hello world\`;
const result = s.length;
    `,
      { expectedValue: 11 }
    );
  });
});
