import { interpret } from "@python/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";
describe("negation concepts", () => {
  describe("boolean NOT operator", () => {
    test("not True", () => {
      const { frames, error } = interpret("not True");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(false);
    });

    test("not False", () => {
      const { frames, error } = interpret("not False");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(true);
    });

    test("not not True (double negation)", () => {
      const { frames, error } = interpret("not not True");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(true);
    });

    test("not not False (double negation)", () => {
      const { frames, error } = interpret("not not False");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(false);
    });
  });

  describe("NOT with truthiness (enabled)", () => {
    test("not 0 should return True", () => {
      const { frames, error } = interpret("not 0", { languageFeatures: { allowTruthiness: true } });
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(true);
    });

    test("not 1 should return False", () => {
      const { frames, error } = interpret("not 1", { languageFeatures: { allowTruthiness: true } });
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(false);
    });

    test('not "" should return True', () => {
      const { frames, error } = interpret('not ""', { languageFeatures: { allowTruthiness: true } });
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(true);
    });

    test('not "hello" should return False', () => {
      const { frames, error } = interpret('not "hello"', { languageFeatures: { allowTruthiness: true } });
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(false);
    });

    test("not None should return True", () => {
      const { frames, error } = interpret("not None", { languageFeatures: { allowTruthiness: true } });
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(true);
    });
  });

  describe("NOT with truthiness disabled (default)", () => {
    test("not 0 should raise TruthinessDisabled error", () => {
      const { frames, error } = interpret("not 0");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("ERROR");
      expect(frames[0].error?.type).toBe("TruthinessDisabled");
    });

    test("not 1 should raise TruthinessDisabled error", () => {
      const { frames, error } = interpret("not 1");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("ERROR");
      expect(frames[0].error?.type).toBe("TruthinessDisabled");
    });

    test('not "hello" should raise TruthinessDisabled error', () => {
      const { frames, error } = interpret('not "hello"');
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("ERROR");
      expect(frames[0].error?.type).toBe("TruthinessDisabled");
    });
  });

  describe("NOT with complex expressions", () => {
    test("not (True and False)", () => {
      const { frames, error } = interpret("not (True and False)");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(true);
    });

    test("not (True or False)", () => {
      const { frames, error } = interpret("not (True or False)");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(false);
    });
  });
  describe("basic negation", () => {
    test("negative integer", () => {
      const { frames, error } = interpret("-5");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect((frames[0] as TestAugmentedFrame).description).toContain("-5");
      expect(frames[0].result?.jikiObject.value).toBe(-5);
    });

    test("negative zero", () => {
      const { frames, error } = interpret("-0");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].result?.jikiObject.value).toBe(-0);
    });

    test("negative float", () => {
      const { frames, error } = interpret("-3.14");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].result?.jikiObject.value).toBe(-3.14);
    });

    test("negative scientific notation", () => {
      const { frames, error } = interpret("-1.5e2");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].result?.jikiObject.value).toBe(-150);
    });
  });

  describe("negation of expressions", () => {
    test("negation of parenthesized expression", () => {
      const { frames, error } = interpret("-(3 + 2)");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].result?.jikiObject.value).toBe(-5);
    });

    test("negation of multiplication", () => {
      const { frames, error } = interpret("-(3 * 4)");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].result?.jikiObject.value).toBe(-12);
    });

    test("negation of division", () => {
      const { frames, error } = interpret("-(10 / 2)");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].result?.jikiObject.value).toBe(-5);
    });
  });

  describe("nested negation", () => {
    test("double negation", () => {
      const { frames, error } = interpret("--5");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].result?.jikiObject.value).toBe(5);
    });

    test("triple negation", () => {
      const { frames, error } = interpret("---7");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].result?.jikiObject.value).toBe(-7);
    });

    test("nested negation with parentheses", () => {
      const { frames, error } = interpret("-(-(-5 + 2))");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].result?.jikiObject.value).toBe(-3);
    });
  });

  describe("negation with variables", () => {
    test("negation of variable", () => {
      const { frames, error } = interpret("x = 5\n-x");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(2);
      expect(frames[1].result?.jikiObject.value).toBe(-5);
    });

    test("assign negative value to variable", () => {
      const { frames, error } = interpret("y = -10");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].result?.jikiObject.value).toBe(-10);
    });

    test("complex expression with negation and variables", () => {
      const { frames, error } = interpret("a = 3\nb = 4\n-(a + b) * 2");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(3);
      expect(frames[2].result?.jikiObject.value).toBe(-14);
    });
  });

  describe("negation precedence", () => {
    test("negation binds tighter than addition", () => {
      const { frames, error } = interpret("-3 + 2");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].result?.jikiObject.value).toBe(-1);
    });

    test("negation binds tighter than subtraction", () => {
      const { frames, error } = interpret("5 + -3");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].result?.jikiObject.value).toBe(2);
    });

    test("negation binds tighter than multiplication", () => {
      const { frames, error } = interpret("-2 * 3");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].result?.jikiObject.value).toBe(-6);
    });

    test("multiple negations with different precedence", () => {
      const { frames, error } = interpret("-2 + -3 * -1");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].result?.jikiObject.value).toBe(1);
    });
  });
});
