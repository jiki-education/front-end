import { describe, it, expect } from "vitest";
import { interpret } from "../../src/javascript/interpreter";
import type { ExternalFunction } from "../../src/shared/interfaces";
import type { ExecutionContext } from "../../src/javascript/executor";
import { JSNumber, JSString, JSBoolean, type JikiObject } from "../../src/javascript/jsObjects";

// Helper to extract description text from HTML
function extractText(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

describe("JavaScript Call Descriptions", () => {
  it("should describe standalone function calls", () => {
    const testFunc: ExternalFunction = {
      name: "testFunc",
      func: (context: ExecutionContext) => new JSNumber(42),
      description: "test function",
      arity: 0,
    };

    const result = interpret(`testFunc();`, {
      externalFunctions: [testFunc],
    });

    expect(result.error).toBeNull();
    expect(result.frames).toHaveLength(1);

    const frame = result.frames[0];
    if (frame.generateDescription) {
      const description = frame.generateDescription();

      // JavaScript should now say "JavaScript used the testFunc function"
      expect(description).toContain("JavaScript used the");
      expect(description).toContain("testFunc");
      expect(description).toContain("function");
      expect(description).toContain("got");
      expect(description).toContain("42");

      // Steps should include function lookup and call
      expect(description).toContain("Looked up the function");
      expect(description).toContain("testFunc");
      expect(description).toContain("Called");
      expect(description).toContain("got");
      expect(description).toContain("42");
    }
  });

  it("should describe function calls with arguments", () => {
    const add: ExternalFunction = {
      name: "add",
      func: (context: ExecutionContext, a: JikiObject, b: JikiObject) => {
        if (!(a instanceof JSNumber) || !(b instanceof JSNumber)) {
          throw new Error("add expects numbers");
        }
        return new JSNumber(a.value + b.value);
      },
      description: "adds numbers",
      arity: 2,
    };

    const result = interpret(`add(2, 3);`, {
      externalFunctions: [add],
    });

    expect(result.error).toBeNull();
    expect(result.frames).toHaveLength(1);

    const frame = result.frames[0];
    if (frame.generateDescription) {
      const description = frame.generateDescription();
      expect(description).toContain("add");
      expect(description).toContain("2 argument");
    }
  });

  it("should describe function calls in compound expressions", () => {
    const double: ExternalFunction = {
      name: "double",
      func: (context: ExecutionContext, n: JikiObject) => {
        if (!(n instanceof JSNumber)) {
          throw new Error("double expects a number");
        }
        return new JSNumber(n.value * 2);
      },
      description: "doubles a number",
      arity: 1,
    };

    const result = interpret(`let x = double(5) + 3;`, {
      externalFunctions: [double],
    });

    expect(result.error).toBeNull();
    expect(result.frames).toHaveLength(1);

    const frame = result.frames[0];
    if (frame.generateDescription) {
      const description = frame.generateDescription();
      // Should describe the variable assignment and the function call
      expect(description).toContain("double");
      expect(description).toContain("x");
    }
  });

  it("should describe function calls in if conditions", () => {
    const isEven: ExternalFunction = {
      name: "isEven",
      func: (context: ExecutionContext, n: JikiObject) => {
        if (!(n instanceof JSNumber)) {
          throw new Error("isEven expects a number");
        }
        return new JSBoolean(n.value % 2 === 0);
      },
      description: "checks if even",
      arity: 1,
    };

    const result = interpret(
      `
      if (isEven(4)) {
        let x = 1;
      }
    `,
      {
        externalFunctions: [isEven],
      }
    );

    expect(result.error).toBeNull();
    const ifFrame = result.frames[0];

    if (ifFrame.generateDescription) {
      const description = ifFrame.generateDescription();
      // Should mention the function call in the condition
      expect(description).toContain("isEven");
      expect(description).toContain("condition");
    }
  });

  it("should describe complex argument expressions", () => {
    const foobar: ExternalFunction = {
      name: "foobar",
      func: (context: ExecutionContext, n: JikiObject) => {
        if (!(n instanceof JSNumber)) {
          throw new Error("foobar expects a number");
        }
        return new JSNumber(n.value * 10);
      },
      description: "multiplies by 10",
      arity: 1,
    };

    const result = interpret(`foobar(1 + 2);`, {
      externalFunctions: [foobar],
    });

    expect(result.error).toBeNull();
    expect(result.frames).toHaveLength(1);

    const frame = result.frames[0];
    if (frame.generateDescription) {
      const description = frame.generateDescription();

      // Should describe evaluating 1 + 2 first
      expect(description).toContain("1 + 2");
      expect(description).toContain("3");

      // Then calling foobar with the result
      expect(description).toContain("Called");
      expect(description).toContain("foobar");
      expect(description).toContain("with");
      expect(description).toContain("3");
      expect(description).toContain("got");
      expect(description).toContain("30");
    }
  });
});
