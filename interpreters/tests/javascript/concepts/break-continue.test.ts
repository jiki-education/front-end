import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

describe("break", () => {
  test("break in for loop", () => {
    const { success, frames } = interpret(
      `
      let x = 0;
      for (let i = 1; i <= 5; i = i + 1) {
        if (i === 3) {
          break;
        }
        x = x + i;
      }
    `,
      {}
    );
    expect(success).toBe(true);
    // x should be 1 + 2 = 3 (stops before i=3)
    const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.variables?.x?.value).toBe(3);
  });

  test("break in while loop", () => {
    const { success, frames } = interpret(
      `
      let x = 0;
      let i = 1;
      while (i <= 5) {
        if (i === 3) {
          break;
        }
        x = x + i;
        i = i + 1;
      }
    `,
      {}
    );
    expect(success).toBe(true);
    // x should be 1 + 2 = 3 (stops before i=3)
    const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.variables?.x?.value).toBe(3);
  });

  test("break outside loop is runtime error", () => {
    const { frames, success } = interpret(
      `
      let x = 5;
      break;
    `,
      {}
    );
    expect(success).toBe(false);
    const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("ERROR");
    expect(lastFrame.error?.message).toMatch(/BreakOutsideLoop/);
  });
});

describe("continue", () => {
  test("continue in for loop", () => {
    const { success, frames } = interpret(
      `
      let x = 0;
      for (let i = 1; i <= 5; i = i + 1) {
        if (i === 3) {
          continue;
        }
        x = x + i;
      }
    `,
      {}
    );
    expect(success).toBe(true);
    // x should be 1 + 2 + 4 + 5 = 12 (skip 3)
    const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.variables?.x?.value).toBe(12);
  });

  test("continue executes update expression in for loop", () => {
    const { success, frames } = interpret(
      `
      let x = 0;
      let count = 0;
      for (let i = 0; i < 5; i = i + 1) {
        count = count + 1;
        if (i === 2) {
          continue;
        }
        x = x + i;
      }
    `,
      {}
    );
    expect(success).toBe(true);
    const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
    // count should be 5 (loop runs 5 times)
    expect(lastFrame.variables?.count?.value).toBe(5);
    // x should be 0 + 1 + 3 + 4 = 8 (skip i=2)
    expect(lastFrame.variables?.x?.value).toBe(8);
    // Verify i reaches 5, proving update expression ran after continue
    expect(lastFrame.variables?.i?.value).toBe(5);
  });

  test("continue in while loop", () => {
    const { success, frames } = interpret(
      `
      let x = 0;
      let i = 0;
      while (i < 5) {
        i = i + 1;
        if (i === 3) {
          continue;
        }
        x = x + i;
      }
    `,
      {}
    );
    expect(success).toBe(true);
    // x should be 1 + 2 + 4 + 5 = 12 (skip 3)
    const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.variables?.x?.value).toBe(12);
  });

  test("continue outside loop is runtime error", () => {
    const { frames, success } = interpret(
      `
      let x = 5;
      continue;
    `,
      {}
    );
    expect(success).toBe(false);
    const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("ERROR");
    expect(lastFrame.error?.message).toMatch(/ContinueOutsideLoop/);
  });
});

describe("nested loops", () => {
  test("break only exits inner loop", () => {
    const { success, frames } = interpret(
      `
      let x = 0;
      for (let i = 1; i <= 3; i = i + 1) {
        for (let j = 1; j <= 3; j = j + 1) {
          if (j === 2) {
            break;
          }
          x = x + i * 10 + j;
        }
      }
    `,
      {}
    );
    expect(success).toBe(true);
    // x should be 11 + 21 + 31 = 63 (only first j in each outer loop iteration)
    const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.variables?.x?.value).toBe(63);
  });

  test("continue only affects inner loop", () => {
    const { success, frames } = interpret(
      `
      let x = 0;
      for (let i = 1; i <= 3; i = i + 1) {
        for (let j = 1; j <= 3; j = j + 1) {
          if (j === 2) {
            continue;
          }
          x = x + i * 10 + j;
        }
      }
    `,
      {}
    );
    expect(success).toBe(true);
    // x should be 11 + 13 + 21 + 23 + 31 + 33 = 132 (skip j=2 in each iteration)
    const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.variables?.x?.value).toBe(132);
  });
});
