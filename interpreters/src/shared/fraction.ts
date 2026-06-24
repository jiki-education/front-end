/**
 * Exact rational number (numerator/denominator as BigInt, always normalized).
 *
 * Interpreters store numbers as binary floats, which makes mathematically
 * equivalent expressions diverge once they involve division. For example
 * `1 / 7 * x` and `x / 7` produce different results, because the intermediate
 * `1 / 7` is rounded before being multiplied.
 *
 * Storing exact rationals removes that divergence: `1/7` is held as the
 * fraction 1/7, so `1/7 * 7` is exactly 1. Only operations that cannot stay
 * rational (e.g. sqrt, non-integer exponents) fall back to floats; those
 * operations return `null` from the relevant method so the caller can drop to
 * float arithmetic.
 */
function bigintGcd(a: bigint, b: bigint): bigint {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

function bigintPow(base: bigint, exp: bigint): bigint {
  let result = 1n;
  let b = base;
  let e = exp;
  while (e > 0n) {
    if (e & 1n) {
      result *= b;
    }
    b *= b;
    e >>= 1n;
  }
  return result;
}

export class Fraction {
  // Invariants: den > 0, gcd(|num|, den) === 1.
  readonly num: bigint;
  readonly den: bigint;

  private constructor(num: bigint, den: bigint) {
    this.num = num;
    this.den = den;
  }

  static of(num: bigint, den: bigint): Fraction {
    // Invariant guard, not a student-facing error: every public operation that
    // could divide by zero (div/mod, and pow with a zero base and negative
    // exponent) returns null *before* reaching here, signalling the caller to
    // fall back to float maths. So a zero denominator means a bug in Fraction
    // itself, and throwing surfaces it loudly rather than producing a bad value.
    if (den === 0n) {
      throw new Error("Fraction denominator cannot be zero");
    }
    if (den < 0n) {
      num = -num;
      den = -den;
    }
    const g = bigintGcd(num, den) || 1n;
    return new Fraction(num / g, den / g);
  }

  static fromInteger(n: bigint | number): Fraction {
    return new Fraction(typeof n === "bigint" ? n : BigInt(n), 1n);
  }

  /**
   * Build an exact fraction from a JS number. Returns null for non-finite
   * values. The number is interpreted via its shortest decimal string, so a
   * literal like 0.1 becomes exactly 1/10 rather than the binary-float value.
   */
  static fromNumber(n: number): Fraction | null {
    if (!Number.isFinite(n)) {
      return null;
    }
    if (Number.isInteger(n)) {
      return new Fraction(BigInt(n), 1n);
    }
    return Fraction.fromDecimalString(n.toString());
  }

  private static fromDecimalString(s: string): Fraction | null {
    const match = /^([+-]?)(\d*)(?:\.(\d*))?(?:[eE]([+-]?\d+))?$/.exec(s.trim());
    if (!match) {
      return null;
    }
    const [, sign, intPart = "", fracPart = "", expPart] = match;
    const digits = (intPart || "0") + fracPart;
    if (digits === "") {
      return null;
    }
    let num = BigInt(digits === "" ? "0" : digits);
    if (sign === "-") {
      num = -num;
    }
    let den = bigintPow(10n, BigInt(fracPart.length));
    const exp = expPart ? BigInt(expPart) : 0n;
    if (exp > 0n) {
      num *= bigintPow(10n, exp);
    } else if (exp < 0n) {
      den *= bigintPow(10n, -exp);
    }
    return Fraction.of(num, den);
  }

  add(o: Fraction): Fraction {
    return Fraction.of(this.num * o.den + o.num * this.den, this.den * o.den);
  }

  sub(o: Fraction): Fraction {
    return Fraction.of(this.num * o.den - o.num * this.den, this.den * o.den);
  }

  mul(o: Fraction): Fraction {
    return Fraction.of(this.num * o.num, this.den * o.den);
  }

  /** Returns null on division by zero, so the caller can fall back to float (Infinity/NaN). */
  div(o: Fraction): Fraction | null {
    if (o.num === 0n) {
      return null;
    }
    return Fraction.of(this.num * o.den, this.den * o.num);
  }

  /** JS-style remainder: a - b * trunc(a / b). Null on modulo by zero. */
  mod(o: Fraction): Fraction | null {
    if (o.num === 0n) {
      return null;
    }
    const q = this.div(o)!;
    const truncated = q.num / q.den; // bigint division truncates toward zero
    return this.sub(o.mul(Fraction.fromInteger(truncated)));
  }

  /** Only exact for integer exponents; returns null otherwise (caller uses float). */
  pow(o: Fraction): Fraction | null {
    if (o.den !== 1n) {
      return null;
    }
    const exp = o.num;
    if (exp >= 0n) {
      return Fraction.of(bigintPow(this.num, exp), bigintPow(this.den, exp));
    }
    if (this.num === 0n) {
      return null; // 0 to a negative power -> Infinity, let float handle it
    }
    const posExp = -exp;
    return Fraction.of(bigintPow(this.den, posExp), bigintPow(this.num, posExp));
  }

  neg(): Fraction {
    return new Fraction(-this.num, this.den);
  }

  isInteger(): boolean {
    return this.den === 1n;
  }

  equals(o: Fraction): boolean {
    return this.num === o.num && this.den === o.den;
  }

  toNumber(): number {
    if (this.den === 1n) {
      return Number(this.num);
    }
    return Number(this.num) / Number(this.den);
  }
}
