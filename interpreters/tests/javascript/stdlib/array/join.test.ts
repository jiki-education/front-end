import { expect, test, describe } from "vitest";
import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

describe("join() method", () => {
  test("joins with default comma separator", () => {
    const result = interpret(`
        let arr = [1, 2, 3];
        let result = arr.join();
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe("1,2,3");
  });

  test("joins with custom separator", () => {
    const result = interpret(`
        let arr = [1, 2, 3];
        let result = arr.join("-");
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe("1-2-3");
  });

  test("joins with empty string separator", () => {
    const result = interpret(`
        let arr = ["a", "b", "c"];
        let result = arr.join("");
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe("abc");
  });

  test("joins empty array", () => {
    const result = interpret(`
        let arr = [];
        let result = arr.join(",");
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe("");
  });

  test("requires separator to be a string if provided", () => {
    const result = interpret(`
        let arr = [1, 2, 3];
        arr.join(5);
      `);
    expect(result.error).toBeNull();
    const errorFrame = result.frames.find(f => f.status === "ERROR");
    expect(errorFrame).toBeDefined();
    expect(errorFrame?.error?.type).toBe("TypeError");
  });
});
