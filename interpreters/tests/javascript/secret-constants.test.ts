import { describe, it, expect } from "vitest";
import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

function lastFrameVariable(result: ReturnType<typeof interpret>, name: string) {
  const frame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
  return frame.variables?.[name];
}

describe("JavaScript secretConstants", () => {
  it("exposes secret constants as top-level variables", () => {
    const result = interpret(`let area = radius * 2;`, {
      secretConstants: { radius: 10 },
    });
    expect(result.error).toBeNull();
    expect(result.success).toBe(true);
    expect(lastFrameVariable(result, "area")?.value).toBe(20);
  });

  it("silently ignores a top-level `let` that shadows a secret constant", () => {
    const result = interpret(
      `let radius = 20;
let area = radius;`,
      { secretConstants: { radius: 10 } }
    );
    expect(result.error).toBeNull();
    expect(result.success).toBe(true);
    expect(lastFrameVariable(result, "area")?.value).toBe(10);
  });

  it("silently ignores a top-level `const` that shadows a secret constant", () => {
    const result = interpret(
      `const radius = 20;
let area = radius;`,
      { secretConstants: { radius: 10 } }
    );
    expect(result.error).toBeNull();
    expect(lastFrameVariable(result, "area")?.value).toBe(10);
  });

  it("silently ignores reassignment of a secret constant", () => {
    const result = interpret(
      `radius = 20;
let area = radius;`,
      { secretConstants: { radius: 10 } }
    );
    expect(result.error).toBeNull();
    expect(result.success).toBe(true);
    expect(lastFrameVariable(result, "area")?.value).toBe(10);
  });

  it("silently ignores increment/decrement of a secret constant", () => {
    const result = interpret(
      `radius++;
radius--;
let area = radius;`,
      { secretConstants: { radius: 10 } }
    );
    expect(result.error).toBeNull();
    expect(result.success).toBe(true);
    expect(lastFrameVariable(result, "area")?.value).toBe(10);
  });

  it("allows an inner-scope `let` to shadow a secret constant locally", () => {
    const result = interpret(
      `let outer = radius;
{
  let radius = 99;
  outer = radius;
}
let after = radius;`,
      { secretConstants: { radius: 10 }, languageFeatures: { allowShadowing: true } }
    );
    expect(result.error).toBeNull();
    expect(result.success).toBe(true);
    // Inner shadow took effect, then went out of scope; top-level remains 10.
    expect(lastFrameVariable(result, "outer")?.value).toBe(99);
    expect(lastFrameVariable(result, "after")?.value).toBe(10);
  });

  it("supports string secret constants", () => {
    const result = interpret(`let greeting = name + "!";`, {
      secretConstants: { name: "Hi" },
    });
    expect(result.error).toBeNull();
    expect(lastFrameVariable(result, "greeting")?.value).toBe("Hi!");
  });
});
