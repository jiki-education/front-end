import type { Token } from "./token";
import type { Location } from "../shared/location";

export abstract class Expression {
  constructor(public type: string) {}
  abstract location: Location;
  abstract children(): Expression[];
}

export class LiteralExpression extends Expression {
  constructor(
    public value: number | string | boolean | null | undefined,
    public location: Location
  ) {
    super("LiteralExpression");
  }
  public children() {
    return [];
  }
}

export class BinaryExpression extends Expression {
  constructor(
    public left: Expression,
    public operator: Token,
    public right: Expression,
    public location: Location
  ) {
    super("BinaryExpression");
  }
  public children() {
    return [this.left, this.right];
  }
}

export class UnaryExpression extends Expression {
  constructor(
    public operator: Token,
    public operand: Expression,
    public location: Location
  ) {
    super("UnaryExpression");
  }
  public children() {
    return [this.operand];
  }
}

export class GroupingExpression extends Expression {
  constructor(
    public inner: Expression,
    public location: Location
  ) {
    super("GroupingExpression");
  }
  public children() {
    return [this.inner];
  }
}

export class IdentifierExpression extends Expression {
  constructor(
    public name: Token,
    public location: Location
  ) {
    super("IdentifierExpression");
  }
  public children() {
    return [];
  }
}

export class AssignmentExpression extends Expression {
  constructor(
    public target: Token | MemberExpression,
    public value: Expression,
    public location: Location
  ) {
    super("AssignmentExpression");
  }
  public children() {
    if (this.target instanceof MemberExpression) {
      return [this.target, this.value];
    }
    return [this.value];
  }
}

export class UpdateExpression extends Expression {
  constructor(
    public operator: Token, // INCREMENT or DECREMENT
    public operand: IdentifierExpression,
    public prefix: boolean, // true for ++i, false for i++
    public location: Location
  ) {
    super("UpdateExpression");
  }
  public children() {
    return [this.operand];
  }
}

export class TemplateLiteralExpression extends Expression {
  constructor(
    public parts: (string | Expression)[], // Array of template parts (strings) and interpolations (expressions)
    public location: Location
  ) {
    super("TemplateLiteralExpression");
  }
  public children() {
    return this.parts.filter((part): part is Expression => typeof part !== "string");
  }
}

export class ArrayExpression extends Expression {
  constructor(
    public elements: Expression[],
    public location: Location
  ) {
    super("ArrayExpression");
  }
  public children() {
    return this.elements;
  }
}

export class MemberExpression extends Expression {
  constructor(
    public object: Expression,
    public property: Expression,
    public computed: boolean, // true for arr[0], false for obj.prop (future)
    public location: Location
  ) {
    super("MemberExpression");
  }
  public children() {
    return [this.object, this.property];
  }
}

export class DictionaryExpression extends Expression {
  constructor(
    public elements: Map<string, Expression>,
    public location: Location
  ) {
    super("DictionaryExpression");
  }
  public children() {
    return Array.from(this.elements.values());
  }
}

export class CallExpression extends Expression {
  constructor(
    public callee: Expression,
    public args: Expression[],
    public location: Location
  ) {
    super("CallExpression");
  }
  public children() {
    return [this.callee, ...this.args];
  }
}

export class NewExpression extends Expression {
  constructor(
    public className: IdentifierExpression,
    public args: Expression[],
    public location: Location
  ) {
    super("NewExpression");
  }
  public children() {
    return [this.className, ...this.args];
  }
}
