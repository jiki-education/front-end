export abstract class JikiObject {
  public readonly objectId: string;
  constructor(public readonly type: string) {
    this.objectId = Math.random().toString(36).substring(7);
  }

  public abstract toString(): string;
  public abstract get value(): any;
  public abstract clone(): JikiObject;
}
