import type { Description, DescriptionContext } from "../../shared/frames";
import type { FrameWithResult } from "../frameDescribers";

export function describeBreakStatement(_frame: FrameWithResult, _context: DescriptionContext): Description {
  const result = `<p>Python encountered a <code>break</code> statement and is exiting the current loop.</p>`;
  const steps = [`<li>Python is breaking out of the current loop.</li>`];

  return { result, steps };
}
