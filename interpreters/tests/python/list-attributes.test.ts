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

describe("Python list attributes", () => {
  describe("list properties", () => {
    it("should return a function when accessing __len__ as attribute", () => {
      const code = `
lst = [1, 2, 3, 4, 5]
len_func = lst.__len__
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      // len_func should be a function object
      expect(lastFrame.variables?.len_func?.type).toBe("function");
    });
  });

  describe("list methods", () => {
    it("should call __len__ method", () => {
      const code = `
lst = [1, 2, 3]
length = lst.__len__()
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.length?.value ?? lastFrame.variables?.length).toBe(3);
    });

    it("should work with empty lists", () => {
      const code = `
lst = []
length = lst.__len__()
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.length?.value ?? lastFrame.variables?.length).toBe(0);
    });

    it("should error when __len__ is called with arguments", () => {
      const code = `
lst = [1, 2, 3]
length = lst.__len__(42)
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(false);
      expect(result.error).toBe(null);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("ERROR");
      expect(lastFrame.error?.type).toBe("TypeError");
    });
  });

  describe("method chaining", () => {
    it("should support method calls on list elements", () => {
      const code = `
lst = [[1, 2], [3, 4, 5]]
inner_length = lst[1].__len__()
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.inner_length?.value ?? lastFrame.variables?.inner_length).toBe(3);
    });

    it("should access attributes after subscript", () => {
      const code = `
matrix = [["a", "b"], ["c", "d"]]
first_row_len_func = matrix[0].__len__
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      // Should get a function object
      expect(lastFrame.variables?.first_row_len_func?.type).toBe("function");
    });
  });

  describe("attribute access syntax", () => {
    it("should parse dot notation correctly", () => {
      const code = `
lst = [1, 2, 3]
method = lst.__len__
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      // Verify that we successfully got a function object
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.method?.type).toBe("function");
    });

    it("should differentiate between property access and method call", () => {
      const code = `
lst = [1, 2, 3]
func = lst.__len__
result = lst.__len__()
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.func?.type).toBe("function"); // func should be a function object
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe(3); // result should be 3
    });
  });
});
