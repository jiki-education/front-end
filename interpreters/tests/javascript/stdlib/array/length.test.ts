import { expect, test, describe } from "vitest";
import { interpret } from "@javascript/interpreter";

describe("Array length property", () => {
  test("returns correct length for non-empty array", () => {
    const result = interpret(`
      let arr = [1, 2, 3];
      arr.length;
    `);
    expect(result.frames.length).toBeGreaterThan(0);
    const lastFrame = result.frames[result.frames.length - 1];
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(3);
  });

  test("returns 0 for empty array", () => {
    const result = interpret(`
      let arr = [];
      arr.length;
    `);
    expect(result.frames.length).toBeGreaterThan(0);
    const lastFrame = result.frames[result.frames.length - 1];
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(0);
  });

  test("works with array literals", () => {
    const result = interpret(`
      [10, 20, 30, 40].length;
    `);
    expect(result.frames.length).toBeGreaterThan(0);
    const lastFrame = result.frames[result.frames.length - 1];
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(4);
  });

  test("updates when array is modified", () => {
    const result = interpret(`
      let arr = [1, 2];
      arr[2] = 3;
      arr.length;
    `);
    expect(result.frames.length).toBeGreaterThan(0);
    const lastFrame = result.frames[result.frames.length - 1];
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(3);
  });

  test("gives runtime error when using computed access for length", () => {
    const result = interpret(`
      let arr = [1, 2, 3];
      arr["length"];
    `);

    expect(result.error).toBe(null);
    const errorFrame = result.frames.find(f => f.status === "ERROR");
    expect(errorFrame).toBeDefined();
    expect(errorFrame?.error?.message).toBe(
      "TypeError: message: Cannot use computed property access for stdlib members"
    );
  });

  test("gives runtime error for unknown property", () => {
    const result = interpret(`
      let arr = [1, 2, 3];
      arr.foo;
    `);
    expect(result.error).toBeNull();
    expect(result.frames.length).toBeGreaterThan(0);
    const lastFrame = result.frames[result.frames.length - 1];
    expect(lastFrame.status).toBe("ERROR");
    expect(lastFrame.error).toEqual(
      expect.objectContaining({
        type: "PropertyNotFound",
        context: { property: "foo" },
      })
    );
  });

  test("allows bracket notation for numeric indices", () => {
    const result = interpret(`
      let arr = [10, 20, 30];
      arr[1];
    `);
    expect(result.frames.length).toBeGreaterThan(0);
    const lastFrame = result.frames[result.frames.length - 1];
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe(20);
  });
});
