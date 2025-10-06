import { describe, expect, it } from "vitest";
import { interpret } from "../../src/python/interpreter";

// Type for frames augmented in test environment
interface TestAugmentedFrame {
  status: "SUCCESS" | "ERROR";
  result?: any;
  variables?: Record<string, any>;
  description?: string;
  error?: {
    type: string;
    message?: string;
    context?: any;
  };
}

describe("Python list index() method", () => {
  describe("basic functionality", () => {
    it("should find element at beginning", () => {
      const code = `
lst = [10, 20, 30]
result = lst.index(10)
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe(0);
    });

    it("should find element in middle", () => {
      const code = `
lst = [10, 20, 30, 40, 50]
result = lst.index(30)
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe(2);
    });

    it("should find element at end", () => {
      const code = `
lst = ["a", "b", "c"]
result = lst.index("c")
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe(2);
    });

    it("should find first occurrence when duplicates exist", () => {
      const code = `
lst = [1, 2, 3, 2, 4, 2, 5]
result = lst.index(2)
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe(1);
    });
  });

  describe("with start parameter", () => {
    it("should search from start position", () => {
      const code = `
lst = [1, 2, 3, 2, 4]
result = lst.index(2, 2)
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe(3);
    });

    it("should handle start at 0", () => {
      const code = `
lst = [5, 10, 15]
result = lst.index(5, 0)
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe(0);
    });
  });

  describe("with start and end parameters", () => {
    it("should search within range", () => {
      const code = `
lst = [1, 2, 3, 4, 5, 3, 7]
result = lst.index(3, 3, 6)
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe(5);
    });

    it("should handle negative start index", () => {
      const code = `
lst = [1, 2, 3, 2, 5]
result = lst.index(2, -3)
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      // -3 from end is index 2, so should find the 2 at index 3
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe(3);
    });

    it("should handle negative end index", () => {
      const code = `
lst = [1, 2, 3, 2, 5]
result = lst.index(2, 0, -1)
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      // Should search from 0 to index 4 (exclusive), finding 2 at index 1
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe(1);
    });

    it("should handle both negative indices", () => {
      const code = `
lst = [1, 2, 3, 4, 2, 6]
result = lst.index(2, -4, -1)
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      // -4 from end is index 2, -1 from end is index 5 (exclusive)
      // Should find 2 at index 4
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe(4);
    });

    it("should handle extreme negative indices that go past beginning", () => {
      const code = `
lst = [1, 2, 3, 4, 5]
result = lst.index(1, -10)
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      // -10 from end would be negative, should clamp to 0
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe(0);
    });

    it("should not find element outside range", () => {
      const code = `
lst = [1, 2, 3, 4, 5]
result = lst.index(5, 0, 4)
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(false);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("ERROR");
      expect(lastFrame.error?.type).toBe("ValueError"); // ValueError for value not found in Python
    });
  });

  describe("error cases", () => {
    it("should error when value not found", () => {
      const code = `
lst = [1, 2, 3]
result = lst.index(99)
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(false);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("ERROR");
      expect(lastFrame.error?.type).toBe("ValueError");
      expect(lastFrame.error?.context?.value).toBe("99");
    });

    it("should error with no arguments", () => {
      const code = `
lst = [1, 2, 3]
result = lst.index()
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(false);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("ERROR");
      expect(lastFrame.error?.type).toBe("InvalidNumberOfArguments");
    });

    it("should error with too many arguments", () => {
      const code = `
lst = [1, 2, 3]
result = lst.index(1, 0, 3, 99)
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(false);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("ERROR");
      expect(lastFrame.error?.type).toBe("InvalidNumberOfArguments");
    });

    it("should error when start is not a number", () => {
      const code = `
lst = [1, 2, 3]
result = lst.index(2, "abc")
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(false);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("ERROR");
      expect(lastFrame.error?.type).toBe("TypeError"); // Type error for wrong argument type
    });

    it("should error when end is not a number", () => {
      const code = `
lst = [1, 2, 3]
result = lst.index(2, 0, "xyz")
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(false);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("ERROR");
      expect(lastFrame.error?.type).toBe("TypeError"); // Type error for wrong argument type
    });
  });

  describe("with empty list", () => {
    it("should error when searching in empty list", () => {
      const code = `
lst = []
result = lst.index(1)
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(false);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("ERROR");
      expect(lastFrame.error?.type).toBe("ValueError");
    });
  });

  describe("with different types", () => {
    it("should work with string elements", () => {
      const code = `
lst = ["apple", "banana", "cherry"]
result = lst.index("banana")
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe(1);
    });

    it("should work with boolean elements", () => {
      const code = `
lst = [True, False, True, False]
result = lst.index(False)
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe(1);
    });

    it("should work with None", () => {
      const code = `
lst = [1, None, 3, None]
result = lst.index(None)
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe(1);
    });
  });
});
