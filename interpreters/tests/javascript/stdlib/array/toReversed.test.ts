import { expect, test, describe } from "vitest";
import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

describe("toReversed() method", () => {
  test("returns a new reversed array", () => {
    const result = interpret(`
        let arr = [1, 2, 3, 4, 5];
        arr.toReversed();
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value[0].value).toBe(5);
    expect(lastFrame.result?.jikiObject?.value[4].value).toBe(1);
  });

  test("does not mutate the original array", () => {
    const result = interpret(`
        let arr = [1, 2, 3];
        let reversed = arr.toReversed();
        arr.length;
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.variables?.arr.value[0].value).toBe(1);
    expect(lastFrame.variables?.arr.value[2].value).toBe(3);
    expect(lastFrame.variables?.reversed.value[0].value).toBe(3);
    expect(lastFrame.variables?.reversed.value[2].value).toBe(1);
  });

  test("reverses empty array", () => {
    const result = interpret(`
        let arr = [];
        arr.toReversed();
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value.length).toBe(0);
  });

  test("reverses single element array", () => {
    const result = interpret(`
        let arr = [42];
        arr.toReversed();
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value[0].value).toBe(42);
  });

  test("requires no arguments", () => {
    const result = interpret(`
        let arr = [1, 2, 3];
        arr.toReversed(1);
      `);
    expect(result.error).toBeNull();
    const errorFrame = result.frames.find(f => f.status === "ERROR");
    expect(errorFrame).toBeDefined();
    expect(errorFrame?.error?.type).toBe("InvalidNumberOfArguments");
  });
});
