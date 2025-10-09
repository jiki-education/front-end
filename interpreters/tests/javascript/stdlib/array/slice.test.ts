import { expect, test, describe } from "vitest";
import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

describe("slice() method", () => {
  test("slices from start to end", () => {
    const result = interpret(`
        let arr = [10, 20, 30, 40, 50];
        let sliced = arr.slice(1, 3);
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value.length).toBe(2);
    expect(lastFrame.result?.jikiObject?.value[0].value).toBe(20);
    expect(lastFrame.result?.jikiObject?.value[1].value).toBe(30);
  });

  test("slices from start to array end when no end parameter", () => {
    const result = interpret(`
        let arr = [10, 20, 30, 40];
        let sliced = arr.slice(2);
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value.length).toBe(2);
    expect(lastFrame.result?.jikiObject?.value[0].value).toBe(30);
  });

  test("returns shallow copy when no parameters", () => {
    const result = interpret(`
        let arr = [10, 20, 30];
        let sliced = arr.slice();
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value.length).toBe(3);
  });

  test("supports negative indices", () => {
    const result = interpret(`
        let arr = [10, 20, 30, 40, 50];
        let sliced = arr.slice(-3, -1);
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value.length).toBe(2);
    expect(lastFrame.result?.jikiObject?.value[0].value).toBe(30);
  });

  test("does not mutate original array", () => {
    const result = interpret(`
        let arr = [10, 20, 30];
        let sliced = arr.slice(1);
        arr.length;
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(3);
  });
});
