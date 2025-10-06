import { interpret } from "@python/interpreter";
import { PyNumber } from "@python/jikiObjects";

describe("arithmetic interpreter", () => {
  describe("execute", () => {
    describe("literals", () => {
      test("integer", () => {
        const { frames, error } = interpret("42");
        expect(error).toBeNull();
        expect(frames).toBeArrayOfSize(1);
        expect(frames[0].status).toBe("SUCCESS");
        expect(frames[0].result?.jikiObject).toBeInstanceOf(PyNumber);
        expect(frames[0].result?.jikiObject.value).toBe(42);
      });

      test("floating point", () => {
        const { frames, error } = interpret("3.14");
        expect(error).toBeNull();
        expect(frames).toBeArrayOfSize(1);
        expect(frames[0].status).toBe("SUCCESS");
        expect(frames[0].result?.jikiObject.value).toBe(3.14);
      });

      test("zero", () => {
        const { frames, error } = interpret("0");
        expect(error).toBeNull();
        expect(frames).toBeArrayOfSize(1);
        expect(frames[0].status).toBe("SUCCESS");
        expect(frames[0].result?.jikiObject.value).toBe(0);
      });

      test("negative integer", () => {
        const { frames, error } = interpret("-5");
        expect(error).toBeNull();
        expect(frames).toBeArrayOfSize(1);
        expect(frames[0].status).toBe("SUCCESS");
        expect(frames[0].result?.jikiObject.value).toBe(-5);
      });

      test("scientific notation", () => {
        const { frames, error } = interpret("1.5e2");
        expect(error).toBeNull();
        expect(frames).toBeArrayOfSize(1);
        expect(frames[0].status).toBe("SUCCESS");
        expect(frames[0].result?.jikiObject.value).toBe(150);
      });
    });
  });
});
