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

describe("Python string methods", () => {
  describe("upper() method", () => {
    it("should convert lowercase to uppercase", () => {
      const code = `
text = "hello world"
result = text.upper()
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("HELLO WORLD");
    });

    it("should leave uppercase unchanged", () => {
      const code = `
text = "ALREADY UPPER"
result = text.upper()
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("ALREADY UPPER");
    });

    it("should handle mixed case", () => {
      const code = `
text = "MiXeD CaSe"
result = text.upper()
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("MIXED CASE");
    });

    it("should handle empty string", () => {
      const code = `
text = ""
result = text.upper()
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("");
    });

    it("should handle strings with numbers and symbols", () => {
      const code = `
text = "hello123!@#"
result = text.upper()
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("HELLO123!@#");
    });

    it("should error when called with arguments", () => {
      const code = `
text = "hello"
result = text.upper("arg")
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(false);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("ERROR");
    });
  });

  describe("lower() method", () => {
    it("should convert uppercase to lowercase", () => {
      const code = `
text = "HELLO WORLD"
result = text.lower()
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("hello world");
    });

    it("should leave lowercase unchanged", () => {
      const code = `
text = "already lower"
result = text.lower()
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("already lower");
    });

    it("should handle mixed case", () => {
      const code = `
text = "MiXeD CaSe"
result = text.lower()
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("mixed case");
    });

    it("should handle empty string", () => {
      const code = `
text = ""
result = text.lower()
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("");
    });

    it("should handle strings with numbers and symbols", () => {
      const code = `
text = "HELLO123!@#"
result = text.lower()
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("hello123!@#");
    });

    it("should error when called with arguments", () => {
      const code = `
text = "HELLO"
result = text.lower("arg")
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(false);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("ERROR");
    });
  });

  describe("method chaining", () => {
    it("should chain upper and lower", () => {
      const code = `
text = "Hello"
result = text.upper().lower()
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("hello");
    });

    it("should chain lower and upper", () => {
      const code = `
text = "Hello"
result = text.lower().upper()
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("HELLO");
    });
  });

  describe("attribute access", () => {
    it("should return function object for upper", () => {
      const code = `
text = "hello"
func = text.upper
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.func?.type).toBe("function");
    });

    it("should return function object for lower", () => {
      const code = `
text = "HELLO"
func = text.lower
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.func?.type).toBe("function");
    });

    it("should differentiate between property access and method call", () => {
      const code = `
text = "hello"
func = text.upper
result = text.upper()
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.func?.type).toBe("function");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("HELLO");
    });
  });

  describe("immutability", () => {
    it("upper() should not modify original string", () => {
      const code = `
text = "hello"
result = text.upper()
original = text
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.original?.value ?? lastFrame.variables?.original).toBe("hello");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("HELLO");
    });

    it("lower() should not modify original string", () => {
      const code = `
text = "HELLO"
result = text.lower()
original = text
      `.trim();
      const result = interpret(code);
      expect(result.success).toBe(true);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.variables?.original?.value ?? lastFrame.variables?.original).toBe("HELLO");
      expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("hello");
    });
  });
});
