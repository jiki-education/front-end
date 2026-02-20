import { interpret } from "@javascript/interpreter";

describe("Footgun #15: Implicit globals and const protections", () => {
  // In real JS: forgetting let/const creates implicit global variables
  // Jiki requires let/const - undeclared variables throw VariableNotDeclared

  describe("implicit globals blocked", () => {
    test("assignment without declaration is blocked", () => {
      const { frames } = interpret("x = 5");
      expect(frames[0].status).toBe("ERROR");
      expect(frames[0].error?.type).toBe("VariableNotDeclared");
    });

    test("using undeclared variable is blocked", () => {
      const { frames } = interpret("x + 1");
      expect(frames[0].status).toBe("ERROR");
      expect(frames[0].error?.type).toBe("VariableNotDeclared");
    });
  });

  describe("const protections", () => {
    test("const without initializer is a syntax error", () => {
      const { error } = interpret("const x;");
      expect(error).not.toBeNull();
      expect(error?.type).toBe("MissingInitializerInConstDeclaration");
    });

    test("const reassignment is blocked", () => {
      const { frames } = interpret("const x = 5; x = 10");
      expect(frames[1].status).toBe("ERROR");
      expect(frames[1].error?.type).toBe("AssignmentToConstant");
    });

    test("const in C-style for loop is a syntax error", () => {
      const { error } = interpret("for (const i = 0; i < 5; i++) {}");
      expect(error).not.toBeNull();
      expect(error?.type).toBe("ConstInForLoopInit");
    });

    test("const ++ is blocked", () => {
      const { frames } = interpret("const x = 5; x++");
      expect(frames[1].status).toBe("ERROR");
      expect(frames[1].error?.type).toBe("AssignmentToConstant");
    });
  });

  describe("infinite loop protection", () => {
    test("infinite while loop is caught", () => {
      const { frames } = interpret("while (true) { let x = 1 }");
      const errorFrame = frames.find(f => f.status === "ERROR");
      expect(errorFrame).toBeDefined();
      expect(errorFrame?.error?.type).toBe("MaxIterationsReached");
    });
  });
});
