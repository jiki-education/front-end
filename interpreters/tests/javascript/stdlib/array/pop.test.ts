import { expect, test, describe } from "vitest";
import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

describe("pop() method", () => {
  test("removes and returns last element", () => {
    const result = interpret(`
        let arr = [1, 2, 3];
        let last = arr.pop();
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(3);
    expect(lastFrame.variables?.arr.value.length).toBe(2);
  });

  test("returns undefined for empty array", () => {
    const result = interpret(`
        let arr = [];
        let last = arr.pop();
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBeUndefined();
    expect(lastFrame.variables?.arr.value.length).toBe(0);
  });

  test("requires no arguments", () => {
    const result = interpret(`
        let arr = [1, 2, 3];
        arr.pop(1);
      `);
    expect(result.error).toBeNull();
    const errorFrame = result.frames.find(f => f.status === "ERROR");
    expect(errorFrame).toBeDefined();
    expect(errorFrame?.error?.type).toBe("InvalidNumberOfArguments");
  });
});
