import { interpret } from "@python/interpreter";
import { SyntaxError } from "@python/error";

describe("variables syntax errors", () => {
  describe("undefined variable access", () => {
    test("accessing undefined variable", () => {
      const { frames, error } = interpret("undefined_var");
      expect(error).toBeNull(); // Runtime errors are in frames, not returned
      const errorFrame = frames.find(f => f.status === "ERROR");
      expect(errorFrame).toBeTruthy();
      expect(errorFrame?.error?.message).toContain("UndefinedVariable");
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("ERROR");
    });

    test("accessing undefined variable in expression", () => {
      const { frames, error } = interpret("5 + missing_var");
      expect(error).toBeNull(); // Runtime errors are in frames, not returned
      const errorFrame = frames.find(f => f.status === "ERROR");
      expect(errorFrame).toBeTruthy();
      expect(errorFrame?.error?.message).toContain("UndefinedVariable");
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("ERROR");
    });

    test("using undefined variable after defining another", () => {
      const { frames, error } = interpret("x = 10\ny");
      expect(error).toBeNull(); // Runtime errors are in frames, not returned
      const errorFrame = frames.find(f => f.status === "ERROR");
      expect(errorFrame).toBeTruthy();
      expect(errorFrame?.error?.message).toContain("UndefinedVariable");
      expect(frames).toBeArrayOfSize(2);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[1].status).toBe("ERROR");
    });
  });

  describe("invalid assignment syntax", () => {
    test("missing variable name", () => {
      const { frames, error } = interpret("= 5");
      expect(error).not.toBeNull();
      expect((error as SyntaxError)?.type).toBe("MissingExpression");
    });

    test("missing value after equals", () => {
      const { frames, error } = interpret("x =");
      expect(error).not.toBeNull();
      expect((error as SyntaxError)?.type).toBe("MissingExpression");
    });

    test("number as variable name", () => {
      const { frames, error } = interpret("123 = 5");
      expect(error).not.toBeNull();
      expect((error as SyntaxError)?.type).toBe("MissingExpression");
    });

    test("keyword as variable name", () => {
      const { frames, error } = interpret("True = 5");
      expect(error).not.toBeNull();
      expect((error as SyntaxError)?.type).toBe("MissingExpression");
    });

    test("string as variable name", () => {
      const { frames, error } = interpret('"hello" = 5');
      expect(error).not.toBeNull();
      expect((error as SyntaxError)?.type).toBe("MissingExpression");
    });
  });

  describe("complex undefined variable scenarios", () => {
    test("undefined variable in complex expression", () => {
      const { frames, error } = interpret("result = (5 + unknown) * 2");
      expect(error).toBeNull(); // Runtime errors are in frames, not returned
      const errorFrame = frames.find(f => f.status === "ERROR");
      expect(errorFrame).toBeTruthy();
      expect(errorFrame?.error?.message).toContain("UndefinedVariable");
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("ERROR");
    });

    test("multiple undefined variables", () => {
      const { frames, error } = interpret("a + b");
      expect(error).toBeNull(); // Runtime errors are in frames, not returned
      const errorFrame = frames.find(f => f.status === "ERROR");
      expect(errorFrame).toBeTruthy();
      expect(errorFrame?.error?.message).toContain("UndefinedVariable");
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("ERROR");
    });

    test("assigning undefined variable to another variable", () => {
      const { frames, error } = interpret("x = undefined_var");
      expect(error).toBeNull(); // Runtime errors are in frames, not returned
      const errorFrame = frames.find(f => f.status === "ERROR");
      expect(errorFrame).toBeTruthy();
      expect(errorFrame?.error?.message).toContain("UndefinedVariable");
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("ERROR");
    });

    test("using undefined variable in comparison", () => {
      const { frames, error } = interpret("missing > 5");
      expect(error).toBeNull(); // Runtime errors are in frames, not returned
      const errorFrame = frames.find(f => f.status === "ERROR");
      expect(errorFrame).toBeTruthy();
      expect(errorFrame?.error?.message).toContain("UndefinedVariable");
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("ERROR");
    });

    test("using undefined variable in logical expression", () => {
      const { frames, error } = interpret("True and missing");
      expect(error).toBeNull(); // Runtime errors are in frames, not returned
      const errorFrame = frames.find(f => f.status === "ERROR");
      expect(errorFrame).toBeTruthy();
      expect(errorFrame?.error?.message).toContain("UndefinedVariable");
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("ERROR");
    });
  });

  describe("edge cases", () => {
    test("empty variable name", () => {
      // This would be caught by the scanner as an indentation error
      // since " = 5" starts with 1 space (not multiple of 4)
      const { frames, error } = interpret(" = 5");
      expect(error).not.toBeNull();
      expect((error as SyntaxError)?.type).toBe("IndentationError");
    });
  });
});
