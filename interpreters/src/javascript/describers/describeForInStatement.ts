import type { EvaluationResultForInStatement } from "../evaluation-result";
import type { Description, DescriptionContext, FrameWithResult } from "../../shared/frames";
import type { ForInStatement } from "../statement";
import { describeExpression } from "./describeSteps";
import { JSDictionary } from "../jikiObjects";

export function describeForInStatement(frame: FrameWithResult, context: DescriptionContext): Description {
  const forInStatement = frame.context as ForInStatement;
  const result = frame.result as EvaluationResultForInStatement;

  const steps = describeExpression(forInStatement.object, result.object, context);
  steps.push(describeFinalStep(result, forInStatement));

  return {
    result: describeResult(result, forInStatement),
    steps,
  };
}

function describeFinalStep(result: EvaluationResultForInStatement, statement: ForInStatement): string {
  const obj = result.object.immutableJikiObject;
  const variableName = statement.variable.lexeme;

  if (obj instanceof JSDictionary) {
    if (obj.value.size === 0) {
      return `<li>The object is empty, so the loop body will not execute.</li>`;
    }

    if (result.currentKey) {
      const keyValue = result.currentKey.toString();
      return `<li>Set <code>${variableName}</code> to <code>${keyValue}</code> (iteration ${result.iteration}).</li>`;
    }
  }

  return `<li>Begin looping through the keys.</li>`;
}

function describeResult(result: EvaluationResultForInStatement, statement: ForInStatement): string {
  const obj = result.object.immutableJikiObject;
  const variableName = statement.variable.lexeme;

  if (obj instanceof JSDictionary) {
    if (obj.value.size === 0) {
      return `<p>The object is empty, so the loop body did not execute.</p>`;
    }

    if (result.currentKey) {
      const keyValue = result.currentKey.toString();
      return `<p>Set <code>${variableName}</code> to <code>${keyValue}</code> for iteration ${result.iteration}.</p>`;
    }
  }

  return `<p>Looping through each key.</p>`;
}
