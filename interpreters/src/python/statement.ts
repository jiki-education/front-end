import type { Expression } from "./expression";
import { SubscriptExpression } from "./expression";
import type { Token } from "./token";
import type { Location } from "../shared/location";

export abstract class Statement {
  constructor(public type: string) {}
  abstract location: Location;
  abstract children(): Expression[];
}

export class ExpressionStatement extends Statement {
  constructor(
    public expression: Expression,
    public location: Location
  ) {
    super("ExpressionStatement");
  }
  public children() {
    return [this.expression];
  }
}

export class PrintStatement extends Statement {
  constructor(
    public expression: Expression,
    public location: Location
  ) {
    super("PrintStatement");
  }
  public children() {
    return [this.expression];
  }
}

export class AssignmentStatement extends Statement {
  constructor(
    public target: Token | SubscriptExpression,
    public initializer: Expression,
    public location: Location
  ) {
    super("AssignmentStatement");
  }
  public children() {
    if (this.target instanceof SubscriptExpression) {
      return [this.target, this.initializer];
    }
    return [this.initializer];
  }

  // Helper to get name for backwards compatibility
  public get name(): Token {
    if (!(this.target instanceof SubscriptExpression)) {
      return this.target;
    }
    // For subscript, return a dummy token (shouldn't be used in this case)
    throw new Error("Cannot get name from subscript assignment");
  }
}

export class BlockStatement extends Statement {
  constructor(
    public statements: Statement[],
    public location: Location
  ) {
    super("BlockStatement");
  }
  public children() {
    // Return empty array since statements are not expressions
    return [];
  }
}

export class IfStatement extends Statement {
  constructor(
    public condition: Expression,
    public thenBranch: Statement,
    public elseBranch: Statement | null,
    public location: Location
  ) {
    super("IfStatement");
  }
  public children() {
    const children = [this.condition];
    // Note: thenBranch and elseBranch are statements, not expressions
    // so we don't include them in children() which returns Expression[]
    return children;
  }
}

export class ForInStatement extends Statement {
  constructor(
    public variable: Token,
    public iterable: Expression,
    public body: Statement[],
    public location: Location
  ) {
    super("ForInStatement");
  }
  public children() {
    return [this.iterable];
  }
}

export class WhileStatement extends Statement {
  constructor(
    public condition: Expression,
    public body: Statement[],
    public location: Location
  ) {
    super("WhileStatement");
  }
  public children() {
    return [this.condition];
  }
}

export class BreakStatement extends Statement {
  constructor(
    public keyword: Token,
    public location: Location
  ) {
    super("BreakStatement");
  }
  public children() {
    return [];
  }
}

export class ContinueStatement extends Statement {
  constructor(
    public keyword: Token,
    public location: Location
  ) {
    super("ContinueStatement");
  }
  public children() {
    return [];
  }
}

export class FunctionParameter {
  constructor(public name: Token) {}
}

export class FunctionDeclaration extends Statement {
  constructor(
    public name: Token,
    public parameters: FunctionParameter[],
    public body: Statement[],
    public location: Location
  ) {
    super("FunctionDeclaration");
  }
  public children() {
    return [];
  }
}

export class ReturnStatement extends Statement {
  constructor(
    public keyword: Token,
    public expression: Expression | null,
    public location: Location
  ) {
    super("ReturnStatement");
  }
  public children() {
    return this.expression ? [this.expression] : [];
  }
}
