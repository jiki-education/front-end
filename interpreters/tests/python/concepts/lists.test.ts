import { interpret } from "@python/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";
import { PyList, PyNumber, PyString, PyBoolean, PyNone } from "@python/jikiObjects";

describe("Python lists", () => {
  describe("list creation", () => {
    test("creates empty list", () => {
      const { frames, error } = interpret("[]");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      const frame = frames[0] as TestAugmentedFrame;
      expect(frame.result?.jikiObject).toBeInstanceOf(PyList);
      expect((frame.result?.jikiObject as PyList).value).toHaveLength(0);
      expect((frame.result?.jikiObject as PyList).toString()).toBe("[]");
    });

    test("creates list with single element", () => {
      const { frames, error } = interpret("[42]");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      const frame = frames[0] as TestAugmentedFrame;
      expect(frame.result?.jikiObject).toBeInstanceOf(PyList);
      const list = frame.result?.jikiObject as PyList;
      expect(list.value).toHaveLength(1);
      expect(list.value[0]).toBeInstanceOf(PyNumber);
      expect((list.value[0] as PyNumber).value).toBe(42);
      expect(list.toString()).toBe("[42]");
    });

    test("creates list with multiple elements", () => {
      const { frames, error } = interpret("[1, 2, 3]");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      const frame = frames[0] as TestAugmentedFrame;
      expect(frame.result?.jikiObject).toBeInstanceOf(PyList);
      const list = frame.result?.jikiObject as PyList;
      expect(list.value).toHaveLength(3);
      expect((list.value[0] as PyNumber).value).toBe(1);
      expect((list.value[1] as PyNumber).value).toBe(2);
      expect((list.value[2] as PyNumber).value).toBe(3);
      expect(list.toString()).toBe("[1, 2, 3]");
    });

    test("creates list with mixed types", () => {
      const { frames, error } = interpret("[42, 'hello', True, None]");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      const frame = frames[0] as TestAugmentedFrame;
      const list = frame.result?.jikiObject as PyList;
      expect(list.value).toHaveLength(4);
      expect(list.value[0]).toBeInstanceOf(PyNumber);
      expect((list.value[0] as PyNumber).value).toBe(42);
      expect(list.value[1]).toBeInstanceOf(PyString);
      expect((list.value[1] as PyString).value).toBe("hello");
      expect(list.value[2]).toBeInstanceOf(PyBoolean);
      expect((list.value[2] as PyBoolean).value).toBe(true);
      expect(list.value[3]).toBeInstanceOf(PyNone);
      expect(list.toString()).toBe("[42, 'hello', True, None]");
    });

    test("creates nested lists", () => {
      const { frames, error } = interpret("[[1, 2], [3, 4], []]");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      const frame = frames[0] as TestAugmentedFrame;
      const list = frame.result?.jikiObject as PyList;
      expect(list.value).toHaveLength(3);

      // First nested list [1, 2]
      expect(list.value[0]).toBeInstanceOf(PyList);
      const nested1 = list.value[0] as PyList;
      expect(nested1.value).toHaveLength(2);
      expect((nested1.value[0] as PyNumber).value).toBe(1);
      expect((nested1.value[1] as PyNumber).value).toBe(2);

      // Second nested list [3, 4]
      expect(list.value[1]).toBeInstanceOf(PyList);
      const nested2 = list.value[1] as PyList;
      expect(nested2.value).toHaveLength(2);
      expect((nested2.value[0] as PyNumber).value).toBe(3);
      expect((nested2.value[1] as PyNumber).value).toBe(4);

      // Third nested list (empty)
      expect(list.value[2]).toBeInstanceOf(PyList);
      const nested3 = list.value[2] as PyList;
      expect(nested3.value).toHaveLength(0);

      expect(list.toString()).toBe("[[1, 2], [3, 4], []]");
    });

    test("evaluates expressions in list", () => {
      const { frames, error } = interpret("[1 + 1, 2 * 3, 10 - 5]");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      const frame = frames[0] as TestAugmentedFrame;
      const list = frame.result?.jikiObject as PyList;
      expect(list.value).toHaveLength(3);
      expect((list.value[0] as PyNumber).value).toBe(2);
      expect((list.value[1] as PyNumber).value).toBe(6);
      expect((list.value[2] as PyNumber).value).toBe(5);
      expect(list.toString()).toBe("[2, 6, 5]");
    });

    test("creates list with variables", () => {
      const code = `x = 10
y = 20
[x, y, x + y]`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      const list = lastFrame.result?.jikiObject as PyList;
      expect(list.value).toHaveLength(3);
      expect((list.value[0] as PyNumber).value).toBe(10);
      expect((list.value[1] as PyNumber).value).toBe(20);
      expect((list.value[2] as PyNumber).value).toBe(30);
      expect(list.toString()).toBe("[10, 20, 30]");
    });
  });

  describe("list assignment to variables", () => {
    test("assigns empty list to variable", () => {
      const code = `my_list = []
my_list`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      const list = lastFrame.result?.jikiObject as PyList;
      expect(list).toBeInstanceOf(PyList);
      expect(list.value).toHaveLength(0);
    });

    test("assigns list to variable", () => {
      const code = `numbers = [1, 2, 3]
numbers`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      const list = lastFrame.result?.jikiObject as PyList;
      expect(list.value).toHaveLength(3);
      expect((list.value[0] as PyNumber).value).toBe(1);
      expect((list.value[1] as PyNumber).value).toBe(2);
      expect((list.value[2] as PyNumber).value).toBe(3);
    });

    test("assigns nested lists to variable", () => {
      const code = `matrix = [[1, 2, 3], [4, 5, 6]]
matrix`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      const list = lastFrame.result?.jikiObject as PyList;
      expect(list.value).toHaveLength(2);

      const row1 = list.value[0] as PyList;
      expect(row1.value).toHaveLength(3);
      expect((row1.value[0] as PyNumber).value).toBe(1);
      expect((row1.value[1] as PyNumber).value).toBe(2);
      expect((row1.value[2] as PyNumber).value).toBe(3);

      const row2 = list.value[1] as PyList;
      expect(row2.value).toHaveLength(3);
      expect((row2.value[0] as PyNumber).value).toBe(4);
      expect((row2.value[1] as PyNumber).value).toBe(5);
      expect((row2.value[2] as PyNumber).value).toBe(6);
    });
  });

  describe("list clone behavior", () => {
    test("clone creates deep copy of list", () => {
      const original = new PyList([new PyNumber(1), new PyNumber(2), new PyNumber(3)]);

      const cloned = original.clone();

      // Should be different instances
      expect(cloned).not.toBe(original);
      // Internal storage is now private, just check they are different objects
      expect(cloned.value).not.toBe(original.value);

      // But should have equal values
      expect(cloned.toString()).toBe(original.toString());
      expect(cloned.value).toHaveLength(3);
    });

    test("clone preserves nested list structure", () => {
      const innerList = new PyList([new PyNumber(1), new PyNumber(2)]);
      const original = new PyList([innerList, new PyNumber(3)]);

      const cloned = original.clone();

      expect(cloned).not.toBe(original);
      expect(cloned.value[0]).not.toBe(original.value[0]); // Nested list should also be cloned
      expect(cloned.toString()).toBe(original.toString());
    });
  });

  describe("list string representation", () => {
    test("formats strings with single quotes in lists", () => {
      const { frames, error } = interpret('["hello", "world"]');
      expect(error).toBeNull();
      const frame = frames[0] as TestAugmentedFrame;
      const list = frame.result?.jikiObject as PyList;
      expect(list.toString()).toBe("['hello', 'world']");
    });

    test("formats mixed types correctly", () => {
      const { frames, error } = interpret('[42, "test", True, False, None]');
      expect(error).toBeNull();
      const frame = frames[0] as TestAugmentedFrame;
      const list = frame.result?.jikiObject as PyList;
      expect(list.toString()).toBe("[42, 'test', True, False, None]");
    });

    test("formats deeply nested lists", () => {
      const { frames, error } = interpret("[1, [2, [3, [4]]]]");
      expect(error).toBeNull();
      const frame = frames[0] as TestAugmentedFrame;
      const list = frame.result?.jikiObject as PyList;
      expect(list.toString()).toBe("[1, [2, [3, [4]]]]");
    });
  });

  describe("list expressions with boolean operators", () => {
    test("creates list with boolean expressions", () => {
      const { frames, error } = interpret("[5 > 3, 2 == 2, 1 != 1]");
      expect(error).toBeNull();
      const frame = frames[0] as TestAugmentedFrame;
      const list = frame.result?.jikiObject as PyList;
      expect(list.value).toHaveLength(3);
      expect((list.value[0] as PyBoolean).value).toBe(true);
      expect((list.value[1] as PyBoolean).value).toBe(true);
      expect((list.value[2] as PyBoolean).value).toBe(false);
      expect(list.toString()).toBe("[True, True, False]");
    });
  });

  describe("list index access", () => {
    test("accesses first element", () => {
      const code = `my_list = [10, 20, 30]
my_list[0]`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.result?.jikiObject).toBeInstanceOf(PyNumber);
      expect((lastFrame.result?.jikiObject as PyNumber).value).toBe(10);
    });

    test("accesses middle element", () => {
      const code = `my_list = [10, 20, 30]
my_list[1]`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.result?.jikiObject).toBeInstanceOf(PyNumber);
      expect((lastFrame.result?.jikiObject as PyNumber).value).toBe(20);
    });

    test("accesses last element", () => {
      const code = `my_list = [10, 20, 30]
my_list[2]`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.result?.jikiObject).toBeInstanceOf(PyNumber);
      expect((lastFrame.result?.jikiObject as PyNumber).value).toBe(30);
    });

    test("accesses element with negative index", () => {
      const code = `my_list = [10, 20, 30]
my_list[-1]`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.result?.jikiObject).toBeInstanceOf(PyNumber);
      expect((lastFrame.result?.jikiObject as PyNumber).value).toBe(30);
    });

    test("accesses element with negative index -2", () => {
      const code = `my_list = [10, 20, 30]
my_list[-2]`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.result?.jikiObject).toBeInstanceOf(PyNumber);
      expect((lastFrame.result?.jikiObject as PyNumber).value).toBe(20);
    });

    test("accesses element with expression as index", () => {
      const code = `my_list = [10, 20, 30, 40, 50]
i = 2
my_list[i + 1]`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.result?.jikiObject).toBeInstanceOf(PyNumber);
      expect((lastFrame.result?.jikiObject as PyNumber).value).toBe(40);
    });

    test("accesses nested lists", () => {
      const code = `matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
matrix[1][2]`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.result?.jikiObject).toBeInstanceOf(PyNumber);
      expect((lastFrame.result?.jikiObject as PyNumber).value).toBe(6);
    });

    test("accesses string element from list", () => {
      const code = `words = ['hello', 'world', 'test']
words[1]`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.result?.jikiObject).toBeInstanceOf(PyString);
      expect((lastFrame.result?.jikiObject as PyString).value).toBe("world");
    });

    test("handles index out of range error", () => {
      const code = `my_list = [10, 20, 30]
my_list[5]`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("ERROR");
      expect(lastFrame.error?.type).toBe("IndexError");
    });

    test("handles negative index out of range error", () => {
      const code = `my_list = [10, 20, 30]
my_list[-5]`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("ERROR");
      expect(lastFrame.error?.type).toBe("IndexError");
    });

    test("handles non-integer index error", () => {
      const code = `my_list = [10, 20, 30]
my_list[1.5]`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("ERROR");
      expect(lastFrame.error?.type).toBe("TypeError");
      expect(lastFrame.error?.message).toContain("must be integers, not float");
    });

    test("handles string index error", () => {
      const code = `my_list = [10, 20, 30]
my_list['hello']`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("ERROR");
      expect(lastFrame.error?.type).toBe("TypeError");
      expect(lastFrame.error?.message).toContain("must be integers, not str");
    });

    test("direct list literal access", () => {
      const code = `[100, 200, 300][1]`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.result?.jikiObject).toBeInstanceOf(PyNumber);
      expect((lastFrame.result?.jikiObject as PyNumber).value).toBe(200);
    });
  });

  describe("list element assignment", () => {
    test("assigns to first element", () => {
      const code = `my_list = [10, 20, 30]
my_list[0] = 99`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();

      // Check that assignment succeeded
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");

      // Verify the list was modified
      const my_list = lastFrame.variables?.["my_list"] as PyList;
      expect(my_list.value[0]).toBeInstanceOf(PyNumber);
      expect((my_list.value[0] as PyNumber).value).toBe(99);
      expect(my_list.toString()).toBe("[99, 20, 30]");
    });

    test("assigns to middle element", () => {
      const code = `my_list = [1, 2, 3, 4, 5]
my_list[2] = 100`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();

      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");

      const my_list = lastFrame.variables?.["my_list"] as PyList;
      expect((my_list.value[2] as PyNumber).value).toBe(100);
      expect(my_list.toString()).toBe("[1, 2, 100, 4, 5]");
    });

    test("assigns to last element", () => {
      const code = `my_list = [10, 20, 30]
my_list[2] = 99`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();

      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      const my_list = lastFrame.variables?.["my_list"] as PyList;
      expect((my_list.value[2] as PyNumber).value).toBe(99);
      expect(my_list.toString()).toBe("[10, 20, 99]");
    });

    test("assigns using negative index", () => {
      const code = `my_list = [10, 20, 30]
my_list[-1] = 99`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();

      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      const my_list = lastFrame.variables?.["my_list"] as PyList;
      expect((my_list.value[2] as PyNumber).value).toBe(99);
      expect(my_list.toString()).toBe("[10, 20, 99]");
    });

    test("assigns using negative index -2", () => {
      const code = `my_list = [10, 20, 30]
my_list[-2] = 99`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();

      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      const my_list = lastFrame.variables?.["my_list"] as PyList;
      expect((my_list.value[1] as PyNumber).value).toBe(99);
      expect(my_list.toString()).toBe("[10, 99, 30]");
    });

    test("assigns using expression as index", () => {
      const code = `my_list = [10, 20, 30, 40, 50]
i = 1
my_list[i + 1] = 99`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();

      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      const my_list = lastFrame.variables?.["my_list"] as PyList;
      expect((my_list.value[2] as PyNumber).value).toBe(99);
      expect(my_list.toString()).toBe("[10, 20, 99, 40, 50]");
    });

    test("assigns different types", () => {
      const code = `my_list = [1, 2, 3]
my_list[0] = 'hello'
my_list[1] = True
my_list[2] = None`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();

      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      const my_list = lastFrame.variables?.["my_list"] as PyList;
      expect(my_list.value[0]).toBeInstanceOf(PyString);
      expect((my_list.value[0] as PyString).value).toBe("hello");
      expect(my_list.value[1]).toBeInstanceOf(PyBoolean);
      expect((my_list.value[1] as PyBoolean).value).toBe(true);
      expect(my_list.value[2]).toBeInstanceOf(PyNone);
      expect(my_list.toString()).toBe("['hello', True, None]");
    });

    test("assigns to nested lists", () => {
      const code = `matrix = [[1, 2], [3, 4]]
matrix[0][1] = 99`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();

      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      const matrix = lastFrame.variables?.["matrix"] as PyList;
      const row0 = matrix.value[0] as PyList;
      expect((row0.value[1] as PyNumber).value).toBe(99);
      expect(matrix.toString()).toBe("[[1, 99], [3, 4]]");
    });

    test("handles index out of range error (positive)", () => {
      const code = `my_list = [10, 20, 30]
my_list[5] = 99`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();

      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("ERROR");
      expect(lastFrame.error?.type).toBe("IndexError");
    });

    test("handles index out of range error (negative)", () => {
      const code = `my_list = [10, 20, 30]
my_list[-5] = 99`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();

      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("ERROR");
      expect(lastFrame.error?.type).toBe("IndexError");
    });

    test("handles non-integer index error", () => {
      const code = `my_list = [10, 20, 30]
my_list[1.5] = 99`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();

      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("ERROR");
      expect(lastFrame.error?.type).toBe("TypeError");
      expect(lastFrame.error?.message).toContain("must be integers, not float");
    });

    test("handles string index error", () => {
      const code = `my_list = [10, 20, 30]
my_list['hello'] = 99`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();

      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("ERROR");
      expect(lastFrame.error?.type).toBe("TypeError");
      expect(lastFrame.error?.message).toContain("must be integers, not str");
    });

    test("handles assignment to non-list", () => {
      const code = `not_a_list = 42
not_a_list[0] = 99`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();

      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("ERROR");
      expect(lastFrame.error?.type).toBe("TypeError");
      expect(lastFrame.error?.message).toContain("does not support item assignment");
    });

    test("multiple assignments in sequence", () => {
      const code = `my_list = [1, 2, 3, 4, 5]
my_list[0] = 10
my_list[2] = 30
my_list[4] = 50`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();

      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      const my_list = lastFrame.variables?.["my_list"] as PyList;
      expect(my_list.toString()).toBe("[10, 2, 30, 4, 50]");
    });
  });

  describe("frame generation", () => {
    test("generates correct frames for list creation", () => {
      const { frames, error } = interpret("[1, 2, 3]");
      expect(error).toBeNull();
      expect(frames).toHaveLength(1);

      const frame = frames[0] as TestAugmentedFrame;
      expect(frame.code).toBe("[1, 2, 3]");
      expect(frame.status).toBe("SUCCESS");
      expect(frame.result?.jikiObject).toBeInstanceOf(PyList);
      expect(frame.result?.immutableJikiObject).toBeInstanceOf(PyList);

      // Check that immutable is a clone, not the same instance
      expect(frame.result?.immutableJikiObject).not.toBe(frame.result?.jikiObject);
    });

    test("generates frames for each expression in list", () => {
      const code = `x = 5
y = 10
[x, y, x + y]`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();

      // Should have frames for x=5, y=10, and the list creation
      expect(frames.length).toBeGreaterThanOrEqual(3);

      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.code).toBe("[x, y, x + y]");
      expect(lastFrame.result?.jikiObject).toBeInstanceOf(PyList);
    });
  });
});
