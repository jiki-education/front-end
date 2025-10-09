import { describe, expect, it } from "vitest";
import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

describe("JavaScript stdlib errors", () => {
  describe("MethodNotYetImplemented errors", () => {
    it("should throw MethodNotYetImplemented for unimplemented array methods", () => {
      const code = `
        let arr = [1, 2, 3];
        arr.map();
      `;
      const result = interpret(code);
      expect(result.success).toBe(false);
      expect(result.error).toBe(null);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("ERROR");
      expect(lastFrame.error?.type).toBe("MethodNotYetImplemented");
      expect(lastFrame.error?.context?.method).toBe("map");
    });

    it("should return a function for stub methods but throw when called", () => {
      const code = `
        let arr = [1, 2, 3];
        let mapFn = arr.map;
        mapFn();
      `;
      const result = interpret(code);
      expect(result.success).toBe(false);
      expect(result.error).toBe(null);

      // Should be able to access the method (frame 1)
      const accessFrame = result.frames[1] as TestAugmentedFrame;
      expect(accessFrame.status).toBe("SUCCESS");

      // But calling it should fail (last frame)
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("ERROR");
      expect(lastFrame.error?.type).toBe("MethodNotYetImplemented");
    });

    it("should list all unimplemented array methods", () => {
      const unimplementedMethods = ["forEach", "map", "filter", "reduce", "find", "every", "some"];

      for (const method of unimplementedMethods) {
        const code = `
          let arr = [];
          arr.${method}();
        `;
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
        let arr = [1, 2, 3];
        arr.at(0);
      `;

      // With restrictive feature flags
      const result = interpret(code, {
        languageFeatures: {
          allowedStdlib: {
            array: {
              properties: ["length"],
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
      expect(lastFrame.error?.context?.method).toBe("at");
    });

    it("should allow methods when included in feature flags", () => {
      const code = `
        let arr = [1, 2, 3];
        arr.at(0);
      `;

      // With permissive feature flags
      const result = interpret(code, {
        languageFeatures: {
          allowedStdlib: {
            array: {
              properties: ["length"],
              methods: ["at"], // at is allowed
            },
          },
        },
      });

      expect(result.success).toBe(true);
      expect(result.error).toBe(null);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      // Check that arr exists and is an array with correct values
      expect(lastFrame.variables?.arr).toBeDefined();
      expect(lastFrame.variables?.arr.type).toBe("list");
      expect(lastFrame.variables?.arr.elements).toHaveLength(3);
    });

    it("should allow all methods when no restrictions", () => {
      const code = `
        let arr = [1, 2, 3];
        let len = arr.length;
        let first = arr.at(0);
      `;

      // No feature flags = everything allowed
      const result = interpret(code);

      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
    });

    it("should restrict properties when specified", () => {
      const code = `
        let arr = [1, 2, 3];
        let len = arr.length;
      `;

      const result = interpret(code, {
        languageFeatures: {
          allowedStdlib: {
            array: {
              properties: [], // No properties allowed
              methods: ["at"],
            },
          },
        },
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe(null);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("ERROR");
      expect(lastFrame.error?.type).toBe("MethodNotYetAvailable");
      expect(lastFrame.error?.context?.method).toBe("length");
    });
  });

  describe("PropertyNotFound errors", () => {
    it("should throw PropertyNotFound for completely unknown properties", () => {
      const code = `
        let arr = [1, 2, 3];
        arr.unknownMethod();
      `;
      const result = interpret(code);
      expect(result.success).toBe(false);
      expect(result.error).toBe(null);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("ERROR");
      expect(lastFrame.error?.type).toBe("PropertyNotFound");
      expect(lastFrame.error?.context?.property).toBe("unknownMethod");
    });

    it("should throw PropertyNotFound for misspelled methods", () => {
      const code = `
        let arr = [1, 2, 3];
        arr.pussh(4); // Typo in push
      `;
      const result = interpret(code);
      expect(result.success).toBe(false);
      expect(result.error).toBe(null);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("ERROR");
      expect(lastFrame.error?.type).toBe("PropertyNotFound");
      expect(lastFrame.error?.context?.property).toBe("pussh");
    });
  });

  describe("TypeError for non-object property access", () => {
    it("should throw TypeError when accessing property on number", () => {
      const code = `
        let num = 42;
        num.property;
      `;
      const result = interpret(code);
      expect(result.success).toBe(false);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("ERROR");
      expect(lastFrame.error?.type).toBe("TypeError");
      expect(lastFrame.error?.context?.message).toContain("number");
    });

    it("should throw TypeError when accessing property on boolean", () => {
      const code = `
        let bool = true;
        bool.property;
      `;
      const result = interpret(code);
      expect(result.success).toBe(false);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("ERROR");
      expect(lastFrame.error?.type).toBe("TypeError");
      expect(lastFrame.error?.context?.message).toContain("boolean");
    });
  });
});
