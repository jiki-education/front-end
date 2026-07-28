import type { EvaluationResultForInStatement } from "../evaluation-result";
import type { Description, FrameWithResult } from "../../shared/frames";
import type { DescriptionContext } from "./types";
import type { ForInStatement } from "../statement";
import { describeExpression } from "./describeSteps";
import { JSDictionary } from "../jikiObjects";

export function describeForInStatement(frame: FrameWithResult, context: DescriptionContext): Description {
  const forInStatement = frame.context as ForInStatement;
  const result = frame.result as EvaluationResultForInStatement;

  const steps = describeExpression(forInStatement.object, result.object, context);
  steps.push(describeFinalStep(result, forInStatement, context));

  return {
    result: describeResult(result, forInStatement, context),
    steps,
  };
}

function describeFinalStep(
  result: EvaluationResultForInStatement,
  statement: ForInStatement,
  context: DescriptionContext
): string {
  const obj = result.object.immutableJikiObject;
  const variableName = statement.variable.lexeme;

  if (obj instanceof JSDictionary) {
    if (obj.value.size === 0) {
      return context.t("description.forInStatement.stepEmpty");
    }

    if (result.currentKey) {
      const keyValue = result.currentKey.toDisplayString();
      return context.t("description.forInStatement.stepSetKey", {
        variableName,
        keyValue,
        iteration: result.iteration,
      });
    }
  }

  return context.t("description.forInStatement.stepDefault");
}

function describeResult(
  result: EvaluationResultForInStatement,
  statement: ForInStatement,
  context: DescriptionContext
): string {
  const obj = result.object.immutableJikiObject;
  const variableName = statement.variable.lexeme;

  if (obj instanceof JSDictionary) {
    if (obj.value.size === 0) {
      return context.t("description.forInStatement.resultEmpty");
    }

    if (result.currentKey) {
      const keyValue = result.currentKey.toDisplayString();
      return context.t("description.forInStatement.resultSetKey", {
        variableName,
        keyValue,
        iteration: result.iteration,
      });
    }
  }

  return context.t("description.forInStatement.resultDefault");
}
