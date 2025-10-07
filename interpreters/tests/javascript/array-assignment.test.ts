import { describe, it, expect } from "vitest";
import { interpret } from "@javascript/interpreter";

// Type for frames augmented in test environment
interface TestFrame {
  status: "SUCCESS" | "ERROR";
  result?: any;
  variables?: Record<string, any>;
  description?: string;
  error?: { type: string; message?: string };
}

describe("JavaScript - Array Element Assignment", () => {
  describe("Basic element assignment", () => {
    it("should assign to array element at index 0", () => {
      const sourceCode = `
        let arr = [1, 2, 3];
        arr[0] = 5;
      `;

      const result = interpret(sourceCode);
      expect(result.error).toBeNull();
      expect(result.success).toBe(true);
      expect(result.frames).toHaveLength(2);

      // First frame: variable declaration
      expect(result.frames[0].status).toBe("SUCCESS");

      // Second frame: assignment
      const assignmentFrame = result.frames[1] as TestFrame;
      expect(assignmentFrame.status).toBe("SUCCESS");
      expect(assignmentFrame.variables?.arr?.toString()).toBe("[ 5, 2, 3 ]");
    });

    it("should assign to array element at middle index", () => {
      const sourceCode = `
        let arr = [10, 20, 30, 40];
        arr[2] = 99;
      `;

      const result = interpret(sourceCode);
      expect(result.error).toBeNull();
      expect(result.success).toBe(true);
      expect(result.frames).toHaveLength(2);

      const assignmentFrame = result.frames[1] as TestFrame;
      expect(assignmentFrame.status).toBe("SUCCESS");
      expect(assignmentFrame.variables?.arr?.toString()).toBe("[ 10, 20, 99, 40 ]");
    });

    it("should assign to last array element", () => {
      const sourceCode = `
        let arr = ["a", "b", "c"];
        arr[2] = "z";
      `;

      const result = interpret(sourceCode);
      expect(result.error).toBeNull();
      expect(result.success).toBe(true);

      const assignmentFrame = result.frames[1] as TestFrame;
      expect(assignmentFrame.status).toBe("SUCCESS");
      expect(assignmentFrame.variables?.arr?.toString()).toBe('[ "a", "b", "z" ]');
    });
  });

  describe("Variable and expression indices", () => {
    it("should assign using variable index", () => {
      const sourceCode = `
        let arr = [1, 2, 3];
        let i = 1;
        arr[i] = 10;
      `;

      const result = interpret(sourceCode);
      expect(result.error).toBeNull();
      expect(result.success).toBe(true);
      expect(result.frames).toHaveLength(3);

      const assignmentFrame = result.frames[2] as TestFrame;
      expect(assignmentFrame.status).toBe("SUCCESS");
      expect(assignmentFrame.variables?.arr?.toString()).toBe("[ 1, 10, 3 ]");
    });

    it("should assign using expression index", () => {
      const sourceCode = `
        let arr = [5, 10, 15, 20];
        let i = 1;
        arr[i + 1] = 100;
      `;

      const result = interpret(sourceCode);
      expect(result.error).toBeNull();
      expect(result.success).toBe(true);

      const assignmentFrame = result.frames[2] as TestFrame;
      expect(assignmentFrame.status).toBe("SUCCESS");
      expect(assignmentFrame.variables?.arr?.toString()).toBe("[ 5, 10, 100, 20 ]");
    });
  });

  describe("Array extension", () => {
    it("should extend array when assigning beyond current length", () => {
      const sourceCode = `
        let arr = [1, 2];
        arr[4] = 5;
      `;

      const result = interpret(sourceCode);
      expect(result.error).toBeNull();
      expect(result.success).toBe(true);

      const assignmentFrame = result.frames[1] as TestFrame;
      expect(assignmentFrame.status).toBe("SUCCESS");
      // Should fill gaps with undefined
      expect(assignmentFrame.variables?.arr?.toString()).toBe("[ 1, 2, undefined, undefined, 5 ]");
    });

    it("should extend empty array", () => {
      const sourceCode = `
        let arr = [];
        arr[2] = "hello";
      `;

      const result = interpret(sourceCode);
      expect(result.error).toBeNull();
      expect(result.success).toBe(true);

      const assignmentFrame = result.frames[1] as TestFrame;
      expect(assignmentFrame.status).toBe("SUCCESS");
      expect(assignmentFrame.variables?.arr?.toString()).toBe('[ undefined, undefined, "hello" ]');
    });
  });

  describe("Chained array assignment", () => {
    it("should assign to nested array element", () => {
      const sourceCode = `
        let arr = [[1, 2], [3, 4]];
        arr[0][1] = 99;
      `;

      const result = interpret(sourceCode);
      expect(result.error).toBeNull();
      expect(result.success).toBe(true);

      const assignmentFrame = result.frames[1] as TestFrame;
      expect(assignmentFrame.status).toBe("SUCCESS");
      expect(assignmentFrame.variables?.arr?.toString()).toBe("[ [ 1, 99 ], [ 3, 4 ] ]");
    });

    it("should assign to deeply nested array", () => {
      const sourceCode = `
        let arr = [[[1, 2], [3, 4]], [[5, 6], [7, 8]]];
        arr[1][0][1] = 100;
      `;

      const result = interpret(sourceCode);
      expect(result.error).toBeNull();
      expect(result.success).toBe(true);

      const assignmentFrame = result.frames[1] as TestFrame;
      expect(assignmentFrame.status).toBe("SUCCESS");
      expect(assignmentFrame.variables?.arr?.toString()).toBe("[ [ [ 1, 2 ], [ 3, 4 ] ], [ [ 5, 100 ], [ 7, 8 ] ] ]");
    });
  });

  describe("Runtime errors", () => {
    it("should error when assigning to non-array", () => {
      const sourceCode = `
        let x = 5;
        x[0] = 10;
      `;

      const result = interpret(sourceCode);
      expect(result.error).toBeNull();
      expect(result.frames.length).toBe(2); // Should have 2 frames: variable declaration and error

      const assignmentFrame = result.frames[1] as TestFrame;
      expect(assignmentFrame.status).toBe("ERROR");
      expect(assignmentFrame.error?.message).toContain("TypeError");
    });

    it("should error with non-numeric index", () => {
      const sourceCode = `
        let arr = [1, 2, 3];
        arr["foo"] = 10;
      `;

      const result = interpret(sourceCode);
      expect(result.error).toBeNull();
      expect(result.frames.length).toBe(2);

      const assignmentFrame = result.frames[1] as TestFrame;
      expect(assignmentFrame.status).toBe("ERROR");
      expect(assignmentFrame.error?.message).toContain("TypeError");
    });

    it("should error with non-integer numeric index", () => {
      const sourceCode = `
        let arr = [1, 2, 3];
        arr[1.5] = 10;
      `;

      const result = interpret(sourceCode);
      expect(result.error).toBeNull();
      expect(result.frames.length).toBe(2);

      const assignmentFrame = result.frames[1] as TestFrame;
      expect(assignmentFrame.status).toBe("ERROR");
      expect(assignmentFrame.error?.message).toContain("TypeError");
    });

    it("should error with negative index", () => {
      const sourceCode = `
        let arr = [1, 2, 3];
        arr[-1] = 10;
      `;

      const result = interpret(sourceCode);
      expect(result.error).toBeNull();
      expect(result.frames.length).toBe(2);

      const assignmentFrame = result.frames[1] as TestFrame;
      expect(assignmentFrame.status).toBe("ERROR");
      expect(assignmentFrame.error?.message).toContain("IndexOutOfRange");
    });

    it("should error when accessing undefined nested array", () => {
      const sourceCode = `
        let arr = [[1, 2]];
        arr[1][0] = 5;
      `;

      const result = interpret(sourceCode);
      expect(result.error).toBeNull();
      expect(result.frames.length).toBe(2);

      const assignmentFrame = result.frames[1] as TestFrame;
      expect(assignmentFrame.status).toBe("ERROR");
      expect(assignmentFrame.error?.message).toContain("TypeError");
    });
  });

  describe("Mixed types in arrays", () => {
    it("should allow assigning different types to array elements", () => {
      const sourceCode = `
        let arr = [1, "hello", true];
        arr[0] = false;
        arr[1] = 42;
        arr[2] = "world";
      `;

      const result = interpret(sourceCode);
      expect(result.error).toBeNull();
      expect(result.success).toBe(true);

      const lastFrame = result.frames[3] as TestFrame;
      expect(lastFrame.variables?.arr?.toString()).toBe('[ false, 42, "world" ]');
    });
  });
});
