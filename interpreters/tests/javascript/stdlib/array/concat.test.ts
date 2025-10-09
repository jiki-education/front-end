import { expect, test, describe } from "vitest";
import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

describe("concat() method", () => {
  test("concatenates two arrays", () => {
    const result = interpret(`
        let arr1 = [1, 2];
        let arr2 = [3, 4];
        let result = arr1.concat(arr2);
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value.length).toBe(4);
    expect(lastFrame.result?.jikiObject?.value[2].value).toBe(3);
  });

  test("concatenates multiple arrays", () => {
    const result = interpret(`
        let arr1 = [1];
        let arr2 = [2];
        let arr3 = [3];
        let result = arr1.concat(arr2, arr3);
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value.length).toBe(3);
  });

  test("concatenates with non-array values", () => {
    const result = interpret(`
        let arr = [1, 2];
        let result = arr.concat(3, 4);
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value.length).toBe(4);
    expect(lastFrame.result?.jikiObject?.value[2].value).toBe(3);
  });

  test("works with no arguments", () => {
    const result = interpret(`
        let arr = [1, 2, 3];
        let result = arr.concat();
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value.length).toBe(3);
  });

  test("does not mutate original array", () => {
    const result = interpret(`
        let arr1 = [1, 2];
        let arr2 = [3, 4];
        let result = arr1.concat(arr2);
        arr1.length;
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(2);
  });
});
