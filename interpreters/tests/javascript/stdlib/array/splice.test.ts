import { expect, test, describe } from "vitest";
import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

describe("splice() method", () => {
  test("removes elements from middle and returns deleted elements", () => {
    const result = interpret(`
        let arr = [1, 2, 3, 4, 5];
        let deleted = arr.splice(2, 2);
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value.length).toBe(2);
    expect(lastFrame.result?.jikiObject?.value[0].value).toBe(3);
    expect(lastFrame.result?.jikiObject?.value[1].value).toBe(4);
    expect(lastFrame.variables?.arr.value.length).toBe(3);
    expect(lastFrame.variables?.arr.value[2].value).toBe(5);
  });

  test("removes and inserts elements", () => {
    const result = interpret(`
        let arr = [1, 2, 3, 4];
        let deleted = arr.splice(1, 2, 10, 20);
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value.length).toBe(2);
    expect(lastFrame.result?.jikiObject?.value[0].value).toBe(2);
    expect(lastFrame.variables?.arr.value.length).toBe(4);
    expect(lastFrame.variables?.arr.value[1].value).toBe(10);
    expect(lastFrame.variables?.arr.value[2].value).toBe(20);
  });

  test("inserts elements without removing", () => {
    const result = interpret(`
        let arr = [1, 2, 3];
        let deleted = arr.splice(1, 0, 10, 20);
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value.length).toBe(0);
    expect(lastFrame.variables?.arr.value.length).toBe(5);
    expect(lastFrame.variables?.arr.value[1].value).toBe(10);
  });

  test("removes from start", () => {
    const result = interpret(`
        let arr = [1, 2, 3, 4];
        let deleted = arr.splice(0, 2);
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value.length).toBe(2);
    expect(lastFrame.variables?.arr.value.length).toBe(2);
    expect(lastFrame.variables?.arr.value[0].value).toBe(3);
  });

  test("removes all elements from position to end when deleteCount omitted", () => {
    const result = interpret(`
        let arr = [1, 2, 3, 4, 5];
        let deleted = arr.splice(2);
      `);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value.length).toBe(3);
    expect(lastFrame.variables?.arr.value.length).toBe(2);
  });

  test("requires at least one argument", () => {
    const result = interpret(`
        let arr = [1, 2, 3];
        arr.splice();
      `);
    expect(result.error).toBeNull();
    const errorFrame = result.frames.find(f => f.status === "ERROR");
    expect(errorFrame).toBeDefined();
    expect(errorFrame?.error?.type).toBe("InvalidNumberOfArguments");
  });

  test("requires start to be a number", () => {
    const result = interpret(`
        let arr = [1, 2, 3];
        arr.splice("1", 1);
      `);
    expect(result.error).toBeNull();
    const errorFrame = result.frames.find(f => f.status === "ERROR");
    expect(errorFrame).toBeDefined();
    expect(errorFrame?.error?.type).toBe("TypeError");
  });
});
