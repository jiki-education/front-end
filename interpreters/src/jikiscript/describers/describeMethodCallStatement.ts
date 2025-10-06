import { toSentence } from "@utils/toSentence";
import type { EvaluationResultMethodCallStatement } from "../evaluation-result";
import type { DescriptionContext, FrameWithResult } from "../../shared/frames";
import { codeTag, formatJikiObject } from "../helpers";
import type { MethodCallStatement } from "../statement";
import { describeExpression } from "./describeSteps";
import type * as Jiki from "../jikiObjects";

export function describeMethodCallStatement(frame: FrameWithResult, context: DescriptionContext) {
  const frameContext = frame.context as MethodCallStatement;
  const frameResult = frame.result as EvaluationResultMethodCallStatement;
  const expression = frameContext.expression;

  const methodName = expression.methodName.lexeme;

  const args = (args => {
    return toSentence(
      args.map((arg, idx) => codeTag(formatJikiObject(arg.jikiObject), frameContext.expression.args[idx].location))
    );
  })(frameResult.expression.args);

  const instance = frameResult.expression.object.jikiObject as Jiki.Instance;
  const instanceDesc = `${instance.getClassName()} instance's`;

  const methodCallCodeTag = codeTag(methodName, expression.methodName.location);
  const argsDesc = args.length > 0 ? ` with the inputs ${args}` : "";
  const result = `<p>This used the ${instanceDesc} ${methodCallCodeTag} method${argsDesc}.</p>`;

  let steps = describeExpression(frameContext.expression, frameResult.expression, context);

  return {
    result: result,
    steps: steps,
  };
}
