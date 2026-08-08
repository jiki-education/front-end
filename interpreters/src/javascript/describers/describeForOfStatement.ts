import type { EvaluationResultForOfStatement } from "../evaluation-result";
import type { Description, FrameWithResult } from "../../shared/frames";
import type { DescriptionContext } from "./types";
import type { ForOfStatement } from "../statement";
import { JSArray, JSString } from "../jikiObjects";
import { codeTag, formatJSObject } from "../helpers";

export function describeForOfStatement(frame: FrameWithResult, context: DescriptionContext): Description {
  const statement = frame.context as ForOfStatement;
  const result = frame.result as EvaluationResultForOfStatement;

  const iterable = result.iterable.immutableJikiObject;
  const typeName = iterable instanceof JSString ? "string" : "array";
  const isEmpty = (iterable instanceof JSArray || iterable instanceof JSString) && iterable.value.length === 0;

  if (isEmpty) {
    return {
      result: context.t("description.forOfStatement.result_empty", { type: typeName }),
      steps: [context.t("description.forOfStatement.step_empty", { type: typeName })],
    };
  }

  const name = codeTag(statement.variable.lexeme, statement.variable.location);
  const value = codeTag(formatJSObject(result.currentElement), statement.iterable.location);

  return {
    result: context.t("description.forOfStatement.result_iteration", {
      count: result.iteration,
      ordinal: true,
      name,
      value,
    }),
    steps: [
      context.t("description.forOfStatement.step_create", { name }),
      context.t("description.forOfStatement.step_put", { value }),
    ],
  };
}
