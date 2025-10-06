import type { FunctionParameter } from "@jikiscript/statement";
import type { Token } from "../token";
import type { ErrorType } from "@jikiscript/error";

export function errorForMissingDoAfterParameters(
  token: Token,
  parameters: FunctionParameter[]
): { errorType: ErrorType; context: {} } {
  if (token.type === "EOL") {
    return {
      errorType: "MissingDoToStartFunctionBody",
      context: {
        type: "function",
      },
    };
  }

  if (token.type === "IDENTIFIER") {
    if (parameters.length === 0) {
      return {
        errorType: "MissingWithBeforeParametersInFunction",
        context: {},
      };
    }
    return {
      errorType: "MissingCommaBetweenFunctionParameters",
      context: {
        parameter: parameters[parameters.length - 1].name.lexeme,
      },
    };
  }

  return {
    errorType: "UnexpectedTokenAfterParametersInFunction",
    context: {},
  };
}
// this.error("MissingCommaAfterParameter", , { parameter: parameters[-1].name })
