import { JikiObject } from "../../shared/jikiObject";

export class JSBoolean extends JikiObject {
  constructor(public readonly _value: boolean) {
    super("boolean");
  }

  public get value(): boolean {
    return this._value;
  }

  public toString(): string {
    return this._value.toString();
  }

  public clone(): JSBoolean {
    // Booleans are immutable, so return self
    return this;
  }
}
