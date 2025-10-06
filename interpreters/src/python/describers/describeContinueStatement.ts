import type { Description, DescriptionContext } from "../../shared/frames";
import type { FrameWithResult } from "../frameDescribers";

export function describeContinueStatement(_frame: FrameWithResult, _context: DescriptionContext): Description {
  const result = `<p>Python encountered a <code>continue</code> statement and is moving to the next iteration.</p>`;
  const steps = [`<li>Python is continuing to the next iteration of the loop.</li>`];

  return { result, steps };
}
