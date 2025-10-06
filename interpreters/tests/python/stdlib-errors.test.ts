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

describe("Python stdlib errors", () => {
  describe("MethodNotYetImplemented errors", () => {
    it("should throw MethodNotYetImplemented for unimplemented list methods", () => {
      const code = `
lst = [1, 2, 3]
lst.append(4)
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(false);
      expect(result.error).toBe(null);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("ERROR");
      expect(lastFrame.error?.type).toBe("MethodNotYetImplemented");
      expect(lastFrame.error?.context?.method).toBe("append");
    });

    it("should return a function for stub methods but throw when called", () => {
      const code = `
lst = [1, 2, 3]
append_fn = lst.append
append_fn(4)
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(false);
      expect(result.error).toBe(null);

      // Check that we can access the method (it should return a function)
      // The second-to-last frame should be the assignment which succeeds
      const framesBeforeError = result.frames.slice(0, -1);
      const hasSuccessfulFrame = framesBeforeError.some(f => f.status === "SUCCESS");
      expect(hasSuccessfulFrame).toBe(true);

      // But calling it should fail (last frame)
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("ERROR");
      expect(lastFrame.error?.type).toBe("MethodNotYetImplemented");
    });

    it("should list all unimplemented list methods", () => {
      const unimplementedMethods = [
        "append",
        "extend",
        "insert",
        "remove",
        "pop",
        "clear",
        "sort",
        "reverse",
        "count",
        "copy",
      ];

      for (const method of unimplementedMethods) {
        const code = `
lst = []
lst.${method}()
        `.trim();
        const result = interpret(code);
        expect(result.success).toBe(false);

        const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
        expect(lastFrame.error?.type).toBe("MethodNotYetImplemented");
        expect(lastFrame.error?.context?.method).toBe(method);
      }
    });
  });

  describe("MethodNotYetAvailable errors", () => {
    it("should throw MethodNotYetAvailable when method is disabled by feature flags", () => {
      const code = `
lst = [1, 2, 3]
len_func = lst.__len__
      `.trim();

      // With restrictive feature flags
      const result = interpret(code, {
        languageFeatures: {
          allowedStdlib: {
            list: {
              methods: [], // No methods allowed
            },
          },
        },
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe(null);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("ERROR");
      expect(lastFrame.error?.type).toBe("MethodNotYetAvailable");
      expect(lastFrame.error?.context?.method).toBe("__len__");
    });

    it("should allow methods when explicitly listed in feature flags", () => {
      const code = `
lst = [1, 2, 3]
length = lst.__len__()
      `.trim();

      // With permissive feature flags
      const result = interpret(code, {
        languageFeatures: {
          allowedStdlib: {
            list: {
              methods: ["__len__"], // Only __len__ allowed
            },
          },
        },
      });

      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.length?.value ?? lastFrame.variables?.length).toBe(3);
    });
  });

  describe("AttributeError", () => {
    it("should throw AttributeError for unknown attributes", () => {
      const code = `
lst = [1, 2, 3]
x = lst.unknown_method
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(false);
      expect(result.error).toBe(null);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("ERROR");
      expect(lastFrame.error?.type).toBe("AttributeError");
      expect(lastFrame.error?.context?.attribute).toBe("unknown_method");
      expect(lastFrame.error?.context?.type).toBe("list");
    });

    it("should throw TypeError for types without attributes", () => {
      const code = `
num = 42
x = num.append
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(false);
      expect(result.error).toBe(null);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("ERROR");
      expect(lastFrame.error?.type).toBe("TypeError");
      expect(lastFrame.error?.context?.message).toContain("has no attributes");
    });
  });
});
