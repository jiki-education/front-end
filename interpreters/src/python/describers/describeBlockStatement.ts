import type { Description, DescriptionContext } from "../../shared/frames";
import type { FrameWithResult } from "../frameDescribers";

export function describeBlockStatement(_frame: FrameWithResult, _context: DescriptionContext): Description {
  const result = `<p>Python is executing a block of statements.</p>`;
  const steps = [`<li>Python started executing a block of code.</li>`];

  return { result, steps };
}
