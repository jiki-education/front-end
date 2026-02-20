import { interpret } from "@javascript/interpreter";

describe("Footgun #21: NaN !== NaN", () => {
  // In real JS: NaN === NaN is false (the only value not equal to itself)
  // This violates the fundamental expectation that a value equals itself
  // Should we provide a special error or educational message?

  test.skip("NaN === NaN should have educational handling", () => {
    // This requires NaN to exist in the language first
    // Could come from 0/0, Number("hello"), or undefined + 1
    const code = `
      let x = 0 / 0
      let result = x === x
    `;
    const { frames } = interpret(code, {
      languageFeatures: { allowTypeCoercion: true },
    });
    // In real JS: result === false (very confusing!)
    // Should we make NaN === NaN return true in educational mode?
    // Or block NaN from being produced?
  });

  test.skip("NaN propagation in arithmetic should be handled", () => {
    const code = `
      let x = 0 / 0
      let y = x + 1
    `;
    const { frames } = interpret(code, {
      languageFeatures: { allowTypeCoercion: true },
    });
    // y should be NaN (NaN is contagious in arithmetic)
    // Should we provide an educational message about this?
  });
});
