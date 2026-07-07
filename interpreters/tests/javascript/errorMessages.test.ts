import { interpret } from "@javascript/interpreter";
import { parse } from "@javascript/parser";
import { changeLanguage } from "@javascript/translator";
import { describe, test, expect, beforeAll, afterAll } from "vitest";

function errorFrame(code: string) {
  const { frames } = interpret(code);
  return frames.find(f => f.status === "ERROR");
}

describe("reworked error messages", () => {
  // The global test setup runs in the "system" language.
  describe("types / system format", () => {
    test("UpdateOperatorRequiresNumber: ++ on a non-number", () => {
      const f = errorFrame('let x = "hi";\nx++;');
      expect(f?.error?.type).toBe("UpdateOperatorRequiresNumber");
      expect(f?.error?.message).toBe("UpdateOperatorRequiresNumber: operator: ++: type: string");
    });

    test("MissingClassNameAfterNew: new without a class name", () => {
      expect(() => parse("new 5();")).toThrow("MissingClassNameAfterNew");
    });

    test("MethodUsedWithoutParentheses: bare method reference", () => {
      const f = errorFrame("let arr = [1, 2];\nlet x = arr.push;");
      expect(f?.error?.type).toBe("MethodUsedWithoutParentheses");
      expect(f?.error?.context?.property).toBe("push");
    });

    test("calling a method (with parentheses) does NOT trigger the guard", () => {
      const { frames } = interpret("let arr = [1, 2];\narr.push(3);");
      expect(frames.find(fr => fr.status === "ERROR")).toBeUndefined();
    });

    test("accessing a real property (length) does NOT trigger the guard", () => {
      const { frames } = interpret("let arr = [1, 2];\nlet n = arr.length;");
      expect(frames.find(fr => fr.status === "ERROR")).toBeUndefined();
    });

    test("UnterminatedBlockComment: unclosed /*", () => {
      expect(() => parse("/* hello world")).toThrow("UnterminatedBlockComment");
    });
  });

  describe("English copy with interpolated context", () => {
    beforeAll(async () => {
      await changeLanguage("en");
    });
    afterAll(async () => {
      await changeLanguage("system");
    });

    test("UpdateOperatorRequiresNumber names the operator and type", () => {
      const f = errorFrame('let x = "hi";\nx++;');
      expect(f?.error?.message).toBe("Jiki can't use ++ on a string - only on numbers.");
    });

    test("MissingExpression names the offending token", () => {
      expect(() => parse("1 +;")).toThrow("Jiki didn't understand what to do with ; here.");
    });

    test("MissingClassNameAfterNew", () => {
      expect(() => parse("new 5();")).toThrow("Jiki expected the name of a class after `new`, but didn't find one.");
    });

    test("UnterminatedBlockComment", () => {
      expect(() => parse("/* hello world")).toThrow("Jiki couldn't find the `*/` needed to close this block comment.");
    });

    // These runtime errors used to hardcode a raw system-format string and
    // bypass translate(); they now render their English copy.
    test("InOperatorRequiresObject renders English (was raw system text)", () => {
      const f = errorFrame('let y = "a" in 5;');
      expect(f?.error?.type).toBe("InOperatorRequiresObject");
      expect(f?.error?.message).toBe(
        "The `in` operator requires an object/dictionary on the right side, but instead you gave it a number."
      );
    });

    test("ArrayIndexNotNumber renders its English copy", () => {
      const f = errorFrame('let a = [1];\nlet b = a["x"];');
      expect(f?.error?.type).toBe("ArrayIndexNotNumber");
      expect(f?.error?.message).toBe("You can only use a number as an array index, like `myArray[0]`.");
    });

    test("MethodUsedWithoutParentheses renders the full guidance", () => {
      const f = errorFrame("let arr = [1, 2];\nlet x = arr.push;");
      expect(f?.error?.message).toBe(
        "The `push` property does not exist on arrays. Did you mean to use the `push` method? If so, remember you need to add brackets like you would with a normal function."
      );
    });
  });
});
