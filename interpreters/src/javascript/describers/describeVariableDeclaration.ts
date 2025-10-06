import type { EvaluationResultVariableDeclaration } from "../evaluation-result";
import type { Description, DescriptionContext, FrameWithResult } from "../../shared/frames";
import { formatJSObject } from "../helpers";
import type { VariableDeclaration } from "../statement";
import { describeExpression } from "./describeSteps";

export function describeVariableDeclaration(frame: FrameWithResult, context: DescriptionContext): Description {
  const variableDeclaration = frame.context as VariableDeclaration;
  const frameResult = frame.result as EvaluationResultVariableDeclaration;
  const value = formatJSObject(frameResult.immutableJikiObject);
  const name = variableDeclaration.name.lexeme;

  let result: string;
  let steps: string[];

  if (variableDeclaration.initializer) {
    result = `<p>Declared variable <code>${name}</code> and set it to <code>${value}</code>.</p>`;
    const initializerSteps = describeExpression(variableDeclaration.initializer, frameResult.value, context);
    steps = [
      ...initializerSteps,
      `<li>JavaScript created variable <code>${name}</code> and assigned it the value <code>${value}</code>.</li>`,
    ];
  } else {
    result = `<p>Declared variable <code>${name}</code>.</p>`;
    steps = [`<li>JavaScript created variable <code>${name}</code> with value <code>undefined</code>.</li>`];
  }

  return {
    result,
    steps,
  };
}
