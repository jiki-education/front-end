import { compile, interpret } from "@javascript/interpreter";

describe("missing let in for loops", () => {
  describe("for...of without let/const", () => {
    test("is a syntax error", () => {
      const { error } = interpret('for (letter of "abc") {}');
      expect(error).not.toBeNull();
      expect(error?.type).toBe("MissingLetInForOf");
    });

    test("is a syntax error even when the variable is already declared", () => {
      const code = `
        let letter = "";
        for (letter of "abc") {}
      `;
      const { error } = interpret(code);
      expect(error).not.toBeNull();
      expect(error?.type).toBe("MissingLetInForOf");
    });

    test("system message includes the variable name", () => {
      const { error } = interpret('for (letter of "abc") {}');
      expect(error?.message).toBe("MissingLetInForOf: name: letter");
    });

    test("reports ForOfStatementNotAllowed when for...of is not allowed on the level", () => {
      const result = compile('for (letter of "abc") {}', {
        languageFeatures: {
          allowedNodes: ["ForStatement", "BlockStatement", "LiteralExpression", "IdentifierExpression"],
        },
      });
      expect(result.success).toBe(false);
      expect(result.success === false && result.error.type).toBe("ForOfStatementNotAllowed");
    });

    test("reports MissingLetInForOf when for...of is allowed on the level", () => {
      const result = compile('for (letter of "abc") {}', {
        languageFeatures: {
          allowedNodes: ["ForOfStatement", "BlockStatement", "LiteralExpression", "IdentifierExpression"],
        },
      });
      expect(result.success).toBe(false);
      expect(result.success === false && result.error.type).toBe("MissingLetInForOf");
    });
  });

  describe("for...in without let/const", () => {
    test("is a syntax error", () => {
      const code = `
        let obj = {};
        for (key in obj) {}
      `;
      const { error } = interpret(code);
      expect(error).not.toBeNull();
      expect(error?.type).toBe("MissingLetInForIn");
    });

    test("system message includes the variable name", () => {
      const code = `
        let obj = {};
        for (key in obj) {}
      `;
      const { error } = interpret(code);
      expect(error?.message).toBe("MissingLetInForIn: name: key");
    });

    test("reports ForInStatementNotAllowed when for...in is not allowed on the level", () => {
      const result = compile("for (key in obj) {}", {
        languageFeatures: {
          allowedNodes: ["ForStatement", "BlockStatement", "LiteralExpression", "IdentifierExpression"],
        },
      });
      expect(result.success).toBe(false);
      expect(result.success === false && result.error.type).toBe("ForInStatementNotAllowed");
    });

    test("reports MissingLetInForIn when for...in is allowed on the level", () => {
      const result = compile("for (key in obj) {}", {
        languageFeatures: {
          allowedNodes: ["ForInStatement", "BlockStatement", "LiteralExpression", "IdentifierExpression"],
        },
      });
      expect(result.success).toBe(false);
      expect(result.success === false && result.error.type).toBe("MissingLetInForIn");
    });
  });

  describe("C-style for loop init without let", () => {
    test("assignment init is a syntax error", () => {
      const { error } = interpret("for (i = 0; i < 5; i++) {}");
      expect(error).not.toBeNull();
      expect(error?.type).toBe("MissingLetInForLoopInit");
    });

    test("assignment init is a syntax error even when the variable is already declared", () => {
      const code = `
        let i = 10;
        for (i = 0; i < 3; i++) {}
      `;
      const { error } = interpret(code);
      expect(error).not.toBeNull();
      expect(error?.type).toBe("MissingLetInForLoopInit");
    });

    test("empty init is still allowed", () => {
      const code = `
        let i = 0;
        for (; i < 3; i++) {}
      `;
      const { error, success } = interpret(code);
      expect(error).toBeNull();
      expect(success).toBe(true);
    });

    test("let init is still allowed", () => {
      const { error, success } = interpret("for (let i = 0; i < 3; i++) {}");
      expect(error).toBeNull();
      expect(success).toBe(true);
    });
  });
});
