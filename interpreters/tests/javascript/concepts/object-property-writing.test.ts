import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

describe("Object Property Writing", () => {
  describe("dot notation", () => {
    it("should set object property using dot notation", () => {
      const code = `
        let obj = { name: "Alice" };
        obj.name = "Bob";
        obj.name;
      `;
      const result = interpret(code);
      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames).toHaveLength(3);

      const lastFrame = result.frames[2] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.toString()).toBe("Bob");

      // Check that the property was actually updated
      expect(lastFrame.variables.obj?.toString()).toContain('"Bob"');
    });

    it("should add new property using dot notation", () => {
      const code = `
        let obj = { name: "Alice" };
        obj.age = 30;
        obj.age;
      `;
      const result = interpret(code);
      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames).toHaveLength(3);

      const lastFrame = result.frames[2] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.toString()).toBe("30");
    });

    it("should handle nested property assignment", () => {
      const code = `
        let obj = {
          user: {
            profile: {
              name: "Alice"
            }
          }
        };
        obj.user.profile.name = "Bob";
        obj.user.profile.name;
      `;
      const result = interpret(code);
      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames).toHaveLength(3);

      const lastFrame = result.frames[2] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.toString()).toBe("Bob");
    });
  });

  describe("bracket notation", () => {
    it("should set property using bracket notation with string", () => {
      const code = `
        let obj = { "first-name": "Alice" };
        obj["first-name"] = "Bob";
        obj["first-name"];
      `;
      const result = interpret(code);
      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames).toHaveLength(3);

      const lastFrame = result.frames[2] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.toString()).toBe("Bob");
    });

    it("should set property using bracket notation with number", () => {
      const code = `
        let obj = { 42: "answer" };
        obj[42] = "question";
        obj[42];
      `;
      const result = interpret(code);
      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames).toHaveLength(3);

      const lastFrame = result.frames[2] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.toString()).toBe("question");
    });

    it("should set property using bracket notation with variable", () => {
      const code = `
        let key = "status";
        let obj = { status: "active" };
        obj[key] = "inactive";
        obj.status;
      `;
      const result = interpret(code);
      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames).toHaveLength(4);

      const lastFrame = result.frames[3] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.toString()).toBe("inactive");
    });

    it("should set property using bracket notation with expression", () => {
      const code = `
        let prefix = "user";
        let obj = {};
        obj[prefix + "_id"] = 123;
        obj.user_id;
      `;
      const result = interpret(code);
      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames).toHaveLength(4);

      const lastFrame = result.frames[3] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.toString()).toBe("123");
    });
  });

  describe("mixed notation", () => {
    it("should support mixing dot and bracket notation for writing", () => {
      const code = `
        let obj = {
          data: {
            items: {}
          }
        };
        obj.data["items"]["item-1"] = "first";
        obj.data.items["item-1"];
      `;
      const result = interpret(code);
      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames).toHaveLength(3);

      const lastFrame = result.frames[2] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.toString()).toBe("first");
    });

    it("should handle array inside object", () => {
      const code = `
        let obj = { list: [10, 20, 30] };
        obj.list[1] = 25;
        obj.list[1];
      `;
      const result = interpret(code);
      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames).toHaveLength(3);

      const lastFrame = result.frames[2] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.toString()).toBe("25");
    });

    it("should handle object inside array", () => {
      const code = `
        let arr = [{ x: 100 }, { y: 200 }];
        arr[0].x = 150;
        arr[0].x;
      `;
      const result = interpret(code);
      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames).toHaveLength(3);

      const lastFrame = result.frames[2] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.toString()).toBe("150");
    });
  });

  describe("property creation", () => {
    it("should create new properties on empty object", () => {
      const code = `
        let obj = {};
        obj.a = 1;
        obj.b = 2;
        obj.c = 3;
        obj.b;
      `;
      const result = interpret(code);
      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames).toHaveLength(5);

      const lastFrame = result.frames[4] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.toString()).toBe("2");
    });

    it("should handle different value types", () => {
      const code = `
        let obj = {};
        obj.str = "hello";
        obj.num = 42;
        obj.bool = true;
        obj.nil = null;
        obj.undef = undefined;
        obj.obj = { nested: "value" };
        obj.arr = [1, 2, 3];
        obj.obj;
      `;
      const result = interpret(code);
      expect(result.success).toBe(true);
      expect(result.error).toBe(null);

      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.toString()).toContain("nested");
    });
  });

  describe("overwriting properties", () => {
    it("should overwrite existing property", () => {
      const code = `
        let obj = { value: "old" };
        obj.value = "new";
        obj.value;
      `;
      const result = interpret(code);
      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames).toHaveLength(3);

      const lastFrame = result.frames[2] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.toString()).toBe("new");
    });

    it("should change property type when overwriting", () => {
      const code = `
        let obj = { value: "string" };
        obj.value = 42;
        obj.value;
      `;
      const result = interpret(code);
      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames).toHaveLength(3);

      const lastFrame = result.frames[2] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.toString()).toBe("42");
    });
  });

  describe("chained assignments", () => {
    it("should handle chained property assignments", () => {
      const code = `
        let obj = {};
        let value = obj.a = obj.b = 42;
        value;
      `;
      const result = interpret(code);
      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames).toHaveLength(3);

      const lastFrame = result.frames[2] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.toString()).toBe("42");
    });
  });

  describe("error handling", () => {
    it("should error when setting property on number", () => {
      const code = `
        let num = 42;
        num.property = "value";
      `;
      const result = interpret(code);
      expect(result.success).toBe(false);
      expect(result.error).toBe(null);
      expect(result.frames).toHaveLength(2);

      const lastFrame = result.frames[1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("ERROR");
      expect(lastFrame.error?.type).toBe("TypeError");
    });

    it("should error when setting property on string", () => {
      const code = `
        let str = "hello";
        str.property = "value";
      `;
      const result = interpret(code);
      expect(result.success).toBe(false);
      expect(result.error).toBe(null);
      expect(result.frames).toHaveLength(2);

      const lastFrame = result.frames[1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("ERROR");
      expect(lastFrame.error?.type).toBe("TypeError");
    });

    it("should error when setting property on null", () => {
      const code = `
        let obj = null;
        obj.property = "value";
      `;
      const result = interpret(code);
      expect(result.success).toBe(false);
      expect(result.error).toBe(null);
      expect(result.frames).toHaveLength(2);

      const lastFrame = result.frames[1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("ERROR");
      expect(lastFrame.error?.type).toBe("TypeError");
    });

    it("should error when setting property on undefined", () => {
      const code = `
        let obj;
        obj.property = "value";
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
