import type { EvaluationResultForInStatement } from "../evaluation-result";
import type { Description, FrameWithResult } from "../../shared/frames";
import type { DescriptionContext } from "./types";
import type { ForInStatement } from "../statement";
import { JSDictionary } from "../jikiObjects";
import { codeTag, formatJSObject } from "../helpers";

export function describeForInStatement(frame: FrameWithResult, context: DescriptionContext): Description {
  const statement = frame.context as ForInStatement;
  const result = frame.result as EvaluationResultForInStatement;

  const obj = result.object.immutableJikiObject;
  const isEmpty = obj instanceof JSDictionary && obj.value.size === 0;

  if (isEmpty) {
    return {
      result: context.t("description.forInStatement.result_empty"),
      steps: [context.t("description.forInStatement.step_empty")],
    };
  }

  const name = codeTag(statement.variable.lexeme, statement.variable.location);
  const value = codeTag(formatJSObject(result.currentKey), statement.object.location);

  return {
    result: context.t("description.forInStatement.result_iteration", {
      count: result.iteration,
      ordinal: true,
      name,
      value,
    }),
    steps: [
      context.t("description.forInStatement.step_create", { name }),
      context.t("description.forInStatement.step_put", { value }),
    ],
  };
}
