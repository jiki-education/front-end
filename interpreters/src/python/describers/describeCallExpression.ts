import type { EvaluationResultCallExpression } from "../evaluation-result";
import type { CallExpression } from "../expression";
import { describeExpression } from "./describeSteps";
import { formatPyObject } from "./helpers";

export function describeCallExpression(expression: CallExpression, result: EvaluationResultCallExpression): string[] {
  const steps: string[] = [];

  // First, describe evaluation of all arguments
  for (let i = 0; i < result.args.length; i++) {
    const argResult = result.args[i];
    const argSteps = describeExpression(expression.args[i], argResult as any, { functionDescriptions: {} });
    if (argSteps.length > 0) {
      steps.push(...argSteps);
    }
  }

  // Build arguments description
  const argValues = result.args.map(arg => {
    return formatPyObject(arg.immutableJikiObject);
  });

  // Special handling for print() - show what it outputs
  if (result.functionName === "print") {
    // Get the actual output by converting JikiObjects to strings (without quotes)
    const output = result.args.map(arg => arg.immutableJikiObject.toString()).join(" ");

    if (argValues.length === 0) {
      steps.push(`<li>Python used the <code>print</code> function, which printed a blank line.</li>`);
    } else if (argValues.length === 1) {
      steps.push(
        `<li>Python used the <code>print</code> function with <code>${argValues[0]}</code>, which printed <code>${output}</code>.</li>`
      );
    } else {
      const lastArg = argValues[argValues.length - 1];
      const otherArgs = argValues.slice(0, -1);
      steps.push(
        `<li>Python used the <code>print</code> function with <code>${otherArgs.join("</code>, <code>")}</code> and <code>${lastArg}</code>, which printed <code>${output}</code>.</li>`
      );
    }
    return steps;
  }

  // General function call description
  if (argValues.length === 0) {
    steps.push(`<li>Python used the <code>${result.functionName}</code> function.</li>`);
  } else if (argValues.length === 1) {
    steps.push(
      `<li>Python used the <code>${result.functionName}</code> function with <code>${argValues[0]}</code>.</li>`
    );
  } else {
    const lastArg = argValues[argValues.length - 1];
    const otherArgs = argValues.slice(0, -1);
    steps.push(
      `<li>Python used the <code>${result.functionName}</code> function with <code>${otherArgs.join("</code>, <code>")}</code> and <code>${lastArg}</code>.</li>`
    );
  }

  return steps;
}
