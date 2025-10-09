import { describe, expect, it } from "vitest";
import { interpret } from "@python/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

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
