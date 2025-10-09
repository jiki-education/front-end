import { describe, expect, test } from "vitest";
import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

describe("String computed access", () => {
  test("gives runtime error when using computed access for methods", () => {
    const result = interpret(`
      let str = "hello";
      str["charAt"];
    `);

    expect(result.success).toBe(false);
    expect(result.error).toBe(null);
    const errorFrame = result.frames.find(f => (f as TestAugmentedFrame).status === "ERROR");
    expect(errorFrame).toBeDefined();
    expect((errorFrame as TestAugmentedFrame)?.error?.message).toBe(
      "TypeError: message: Cannot use computed property access for stdlib members"
    );
  });
});
