import { describe, it, expect } from "vitest";
import { interpret } from "../../src/python";
import type { TestAugmentedFrame } from "../../src/shared/frames";

describe("Python builtin functions", () => {
  describe("print()", () => {
    it("should call print with no arguments", () => {
      const result = interpret("print()");

      expect(result.success).toBe(true);
      expect(result.frames).toHaveLength(1);
      expect(result.frames[0].result?.jikiObject.type).toBe("none");
      expect(result.frames[0].status).toBe("SUCCESS");
    });

    it("should call print with a single string argument", () => {
      const result = interpret('print("Hello")');

      expect(result.success).toBe(true);
      expect(result.frames).toHaveLength(1);
      expect(result.frames[0].result?.jikiObject.type).toBe("none");
      expect((result.frames[0] as TestAugmentedFrame).description).toContain("print");
      expect((result.frames[0] as TestAugmentedFrame).description).toContain("Hello");
    });

    it("should call print with a single number argument", () => {
      const result = interpret("print(42)");

      expect(result.success).toBe(true);
      expect(result.frames).toHaveLength(1);
      expect(result.frames[0].result?.jikiObject.type).toBe("none");
      expect((result.frames[0] as TestAugmentedFrame).description).toContain("print");
      expect((result.frames[0] as TestAugmentedFrame).description).toContain("42");
    });

    it("should call print with multiple arguments", () => {
      const result = interpret('print("Hello", "World", 42)');

      expect(result.success).toBe(true);
      expect(result.frames).toHaveLength(1);
      expect(result.frames[0].result?.jikiObject.type).toBe("none");
      expect((result.frames[0] as TestAugmentedFrame).description).toContain("print");
      expect((result.frames[0] as TestAugmentedFrame).description).toContain("Hello");
      expect((result.frames[0] as TestAugmentedFrame).description).toContain("World");
      expect((result.frames[0] as TestAugmentedFrame).description).toContain("42");
    });

    it("should call print with variable arguments", () => {
      const result = interpret(`x = 10
print(x)`);

      expect(result.success).toBe(true);
      expect(result.frames).toHaveLength(2);
      expect(result.frames[1].result?.jikiObject.type).toBe("none");
      expect((result.frames[1] as TestAugmentedFrame).description).toContain("print");
      expect((result.frames[1] as TestAugmentedFrame).description).toContain("10");
    });

    it("should call print with boolean values", () => {
      const result = interpret("print(True, False)");

      expect(result.success).toBe(true);
      expect(result.frames).toHaveLength(1);
      expect((result.frames[0] as TestAugmentedFrame).description).toContain("True");
      expect((result.frames[0] as TestAugmentedFrame).description).toContain("False");
    });

    it("should call print with None", () => {
      const result = interpret("print(None)");

      expect(result.success).toBe(true);
      expect(result.frames).toHaveLength(1);
      expect((result.frames[0] as TestAugmentedFrame).description).toContain("None");
    });

    it("should call print with list", () => {
      const result = interpret("print([1, 2, 3])");

      expect(result.success).toBe(true);
      expect(result.frames).toHaveLength(1);
      expect((result.frames[0] as TestAugmentedFrame).description).toContain("[1, 2, 3]");
    });

    it("should call print multiple times", () => {
      const result = interpret(`print("First")
print("Second")
print("Third")`);

      expect(result.success).toBe(true);
      expect(result.frames).toHaveLength(3);
      expect((result.frames[0] as TestAugmentedFrame).description).toContain("First");
      expect((result.frames[1] as TestAugmentedFrame).description).toContain("Second");
      expect((result.frames[2] as TestAugmentedFrame).description).toContain("Third");
    });

    it("should call print with expression arguments", () => {
      const result = interpret("print(2 + 3, 10 * 2)");

      expect(result.success).toBe(true);
      expect(result.frames).toHaveLength(1);
      expect((result.frames[0] as TestAugmentedFrame).description).toContain("5");
      expect((result.frames[0] as TestAugmentedFrame).description).toContain("20");
    });

    it("should describe print output correctly for single argument", () => {
      const result = interpret('print("test")');

      expect(result.success).toBe(true);
      const description = (result.frames[0] as TestAugmentedFrame).description;
      expect(description).toContain("This printed");
      expect(description).toContain("test");
    });

    it("should describe print output correctly for multiple arguments", () => {
      const result = interpret('print("Hello", "World")');

      expect(result.success).toBe(true);
      const description = (result.frames[0] as TestAugmentedFrame).description;
      expect(description).toContain("This printed");
      expect(description).toContain("Hello World");
    });

    it("should describe print with no arguments as printing blank line", () => {
      const result = interpret("print()");

      expect(result.success).toBe(true);
      const description = (result.frames[0] as TestAugmentedFrame).description;
      expect(description).toContain("This printed a blank line");
    });
  });

  describe("print() logLines", () => {
    it("should log output to logLines with time", () => {
      const result = interpret('print("Hello")');

      expect(result.success).toBe(true);
      expect(result.logLines).toHaveLength(1);
      expect(result.logLines[0].output).toBe("Hello");
      expect(result.logLines[0].time).toBe(0);
    });

    it("should log multiple arguments separated by spaces", () => {
      const result = interpret('print("Hello", "World", 42)');

      expect(result.success).toBe(true);
      expect(result.logLines).toHaveLength(1);
      expect(result.logLines[0].output).toBe("Hello World 42");
    });

    it("should log empty string for print with no arguments", () => {
      const result = interpret("print()");

      expect(result.success).toBe(true);
      expect(result.logLines).toHaveLength(1);
      expect(result.logLines[0].output).toBe("");
    });

    it("should log multiple print calls with correct times", () => {
      const result = interpret(`print("First")
print("Second")
print("Third")`);

      expect(result.success).toBe(true);
      expect(result.logLines).toHaveLength(3);
      expect(result.logLines[0].output).toBe("First");
      expect(result.logLines[0].time).toBe(0);
      expect(result.logLines[1].output).toBe("Second");
      expect(result.logLines[1].time).toBe(1);
      expect(result.logLines[2].output).toBe("Third");
      expect(result.logLines[2].time).toBe(2);
    });

    it("should log boolean values as strings", () => {
      const result = interpret("print(True, False)");

      expect(result.success).toBe(true);
      expect(result.logLines).toHaveLength(1);
      expect(result.logLines[0].output).toBe("True False");
    });

    it("should log None as string", () => {
      const result = interpret("print(None)");

      expect(result.success).toBe(true);
      expect(result.logLines).toHaveLength(1);
      expect(result.logLines[0].output).toBe("None");
    });

    it("should log list representations", () => {
      const result = interpret("print([1, 2, 3])");

      expect(result.success).toBe(true);
      expect(result.logLines).toHaveLength(1);
      expect(result.logLines[0].output).toBe("[1, 2, 3]");
    });

    it("should log expression results", () => {
      const result = interpret("print(2 + 3, 10 * 2)");

      expect(result.success).toBe(true);
      expect(result.logLines).toHaveLength(1);
      expect(result.logLines[0].output).toBe("5 20");
    });

    it("should log variable values", () => {
      const result = interpret(`x = 10
y = 20
print(x, y)`);

      expect(result.success).toBe(true);
      expect(result.logLines).toHaveLength(1);
      expect(result.logLines[0].output).toBe("10 20");
      expect(result.logLines[0].time).toBe(2); // After two assignment statements
    });
  });
});
