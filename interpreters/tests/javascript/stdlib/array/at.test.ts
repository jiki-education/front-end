import { expect, test, describe } from "vitest";
import { interpret } from "@javascript/interpreter";

describe("Array at() method", () => {
  test("at() method with positive index", () => {
    const result = interpret(`
      let arr = [1, 2, 3];
      arr.at(0);
    `);
    expect(result.frames.length).toBeGreaterThan(0);
    const lastFrame = result.frames[result.frames.length - 1];
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(1);
  });

  test("at() method with negative index", () => {
    const result = interpret(`
      let arr = [1, 2, 3];
      arr.at(-1);
    `);
    expect(result.frames.length).toBeGreaterThan(0);
    const lastFrame = result.frames[result.frames.length - 1];
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(3);
  });

  test("at() method with out of bounds index", () => {
    const result = interpret(`
      let arr = [1, 2, 3];
      arr.at(10);
    `);
    expect(result.frames.length).toBeGreaterThan(0);
    const lastFrame = result.frames[result.frames.length - 1];
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBeUndefined();
  });
});
