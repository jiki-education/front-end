import { expect, test, describe } from "vitest";
import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

describe("includes() method", () => {
  test("returns true when element found", () => {
    const result = interpret(`
        let arr = [10, 20, 30];
        let found = arr.includes(20);
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(true);
  });

  test("returns false when element not found", () => {
    const result = interpret(`
        let arr = [10, 20, 30];
        let found = arr.includes(99);
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(false);
  });

  test("supports fromIndex parameter", () => {
    const result = interpret(`
        let arr = [10, 20, 30, 20];
        let found = arr.includes(20, 2);
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(true);
  });

  test("supports negative fromIndex", () => {
    const result = interpret(`
        let arr = [10, 20, 30, 40];
        let found = arr.includes(20, -2);
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(false);
  });

  test("requires at least one argument", () => {
    const result = interpret(`
        let arr = [1, 2, 3];
        arr.includes();
      `);
    expect(result.error).toBeNull();
    const errorFrame = result.frames.find(f => f.status === "ERROR");
    expect(errorFrame).toBeDefined();
    expect(errorFrame?.error?.type).toBe("InvalidNumberOfArguments");
  });
});
