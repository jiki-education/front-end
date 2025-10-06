import { interpret } from "@python/interpreter";
import { PyList, PyNumber, PyString, PyBoolean, PyNone } from "@python/jikiObjects";
import type { TestAugmentedFrame } from "@shared/frames";

describe("Python nested lists - comprehensive", () => {
  test("deep nesting (5 levels)", () => {
    const code = `deep = [1, [2, [3, [4, [5]]]]]
deep[1][1][1][1][0]`;
    const { frames, error } = interpret(code);
    expect(error).toBeNull();
    const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
    expect((lastFrame.result?.jikiObject as PyNumber).value).toBe(5);
  });

  test("modifying deeply nested elements", () => {
    const code = `matrix = [[[1, 2], [3, 4]], [[5, 6], [7, 8]]]
matrix[0][1][0] = 99
matrix[0][1][0]`;
    const { frames, error } = interpret(code);
    expect(error).toBeNull();
    const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
    expect((lastFrame.result?.jikiObject as PyNumber).value).toBe(99);
  });

  test("chained operations with nested lists", () => {
    const code = `data = [[[1, 2], [3, 4]], [[5, 6], [7, 8]]]
data[0][0][0] = data[1][1][1]
data[0][0][0]`;
    const { frames, error } = interpret(code);
    expect(error).toBeNull();
    const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
    expect((lastFrame.result?.jikiObject as PyNumber).value).toBe(8);
  });

  test("empty nested lists", () => {
    const code = `empty = [[], [[]], [[[]]]]
empty`;
    const { frames, error } = interpret(code);
    expect(error).toBeNull();
    const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
    const list = lastFrame.result?.jikiObject as PyList;
    expect(list.toString()).toBe("[[], [[]], [[[]]]]");
  });

  test("jagged arrays", () => {
    const code = `jagged = [[1], [2, 3], [4, 5, 6]]
jagged[2][2]`;
    const { frames, error } = interpret(code);
    expect(error).toBeNull();
    const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
    expect((lastFrame.result?.jikiObject as PyNumber).value).toBe(6);
  });

  test("mixed type nested lists", () => {
    const code = `mixed = [[1, 'hello'], [True, None, [3.14, False]]]
mixed[1][2][0]`;
    const { frames, error } = interpret(code);
    expect(error).toBeNull();
    const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
    expect((lastFrame.result?.jikiObject as PyNumber).value).toBe(3.14);
  });

  test("error on out of bounds nested access", () => {
    const code = `nested = [[1, 2], [3, 4]]
nested[0][5]`;
    const { frames, error } = interpret(code);
    expect(error).toBeNull();
    const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("ERROR");
    expect(lastFrame.error?.type).toBe("IndexError");
  });

  test("error on accessing non-list in nested structure", () => {
    const code = `nested = [[1, 2], 3]
nested[1][0]`;
    const { frames, error } = interpret(code);
    expect(error).toBeNull();
    const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("ERROR");
    expect(lastFrame.error?.type).toBe("TypeError");
  });

  test("modifying nested list with negative indices", () => {
    const code = `matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
matrix[-1][-1] = 100
matrix[2][2]`;
    const { frames, error } = interpret(code);
    expect(error).toBeNull();
    const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
    expect((lastFrame.result?.jikiObject as PyNumber).value).toBe(100);
  });

  test("deeply nested list clone", () => {
    const code = `original = [[[1, 2]], [[3, 4]]]
original`;
    const { frames, error } = interpret(code);
    expect(error).toBeNull();
    const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
    const original = lastFrame.result?.jikiObject as PyList;
    const cloned = original.clone();

    // Verify deep cloning
    expect(cloned).not.toBe(original);
    expect(cloned.value[0]).not.toBe(original.value[0]);
    expect((cloned.value[0] as PyList).value[0]).not.toBe((original.value[0] as PyList).value[0]);
  });

  test("complex nested list assignment chain", () => {
    const code = `a = [1, 2]
b = [a, [3, 4]]
c = [b, [[5, 6]]]
c[0][0][1] = 99
a[1]`;
    const { frames, error } = interpret(code);
    expect(error).toBeNull();
    const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
    expect((lastFrame.result?.jikiObject as PyNumber).value).toBe(99);
  });
});
