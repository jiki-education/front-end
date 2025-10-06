import { interpret } from "@python/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";
import { PyBoolean } from "@python/jikiObjects";

describe("boolean concepts", () => {
  describe("boolean literals", () => {
    test("True literal", () => {
      const { frames, error } = interpret("True");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject).toBeInstanceOf(PyBoolean);
      expect(frames[0].result?.jikiObject.value).toBe(true);
      expect((frames[0] as TestAugmentedFrame).description).toContain("True");
    });

    test("False literal", () => {
      const { frames, error } = interpret("False");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject).toBeInstanceOf(PyBoolean);
      expect(frames[0].result?.jikiObject.value).toBe(false);
      expect((frames[0] as TestAugmentedFrame).description).toContain("False");
    });
  });

  describe("logical operations", () => {
    test("and operation - True and True", () => {
      const { frames, error } = interpret("True and True");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(true);
    });

    test("and operation - True and False", () => {
      const { frames, error } = interpret("True and False");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(false);
    });

    test("and operation - False and True", () => {
      const { frames, error } = interpret("False and True");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(false);
    });

    test("and operation - False and False", () => {
      const { frames, error } = interpret("False and False");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(false);
    });

    test("or operation - True or True", () => {
      const { frames, error } = interpret("True or True");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(true);
    });

    test("or operation - True or False", () => {
      const { frames, error } = interpret("True or False");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(true);
    });

    test("or operation - False or True", () => {
      const { frames, error } = interpret("False or True");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(true);
    });

    test("or operation - False or False", () => {
      const { frames, error } = interpret("False or False");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(false);
    });

    test("not operation - not True", () => {
      const { frames, error } = interpret("not True");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(false);
    });

    test("not operation - not False", () => {
      const { frames, error } = interpret("not False");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(true);
    });

    test("complex logical expression", () => {
      const { frames, error } = interpret("(True or False) and True");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(true);
    });

    test("chained logical operations", () => {
      const { frames, error } = interpret("True and False or True");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      // (True and False) or True = False or True = True
      expect(frames[0].result?.jikiObject.value).toBe(true);
    });
  });

  describe("comparison operations", () => {
    test("equality - True == True", () => {
      const { frames, error } = interpret("True == True");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(true);
    });

    test("equality - True == False", () => {
      const { frames, error } = interpret("True == False");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(false);
    });

    test("inequality - True != False", () => {
      const { frames, error } = interpret("True != False");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(true);
    });

    test("inequality - True != True", () => {
      const { frames, error } = interpret("True != True");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].result?.jikiObject.value).toBe(false);
    });
  });
});
