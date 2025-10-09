import { expect, test, describe } from "vitest";
import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

describe("sort() method", () => {
  test("sorts numbers lexicographically", () => {
    const result = interpret(`
        let arr = [3, 1, 4, 1, 5];
        arr.sort();
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value[0].value).toBe(1);
    expect(lastFrame.result?.jikiObject?.value[1].value).toBe(1);
    expect(lastFrame.result?.jikiObject?.value[2].value).toBe(3);
  });

  test("sorts strings alphabetically", () => {
    const result = interpret(`
        let arr = ["banana", "apple", "cherry"];
        arr.sort();
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value[0].value).toBe("apple");
    expect(lastFrame.result?.jikiObject?.value[1].value).toBe("banana");
    expect(lastFrame.result?.jikiObject?.value[2].value).toBe("cherry");
  });

  test("sorts in place and returns the array", () => {
    const result = interpret(`
        let arr = [3, 1, 2];
        let sorted = arr.sort();
        arr.length;
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(3);
    expect(lastFrame.variables?.arr.value[0].value).toBe(1);
  });

  test("sorts empty array", () => {
    const result = interpret(`
        let arr = [];
        arr.sort();
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value.length).toBe(0);
  });

  test("throws logic error for custom compare function", () => {
    const result = interpret(`
        let arr = [3, 1, 2];
        let compareFn = 5;
        arr.sort(compareFn);
      `);
    expect(result.error).toBeNull();
    const errorFrame = result.frames.find(f => f.status === "ERROR");
    expect(errorFrame).toBeDefined();
    expect(errorFrame?.error?.type).toBe("LogicErrorInExecution");
  });
});
