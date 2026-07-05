export abstract class JikiObject {
  public readonly objectId: string;
  constructor(public readonly type: string) {
    this.objectId = Math.random().toString(36).substring(7);
  }

  public abstract toString(): string;
  public abstract get value(): any;
  public abstract clone(): JikiObject;

  // Display representation used in educational descriptions ("What happened").
  // Defaults to toString(); override where the display form differs from the
  // value/coercion form (e.g. strings are quoted for display but not when
  // coerced to an actual program value).
  public toDisplayString(): string {
    return this.toString();
  }
}
