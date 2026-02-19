import { test, expect, describe } from "vitest";
import { interpret } from "@javascript/interpreter";

interface TestFrame {
  status: "SUCCESS" | "ERROR";
  result?: any;
  variables?: Record<string, any>;
  description?: string;
  error?: { type: string; message?: string };
}

describe("JavaScript String Indexing", () => {
  describe("Basic string index access", () => {
    test("access first character", () => {
      const code = `
        let s = "hello";
        let c = s[0];
      `;
      const result = interpret(code);

      expect(result.success).toBe(true);
      expect(result.error).toBe(null);
      expect(result.frames.length).toBe(2);

      const frame = result.frames[1] as TestFrame;
      expect(frame.status).toBe("SUCCESS");
      expect(frame.result?.jikiObject.toString()).toBe("h");
      expect(frame.variables?.["c"].toString()).toBe("h");
    });

    test("access middle character", () => {
      const code = `
        let s = "hello";
        let c = s[2];
      `;
      const result = interpret(code);

      expect(result.success).toBe(true);
      expect(result.frames.length).toBe(2);

      const frame = result.frames[1] as TestFrame;
      expect(frame.status).toBe("SUCCESS");
      expect(frame.result?.jikiObject.toString()).toBe("l");
      expect(frame.variables?.["c"].toString()).toBe("l");
    });

    test("access last character", () => {
      const code = `
        let s = "hello";
        let c = s[4];
      `;
      const result = interpret(code);

      expect(result.success).toBe(true);
      expect(result.frames.length).toBe(2);

      const frame = result.frames[1] as TestFrame;
      expect(frame.status).toBe("SUCCESS");
      expect(frame.result?.jikiObject.toString()).toBe("o");
      expect(frame.variables?.["c"].toString()).toBe("o");
    });

    test("access with variable index", () => {
      const code = `
        let s = "hello";
        let i = 1;
        let c = s[i];
      `;
      const result = interpret(code);

      expect(result.success).toBe(true);
      expect(result.frames.length).toBe(3);

      const frame = result.frames[2] as TestFrame;
      expect(frame.status).toBe("SUCCESS");
      expect(frame.result?.jikiObject.toString()).toBe("e");
      expect(frame.variables?.["c"].toString()).toBe("e");
    });

    test("access with expression index", () => {
      const code = `
        let s = "hello";
        let c = s[1 + 2];
      `;
      const result = interpret(code);

      expect(result.success).toBe(true);
      expect(result.frames.length).toBe(2);

      const frame = result.frames[1] as TestFrame;
      expect(frame.status).toBe("SUCCESS");
      expect(frame.result?.jikiObject.toString()).toBe("l");
      expect(frame.variables?.["c"].toString()).toBe("l");
    });

    test("string literal indexing", () => {
      const code = `let c = "hello"[1];`;
      const result = interpret(code);

      expect(result.success).toBe(true);
      expect(result.frames.length).toBe(1);

      const frame = result.frames[0] as TestFrame;
      expect(frame.status).toBe("SUCCESS");
      expect(frame.result?.jikiObject.toString()).toBe("e");
      expect(frame.variables?.["c"].toString()).toBe("e");
    });
  });

  describe("Out of bounds", () => {
    test("index beyond string length returns undefined", () => {
      const code = `
        let s = "hi";
        let c = s[5];
      `;
      const result = interpret(code);

      expect(result.success).toBe(true);
      expect(result.frames.length).toBe(2);

      const frame = result.frames[1] as TestFrame;
      expect(frame.status).toBe("SUCCESS");
      expect(frame.variables?.["c"].toString()).toBe("undefined");
    });

    test("empty string index 0 returns undefined", () => {
      const code = `
        let s = "";
        let c = s[0];
      `;
      const result = interpret(code);

      expect(result.success).toBe(true);
      expect(result.frames.length).toBe(2);

      const frame = result.frames[1] as TestFrame;
      expect(frame.status).toBe("SUCCESS");
      expect(frame.variables?.["c"].toString()).toBe("undefined");
    });
  });

  describe("Error cases", () => {
    test("negative index throws IndexOutOfRange", () => {
      const code = `
        let s = "hello";
        let c = s[-1];
      `;
      const result = interpret(code);

      expect(result.success).toBe(false);
      expect(result.frames.length).toBe(2);

      const frame = result.frames[1] as TestFrame;
      expect(frame.status).toBe("ERROR");
      expect(frame.error?.type).toBe("IndexOutOfRange");
    });

    test("non-integer index throws TypeError", () => {
      const code = `
        let s = "hello";
        let c = s[1.5];
      `;
      const result = interpret(code);

      expect(result.success).toBe(false);
      expect(result.frames.length).toBe(2);

      const frame = result.frames[1] as TestFrame;
      expect(frame.status).toBe("ERROR");
      expect(frame.error?.type).toBe("TypeError");
    });

    test("non-numeric string index throws TypeError", () => {
      const code = `
        let s = "hello";
        let c = s["bad"];
      `;
      const result = interpret(code);

      expect(result.success).toBe(false);
      expect(result.frames.length).toBe(2);

      const frame = result.frames[1] as TestFrame;
      expect(frame.status).toBe("ERROR");
      expect(frame.error?.type).toBe("TypeError");
    });

    test("stdlib member via bracket throws TypeError", () => {
      const code = `
        let s = "hello";
        s["length"];
      `;
      const result = interpret(code);

      expect(result.success).toBe(false);
      expect(result.frames.length).toBe(2);

      const frame = result.frames[1] as TestFrame;
      expect(frame.status).toBe("ERROR");
      expect(frame.error?.type).toBe("TypeError");
    });
  });

  describe("Descriptions", () => {
    test("description for string index access", () => {
      const code = `let s = "hello"; let c = s[0];`;
      const result = interpret(code);

      const frame = result.frames[1] as TestFrame;
      expect(frame.description).toContain("Accessed character at index 0");
      expect(frame.description).toContain("got h");
    });

    test("description does not say list", () => {
      const code = `let s = "hello"; let c = s[2];`;
      const result = interpret(code);

      const frame = result.frames[1] as TestFrame;
      expect(frame.description).toContain("string");
      expect(frame.description).not.toContain("list");
    });
  });

  describe("Chained access", () => {
    test("index into string from array element", () => {
      const code = `
        let arr = ["hello", "world"];
        let c = arr[0][1];
      `;
      const result = interpret(code);

      expect(result.success).toBe(true);
      expect(result.frames.length).toBe(2);

      const frame = result.frames[1] as TestFrame;
      expect(frame.status).toBe("SUCCESS");
      expect(frame.result?.jikiObject.toString()).toBe("e");
      expect(frame.variables?.["c"].toString()).toBe("e");
    });

    test("index into string from variable then index", () => {
      const code = `
        let s = "abcdef";
        let c1 = s[0];
        let c2 = s[5];
      `;
      const result = interpret(code);

      expect(result.success).toBe(true);
      expect(result.frames.length).toBe(3);

      const frame1 = result.frames[1] as TestFrame;
      const frame2 = result.frames[2] as TestFrame;
      expect(frame1.variables?.["c1"].toString()).toBe("a");
      expect(frame2.variables?.["c2"].toString()).toBe("f");
    });
  });
});
