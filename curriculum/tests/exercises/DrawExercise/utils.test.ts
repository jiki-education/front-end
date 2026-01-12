import { describe, it, expect } from "vitest";
import { aToR, rToA } from "../../../src/exercise-categories/draw/utils";

describe("Coordinate Utilities", () => {
  describe("3.1 aToR (Absolute to Relative)", () => {
    it("aToR(0, 100) should return 0", () => {
      expect(aToR(0, 100)).toBe(0);
    });

    it("aToR(100, 100) should return 100", () => {
      expect(aToR(100, 100)).toBe(100);
    });

    it("aToR(50, 100) should return 50", () => {
      expect(aToR(50, 100)).toBe(50);
    });

    it("aToR(25, 100) should return 25", () => {
      expect(aToR(25, 100)).toBe(25);
    });

    it("aToR(75, 100) should return 75", () => {
      expect(aToR(75, 100)).toBe(75);
    });

    it("aToR(100, 200) should return 50", () => {
      expect(aToR(100, 200)).toBe(50);
    });

    it("aToR(50, 200) should return 25", () => {
      expect(aToR(50, 200)).toBe(25);
    });

    it("aToR(0, 200) should return 0", () => {
      expect(aToR(0, 200)).toBe(0);
    });

    it("aToR(200, 200) should return 100", () => {
      expect(aToR(200, 200)).toBe(100);
    });

    it("Return value should be a number", () => {
      const result = aToR(50, 100);
      expect(typeof result).toBe("number");
    });

    it("Should handle decimal inputs correctly", () => {
      expect(aToR(33.33, 100)).toBeCloseTo(33.33, 2);
      expect(aToR(66.66, 200)).toBeCloseTo(33.33, 2);
    });

    it("Should handle negative absolute values", () => {
      expect(aToR(-50, 100)).toBe(-50);
      expect(aToR(-100, 200)).toBe(-50);
    });
  });

  describe("3.2 rToA (Relative to Absolute)", () => {
    it("rToA(0) should return 0", () => {
      expect(rToA(0)).toBe(0);
    });

    it("rToA(100) should return 100", () => {
      expect(rToA(100)).toBe(100);
    });

    it("rToA(50) should return 50", () => {
      expect(rToA(50)).toBe(50);
    });

    it("rToA(25) should return 25", () => {
      expect(rToA(25)).toBe(25);
    });

    it("rToA(75) should return 75", () => {
      expect(rToA(75)).toBe(75);
    });

    it("Return value should be a number", () => {
      const result = rToA(50);
      expect(typeof result).toBe("number");
    });

    it("Should handle decimal inputs correctly", () => {
      expect(rToA(33.33)).toBeCloseTo(33.33, 2);
      expect(rToA(66.66)).toBeCloseTo(66.66, 2);
    });

    it("Should handle negative relative values", () => {
      expect(rToA(-50)).toBe(-50);
      expect(rToA(-100)).toBe(-100);
    });
  });

  describe("3.3 Roundtrip Conversion", () => {
    it("aToR(rToA(x), 100) should equal x (for various x values)", () => {
      const testValues = [0, 25, 50, 75, 100];
      testValues.forEach((x) => {
        const result = aToR(rToA(x), 100);
        expect(result).toBeCloseTo(x, 10);
      });
    });

    it("rToA(aToR(x, 100)) should equal x (for various x values)", () => {
      const testValues = [0, 25, 50, 75, 100];
      testValues.forEach((x) => {
        // Note: rToA doesn't take canvas size, so this needs to match the canvasSize of 100
        const result = rToA(aToR(x, 100));
        expect(result).toBeCloseTo(x, 10);
      });
    });

    it("Roundtrip at x=0 should be exact", () => {
      const x = 0;
      const result = aToR(rToA(x), 100);
      expect(result).toBe(x);
    });

    it("Roundtrip at x=50 should be exact", () => {
      const x = 50;
      const result = aToR(rToA(x), 100);
      expect(result).toBe(x);
    });

    it("Roundtrip at x=100 should be exact", () => {
      const x = 100;
      const result = aToR(rToA(x), 100);
      expect(result).toBe(x);
    });

    it("Roundtrip with decimal values should be close (within floating-point precision)", () => {
      const testValues = [12.34, 45.67, 89.01];
      testValues.forEach((x) => {
        const result = aToR(rToA(x), 100);
        expect(result).toBeCloseTo(x, 10);
      });
    });
  });
});
