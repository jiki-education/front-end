import type { EvaluationResultExpressionStatement, EvaluationResultCallExpression } from "../evaluation-result";
import type { Description, FrameWithResult } from "../../shared/frames";
import type { DescriptionContext } from "./types";
import { codeTag, formatJSObject } from "../helpers";
import type { ExpressionStatement } from "../statement";
import { CallExpression, AssignmentExpression } from "../expression";
import { describeExpression } from "./describeSteps";
import { computeLogOutput } from "./describeCallExpression";

export function describeExpressionStatement(frame: FrameWithResult, context: DescriptionContext): Description {
  const expressionStatement = frame.context as ExpressionStatement;
  const frameResult = frame.result as EvaluationResultExpressionStatement;
  const value = formatJSObject(frameResult.immutableJikiObject);

  // Special case for function calls - more educational description
  if (expressionStatement.expression instanceof CallExpression) {
    const callResult = frameResult.expression as EvaluationResultCallExpression;
    const functionName = callResult.functionName || context.t("description.common.defaultFunctionName");
    // console.log as a bare statement gets the LOG-style summary, matching its step.
    let result: string;
    if (functionName === "log") {
      const { output, isBlank } = computeLogOutput(callResult);
      result = isBlank
        ? context.t("description.callExpression.logResultBlank")
        : context.t("description.callExpression.logResult", { output });
    } else {
      result = context.t("description.expressionStatement.callResult", {
        functionName: codeTag(functionName, expressionStatement.expression.callee.location),
      });
    }
    const steps = describeExpression(expressionStatement.expression, frameResult.expression, context);

    return {
      result,
      steps,
    };
  }

  // Special case for assignment expressions - show what variable changed
  if (expressionStatement.expression instanceof AssignmentExpression) {
    const result = context.t("description.expressionStatement.result_default", { value });
    const steps = describeExpression(expressionStatement.expression, frameResult.expression, context);

    return {
      result,
      steps,
    };
  }

  // Default behavior for other expressions
  const result = context.t("description.expressionStatement.result_default", { value });
  let steps = describeExpression(expressionStatement.expression, frameResult.expression, context);
  steps = [...steps, context.t("description.expressionStatement.step_default", { value })];

  return {
    result,
    steps,
  };
}
