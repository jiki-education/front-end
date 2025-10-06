import { describe, expect, test } from "vitest";
import { parse } from "@javascript/parser";
import { interpret } from "@javascript/interpreter";

describe("negation syntax errors", () => {
  describe("missing operand", () => {
    test("arithmetic negation without operand", () => {
      expect(() => parse("-;")).toThrow();
    });

    test("logical negation without operand", () => {
      expect(() => parse("!;")).toThrow();
    });

    test("arithmetic negation at end of file", () => {
      expect(() => parse("-")).toThrow();
    });

    test("logical negation at end of file", () => {
      expect(() => parse("!")).toThrow();
    });
  });

  describe("invalid operand placement", () => {
    test("arithmetic negation with missing right operand in expression", () => {
      expect(() => parse("5 + -;")).toThrow();
    });

    test("logical negation with missing right operand in expression", () => {
      expect(() => parse("true && !;")).toThrow();
    });

    test("negation followed by binary operator", () => {
      expect(() => parse("- +;")).toThrow();
    });

    test("negation followed by closing parenthesis", () => {
      expect(() => parse("(-);")).toThrow();
    });
  });

  describe("incomplete expressions", () => {
    test("negation in incomplete parentheses", () => {
      expect(() => parse("(-5")).toThrow();
    });

    test("logical negation in incomplete parentheses", () => {
      expect(() => parse("(!true")).toThrow();
    });

    test("negation with incomplete binary expression", () => {
      expect(() => parse("-(5 +")).toThrow();
    });

    test("logical negation with incomplete binary expression", () => {
      expect(() => parse("!(true &&")).toThrow();
    });
  });

  describe("invalid negation combinations", () => {
    test("arithmetic negation followed by logical negation without operand", () => {
      expect(() => parse("-!;")).toThrow();
    });

    test("multiple operators without operand", () => {
      expect(() => parse("--!;")).toThrow();
    });
  });
});
