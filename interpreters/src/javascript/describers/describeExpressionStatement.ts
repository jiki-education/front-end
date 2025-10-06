import type { EvaluationResultExpressionStatement, EvaluationResultCallExpression } from "../evaluation-result";
import type { Description, DescriptionContext, FrameWithResult } from "../../shared/frames";
import { formatJSObject } from "../helpers";
import type { ExpressionStatement } from "../statement";
import { CallExpression } from "../expression";
import { describeExpression } from "./describeSteps";

export function describeExpressionStatement(frame: FrameWithResult, context: DescriptionContext): Description {
  const expressionStatement = frame.context as ExpressionStatement;
  const frameResult = frame.result as EvaluationResultExpressionStatement;
  const value = formatJSObject(frameResult.immutableJikiObject);

  // Special case for function calls - more educational description
  if (expressionStatement.expression instanceof CallExpression) {
    const callResult = frameResult.expression as EvaluationResultCallExpression;
    const functionName = callResult.functionName || "a function";
    const argCount = expressionStatement.expression.args.length;
    const argsDesc = argCount > 0 ? ` with ${argCount} argument${argCount !== 1 ? "s" : ""}` : "";

    const result = `<p>JavaScript used the <code>${functionName}</code> function${argsDesc} and got <code>${value}</code>.</p>`;
    const steps = describeExpression(expressionStatement.expression, frameResult.expression, context);

    return {
      result,
      steps,
    };
  }

  // Default behavior for other expressions
  const result = `<p>This expression evaluated to <code>${value}</code>.</p>`;
  let steps = describeExpression(expressionStatement.expression, frameResult.expression, context);
  steps = [...steps, `<li>JavaScript evaluated this expression and got <code>${value}</code>.</li>`];

  return {
    result,
    steps,
  };
}
