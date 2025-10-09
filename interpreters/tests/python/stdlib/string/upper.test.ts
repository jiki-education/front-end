import { describe, expect, it } from "vitest";
import { interpret } from "@python/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

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
});
