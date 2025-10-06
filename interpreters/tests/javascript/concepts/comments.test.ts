import { parse } from "@javascript/parser";

describe("comments", () => {
  describe("parse", () => {
    test("basic text", () => {
      const stmts = parse("// this is a comment");
      expect(stmts).toBeArrayOfSize(0);
    });

    test("text with symbols", () => {
      const stmts = parse("// this (is) a. comme,nt do");
      expect(stmts).toBeArrayOfSize(0);
    });

    test("comment after number", () => {
      const stmts = parse("5; // this is a comment");
      expect(stmts).toBeArrayOfSize(1);
    });

    test("multiline comment", () => {
      const stmts = parse("/* this is a multiline comment */");
      expect(stmts).toBeArrayOfSize(0);
    });

    test("multiline comment with number", () => {
      const stmts = parse("5; /* comment */ 6;");
      expect(stmts).toBeArrayOfSize(2);
    });
  });
});
