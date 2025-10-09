import { expect, test, describe } from "vitest";
import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

describe("lastIndexOf() method", () => {
  test("finds last occurrence of element", () => {
    const result = interpret(`
        let arr = [1, 2, 3, 2, 1];
        let idx = arr.lastIndexOf(2);
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(3);
  });

  test("returns -1 when element not found", () => {
    const result = interpret(`
        let arr = [1, 2, 3];
        let idx = arr.lastIndexOf(99);
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(-1);
  });

  test("finds element at end", () => {
    const result = interpret(`
        let arr = [1, 2, 3, 4];
        let idx = arr.lastIndexOf(4);
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(3);
  });

  test("supports fromIndex parameter", () => {
    const result = interpret(`
        let arr = [1, 2, 3, 2, 1];
        let idx = arr.lastIndexOf(2, 2);
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(1);
  });

  test("supports negative fromIndex", () => {
    const result = interpret(`
        let arr = [1, 2, 3, 2, 1];
        let idx = arr.lastIndexOf(2, -2);
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(3);
  });

  test("handles very negative fromIndex", () => {
    const result = interpret(`
        let arr = [1, 2, 3];
        let idx = arr.lastIndexOf(2, -10);
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(-1);
  });

  test("requires at least one argument", () => {
    const result = interpret(`
        let arr = [1, 2, 3];
        arr.lastIndexOf();
      `);
    expect(result.error).toBeNull();
    const errorFrame = result.frames.find(f => f.status === "ERROR");
    expect(errorFrame).toBeDefined();
    expect(errorFrame?.error?.type).toBe("InvalidNumberOfArguments");
  });
});
