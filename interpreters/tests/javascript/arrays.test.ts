import { test, expect, describe } from "vitest";
import { interpret } from "@javascript/interpreter";

// Type for frames augmented in test environment
interface TestFrame {
  status: "SUCCESS" | "ERROR";
  result?: any;
  variables?: Record<string, any>;
  description?: string;
  error?: { type: string; message?: string };
}

describe("JavaScript Arrays", () => {
  describe("Array creation", () => {
    test("empty array", () => {
      const code = `let arr = [];`;
      const result = interpret(code);

      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames.length).toBe(1);

      const frame = result.frames[0] as TestFrame;
      expect(frame.status).toBe("SUCCESS");
      expect(frame.result?.jikiObject.toString()).toBe("[]");
      expect(frame.variables?.["arr"].toString()).toBe("[]");
    });

    test("array with single number", () => {
      const code = `let arr = [42];`;
      const result = interpret(code);

      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames.length).toBe(1);

      const frame = result.frames[0] as TestFrame;
      expect(frame.status).toBe("SUCCESS");
      expect(frame.result?.jikiObject.toString()).toBe("[ 42 ]");
      expect(frame.variables?.["arr"].toString()).toBe("[ 42 ]");
    });

    test("array with multiple numbers", () => {
      const code = `let arr = [1, 2, 3];`;
      const result = interpret(code);

      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames.length).toBe(1);

      const frame = result.frames[0] as TestFrame;
      expect(frame.status).toBe("SUCCESS");
      expect(frame.result?.jikiObject.toString()).toBe("[ 1, 2, 3 ]");
      expect(frame.variables?.["arr"].toString()).toBe("[ 1, 2, 3 ]");
    });

    test("array with mixed types", () => {
      const code = `let arr = [42, "hello", true, null];`;
      const result = interpret(code);

      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames.length).toBe(1);

      const frame = result.frames[0] as TestFrame;
      expect(frame.status).toBe("SUCCESS");
      expect(frame.result?.jikiObject.toString()).toBe(`[ 42, "hello", true, null ]`);
      expect(frame.variables?.["arr"].toString()).toBe(`[ 42, "hello", true, null ]`);
    });

    test("array with expressions", () => {
      const code = `let arr = [1 + 1, 2 * 3, 10 - 5];`;
      const result = interpret(code);

      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames.length).toBe(1);

      const frame = result.frames[0] as TestFrame;
      expect(frame.status).toBe("SUCCESS");
      expect(frame.result?.jikiObject.toString()).toBe("[ 2, 6, 5 ]");
      expect(frame.variables?.["arr"].toString()).toBe("[ 2, 6, 5 ]");
    });

    test("array with variables", () => {
      const code = `
        let x = 10;
        let y = 20;
        let arr = [x, y, x + y];
      `;
      const result = interpret(code);

      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames.length).toBe(3);

      const frame = result.frames[2] as TestFrame;
      expect(frame.status).toBe("SUCCESS");
      expect(frame.result?.jikiObject.toString()).toBe("[ 10, 20, 30 ]");
      expect(frame.variables?.["arr"].toString()).toBe("[ 10, 20, 30 ]");
    });

    test("nested arrays", () => {
      const code = `let arr = [[1, 2], [3, 4], []];`;
      const result = interpret(code);

      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames.length).toBe(1);

      const frame = result.frames[0] as TestFrame;
      expect(frame.status).toBe("SUCCESS");
      expect(frame.result?.jikiObject.toString()).toBe("[ [ 1, 2 ], [ 3, 4 ], [] ]");
      expect(frame.variables?.["arr"].toString()).toBe("[ [ 1, 2 ], [ 3, 4 ], [] ]");
    });
  });

  describe("Array descriptions", () => {
    test("empty array description", () => {
      const code = `let arr = [];`;
      const result = interpret(code);

      const frame = result.frames[0] as TestFrame;
      expect(frame.description).toContain("Created an empty list");
    });

    test("single element array description", () => {
      const code = `let arr = [42];`;
      const result = interpret(code);

      const frame = result.frames[0] as TestFrame;
      expect(frame.description).toContain("Created a list with 1 element: [ 42 ]");
    });

    test("multiple elements array description", () => {
      const code = `let arr = [1, 2, 3];`;
      const result = interpret(code);

      const frame = result.frames[0] as TestFrame;
      expect(frame.description).toContain("Created a list with 3 elements: [ 1, 2, 3 ]");
    });
  });

  describe("Syntax errors", () => {
    test("missing closing bracket", () => {
      const code = `let arr = [1, 2, 3;`;
      const result = interpret(code);

      expect(result.success).toBe(false);
      expect(result.error?.type).toBe("MissingRightBracketInArray");
      expect(result.frames.length).toBe(0);
    });

    test("trailing comma", () => {
      const code = `let arr = [1, 2, 3,];`;
      const result = interpret(code);

      expect(result.success).toBe(false);
      expect(result.error?.type).toBe("TrailingCommaInArray");
      expect(result.frames.length).toBe(0);
    });

    test("trailing comma in empty array", () => {
      const code = `let arr = [,];`;
      const result = interpret(code);

      expect(result.success).toBe(false);
      expect(result.error?.type).toBe("TrailingCommaInArray");
      expect(result.frames.length).toBe(0);
    });
  });

  describe("Array cloning", () => {
    test("array cloning for immutability", () => {
      const code = `let arr = [1, 2, 3];`;
      const result = interpret(code);

      const frame = result.frames[0] as TestFrame;
      const jikiObject = frame.result?.jikiObject;
      const immutableJikiObject = frame.result?.immutableJikiObject;

      // The objects should be different instances (cloned)
      expect(jikiObject).not.toBe(immutableJikiObject);

      // But their values should be the same
      expect(jikiObject?.toString()).toBe(immutableJikiObject?.toString());
    });
  });

  describe("Array index access", () => {
    test("access first element", () => {
      const code = `
        let arr = [10, 20, 30];
        let first = arr[0];
      `;
      const result = interpret(code);

      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames.length).toBe(2);

      const frame = result.frames[1] as TestFrame;
      expect(frame.status).toBe("SUCCESS");
      expect(frame.result?.jikiObject.toString()).toBe("10");
      expect(frame.variables?.["first"].toString()).toBe("10");
    });

    test("access middle element", () => {
      const code = `
        let arr = [10, 20, 30];
        let middle = arr[1];
      `;
      const result = interpret(code);

      expect(result.success).toBe(true);
      expect(result.frames.length).toBe(2);

      const frame = result.frames[1] as TestFrame;
      expect(frame.status).toBe("SUCCESS");
      expect(frame.result?.jikiObject.toString()).toBe("20");
      expect(frame.variables?.["middle"].toString()).toBe("20");
    });

    test("access last element", () => {
      const code = `
        let arr = [10, 20, 30];
        let last = arr[2];
      `;
      const result = interpret(code);

      expect(result.success).toBe(true);
      expect(result.frames.length).toBe(2);

      const frame = result.frames[1] as TestFrame;
      expect(frame.status).toBe("SUCCESS");
      expect(frame.result?.jikiObject.toString()).toBe("30");
      expect(frame.variables?.["last"].toString()).toBe("30");
    });

    test("access with variable index", () => {
      const code = `
        let arr = [10, 20, 30];
        let i = 1;
        let value = arr[i];
      `;
      const result = interpret(code);

      expect(result.success).toBe(true);
      expect(result.frames.length).toBe(3);

      const frame = result.frames[2] as TestFrame;
      expect(frame.status).toBe("SUCCESS");
      expect(frame.result?.jikiObject.toString()).toBe("20");
      expect(frame.variables?.["value"].toString()).toBe("20");
    });

    test("access with expression index", () => {
      const code = `
        let arr = [10, 20, 30, 40];
        let value = arr[1 + 1];
      `;
      const result = interpret(code);

      expect(result.success).toBe(true);
      expect(result.frames.length).toBe(2);

      const frame = result.frames[1] as TestFrame;
      expect(frame.status).toBe("SUCCESS");
      expect(frame.result?.jikiObject.toString()).toBe("30");
      expect(frame.variables?.["value"].toString()).toBe("30");
    });
  });

  describe("Array index access errors", () => {
    test("index out of bounds - too high", async () => {
      const code = `
        let arr = [10, 20, 30];
        let value = arr[3];
      `;
      const result = interpret(code);

      expect(result.success).toBe(true); // No error, returns undefined
      expect(result.frames.length).toBe(2);

      const frame = result.frames[1] as TestFrame;
      expect(frame.status).toBe("SUCCESS");
      expect(frame.variables?.["value"].toString()).toBe("undefined");
    });

    test("index out of bounds - negative", async () => {
      const code = `
        let arr = [10, 20, 30];
        let value = arr[-1];
      `;
      const result = interpret(code);

      expect(result.success).toBe(false); // Runtime errors don't affect success
      expect(result.frames.length).toBe(2);

      const frame = result.frames[1] as TestFrame;
      expect(frame.status).toBe("ERROR");
      expect(frame.error?.type).toBe("IndexOutOfRange");
    });

    test("non-numeric index", async () => {
      const code = `
        let arr = [10, 20, 30];
        let value = arr["hello"];
      `;
      const result = interpret(code);

      expect(result.success).toBe(false); // Runtime errors don't affect success
      expect(result.frames.length).toBe(2);

      const frame = result.frames[1] as TestFrame;
      expect(frame.status).toBe("ERROR");
      expect(frame.error?.type).toBe("TypeError");
    });

    test("non-integer index", async () => {
      const code = `
        let arr = [10, 20, 30];
        let value = arr[1.5];
      `;
      const result = interpret(code);

      expect(result.success).toBe(false); // Runtime errors don't affect success
      expect(result.frames.length).toBe(2);

      const frame = result.frames[1] as TestFrame;
      expect(frame.status).toBe("ERROR");
      expect(frame.error?.type).toBe("TypeError");
    });

    test("accessing non-array", async () => {
      const code = `
        let notArray = 42;
        let value = notArray[0];
      `;
      const result = interpret(code);

      expect(result.success).toBe(false); // Runtime errors don't affect success
      expect(result.frames.length).toBe(2);

      const frame = result.frames[1] as TestFrame;
      expect(frame.status).toBe("ERROR");
      expect(frame.error?.type).toBe("TypeError");
    });
  });

  describe("Array index access descriptions", () => {
    test("description for array index access", () => {
      const code = `let arr = [10, 20, 30]; let value = arr[1];`;
      const result = interpret(code);

      const frame = result.frames[1] as TestFrame;
      expect(frame.description).toContain("Accessed element at index 1");
      expect(frame.description).toContain("got 20");
    });
  });

  describe("Chained array access", () => {
    test("access nested array - 2D array", () => {
      const code = `
        let matrix = [[1, 2], [3, 4]];
        let value = matrix[0][1];
      `;
      const result = interpret(code);

      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames.length).toBe(2);

      const frame = result.frames[1] as TestFrame;
      expect(frame.status).toBe("SUCCESS");
      expect(frame.result?.jikiObject.toString()).toBe("2");
      expect(frame.variables?.["value"].toString()).toBe("2");
    });

    test("access deeply nested array - 3D array", () => {
      const code = `
        let cube = [[[1, 2], [3, 4]], [[5, 6], [7, 8]]];
        let value = cube[1][0][1];
      `;
      const result = interpret(code);

      expect(result.success).toBe(true);
      expect(result.frames.length).toBe(2);

      const frame = result.frames[1] as TestFrame;
      expect(frame.status).toBe("SUCCESS");
      expect(frame.result?.jikiObject.toString()).toBe("6");
      expect(frame.variables?.["value"].toString()).toBe("6");
    });

    test("chained access with variable indices", () => {
      const code = `
        let matrix = [[10, 20], [30, 40]];
        let i = 1;
        let j = 0;
        let value = matrix[i][j];
      `;
      const result = interpret(code);

      expect(result.success).toBe(true);
      expect(result.frames.length).toBe(4);

      const frame = result.frames[3] as TestFrame;
      expect(frame.status).toBe("SUCCESS");
      expect(frame.result?.jikiObject.toString()).toBe("30");
      expect(frame.variables?.["value"].toString()).toBe("30");
    });

    test("chained access with expression indices", () => {
      const code = `
        let matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
        let value = matrix[1 + 0][2 - 1];
      `;
      const result = interpret(code);

      expect(result.success).toBe(true);
      expect(result.frames.length).toBe(2);

      const frame = result.frames[1] as TestFrame;
      expect(frame.status).toBe("SUCCESS");
      expect(frame.result?.jikiObject.toString()).toBe("5");
      expect(frame.variables?.["value"].toString()).toBe("5");
    });

    test("error in chained access - inner array out of bounds", async () => {
      const code = `
        let matrix = [[1, 2], [3, 4]];
        let value = matrix[0][5];
      `;
      const result = interpret(code);

      expect(result.success).toBe(true); // No error, returns undefined
      expect(result.frames.length).toBe(2);

      const frame = result.frames[1] as TestFrame;
      expect(frame.status).toBe("SUCCESS");
      expect(frame.variables?.["value"].toString()).toBe("undefined");
    });

    test("error in chained access - non-array in chain", async () => {
      const code = `
        let matrix = [[1, 2], [3, 4]];
        let value = matrix[0][1][0];
      `;
      const result = interpret(code);

      expect(result.success).toBe(false);
      expect(result.frames.length).toBe(2);

      const frame = result.frames[1] as TestFrame;
      expect(frame.status).toBe("ERROR");
      expect(frame.error?.type).toBe("TypeError");
    });

    test("chained access with mixed data types", () => {
      const code = `
        let data = [["a", "b"], [true, false], [10, 20]];
        let str = data[0][1];
        let bool = data[1][0];
        let num = data[2][1];
      `;
      const result = interpret(code);

      expect(result.success).toBe(true);
      expect(result.frames.length).toBe(4);

      const frame1 = result.frames[1] as TestFrame;
      const frame2 = result.frames[2] as TestFrame;
      const frame3 = result.frames[3] as TestFrame;
      expect(frame1.variables?.["str"].toString()).toBe("b");
      expect(frame2.variables?.["bool"].toString()).toBe("true");
      expect(frame3.variables?.["num"].toString()).toBe("20");
    });
  });
});
