import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

describe("Dictionary (Object Literals)", () => {
  describe("empty dictionary", () => {
    it("should create an empty dictionary", () => {
      const code = `let empty = {};`;
      const result = interpret(code);
      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames).toHaveLength(1);

      const frame = result.frames[0] as TestAugmentedFrame;
      expect(frame.status).toBe("SUCCESS");
      expect(frame.variables.empty?.toString()).toBe("{}");
    });
  });

  describe("dictionary with various key types", () => {
    it("should create dictionary with identifier keys", () => {
      const code = `let obj = { name: "John", age: 30 };`;
      const result = interpret(code);
      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames).toHaveLength(1);

      const frame = result.frames[0] as TestAugmentedFrame;
      expect(frame.status).toBe("SUCCESS");
      expect(frame.variables.obj?.toString()).toBe('{ name: "John", age: 30 }');
    });

    it("should create dictionary with string keys", () => {
      const code = `let obj = { "first name": "Jane", "last-name": "Doe" };`;
      const result = interpret(code);
      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames).toHaveLength(1);

      const frame = result.frames[0] as TestAugmentedFrame;
      expect(frame.status).toBe("SUCCESS");
      expect(frame.variables.obj?.toString()).toBe('{ "first name": "Jane", "last-name": "Doe" }');
    });

    it("should create dictionary with number keys", () => {
      const code = `let obj = { 0: "zero", 42: "forty-two" };`;
      const result = interpret(code);
      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames).toHaveLength(1);

      const frame = result.frames[0] as TestAugmentedFrame;
      expect(frame.status).toBe("SUCCESS");
      expect(frame.variables.obj?.toString()).toBe('{ "0": "zero", "42": "forty-two" }');
    });
  });

  describe("dictionary with various value types", () => {
    it("should handle different value types", () => {
      const code = `let obj = { str: "hello", num: 42, bool: true, nil: null };`;
      const result = interpret(code);
      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames).toHaveLength(1);

      const frame = result.frames[0] as TestAugmentedFrame;
      expect(frame.status).toBe("SUCCESS");
      expect(frame.variables.obj?.toString()).toBe('{ str: "hello", num: 42, bool: true, nil: null }');
    });

    it("should handle array values", () => {
      const code = `let obj = { items: [1, 2, 3], empty: [] };`;
      const result = interpret(code);
      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames).toHaveLength(1);

      const frame = result.frames[0] as TestAugmentedFrame;
      expect(frame.status).toBe("SUCCESS");
      expect(frame.variables.obj?.toString()).toBe("{ items: [ 1, 2, 3 ], empty: [] }");
    });

    it("should handle nested dictionaries", () => {
      const code = `let obj = { user: { name: "Alice", age: 25 }, active: true };`;
      const result = interpret(code);
      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames).toHaveLength(1);

      const frame = result.frames[0] as TestAugmentedFrame;
      expect(frame.status).toBe("SUCCESS");
      expect(frame.variables.obj?.toString()).toBe('{ user: { name: "Alice", age: 25 }, active: true }');
    });
  });

  describe("dictionary with expressions", () => {
    it("should evaluate expressions in values", () => {
      const code = `
        let x = 10;
        let obj = { sum: x + 5, product: x * 2 };
      `;
      const result = interpret(code);
      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames).toHaveLength(2);

      const frame = result.frames[1] as TestAugmentedFrame;
      expect(frame.status).toBe("SUCCESS");
      expect(frame.variables.obj?.toString()).toBe("{ sum: 15, product: 20 }");
    });

    it("should handle variable references in values", () => {
      const code = `
        let name = "Bob";
        let age = 35;
        let person = { name: name, age: age };
      `;
      const result = interpret(code);
      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames).toHaveLength(3);

      const frame = result.frames[2] as TestAugmentedFrame;
      expect(frame.status).toBe("SUCCESS");
      expect(frame.variables.person?.toString()).toBe('{ name: "Bob", age: 35 }');
    });
  });

  describe("syntax errors", () => {
    it("should error on trailing comma", () => {
      const code = `let obj = { x: 1, };`;
      const result = interpret(code);
      expect(result.success).toBe(false);
      expect(result.error?.type).toBe("TrailingCommaInDictionary");
    });

    it("should error on missing colon", () => {
      const code = `let obj = { x 1 };`;
      const result = interpret(code);
      expect(result.success).toBe(false);
      expect(result.error?.type).toBe("MissingColonInDictionary");
    });

    it("should error on missing closing brace", () => {
      const code = `let obj = { x: 1`;
      const result = interpret(code);
      expect(result.success).toBe(false);
      expect(result.error?.type).toBe("MissingRightBraceInDictionary");
    });

    it("should error on duplicate keys", () => {
      const code = `let obj = { x: 1, x: 2 };`;
      const result = interpret(code);
      expect(result.success).toBe(false);
      expect(result.error?.type).toBe("DuplicateDictionaryKey");
    });

    it("should error on invalid key", () => {
      const code = `let obj = { true: 1 };`;
      const result = interpret(code);
      expect(result.success).toBe(false);
      expect(result.error?.type).toBe("InvalidDictionaryKey");
    });
  });
});
