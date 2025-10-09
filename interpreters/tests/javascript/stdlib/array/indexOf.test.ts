import { expect, test, describe } from "vitest";
import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

describe("indexOf() method", () => {
  test("finds element at beginning", () => {
    const result = interpret(`
        let arr = [10, 20, 30];
        let idx = arr.indexOf(10);
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(0);
  });

  test("finds element in middle", () => {
    const result = interpret(`
        let arr = [10, 20, 30];
        let idx = arr.indexOf(20);
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(1);
  });

  test("returns -1 when not found", () => {
    const result = interpret(`
        let arr = [10, 20, 30];
        let idx = arr.indexOf(99);
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(-1);
  });

  test("supports fromIndex parameter", () => {
    const result = interpret(`
        let arr = [10, 20, 30, 20];
        let idx = arr.indexOf(20, 2);
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(3);
  });

  test("supports negative fromIndex", () => {
    const result = interpret(`
        let arr = [10, 20, 30, 40];
        let idx = arr.indexOf(30, -2);
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(2);
  });

  test("requires at least one argument", () => {
    const result = interpret(`
        let arr = [1, 2, 3];
        arr.indexOf();
      `);
    expect(result.error).toBeNull();
    const errorFrame = result.frames.find(f => f.status === "ERROR");
    expect(errorFrame).toBeDefined();
    expect(errorFrame?.error?.type).toBe("InvalidNumberOfArguments");
  });
});
