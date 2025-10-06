import type { Token } from "./token";
import type { Location } from "../shared/location";

export abstract class Expression {
  constructor(public type: string) {}
  abstract location: Location;
  abstract children(): Expression[];
}

export class LiteralExpression extends Expression {
  constructor(
    public value: number | string | boolean | null,
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

export class ListExpression extends Expression {
  constructor(
    public elements: Expression[],
    public location: Location
  ) {
    super("ListExpression");
  }
  public children() {
    return this.elements;
  }
}

export class SubscriptExpression extends Expression {
  constructor(
    public object: Expression,
    public index: Expression,
    public location: Location
  ) {
    super("SubscriptExpression");
  }
  public children() {
    return [this.object, this.index];
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

export class AttributeExpression extends Expression {
  constructor(
    public object: Expression,
    public attribute: Token,
    public location: Location
  ) {
    super("AttributeExpression");
  }
  public children() {
    return [this.object];
  }
}
