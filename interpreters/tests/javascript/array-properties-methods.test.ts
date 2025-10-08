import { expect, test, describe } from "vitest";
import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

describe("Array properties", () => {
  describe("length property", () => {
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
});

describe("Array methods", () => {
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

  describe("push() method", () => {
    test("adds single element and returns new length", () => {
      const result = interpret(`
        let arr = [1, 2, 3];
        let len = arr.push(4);
      `);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.value).toBe(4);
      expect(lastFrame.variables?.arr.value.length).toBe(4);
      expect(lastFrame.variables?.arr.value[3].value).toBe(4);
    });

    test("adds multiple elements", () => {
      const result = interpret(`
        let arr = [1, 2];
        let len = arr.push(3, 4, 5);
      `);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.value).toBe(5);
      expect(lastFrame.variables?.arr.value.length).toBe(5);
    });

    test("works on empty array", () => {
      const result = interpret(`
        let arr = [];
        let len = arr.push(1);
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
        arr.push();
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
        let result = arr.push();
      `,
        { languageFeatures: { nativeJSMode: true } }
      );
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value).toBe(3);
    });
  });

  describe("pop() method", () => {
    test("removes and returns last element", () => {
      const result = interpret(`
        let arr = [1, 2, 3];
        let last = arr.pop();
      `);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.value).toBe(3);
      expect(lastFrame.variables?.arr.value.length).toBe(2);
    });

    test("returns undefined for empty array", () => {
      const result = interpret(`
        let arr = [];
        let last = arr.pop();
      `);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.value).toBeUndefined();
      expect(lastFrame.variables?.arr.value.length).toBe(0);
    });

    test("requires no arguments", () => {
      const result = interpret(`
        let arr = [1, 2, 3];
        arr.pop(1);
      `);
      expect(result.error).toBeNull();
      const errorFrame = result.frames.find(f => f.status === "ERROR");
      expect(errorFrame).toBeDefined();
      expect(errorFrame?.error?.type).toBe("InvalidNumberOfArguments");
    });
  });

  describe("shift() method", () => {
    test("removes and returns first element", () => {
      const result = interpret(`
        let arr = [1, 2, 3];
        let first = arr.shift();
      `);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.value).toBe(1);
      expect(lastFrame.variables?.arr.value.length).toBe(2);
      expect(lastFrame.variables?.arr.value[0].value).toBe(2);
    });

    test("returns undefined for empty array", () => {
      const result = interpret(`
        let arr = [];
        let first = arr.shift();
      `);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.value).toBeUndefined();
      expect(lastFrame.variables?.arr.value.length).toBe(0);
    });

    test("requires no arguments", () => {
      const result = interpret(`
        let arr = [1, 2, 3];
        arr.shift(1);
      `);
      expect(result.error).toBeNull();
      const errorFrame = result.frames.find(f => f.status === "ERROR");
      expect(errorFrame).toBeDefined();
      expect(errorFrame?.error?.type).toBe("InvalidNumberOfArguments");
    });
  });

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

  describe("indexOf() method", () => {
    test("finds element at beginning", () => {
      const result = interpret(`
        let arr = [10, 20, 30];
        let idx = arr.indexOf(10);
      `);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.value).toBe(0);
    });

    test("finds element in middle", () => {
      const result = interpret(`
        let arr = [10, 20, 30];
        let idx = arr.indexOf(20);
      `);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.value).toBe(1);
    });

    test("returns -1 when not found", () => {
      const result = interpret(`
        let arr = [10, 20, 30];
        let idx = arr.indexOf(99);
      `);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.value).toBe(-1);
    });

    test("supports fromIndex parameter", () => {
      const result = interpret(`
        let arr = [10, 20, 30, 20];
        let idx = arr.indexOf(20, 2);
      `);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.value).toBe(3);
    });

    test("supports negative fromIndex", () => {
      const result = interpret(`
        let arr = [10, 20, 30, 40];
        let idx = arr.indexOf(30, -2);
      `);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.value).toBe(2);
    });

    test("requires at least one argument", () => {
      const result = interpret(`
        let arr = [1, 2, 3];
        arr.indexOf();
      `);
      expect(result.error).toBeNull();
      const errorFrame = result.frames.find(f => f.status === "ERROR");
      expect(errorFrame).toBeDefined();
      expect(errorFrame?.error?.type).toBe("InvalidNumberOfArguments");
    });
  });

  describe("includes() method", () => {
    test("returns true when element found", () => {
      const result = interpret(`
        let arr = [10, 20, 30];
        let found = arr.includes(20);
      `);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.value).toBe(true);
    });

    test("returns false when element not found", () => {
      const result = interpret(`
        let arr = [10, 20, 30];
        let found = arr.includes(99);
      `);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.value).toBe(false);
    });

    test("supports fromIndex parameter", () => {
      const result = interpret(`
        let arr = [10, 20, 30, 20];
        let found = arr.includes(20, 2);
      `);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.value).toBe(true);
    });

    test("supports negative fromIndex", () => {
      const result = interpret(`
        let arr = [10, 20, 30, 40];
        let found = arr.includes(20, -2);
      `);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.value).toBe(false);
    });

    test("requires at least one argument", () => {
      const result = interpret(`
        let arr = [1, 2, 3];
        arr.includes();
      `);
      expect(result.error).toBeNull();
      const errorFrame = result.frames.find(f => f.status === "ERROR");
      expect(errorFrame).toBeDefined();
      expect(errorFrame?.error?.type).toBe("InvalidNumberOfArguments");
    });
  });

  describe("slice() method", () => {
    test("slices from start to end", () => {
      const result = interpret(`
        let arr = [10, 20, 30, 40, 50];
        let sliced = arr.slice(1, 3);
      `);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.value.length).toBe(2);
      expect(lastFrame.result?.jikiObject?.value[0].value).toBe(20);
      expect(lastFrame.result?.jikiObject?.value[1].value).toBe(30);
    });

    test("slices from start to array end when no end parameter", () => {
      const result = interpret(`
        let arr = [10, 20, 30, 40];
        let sliced = arr.slice(2);
      `);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.value.length).toBe(2);
      expect(lastFrame.result?.jikiObject?.value[0].value).toBe(30);
    });

    test("returns shallow copy when no parameters", () => {
      const result = interpret(`
        let arr = [10, 20, 30];
        let sliced = arr.slice();
      `);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.value.length).toBe(3);
    });

    test("supports negative indices", () => {
      const result = interpret(`
        let arr = [10, 20, 30, 40, 50];
        let sliced = arr.slice(-3, -1);
      `);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.value.length).toBe(2);
      expect(lastFrame.result?.jikiObject?.value[0].value).toBe(30);
    });

    test("does not mutate original array", () => {
      const result = interpret(`
        let arr = [10, 20, 30];
        let sliced = arr.slice(1);
        arr.length;
      `);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.value).toBe(3);
    });
  });

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
});
