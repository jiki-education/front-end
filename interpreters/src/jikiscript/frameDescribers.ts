import { deepTrim } from "./describers/helpers";
import type { Frame, Description, DescriptionContext } from "../shared/frames";
import type { EvaluationResult } from "./evaluation-result";
import type { Statement } from "./statement";
import type { Expression } from "./expression";
import { describeIfStatement } from "./describers/describeIfStatement";
import { describeSetVariableStatement } from "./describers/describeSetVariableStatement";
import { describeLogStatement } from "./describers/describeLogStatement";
import { describeChangeVariableStatement } from "./describers/describeChangeVariableStatement";
import { describeFunctionCallStatement } from "./describers/describeFunctionCallStatement";
import { describeReturnStatement } from "./describers/describeReturnStatement";
import { describeChangeElementStatement } from "./describers/describeChangeElementStatement";
import { describeForeachStatement } from "./describers/describeForeachStatement";
import { describeRepeatStatement } from "./describers/describeRepeatStatement";
import { describeBreakStatement } from "./describers/describeBreakStatement";
import { describeContinueStatement } from "./describers/describeNextStatement";
import { describeChangePropertyStatement } from "./describers/describeChangePropertyStatement";
import { describeMethodCallStatement } from "./describers/describeMethodCallStatement";

// JikiScript-specific frame extending the shared base
export interface JikiScriptFrame extends Frame {
  result?: EvaluationResult;
  context?: Statement | Expression;
}

export type FrameWithResult = JikiScriptFrame & { result: EvaluationResult };

function isFrameWithResult(frame: JikiScriptFrame): frame is FrameWithResult {
  return !!frame.result;
}

const defaultMessage = `<p>There is no information available for this line. Show us your code in Discord and we'll improve this!</p>`;

export function describeFrame(frame: JikiScriptFrame, context?: DescriptionContext): string {
  if (!isFrameWithResult(frame)) {
    return defaultMessage;
  }

  const actualContext: DescriptionContext = context ?? { functionDescriptions: {} };

  let description: Description | null = null;
  try {
    description = generateDescription(frame, actualContext);
  } catch (e) {
    if (process.env.NODE_ENV !== "production") {
      throw e;
    }
    return defaultMessage;
  }
  if (description === null) {
    return defaultMessage;
  }

  return deepTrim(`
  <h3>What happened</h3>
  ${description.result}
  <hr/>
  <h3>Steps Jiki Took</h3>
  <ul>
    ${description.steps.join("\n")}
  </ul>
  `);
}

function generateDescription(frame: FrameWithResult, context: DescriptionContext): Description | null {
  // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
  switch (frame.result.type) {
    case "LogStatement":
      return describeLogStatement(frame, context);

    case "SetVariableStatement":
      return describeSetVariableStatement(frame, context);
    case "ChangeVariableStatement":
      return describeChangeVariableStatement(frame, context);

    case "ChangeElementStatement":
      return describeChangeElementStatement(frame, context);

    case "MethodCallStatement":
      return describeMethodCallStatement(frame, context);
    case "FunctionCallStatement":
      return describeFunctionCallStatement(frame, context);
    case "ReturnStatement":
      return describeReturnStatement(frame, context);

    case "ChangePropertyStatement":
      return describeChangePropertyStatement(frame, context);

    case "IfStatement":
      return describeIfStatement(frame, context);

    case "ForeachStatement":
      return describeForeachStatement(frame, context);

    case "RepeatStatement":
      return describeRepeatStatement(frame, context);

    case "BreakStatement":
      return describeBreakStatement(frame, context);

    case "ContinueStatement":
      return describeContinueStatement(frame, context);

    default:
      // Handle expression and other types that don't have specific descriptions
      return null;
  }
}
