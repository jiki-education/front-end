import { JikiObject } from "../../shared/jikiObject";
import type { Fraction } from "../../shared/fraction";

// Results are exposed at 5 decimal places, matching the historic behaviour of
// rounding every arithmetic result. The exact value is kept internally (as a
// Fraction) so chained arithmetic stays order-independent.
const DP_MULTIPLE = 100000;

export function roundToDisplayPrecision(value: number): number {
  if (!Number.isFinite(value)) {
    return value;
  }
  return Math.round(value * DP_MULTIPLE) / DP_MULTIPLE;
}

export class JSNumber extends JikiObject {
  // The exact rational value when known. Null for values that cannot be held
  // exactly (e.g. results of sqrt or other irrational operations).
  public readonly exact: Fraction | null;

  constructor(
    public readonly _value: number,
    exact: Fraction | null = null
  ) {
    super("number");
    this.exact = exact;
  }

  /**
   * Build a JSNumber from an exact fraction. The exposed value is rounded to
   * display precision for backwards compatibility, while the exact fraction is
   * retained to feed subsequent arithmetic.
   */
  public static fromFraction(fraction: Fraction): JSNumber {
    return new JSNumber(roundToDisplayPrecision(fraction.toNumber()), fraction);
  }

  public get value(): number {
    return this._value;
  }

  /** Full-precision value for feeding the next arithmetic operation. */
  public get preciseValue(): number {
    return this.exact !== null ? this.exact.toNumber() : this._value;
  }

  public toString(): string {
    return this._value.toString();
  }

  public clone(): JSNumber {
    // Numbers are immutable, so return self
    return this;
  }
}
