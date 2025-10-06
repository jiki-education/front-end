import type { Description, DescriptionContext, FrameWithResult } from "../../shared/frames";

export function describeBreakStatement(_fr: FrameWithResult, _dc: DescriptionContext): Description {
  const result = `<p>This line immediately exited the loop.</p>`;
  const steps = [`<li>Jiki saw this and decided to move on to after this loop.</li>`];
  return { result, steps };
}
