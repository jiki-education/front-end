import type { Executor } from "../executor";
import type { UnaryExpression } from "../expression";
import type { EvaluationResultUnaryExpression, EvaluationResultExpression } from "../evaluation-result";
import { createJSObject, type JikiObject } from "../jikiObjects";
import { RuntimeError } from "../executor";

export function executeUnaryExpression(
  executor: Executor,
  expression: UnaryExpression
): EvaluationResultUnaryExpression {
  const operandResult = executor.evaluate(expression.operand);

  const result = handleUnaryOperation(executor, expression, operandResult);

  return {
    type: "UnaryExpression",
    operand: operandResult,
    jikiObject: result,
    immutableJikiObject: result.clone(),
  } as any;
}

function handleUnaryOperation(
  executor: Executor,
  expression: UnaryExpression,
  operandResult: EvaluationResultExpression
): JikiObject {
  const operand = operandResult.jikiObject.value;
  const operandType = operandResult.jikiObject.type;

  switch (expression.operator.type) {
    case "MINUS":
      // Check for type coercion when disabled
      if (!executor.languageFeatures.allowTypeCoercion && operandType !== "number") {
        throw new RuntimeError(
          `TypeCoercionNotAllowed: operator: ${expression.operator.lexeme}: operand: ${operandType}`,
          expression.location,
          "TypeCoercionNotAllowed"
        );
      }
      return createJSObject(-operand);
    case "PLUS":
      // Check for type coercion when disabled
      if (!executor.languageFeatures.allowTypeCoercion && operandType !== "number") {
        throw new RuntimeError(
          `TypeCoercionNotAllowed: operator: ${expression.operator.lexeme}: operand: ${operandType}`,
          expression.location,
          "TypeCoercionNotAllowed"
        );
      }
      return createJSObject(+operand);
    case "NOT":
      // Logical NOT doesn't need type coercion check as it works with all types
      return createJSObject(!operand);
    default:
      throw new RuntimeError(
        `Unsupported unary operator: ${expression.operator.type}`,
        expression.location,
        "InvalidUnaryExpression"
      );
  }
}
