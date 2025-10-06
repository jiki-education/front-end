import { describe } from "vitest";
import { testPython } from "../../utils/test-runner";

describe("Python string methods cross-validation", () => {
  describe("str.upper()", () => {
    testPython(
      "lowercase to uppercase",
      `
s = "hello"
result = s.upper()
    `,
      { expectedValue: "HELLO" }
    );

    testPython(
      "already uppercase",
      `
s = "WORLD"
result = s.upper()
    `,
      { expectedValue: "WORLD" }
    );

    testPython(
      "mixed case",
      `
s = "Hello World"
result = s.upper()
    `,
      { expectedValue: "HELLO WORLD" }
    );

    testPython(
      "with numbers and symbols",
      `
s = "hello123!@#"
result = s.upper()
    `,
      { expectedValue: "HELLO123!@#" }
    );

    testPython(
      "empty string",
      `
s = ""
result = s.upper()
    `,
      { expectedValue: "" }
    );

    testPython(
      "with spaces",
      `
s = "hello world"
result = s.upper()
    `,
      { expectedValue: "HELLO WORLD" }
    );
  });

  describe("str.lower()", () => {
    testPython(
      "uppercase to lowercase",
      `
s = "HELLO"
result = s.lower()
    `,
      { expectedValue: "hello" }
    );

    testPython(
      "already lowercase",
      `
s = "world"
result = s.lower()
    `,
      { expectedValue: "world" }
    );

    testPython(
      "mixed case",
      `
s = "Hello World"
result = s.lower()
    `,
      { expectedValue: "hello world" }
    );

    testPython(
      "with numbers and symbols",
      `
s = "HELLO123!@#"
result = s.lower()
    `,
      { expectedValue: "hello123!@#" }
    );

    testPython(
      "empty string",
      `
s = ""
result = s.lower()
    `,
      { expectedValue: "" }
    );

    testPython(
      "with spaces",
      `
s = "HELLO WORLD"
result = s.lower()
    `,
      { expectedValue: "hello world" }
    );
  });

  // SKIPPED: Requires len() builtin implementation
  describe.skip("len(string)", () => {
    testPython(
      "empty string",
      `
s = ""
result = len(s)
    `,
      { expectedValue: 0 }
    );

    testPython(
      "single character",
      `
s = "a"
result = len(s)
    `,
      { expectedValue: 1 }
    );

    testPython(
      "multiple characters",
      `
s = "hello"
result = len(s)
    `,
      { expectedValue: 5 }
    );

    testPython(
      "with spaces",
      `
s = "hello world"
result = len(s)
    `,
      { expectedValue: 11 }
    );

    testPython(
      "with special characters",
      `
s = "hello!@#$%"
result = len(s)
    `,
      { expectedValue: 10 }
    );

    testPython(
      "with newlines",
      `
s = "hello\\nworld"
result = len(s)
    `,
      { expectedValue: 11 }
    );
  });
});
