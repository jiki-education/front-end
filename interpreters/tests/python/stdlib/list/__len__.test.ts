import { describe, expect, it } from "vitest";
import { interpret } from "@python/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

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
      expect(lastFrame.error?.type).toBe("InvalidNumberOfArguments");
    });
  });
});
