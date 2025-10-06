import type { Description, DescriptionContext, FrameWithResult } from "../../shared/frames";
import type { BlockStatement } from "../statement";

export function describeBlockStatement(frame: FrameWithResult, _context: DescriptionContext): Description {
  const blockStatement = frame.context as BlockStatement;
  const statementCount = blockStatement.statements.length;

  let result: string;
  let steps: string[];

  if (statementCount === 0) {
    result = "<p>This empty block has no effect.</p>";
    steps = ["<li>JavaScript executed an empty block with no statements.</li>"];
  } else if (statementCount === 1) {
    result = "<p>This block executed one statement in its own scope.</p>";
    steps = [
      "<li>JavaScript entered a new block scope.</li>",
      "<li>The statement inside the block was executed.</li>",
      "<li>JavaScript exited the block scope, removing any variables declared within it.</li>",
    ];
  } else {
    result = `<p>This block executed ${statementCount} statements in their own scope.</p>`;
    steps = [
      "<li>JavaScript entered a new block scope.</li>",
      `<li>All ${statementCount} statements inside the block were executed in order.</li>`,
      "<li>JavaScript exited the block scope, removing any variables declared within it.</li>",
    ];
  }

  return {
    result,
    steps,
  };
}
