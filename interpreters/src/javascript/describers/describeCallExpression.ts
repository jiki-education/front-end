import type { Description, FrameWithResult } from "../../shared/frames";
import type { DescriptionContext } from "./types";
import type { EvaluationResultCallExpression } from "../evaluation-result";
import type { CallExpression } from "../expression";
import { codeTag, formatJSObject } from "../helpers";
import { JSUndefined } from "../jsObjects/JSUndefined";
import { describeExpression } from "./describeSteps";

export function describeCallExpression(frame: FrameWithResult, context: DescriptionContext): Description {
  const expression = frame.context as CallExpression;
  const result = frame.result as EvaluationResultCallExpression;

  const steps = describeCallExpressionSteps(expression, result, context);
  const functionName = result.functionName || context.t("description.common.defaultFunctionName");

  // console.log gets a "this logged X" summary, matching its LOG-style step.
  if (functionName === "log") {
    const { output, isBlank } = computeLogOutput(result);
    const summary = isBlank
      ? context.t("description.callExpression.logResultBlank")
      : context.t("description.callExpression.logResult", { output });
    return { result: summary, steps };
  }

  const summary = context.t("description.callExpression.summary", {
    fn: codeTag(functionName, expression.callee.location),
  });
  return { result: summary, steps };
}

export function describeCallExpressionSteps(
  expression: CallExpression,
  result: EvaluationResultCallExpression,
  context: DescriptionContext
): string[] {
  const functionName = result.functionName || context.t("description.common.defaultFunctionName");

  const steps: string[] = [];

  // First, describe evaluation of each argument expression (like 1+2)
  const argSteps = expression.args
    .map((arg, idx) => {
      // Get the evaluation steps for this argument expression
      const argResult = result.args?.[idx];
      if (argResult) {
        return describeExpression(arg, argResult, context);
      }
      return [];
    })
    .flat();

  steps.push(...argSteps);

  // Special handling for console.log() - show what it outputs
  if (functionName === "log") {
    const { output, isBlank } = computeLogOutput(result);
    if (isBlank) {
      steps.push(context.t("description.callExpression.logStepBlank"));
    } else {
      steps.push(context.t("description.callExpression.logStep", { output }));
    }
    return steps;
  }

  // Generic function call - "Jiki used the fn(args) function[, which returned X]."
  const hasReturn = !(result.jikiObject instanceof JSUndefined);
  const argsJoined =
    result.args && result.args.length > 0 ? result.args.map(arg => formatJSObject(arg.jikiObject)).join(", ") : "";
  const call = codeTag(`${functionName}(${argsJoined})`, expression.location);

  if (hasReturn) {
    steps.push(
      context.t("description.callExpression.usedReturned", {
        call,
        value: codeTag(formatJSObject(result.jikiObject), expression.location),
      })
    );
  } else {
    steps.push(context.t("description.callExpression.used", { call }));
  }

  return steps;
}

export function computeLogOutput(result: EvaluationResultCallExpression): { output: string; isBlank: boolean } {
  // Actual printed text: convert JikiObjects to their string form (no quotes for strings).
  const output =
    result.args && result.args.length > 0
      ? result.args.map(arg => arg.immutableJikiObject?.toString() ?? "").join(" ")
      : "";

  const printableCount = result.args?.filter(arg => arg.immutableJikiObject !== undefined).length ?? 0;

  return { output, isBlank: printableCount === 0 };
}
