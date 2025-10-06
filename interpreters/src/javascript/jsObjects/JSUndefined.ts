import { JikiObject } from "../../shared/jikiObject";

export class JSUndefined extends JikiObject {
  constructor() {
    super("undefined");
  }

  public get value(): undefined {
    return undefined;
  }

  public toString(): string {
    return "undefined";
  }

  public clone(): JSUndefined {
    // Undefined is immutable, so return self
    return this;
  }
}
