import type { EvaluationResultIfStatement } from "../evaluation-result";
import type { Description, DescriptionContext, FrameWithResult } from "../../shared/frames";
import type { IfStatement } from "../statement";
import { describeExpression } from "./describeSteps";

export function describeIfStatement(frame: FrameWithResult, context: DescriptionContext): Description {
  const ifStatement = frame.context as IfStatement;
  const result = frame.result as EvaluationResultIfStatement;

  let steps = describeExpression(ifStatement.condition, result.condition, context);
  steps = [...steps, describeFinalStep(result, ifStatement)];

  return {
    result: describeResult(result, ifStatement),
    steps,
  };
}

function describeFinalStep(result: EvaluationResultIfStatement, statement: IfStatement): string {
  const conditionValue = Boolean(result.immutableJikiObject.value);

  if (conditionValue) {
    return `<li>The condition evaluated to <code>true</code>, so JavaScript executed the if block.</li>`;
  }
  if (statement.elseBranch) {
    return `<li>The condition evaluated to <code>false</code>, so JavaScript executed the else block.</li>`;
  }
  return `<li>The condition evaluated to <code>false</code>, so JavaScript skipped the if block.</li>`;
}

function describeResult(result: EvaluationResultIfStatement, statement: IfStatement): string {
  const conditionValue = Boolean(result.immutableJikiObject.value);

  if (conditionValue) {
    return `<p>The condition evaluated to <code>true</code>, so the if block was executed.</p>`;
  }
  if (statement.elseBranch) {
    return `<p>The condition evaluated to <code>false</code>, so the else block was executed.</p>`;
  }
  return `<p>The condition evaluated to <code>false</code>, so the if block was skipped.</p>`;
}
