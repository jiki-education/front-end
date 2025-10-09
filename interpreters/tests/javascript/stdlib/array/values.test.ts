import { expect, test, describe } from "vitest";
import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

describe("Array values() method", () => {
  test("returns iterator with array values", () => {
    const result = interpret(`
      let arr = [10, 20, 30];
      let iter = arr.values();
    `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.type).toBe("iterator");
  });

  test("requires no arguments", () => {
    const result = interpret(`
      let arr = [1, 2, 3];
      arr.values(1);
    `);
    expect(result.error).toBeNull();
    const errorFrame = result.frames.find(f => f.status === "ERROR");
    expect(errorFrame).toBeDefined();
    expect(errorFrame?.error?.type).toBe("InvalidNumberOfArguments");
  });
});
