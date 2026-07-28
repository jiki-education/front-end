import type { EvaluationResultVariableDeclaration } from "../evaluation-result";
import type { Description, FrameWithResult } from "../../shared/frames";
import type { DescriptionContext } from "./types";
import { formatJSObject } from "../helpers";
import type { VariableDeclaration } from "../statement";
import { describeExpression } from "./describeSteps";

export function describeVariableDeclaration(frame: FrameWithResult, context: DescriptionContext): Description {
  const variableDeclaration = frame.context as VariableDeclaration;
  const frameResult = frame.result as EvaluationResultVariableDeclaration;
  const value = formatJSObject(frameResult.immutableJikiObject);
  const name = variableDeclaration.name.lexeme;
  const keyword = variableDeclaration.kind;

  let result: string;
  let steps: string[];

  if (variableDeclaration.initializer) {
    result =
      keyword === "const"
        ? context.t("description.variableDeclaration.result_const", { name, value })
        : context.t("description.variableDeclaration.result_let", { name, value });
    const initializerSteps = describeExpression(variableDeclaration.initializer, frameResult.value, context);
    steps = [
      ...initializerSteps,
      keyword === "const"
        ? context.t("description.variableDeclaration.step_const", { name, value })
        : context.t("description.variableDeclaration.step_let", { name, value }),
    ];
  } else {
    result = context.t("description.variableDeclaration.result_uninit", { name });
    steps = [context.t("description.variableDeclaration.step_uninit", { name })];
  }

  return {
    result,
    steps,
  };
}
