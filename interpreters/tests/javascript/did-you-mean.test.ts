import { evaluateFunction, interpret } from "@javascript/interpreter";
import type { ExternalFunction } from "@shared/interfaces";

const turnRight: ExternalFunction = {
  name: "turnRight",
  func: () => undefined,
  description: "turns right",
  arity: 0,
};

describe("did you mean suggestions", () => {
  describe("FunctionNotFoundWithSimilarNameSuggestion", () => {
    test("suggests an external function that differs only in capitalisation", () => {
      const { frames } = interpret("turnright();", { externalFunctions: [turnRight] });
      expect(frames[0].status).toBe("ERROR");
      expect(frames[0].error!.type).toBe("FunctionNotFoundWithSimilarNameSuggestion");
      expect(frames[0].error!.message).toBe(
        "FunctionNotFoundWithSimilarNameSuggestion: name: turnright: suggestion: turnRight"
      );
    });

    test("suggests a user-defined function with a typo", () => {
      const code = `
        function moveForward() {}
        moveFoward();
      `;
      const { frames } = interpret(code);
      const errorFrame = frames.find(f => f.status === "ERROR")!;
      expect(errorFrame.error!.message).toBe(
        "FunctionNotFoundWithSimilarNameSuggestion: name: moveFoward: suggestion: moveForward"
      );
    });

    test("only suggests callables", () => {
      const code = `
        let turnRight = 5;
        turnright();
      `;
      const { frames } = interpret(code);
      const errorFrame = frames.find(f => f.status === "ERROR")!;
      expect(errorFrame.error!.message).toBe("FunctionNotFound: name: turnright");
    });

    test("falls back to FunctionNotFound when nothing is close", () => {
      const { frames } = interpret("jump();", { externalFunctions: [turnRight] });
      expect(frames[0].error!.type).toBe("FunctionNotFound");
      expect(frames[0].error!.message).toBe("FunctionNotFound: name: jump");
    });

    test("suggests the student's function when a test calls a misnamed one", () => {
      const { frames } = evaluateFunction("function m0ve() {}", {}, "move");
      expect(frames[0].error!.message).toBe("FunctionNotFoundWithSimilarNameSuggestion: name: move: suggestion: m0ve");
    });
  });

  describe("VariableNotDeclaredWithSimilarNameSuggestion", () => {
    test("suggests a variable that differs only in capitalisation", () => {
      const code = `
        let myName = "Jiki";
        myname;
      `;
      const { frames } = interpret(code);
      const errorFrame = frames.find(f => f.status === "ERROR")!;
      expect(errorFrame.error!.message).toBe(
        "VariableNotDeclaredWithSimilarNameSuggestion: name: myname: suggestion: myName"
      );
    });

    test("only suggests non-callables", () => {
      const { frames } = interpret("turnright;", { externalFunctions: [turnRight] });
      expect(frames[0].error!.message).toBe("VariableNotDeclared: name: turnright");
    });

    test("does not suggest a different short name", () => {
      const code = `
        let y = 1;
        x;
      `;
      const { frames } = interpret(code);
      const errorFrame = frames.find(f => f.status === "ERROR")!;
      expect(errorFrame.error!.message).toBe("VariableNotDeclared: name: x");
    });

    test("never suggests a secret constant", () => {
      const { frames } = interpret("Radius;", { secretConstants: { radius: 10 } });
      expect(frames[0].error!.message).toBe("VariableNotDeclared: name: Radius");
    });

    test("suggests a student variable that shadows a secret constant's name", () => {
      const code = `
        function area() {
          let radius = 2;
          return Radius;
        }
        area();
      `;
      const { frames } = interpret(code, {
        secretConstants: { radius: 10 },
        languageFeatures: { allowShadowing: true },
      });
      const errorFrame = frames.find(f => f.status === "ERROR")!;
      expect(errorFrame.error!.message).toBe(
        "VariableNotDeclaredWithSimilarNameSuggestion: name: Radius: suggestion: radius"
      );
    });
  });
});
