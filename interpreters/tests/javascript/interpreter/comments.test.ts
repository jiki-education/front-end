import { interpret } from "@javascript/interpreter";

describe("comments interpreter", () => {
  describe("execute", () => {
    test("single line comment only", () => {
      const { frames, error } = interpret("// this is a comment");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(0);
    });

    test("multi-line comment only", () => {
      const { frames, error } = interpret("/* this is a comment */");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(0);
    });

    test("comment with expression", () => {
      const { frames, error } = interpret("42; // this is a comment");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(42);
    });

    test("expression with inline comment", () => {
      const { frames, error } = interpret("1 + /* comment */ 2;");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(3);
    });

    test("multiple statements with comments", () => {
      const { frames, error } = interpret(`
        // First calculation
        1 + 2; 
        /* Second calculation */
        3 * 4;
      `);
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(2);
      expect(frames[0].result?.jikiObject.value).toBe(3);
      expect(frames[1].result?.jikiObject.value).toBe(12);
    });
  });
});
