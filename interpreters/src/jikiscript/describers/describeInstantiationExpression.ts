import type { EvaluationResultInstantiationExpression } from "../evaluation-result";
import type { InstantiationExpression } from "../expression";
import type { DescriptionContext } from "../../shared/frames";
import { codeTag, formatJikiObject } from "../helpers";
import { describeExpression } from "./describeSteps";

export function describeInstantiationExpression(
  expression: InstantiationExpression,
  result: EvaluationResultInstantiationExpression,
  context: DescriptionContext
) {
  const className = result.className.name;

  if (result.args.length === 0) {
    return [`<li>Jiki created a new ${codeTag(className, expression.className.location)}.</li>`];
  }

  let steps = expression.args.map((arg, idx) => describeExpression(arg, result.args[idx], context)).flat();

  const argNames = (args => {
    return args.map(arg => formatJikiObject(arg.jikiObject)).join(", ");
  })(result.args);

  return [
    ...steps,
    `<li>Jiki created a new ${codeTag(className, expression.className.location)}, using the constructor with ${codeTag(
      `${className}(${argNames})`,
      expression.location
    )}.</li>`,
  ];
}
