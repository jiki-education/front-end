import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

const NO_INFO = "There is no information available for this line";

function descriptions(code: string) {
  const { frames, error } = interpret(code);
  expect(error).toBeNull();
  return (frames as TestAugmentedFrame[]).map(f => ({ line: f.line, description: f.description }));
}

describe("for loop frames", () => {
  test("emits one frame per iteration on the for line, plus the init frame", () => {
    const frames = descriptions(`for (let i = 0; i < 3; i++) {
}
`);

    // init + 3 successful condition checks + the final failing check
    expect(frames).toHaveLength(5);
    expect(frames.every(f => f.line === 1)).toBe(true);
  });

  test("every frame has a real description", () => {
    const frames = descriptions(`let sum = 0;
for (let i = 0; i < 3; i++) {
  sum = sum + i;
}
`);

    expect(frames.every(f => !f.description.includes(NO_INFO))).toBe(true);
  });

  test("describes the condition check and its outcome", () => {
    const frames = descriptions(`for (let i = 0; i < 2; i++) {
}
`);

    expect(frames[1].description).toContain(">0 < 2</code>");
    expect(frames[1].description).toContain("The condition evaluated to <code>true</code> so the loop body ran.");
    expect(frames[3].description).toContain("The condition evaluated to <code>false</code> so the loop stopped.");
  });

  test("describes the previous iteration's update at the top of the next frame", () => {
    const frames = descriptions(`for (let i = 0; i < 2; i++) {
}
`);

    // The first iteration has no preceding update
    expect(frames[1].description).not.toContain("Jiki increased");
    expect(frames[2].description).toContain("Jiki increased");
    expect(frames[2].description).toMatch(
      /Jiki increased <code[^>]*>i<\/code> from <code[^>]*>0<\/code> to <code[^>]*>1<\/code>/
    );
  });

  test("describes a decrementing update", () => {
    const frames = descriptions(`for (let i = 2; i > 0; i--) {
}
`);

    expect(frames[2].description).toContain("Jiki decreased");
  });

  test("describes an assignment update", () => {
    const frames = descriptions(`for (let i = 0; i < 2; i = i + 1) {
}
`);

    expect(frames[2].description).toContain("Jiki put <code");
    expect(frames[2].description).not.toContain(NO_INFO);
  });

  test("the body still sees the pre-update value", () => {
    const { frames } = interpret(`let last = 0;
for (let i = 0; i < 3; i++) {
  last = i;
}
`);
    const bodyFrames = (frames as TestAugmentedFrame[]).filter(f => f.line === 3);
    expect(bodyFrames.map(f => f.variables.i.value)).toEqual([0, 1, 2]);
  });

  test("a loop with no condition describes why it kept going", () => {
    const frames = descriptions(`let i = 0;
for (;;) {
  i = i + 1;
  if (i > 2) {
    break;
  }
}
`);

    const headerFrames = frames.filter(f => f.line === 2);
    expect(headerFrames).toHaveLength(3);
    expect(headerFrames[0].description).toContain("This loop has no condition, so the loop body ran again.");
    expect(headerFrames.every(f => !f.description.includes(NO_INFO))).toBe(true);
  });

  test("guards against an infinite loop with a frame-less body", () => {
    const { frames, error } = interpret(`for (;;) {
}
`);

    expect(error).toBeNull();
    const lastFrame = frames[frames.length - 1];
    expect(lastFrame.status).toBe("ERROR");
    expect(lastFrame.error?.type).toBe("MaxIterationsReached");
  });
});
