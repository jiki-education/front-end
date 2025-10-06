import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

describe("Object Property Reading", () => {
  describe("dot notation", () => {
    it("should read object properties using dot notation", () => {
      const code = `
        let obj = { name: "Alice", age: 30 };
        obj.name;
      `;
      const result = interpret(code);
      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames).toHaveLength(2);

      const lastFrame = result.frames[1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.toString()).toBe("Alice");
    });

    it("should return undefined for missing properties", () => {
      const code = `
        let obj = { x: 10 };
        obj.y;
      `;
      const result = interpret(code);
      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames).toHaveLength(2);

      const lastFrame = result.frames[1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.toString()).toBe("undefined");
    });

    it("should handle chained property access", () => {
      const code = `
        let obj = {
          user: {
            profile: {
              name: "Bob"
            }
          }
        };
        obj.user.profile.name;
      `;
      const result = interpret(code);
      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames).toHaveLength(2);

      const lastFrame = result.frames[1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.toString()).toBe("Bob");
    });
  });

  describe("bracket notation", () => {
    it("should read properties using bracket notation with string", () => {
      const code = `
        let obj = { "first-name": "Charlie", age: 25 };
        obj["first-name"];
      `;
      const result = interpret(code);
      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames).toHaveLength(2);

      const lastFrame = result.frames[1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.toString()).toBe("Charlie");
    });

    it("should read properties using bracket notation with number", () => {
      const code = `
        let obj = { 0: "zero", 1: "one", 42: "answer" };
        obj[42];
      `;
      const result = interpret(code);
      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames).toHaveLength(2);

      const lastFrame = result.frames[1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.toString()).toBe("answer");
    });

    it("should read properties using bracket notation with variable", () => {
      const code = `
        let key = "status";
        let obj = { status: "active", id: 123 };
        obj[key];
      `;
      const result = interpret(code);
      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames).toHaveLength(3);

      const lastFrame = result.frames[2] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.toString()).toBe("active");
    });

    it("should read properties using bracket notation with expression", () => {
      const code = `
        let obj = { 10: "ten", 20: "twenty" };
        obj[5 + 5];
      `;
      const result = interpret(code);
      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames).toHaveLength(2);

      const lastFrame = result.frames[1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.toString()).toBe("ten");
    });
  });

  describe("mixed notation", () => {
    it("should support mixing dot and bracket notation", () => {
      const code = `
        let obj = {
          data: {
            items: {
              "item-1": "first"
            }
          }
        };
        obj.data["items"]["item-1"];
      `;
      const result = interpret(code);
      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames).toHaveLength(2);

      const lastFrame = result.frames[1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.toString()).toBe("first");
    });

    it("should handle array inside object", () => {
      const code = `
        let obj = { list: [10, 20, 30] };
        obj.list[1];
      `;
      const result = interpret(code);
      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames).toHaveLength(2);

      const lastFrame = result.frames[1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.toString()).toBe("20");
    });

    it("should handle object inside array", () => {
      const code = `
        let arr = [{ x: 100 }, { y: 200 }];
        arr[0].x;
      `;
      const result = interpret(code);
      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames).toHaveLength(2);

      const lastFrame = result.frames[1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.toString()).toBe("100");
    });
  });

  describe("edge cases", () => {
    it("should handle empty object property access", () => {
      const code = `
        let obj = {};
        obj.anything;
      `;
      const result = interpret(code);
      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames).toHaveLength(2);

      const lastFrame = result.frames[1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.toString()).toBe("undefined");
    });

    it("should handle null and boolean values in objects", () => {
      const code = `
        let obj = { isNull: null, isTrue: true, isFalse: false };
        obj.isNull;
      `;
      const result = interpret(code);
      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames).toHaveLength(2);

      const lastFrame = result.frames[1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.toString()).toBe("null");
    });
  });

  describe("error handling", () => {
    it("should error when accessing property of non-object", () => {
      const code = `
        let num = 42;
        num.property;
      `;
      const result = interpret(code);
      expect(result.success).toBe(false);
      expect(result.error).toBe(null);
      expect(result.frames).toHaveLength(2);

      const lastFrame = result.frames[1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("ERROR");
      expect(lastFrame.error?.type).toBe("TypeError");
    });

    it("should error when accessing property of null", () => {
      const code = `
        let obj = null;
        obj.property;
      `;
      const result = interpret(code);
      expect(result.success).toBe(false);
      expect(result.error).toBe(null);
      expect(result.frames).toHaveLength(2);

      const lastFrame = result.frames[1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("ERROR");
      expect(lastFrame.error?.type).toBe("TypeError");
    });

    it("should error when accessing property of undefined", () => {
      const code = `
        let obj;
        obj.property;
      `;
      const result = interpret(code, { languageFeatures: { requireVariableInstantiation: false } });
      expect(result.success).toBe(false);
      expect(result.error).toBe(null);
      expect(result.frames).toHaveLength(2);

      const lastFrame = result.frames[1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("ERROR");
      expect(lastFrame.error?.type).toBe("TypeError");
    });
  });
});
