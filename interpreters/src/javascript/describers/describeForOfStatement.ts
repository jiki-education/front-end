import type { EvaluationResultForOfStatement } from "../evaluation-result";
import type { Description, DescriptionContext, FrameWithResult } from "../../shared/frames";
import type { ForOfStatement } from "../statement";
import { describeExpression } from "./describeSteps";
import { JSArray, JSString } from "../jikiObjects";

export function describeForOfStatement(frame: FrameWithResult, context: DescriptionContext): Description {
  const forOfStatement = frame.context as ForOfStatement;
  const result = frame.result as EvaluationResultForOfStatement;

  const steps = describeExpression(forOfStatement.iterable, result.iterable, context);
  steps.push(describeFinalStep(result, forOfStatement));

  return {
    result: describeResult(result, forOfStatement),
    steps,
  };
}

function describeFinalStep(result: EvaluationResultForOfStatement, statement: ForOfStatement): string {
  const iterable = result.iterable.immutableJikiObject;
  const variableName = statement.variable.lexeme;

  if (iterable instanceof JSArray || iterable instanceof JSString) {
    if (iterable.value.length === 0) {
      const typeName = iterable instanceof JSArray ? "list" : "string";
      return `<li>The ${typeName} is empty, so the loop body will not execute.</li>`;
    }

    if (result.currentElement) {
      const elementValue = result.currentElement.toString();
      return `<li>Set <code>${variableName}</code> to <code>${elementValue}</code> (iteration ${result.iteration}).</li>`;
    }
  }

  return `<li>Begin looping through the elements.</li>`;
}

function describeResult(result: EvaluationResultForOfStatement, statement: ForOfStatement): string {
  const iterable = result.iterable.immutableJikiObject;
  const variableName = statement.variable.lexeme;

  if (iterable instanceof JSArray || iterable instanceof JSString) {
    if (iterable.value.length === 0) {
      const typeName = iterable instanceof JSArray ? "list" : "string";
      return `<p>The ${typeName} is empty, so the loop body did not execute.</p>`;
    }

    if (result.currentElement) {
      const elementValue = result.currentElement.toString();
      return `<p>Set <code>${variableName}</code> to <code>${elementValue}</code> for iteration ${result.iteration}.</p>`;
    }
  }

  return `<p>Looping through each element.</p>`;
}
