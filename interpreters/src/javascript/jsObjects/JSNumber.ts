import { JikiObject } from "../../shared/jikiObject";

export class JSNumber extends JikiObject {
  constructor(public readonly _value: number) {
    super("number");
  }

  public get value(): number {
    return this._value;
  }

  public toString(): string {
    return this._value.toString();
  }

  public clone(): JSNumber {
    // Numbers are immutable, so return self
    return this;
  }
}
