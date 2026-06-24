import { Fraction } from "@shared/fraction";

describe("Fraction", () => {
  describe("fromNumber", () => {
    test("integers", () => {
      expect(Fraction.fromNumber(5)?.toNumber()).toBe(5);
      expect(Fraction.fromNumber(-3)?.toNumber()).toBe(-3);
      expect(Fraction.fromNumber(0)?.toNumber()).toBe(0);
    });

    test("terminating decimals are exact", () => {
      const tenth = Fraction.fromNumber(0.1)!;
      expect(tenth.num).toBe(1n);
      expect(tenth.den).toBe(10n);
    });

    test("scientific notation", () => {
      const f = Fraction.fromNumber(1.5e-3)!;
      expect(f.num).toBe(3n);
      expect(f.den).toBe(2000n);
    });

    test("non-finite values return null", () => {
      expect(Fraction.fromNumber(Infinity)).toBeNull();
      expect(Fraction.fromNumber(NaN)).toBeNull();
    });
  });

  describe("normalization", () => {
    test("reduces to lowest terms", () => {
      const f = Fraction.of(4n, 8n);
      expect(f.num).toBe(1n);
      expect(f.den).toBe(2n);
    });

    test("denominator is always positive", () => {
      const f = Fraction.of(1n, -2n);
      expect(f.num).toBe(-1n);
      expect(f.den).toBe(2n);
    });

    test("zero denominator throws", () => {
      expect(() => Fraction.of(1n, 0n)).toThrow();
    });
  });

  describe("arithmetic stays exact", () => {
    test("0.1 + 0.2 equals 3/10", () => {
      const result = Fraction.fromNumber(0.1)!.add(Fraction.fromNumber(0.2)!);
      expect(result.num).toBe(3n);
      expect(result.den).toBe(10n);
      expect(result.toNumber()).toBe(0.3);
    });

    test("1/7 * 7 equals 1", () => {
      const seventh = Fraction.fromInteger(1).div(Fraction.fromInteger(7))!;
      const result = seventh.mul(Fraction.fromInteger(7));
      expect(result.toNumber()).toBe(1);
    });

    test("1/7 * 700 equals 700 / 7", () => {
      const a = Fraction.fromInteger(1).div(Fraction.fromInteger(7))!.mul(Fraction.fromInteger(700));
      const b = Fraction.fromInteger(700).div(Fraction.fromInteger(7))!;
      expect(a.equals(b)).toBe(true);
      expect(a.toNumber()).toBe(100);
    });

    test("thirds sum to exactly 1", () => {
      const third = Fraction.fromInteger(1).div(Fraction.fromInteger(3))!;
      expect(third.add(third).add(third).toNumber()).toBe(1);
    });
  });

  describe("division and modulo", () => {
    test("division by zero returns null", () => {
      expect(Fraction.fromInteger(1).div(Fraction.fromInteger(0))).toBeNull();
    });

    test("modulo matches JS remainder semantics", () => {
      expect(Fraction.fromInteger(7).mod(Fraction.fromInteger(3))!.toNumber()).toBe(1);
      expect(Fraction.fromInteger(-7).mod(Fraction.fromInteger(3))!.toNumber()).toBe(-1);
    });

    test("modulo by zero returns null", () => {
      expect(Fraction.fromInteger(1).mod(Fraction.fromInteger(0))).toBeNull();
    });
  });

  describe("pow", () => {
    test("integer exponents stay exact", () => {
      const half = Fraction.of(1n, 2n);
      expect(half.pow(Fraction.fromInteger(3))!.toNumber()).toBe(0.125);
    });

    test("negative integer exponents invert", () => {
      expect(Fraction.fromInteger(2).pow(Fraction.fromInteger(-2))!.toNumber()).toBe(0.25);
    });

    test("non-integer exponents return null (float fallback)", () => {
      expect(Fraction.fromInteger(2).pow(Fraction.of(1n, 2n))).toBeNull();
    });
  });

  describe("neg", () => {
    test("negates numerator", () => {
      expect(Fraction.fromNumber(0.1)!.neg().toNumber()).toBe(-0.1);
    });
  });
});
