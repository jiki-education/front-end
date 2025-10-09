import { expect, test, describe } from "vitest";
import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

describe("unshift() method", () => {
  test("adds single element to beginning and returns new length", () => {
    const result = interpret(`
        let arr = [2, 3, 4];
        let len = arr.unshift(1);
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(4);
    expect(lastFrame.variables?.arr.value.length).toBe(4);
    expect(lastFrame.variables?.arr.value[0].value).toBe(1);
  });

  test("adds multiple elements to beginning", () => {
    const result = interpret(`
        let arr = [4, 5];
        let len = arr.unshift(1, 2, 3);
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(5);
    expect(lastFrame.variables?.arr.value.length).toBe(5);
    expect(lastFrame.variables?.arr.value[0].value).toBe(1);
    expect(lastFrame.variables?.arr.value[1].value).toBe(2);
  });

  test("works on empty array", () => {
    const result = interpret(`
        let arr = [];
        let len = arr.unshift(1);
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(1);
    expect(lastFrame.variables?.arr.value.length).toBe(1);
  });

  test("throws logic error with no arguments in default mode", () => {
    const result = interpret(`
        let arr = [1, 2, 3];
        arr.unshift();
      `);
    expect(result.error).toBeNull();
    const errorFrame = result.frames.find(f => f.status === "ERROR");
    expect(errorFrame).toBeDefined();
    expect(errorFrame?.error?.type).toBe("LogicErrorInExecution");
  });

  test("allows zero arguments in nativeJSMode", () => {
    const result = interpret(
      `
        let arr = [1, 2, 3];
        let result = arr.unshift();
      `,
      { languageFeatures: { nativeJSMode: true } }
    );
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.variables?.result?.value).toBe(3);
  });
});
