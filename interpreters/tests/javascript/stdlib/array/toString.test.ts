import { expect, test, describe } from "vitest";
import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

describe("toString() method", () => {
  test("converts array to comma-separated string", () => {
    const result = interpret(`
        let arr = [1, 2, 3];
        let str = arr.toString();
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe("1,2,3");
  });

  test("converts empty array to empty string", () => {
    const result = interpret(`
        let arr = [];
        let str = arr.toString();
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe("");
  });

  test("converts array with strings", () => {
    const result = interpret(`
        let arr = ["a", "b", "c"];
        let str = arr.toString();
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe("a,b,c");
  });

  test("requires no arguments", () => {
    const result = interpret(`
        let arr = [1, 2, 3];
        arr.toString(1);
      `);
    expect(result.error).toBeNull();
    const errorFrame = result.frames.find(f => f.status === "ERROR");
    expect(errorFrame).toBeDefined();
    expect(errorFrame?.error?.type).toBe("InvalidNumberOfArguments");
  });
});
