import { expect, test, describe } from "vitest";
import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

describe("fill() method", () => {
  test("fills entire array with value", () => {
    const result = interpret(`
        let arr = [1, 2, 3, 4];
        arr.fill(0);
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value[0].value).toBe(0);
    expect(lastFrame.result?.jikiObject?.value[3].value).toBe(0);
  });

  test("fills from start index to end", () => {
    const result = interpret(`
        let arr = [1, 2, 3, 4];
        arr.fill(0, 2);
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value[0].value).toBe(1);
    expect(lastFrame.result?.jikiObject?.value[2].value).toBe(0);
    expect(lastFrame.result?.jikiObject?.value[3].value).toBe(0);
  });

  test("fills from start to end index", () => {
    const result = interpret(`
        let arr = [1, 2, 3, 4];
        arr.fill(0, 1, 3);
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value[0].value).toBe(1);
    expect(lastFrame.result?.jikiObject?.value[1].value).toBe(0);
    expect(lastFrame.result?.jikiObject?.value[2].value).toBe(0);
    expect(lastFrame.result?.jikiObject?.value[3].value).toBe(4);
  });

  test("fills in place and returns the array", () => {
    const result = interpret(`
        let arr = [1, 2, 3];
        let filled = arr.fill(9);
        arr.length;
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.variables?.arr.value[0].value).toBe(9);
  });

  test("requires at least one argument", () => {
    const result = interpret(`
        let arr = [1, 2, 3];
        arr.fill();
      `);
    expect(result.error).toBeNull();
    const errorFrame = result.frames.find(f => f.status === "ERROR");
    expect(errorFrame).toBeDefined();
    expect(errorFrame?.error?.type).toBe("InvalidNumberOfArguments");
  });
});
