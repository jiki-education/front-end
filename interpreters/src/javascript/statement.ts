import { Expression } from "./expression";
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

export class ConsoleLogStatement extends Statement {
  constructor(
    public expression: Expression,
    public location: Location
  ) {
    super("ConsoleLogStatement");
  }
  public children() {
    return [this.expression];
  }
}

export class VariableDeclaration extends Statement {
  constructor(
    public name: Token,
    public initializer: Expression | null,
    public location: Location
  ) {
    super("VariableDeclaration");
  }
  public children() {
    return this.initializer ? [this.initializer] : [];
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
    return this.statements.flatMap(stmt => stmt.children());
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
    const children = [this.condition, ...this.thenBranch.children()];
    if (this.elseBranch) {
      children.push(...this.elseBranch.children());
    }
    return children;
  }
}

export class ForStatement extends Statement {
  constructor(
    public init: Statement | Expression | null,
    public condition: Expression | null,
    public update: Expression | null,
    public body: Statement,
    public location: Location
  ) {
    super("ForStatement");
  }
  public children() {
    const children: Expression[] = [];
    if (this.init && this.init instanceof Expression) {
      children.push(this.init);
    }
    if (this.condition) {
      children.push(this.condition);
    }
    if (this.update) {
      children.push(this.update);
    }
    children.push(...this.body.children());
    return children;
  }
}

export class WhileStatement extends Statement {
  constructor(
    public condition: Expression,
    public body: Statement,
    public location: Location
  ) {
    super("WhileStatement");
  }
  public children() {
    const children: Expression[] = [this.condition];
    children.push(...this.body.children());
    return children;
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
    return this.body.flatMap(stmt => stmt.children());
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
