import { JikiObject } from "../../shared/jikiObject";

export class JSString extends JikiObject {
  constructor(public readonly _value: string) {
    super("string");
  }

  public get value(): string {
    return this._value;
  }

  public toString(): string {
    return this._value;
  }

  public toDisplayString(): string {
    return JSON.stringify(this._value);
  }

  public clone(): JSString {
    // Strings are immutable, so return self
    return this;
  }
}
