import type { EvaluationResultForOfStatement } from "../evaluation-result";
import type { Description, FrameWithResult } from "../../shared/frames";
import type { DescriptionContext } from "./types";
import type { ForOfStatement } from "../statement";
import { describeExpression } from "./describeSteps";
import { JSArray, JSString } from "../jikiObjects";

export function describeForOfStatement(frame: FrameWithResult, context: DescriptionContext): Description {
  const forOfStatement = frame.context as ForOfStatement;
  const result = frame.result as EvaluationResultForOfStatement;

  const steps = describeExpression(forOfStatement.iterable, result.iterable, context);
  steps.push(describeFinalStep(result, forOfStatement, context));

  return {
    result: describeResult(result, forOfStatement, context),
    steps,
  };
}

function describeFinalStep(
  result: EvaluationResultForOfStatement,
  statement: ForOfStatement,
  context: DescriptionContext
): string {
  const iterable = result.iterable.immutableJikiObject;
  const variableName = statement.variable.lexeme;

  if (iterable instanceof JSArray || iterable instanceof JSString) {
    if (iterable.value.length === 0) {
      const typeName = iterable instanceof JSArray ? "list" : "string";
      return context.t("description.forOfStatement.stepEmpty", { typeName });
    }

    if (result.currentElement) {
      const elementValue = result.currentElement.toDisplayString();
      return context.t("description.forOfStatement.stepSetElement", {
        variableName,
        elementValue,
        iteration: result.iteration,
      });
    }
  }

  return context.t("description.forOfStatement.stepDefault");
}

function describeResult(
  result: EvaluationResultForOfStatement,
  statement: ForOfStatement,
  context: DescriptionContext
): string {
  const iterable = result.iterable.immutableJikiObject;
  const variableName = statement.variable.lexeme;

  if (iterable instanceof JSArray || iterable instanceof JSString) {
    if (iterable.value.length === 0) {
      const typeName = iterable instanceof JSArray ? "list" : "string";
      return context.t("description.forOfStatement.resultEmpty", { typeName });
    }

    if (result.currentElement) {
      const elementValue = result.currentElement.toDisplayString();
      return context.t("description.forOfStatement.resultSetElement", {
        variableName,
        elementValue,
        iteration: result.iteration,
      });
    }
  }

  return context.t("description.forOfStatement.resultDefault");
}
