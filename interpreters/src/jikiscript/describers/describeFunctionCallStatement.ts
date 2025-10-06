import { toSentence } from "@utils/toSentence";
import type { EvaluationResultMethodCallStatement } from "../evaluation-result";
import type { DescriptionContext, FrameWithResult } from "../../shared/frames";
import { codeTag, formatJikiObject } from "../helpers";
import type { FunctionCallStatement } from "../statement";
import { describeExpression } from "./describeSteps";

export function describeFunctionCallStatement(frame: FrameWithResult, context: DescriptionContext) {
  const frameContext = frame.context as FunctionCallStatement;
  const frameResult = frame.result as EvaluationResultMethodCallStatement;
  const expression = frameContext.expression;

  const fnName = expression.callee.name.lexeme;

  const args = (args => {
    return toSentence(
      args.map((arg, idx) => codeTag(formatJikiObject(arg.jikiObject), frameContext.expression.args[idx].location))
    );
  })(frameResult.expression.args);

  const argsDesc = args.length > 0 ? ` with the inputs ${args}` : "";
  const result = `<p>This used the ${codeTag(fnName, expression.callee.location)} function${argsDesc}.</p>`;

  let steps = describeExpression(frameContext.expression, frameResult.expression, context);

  return {
    result: result,
    steps: steps,
  };
}
