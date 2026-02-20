import { interpret } from "@javascript/interpreter";

describe("Footgun #27: Switch statement fall-through", () => {
  // In real JS: missing break causes execution to fall through to next case
  // switch is not yet implemented in Jiki
  // When implemented, fall-through should be blocked or require explicit opt-in

  test.skip("switch without break should not fall through", () => {
    const code = `
      let day = "Monday"
      let result = ""
      switch (day) {
        case "Monday":
          result = "weekday"
          break
        case "Saturday":
          result = "weekend"
          break
      }
    `;
    const { frames, error } = interpret(code);
    // When switch is implemented, this should work
    expect(error).toBeNull();
  });

  test.skip("switch with missing break should error or not fall through", () => {
    const code = `
      let x = 1
      let result = ""
      switch (x) {
        case 1:
          result = "one"
        case 2:
          result = "two"
      }
    `;
    const { frames } = interpret(code);
    // In real JS: result would be "two" due to fall-through
    // In Jiki: should either require break or not fall through
  });
});
