import type { Executor } from "../executor";
import type { UnaryExpression } from "../expression";
import type { EvaluationResultUnaryExpression } from "../evaluation-result";
import * as Jiki from "../jikiObjects";

export function executeUnaryExpression(
  executor: Executor,
  expression: UnaryExpression
): EvaluationResultUnaryExpression {
  const operand = executor.evaluate(expression.operand);

  switch (expression.operator.type) {
    case "NOT": {
      executor.verifyBoolean(operand.jikiObject, expression.operand);
      const notResult = new Jiki.Boolean(!(operand.jikiObject as Jiki.Boolean).value);
      return {
        type: "UnaryExpression",
        jikiObject: notResult,
        immutableJikiObject: notResult.clone(),
        operand: operand,
      };
    }
    case "MINUS": {
      executor.verifyNumber(operand.jikiObject, expression.operand);
      const minusResult = new Jiki.Number(-(operand.jikiObject as Jiki.Number).value);
      return {
        type: "UnaryExpression",
        jikiObject: minusResult,
        immutableJikiObject: minusResult.clone(),
        operand: operand,
      };
    }
  }

  // Unreachable.
  executor.error("InvalidUnaryOperatorForOperand", expression.operator.location, {
    expression,
  });
}
