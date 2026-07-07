import { interpret } from "@javascript/interpreter";
import { JSClass } from "@javascript/jsObjects/JSClass";
import type { JSInstance } from "@javascript/jsObjects/JSInstance";
import type { JikiObject } from "@javascript/jsObjects";
import type { ExecutionContext } from "@javascript/executor";
import { describe, test, expect } from "vitest";

// These errors were promoted out of the generic TypeError into their own keys.
// Tests run in the "system" language (see tests/setup.ts), so each assertion
// checks the machine-readable system message, following the normal pattern.
function errorFrame(code: string, context = {}) {
  const { frames } = interpret(code, context);
  return frames.find(f => f.status === "ERROR");
}

describe("promoted TypeError keys (system messages)", () => {
  test("ArrayIndexNotNumber", () => {
    const f = errorFrame('let a = [1, 2];\nlet x = a["hello"];');
    expect(f?.error?.type).toBe("ArrayIndexNotNumber");
    expect(f?.error?.message).toBe("ArrayIndexNotNumber");
  });

  test("ArrayIndexNotInteger", () => {
    const f = errorFrame("let a = [1, 2];\nlet x = a[1.5];");
    expect(f?.error?.type).toBe("ArrayIndexNotInteger");
    expect(f?.error?.message).toBe("ArrayIndexNotInteger");
  });

  test("StringIndexNotNumber", () => {
    const f = errorFrame('let s = "hi";\nlet x = s["bad"];');
    expect(f?.error?.type).toBe("StringIndexNotNumber");
    expect(f?.error?.message).toBe("StringIndexNotNumber");
  });

  test("StringIndexNotInteger", () => {
    const f = errorFrame('let s = "hi";\nlet x = s[1.5];');
    expect(f?.error?.type).toBe("StringIndexNotInteger");
    expect(f?.error?.message).toBe("StringIndexNotInteger");
  });

  test("ComputedAccessNotAllowedForStdlib", () => {
    const f = errorFrame('let a = [1, 2];\nlet x = a["length"];');
    expect(f?.error?.type).toBe("ComputedAccessNotAllowedForStdlib");
    expect(f?.error?.message).toBe("ComputedAccessNotAllowedForStdlib");
  });

  test("ComputedAccessNotAllowedForBuiltin", () => {
    const f = errorFrame('let x = Math["max"];');
    expect(f?.error?.type).toBe("ComputedAccessNotAllowedForBuiltin");
    expect(f?.error?.message).toBe("ComputedAccessNotAllowedForBuiltin");
  });

  test("CannotReadPropertiesOfType", () => {
    const f = errorFrame("let n = 42;\nn.property;");
    expect(f?.error?.type).toBe("CannotReadPropertiesOfType");
    expect(f?.error?.message).toBe("CannotReadPropertiesOfType: type: number");
  });

  test("NotCallable", () => {
    const f = errorFrame("let n = 42;\nn();");
    expect(f?.error?.type).toBe("NotCallable");
    expect(f?.error?.message).toBe("NotCallable: callableType: number");
  });

  test("CannotSetPropertyOfType", () => {
    const f = errorFrame('let n = 42;\nn.property = "x";');
    expect(f?.error?.type).toBe("CannotSetPropertyOfType");
    expect(f?.error?.message).toBe("CannotSetPropertyOfType: type: number");
  });

  test("BracketNotationNotAllowedOnInstance", () => {
    const Point = new JSClass("Point");
    Point.addConstructor(function (_: ExecutionContext, instance: JSInstance, x: JikiObject) {
      instance.setField("x", x);
    });
    Point.addGetter("x", "public");

    const f = errorFrame('let p = new Point(5);\np["x"];', { classes: [Point] });
    expect(f?.error?.type).toBe("BracketNotationNotAllowedOnInstance");
    expect(f?.error?.message).toBe("BracketNotationNotAllowedOnInstance");
  });
});
