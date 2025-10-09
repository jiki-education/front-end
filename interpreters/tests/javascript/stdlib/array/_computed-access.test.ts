import { expect, test, describe } from "vitest";
import { interpret } from "@javascript/interpreter";

describe("Array computed access errors", () => {
  test("gives runtime error when using computed access for methods", () => {
    const result = interpret(`
      let arr = [1, 2, 3];
      arr["push"];
    `);

    expect(result.error).toBe(null);
    const errorFrame = result.frames.find(f => f.status === "ERROR");
    expect(errorFrame).toBeDefined();
    expect(errorFrame?.error?.message).toBe(
      "TypeError: message: Cannot use computed property access for stdlib members"
    );
  });

  test("gives runtime error when using string computed access", () => {
    const result = interpret(`
      let arr = [1, 2, 3];
      arr["0"];
    `);

    expect(result.error).toBe(null);
    const errorFrame = result.frames.find(f => f.status === "ERROR");
    expect(errorFrame).toBeDefined();
    expect(errorFrame?.error?.message).toBe("TypeError: message: Array indices must be numbers");
  });
});
