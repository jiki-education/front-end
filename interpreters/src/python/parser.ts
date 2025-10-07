import { SyntaxError, type SyntaxErrorType } from "./error";
import type { Expression } from "./expression";
import {
  LiteralExpression,
  BinaryExpression,
  UnaryExpression,
  GroupingExpression,
  IdentifierExpression,
  ListExpression,
  SubscriptExpression,
  CallExpression,
  AttributeExpression,
  FStringExpression,
} from "./expression";
import { Location } from "../shared/location";
import { Scanner } from "./scanner";
import type { Statement } from "./statement";
import { translate } from "./translator";
import {
  ExpressionStatement,
  AssignmentStatement,
  IfStatement,
  BlockStatement,
  ForInStatement,
  WhileStatement,
  BreakStatement,
  ContinueStatement,
  FunctionDeclaration,
  FunctionParameter,
  ReturnStatement,
} from "./statement";
import { type Token, type TokenType } from "./token";
import type { LanguageFeatures, NodeType } from "./interfaces";
import type { EvaluationContext } from "./interpreter";

export class Parser {
  private readonly scanner: Scanner;
  private current: number = 0;
  private tokens: Token[] = [];
  private readonly languageFeatures: LanguageFeatures;

  constructor(context: EvaluationContext = {}) {
    this.scanner = new Scanner();
    this.languageFeatures = context.languageFeatures || {};
  }

  private isNodeAllowed(nodeType: NodeType): boolean {
    // null or undefined = all nodes allowed (default behavior)
    if (this.languageFeatures.allowedNodes === null || this.languageFeatures.allowedNodes === undefined) {
      return true;
    }
    // Check if the specific node type is in the allowed list
    return this.languageFeatures.allowedNodes.includes(nodeType);
  }

  private checkNodeAllowed(nodeType: NodeType, errorType: SyntaxErrorType, location: Location): void {
    if (!this.isNodeAllowed(nodeType)) {
      const friendlyName = this.getNodeFriendlyName(nodeType);
      throw new SyntaxError(`${friendlyName} cannot be used at this level`, location, errorType, {
        nodeType,
      });
    }
  }

  private getNodeFriendlyName(nodeType: NodeType): string {
    const friendlyNames: Record<NodeType, string> = {
      LiteralExpression: "Literals",
      BinaryExpression: "Binary expressions",
      UnaryExpression: "Unary expressions",
      GroupingExpression: "Grouping expressions",
      IdentifierExpression: "Identifiers",
      ListExpression: "Lists",
      SubscriptExpression: "Subscript expressions",
      CallExpression: "Function calls",
      AttributeExpression: "Attribute access",
      ExpressionStatement: "Expression statements",
      PrintStatement: "Print statements",
      AssignmentStatement: "Assignment statements",
      BlockStatement: "Block statements",
      IfStatement: "If statements",
      ForInStatement: "For loops",
      WhileStatement: "While loops",
      BreakStatement: "Break statements",
      ContinueStatement: "Continue statements",
      FunctionDeclaration: "Function declarations",
      ReturnStatement: "Return statements",
    };
    return friendlyNames[nodeType] || nodeType;
  }

  public parse(sourceCode: string): Statement[] {
    this.tokens = this.scanner.scanTokens(sourceCode);

    const statements: Statement[] = [];

    while (!this.isAtEnd()) {
      const statement = this.statement();
      if (statement) {
        statements.push(statement);
      }
    }

    return statements;
  }

  private statement(): Statement | null {
    try {
      // Skip comments and newlines
      while (this.check("NEWLINE")) {
        this.advance();
      }

      // If we've consumed all tokens, return null
      if (this.isAtEnd()) {
        return null;
      }

      // Check for if statement
      if (this.match("IF")) {
        return this.ifStatement();
      }

      // Check for for statement
      if (this.match("FOR")) {
        return this.forInStatement();
      }

      // Check for while statement
      if (this.match("WHILE")) {
        return this.whileStatement();
      }

      // Check for break statement
      if (this.match("BREAK")) {
        return this.breakStatement();
      }

      // Check for continue statement
      if (this.match("CONTINUE")) {
        return this.continueStatement();
      }

      // Check for function declaration
      if (this.match("DEF")) {
        return this.functionDeclaration(this.previous());
      }

      // Check for return statement
      if (this.match("RETURN")) {
        return this.returnStatement(this.previous());
      }

      // For potential expression or assignment statements,
      // determine the type first before parsing
      if (
        this.check("IDENTIFIER") ||
        this.check("NUMBER") ||
        this.check("STRING") ||
        this.check("F_STRING_TEXT") ||
        this.check("TRUE") ||
        this.check("FALSE") ||
        this.check("NONE") ||
        this.check("LEFT_PAREN") ||
        this.check("LEFT_BRACKET") ||
        this.check("NOT") ||
        this.check("MINUS")
      ) {
        // Look ahead to determine if it's an assignment
        if (this.isAssignmentAhead()) {
          return this.assignmentStatement();
        }
        return this.expressionStatement();
      }

      // If we get here, try to parse as expression statement
      return this.expressionStatement();
    } catch (error) {
      this.synchronize();
      throw error;
    }
  }

  // Helper method to look ahead and determine if the current position starts an assignment
  private isAssignmentAhead(): boolean {
    // Only identifiers can start assignments in Python
    if (!this.check("IDENTIFIER")) {
      return false;
    }

    // Look ahead in the token stream
    let pos = this.current;

    // Skip the identifier
    pos++;

    // Skip any subscript operations (e.g., x[0][1] = ...)
    while (pos < this.tokens.length && this.tokens[pos].type === "LEFT_BRACKET") {
      pos++;
      // Find matching right bracket
      let bracketDepth = 1;
      while (pos < this.tokens.length && bracketDepth > 0) {
        if (this.tokens[pos].type === "LEFT_BRACKET") {
          bracketDepth++;
        }
        if (this.tokens[pos].type === "RIGHT_BRACKET") {
          bracketDepth--;
        }
        pos++;
      }
    }

    // Check if the next token is EQUAL (assignment)
    const isAssignment = pos < this.tokens.length && this.tokens[pos].type === "EQUAL";

    return isAssignment;
  }

  private assignmentStatement(): Statement {
    // Check if AssignmentStatement is allowed first
    this.checkNodeAllowed("AssignmentStatement", "AssignmentStatementNotAllowed", this.peek().location);

    // Now parse the left side
    const left = this.postfix();

    // Consume the EQUAL token
    this.consume("EQUAL", "MissingEqual");

    // Parse the right side
    const value = this.expression();

    // Python doesn't require semicolons, but consume newline if present
    if (this.check("NEWLINE")) {
      this.advance();
    }

    // Create assignment based on left side type
    if (left instanceof IdentifierExpression) {
      return new AssignmentStatement(left.name, value, Location.between(left, value));
    }
    if (left instanceof SubscriptExpression) {
      return new AssignmentStatement(left, value, Location.between(left, value));
    }
    throw new SyntaxError("Invalid assignment target", left.location, "ParseError");
  }

  private expressionStatement(): Statement {
    // Check if ExpressionStatement is allowed
    this.checkNodeAllowed("ExpressionStatement", "ExpressionStatementNotAllowed", this.peek().location);

    const expr = this.expression();
    // Python doesn't require semicolons, but consume newline if present
    if (this.check("NEWLINE")) {
      this.advance();
    }
    return new ExpressionStatement(expr, Location.between(expr, expr));
  }

  private expression(): Expression {
    return this.or();
  }

  private or(): Expression {
    let expr = this.and();

    while (this.match("OR")) {
      // Check if BinaryExpression is allowed
      this.checkNodeAllowed("BinaryExpression", "BinaryExpressionNotAllowed", this.previous().location);

      const operator = this.previous();
      const right = this.and();
      expr = new BinaryExpression(expr, operator, right, Location.between(expr, right));
    }

    return expr;
  }

  private and(): Expression {
    let expr = this.equality();

    while (this.match("AND")) {
      // Check if BinaryExpression is allowed
      this.checkNodeAllowed("BinaryExpression", "BinaryExpressionNotAllowed", this.previous().location);

      const operator = this.previous();
      const right = this.equality();
      expr = new BinaryExpression(expr, operator, right, Location.between(expr, right));
    }

    return expr;
  }

  private equality(): Expression {
    let expr = this.comparison();

    while (this.match("NOT_EQUAL", "EQUAL_EQUAL")) {
      // Check if BinaryExpression is allowed
      this.checkNodeAllowed("BinaryExpression", "BinaryExpressionNotAllowed", this.previous().location);

      const operator = this.previous();
      const right = this.comparison();
      expr = new BinaryExpression(expr, operator, right, Location.between(expr, right));
    }

    return expr;
  }

  private comparison(): Expression {
    let expr = this.term();

    while (this.match("GREATER", "GREATER_EQUAL", "LESS", "LESS_EQUAL")) {
      // Check if BinaryExpression is allowed
      this.checkNodeAllowed("BinaryExpression", "BinaryExpressionNotAllowed", this.previous().location);

      const operator = this.previous();
      const right = this.term();
      expr = new BinaryExpression(expr, operator, right, Location.between(expr, right));
    }

    return expr;
  }

  private term(): Expression {
    let expr = this.factor();

    while (this.match("MINUS", "PLUS")) {
      // Check if BinaryExpression is allowed
      this.checkNodeAllowed("BinaryExpression", "BinaryExpressionNotAllowed", this.previous().location);

      const operator = this.previous();
      const right = this.factor();
      expr = new BinaryExpression(expr, operator, right, Location.between(expr, right));
    }

    return expr;
  }

  private factor(): Expression {
    let expr = this.power();

    while (this.match("SLASH", "DOUBLE_SLASH", "STAR", "PERCENT")) {
      // Check if BinaryExpression is allowed
      this.checkNodeAllowed("BinaryExpression", "BinaryExpressionNotAllowed", this.previous().location);

      const operator = this.previous();
      const right = this.power();
      expr = new BinaryExpression(expr, operator, right, Location.between(expr, right));
    }

    return expr;
  }

  private power(): Expression {
    let expr = this.unary();

    // Power operator is right-associative
    if (this.match("DOUBLE_STAR")) {
      // Check if BinaryExpression is allowed
      this.checkNodeAllowed("BinaryExpression", "BinaryExpressionNotAllowed", this.previous().location);

      const operator = this.previous();
      const right = this.power(); // Right-associative recursion
      expr = new BinaryExpression(expr, operator, right, Location.between(expr, right));
    }

    return expr;
  }

  private unary(): Expression {
    if (this.match("NOT", "MINUS")) {
      const operator = this.previous();
      // Check if UnaryExpression is allowed
      this.checkNodeAllowed("UnaryExpression", "UnaryExpressionNotAllowed", operator.location);
      const right = this.unary();
      return new UnaryExpression(operator, right, Location.between(operator, right));
    }

    return this.postfix();
  }

  private postfix(): Expression {
    let expr = this.primary();

    // Handle postfix operations: subscript access and function calls
    // This allows chaining like list[0][1] for nested lists and func(arg1)(arg2) for curried functions
    while (true) {
      if (this.match("LEFT_BRACKET")) {
        // Check if SubscriptExpression is allowed
        this.checkNodeAllowed("SubscriptExpression", "SubscriptExpressionNotAllowed", this.previous().location);

        const index = this.expression();
        const rightBracket = this.consume("RIGHT_BRACKET", "MissingRightBracket");
        expr = new SubscriptExpression(expr, index, Location.between(expr, rightBracket));
      } else if (this.match("LEFT_PAREN")) {
        // Check if CallExpression is allowed
        this.checkNodeAllowed("CallExpression", "CallExpressionNotAllowed", this.previous().location);

        expr = this.finishCallExpression(expr);
      } else if (this.match("DOT")) {
        // Check if AttributeExpression is allowed
        this.checkNodeAllowed("AttributeExpression", "AttributeExpressionNotAllowed", this.previous().location);

        const attribute = this.consume("IDENTIFIER", "MissingAttributeName");
        expr = new AttributeExpression(expr, attribute, Location.between(expr, attribute));
      } else {
        break;
      }
    }

    return expr;
  }

  private primary(): Expression {
    if (this.match("FALSE")) {
      // Check if LiteralExpression is allowed
      this.checkNodeAllowed("LiteralExpression", "LiteralExpressionNotAllowed", this.previous().location);
      return new LiteralExpression(false, this.previous().location);
    }

    if (this.match("TRUE")) {
      // Check if LiteralExpression is allowed
      this.checkNodeAllowed("LiteralExpression", "LiteralExpressionNotAllowed", this.previous().location);
      return new LiteralExpression(true, this.previous().location);
    }

    if (this.match("NONE")) {
      // Check if LiteralExpression is allowed
      this.checkNodeAllowed("LiteralExpression", "LiteralExpressionNotAllowed", this.previous().location);
      return new LiteralExpression(null, this.previous().location);
    }

    if (this.match("NUMBER", "STRING")) {
      // Check if LiteralExpression is allowed
      this.checkNodeAllowed("LiteralExpression", "LiteralExpressionNotAllowed", this.previous().location);
      return new LiteralExpression(this.previous().literal, this.previous().location);
    }

    if (this.match("IDENTIFIER")) {
      // Check if IdentifierExpression is allowed
      this.checkNodeAllowed("IdentifierExpression", "IdentifierExpressionNotAllowed", this.previous().location);
      return new IdentifierExpression(this.previous(), this.previous().location);
    }

    if (this.match("LEFT_PAREN")) {
      const lparen = this.previous();
      // Check if GroupingExpression is allowed
      this.checkNodeAllowed("GroupingExpression", "GroupingExpressionNotAllowed", lparen.location);
      const expr = this.expression();
      this.consume("RIGHT_PAREN", "MissingRightParen");
      return new GroupingExpression(expr, Location.between(expr, expr));
    }

    if (this.match("LEFT_BRACKET")) {
      return this.listExpression();
    }

    if (this.check("F_STRING_TEXT", "F_STRING_START")) {
      return this.parseFString();
    }

    this.error("MissingExpression", this.peek().location);
  }

  private parseFString(): Expression {
    const startToken = this.peek();
    const parts: (string | Expression)[] = [];

    // Consume the F_STRING_START token
    this.consume("F_STRING_START", "MissingExpression");

    while (!this.isAtEnd() && (this.check("F_STRING_TEXT") || this.check("LEFT_BRACE"))) {
      if (this.match("F_STRING_TEXT")) {
        parts.push(this.previous().literal as string);
      } else if (this.match("LEFT_BRACE")) {
        // Parse the interpolated expression
        const expr = this.expression();
        this.consume("RIGHT_BRACE", "MissingRightBraceInFString");
        parts.push(expr);
      }
    }

    // Create location spanning from start to the current position
    const endToken = this.previous();
    return new FStringExpression(parts, Location.between(startToken, endToken));
  }

  // Helper methods
  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private check(...types: TokenType[]): boolean {
    if (this.isAtEnd()) {
      return false;
    }
    return types.includes(this.peek().type);
  }

  private checkNext(type: TokenType): boolean {
    if (this.current + 1 >= this.tokens.length) {
      return false;
    }
    return this.tokens[this.current + 1].type === type;
  }

  private advance(): Token {
    if (!this.isAtEnd()) {
      this.current++;
    }
    return this.previous();
  }

  private isAtEnd(): boolean {
    return this.peek().type === "EOF";
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  private consume(tokenType: TokenType, errorType: SyntaxErrorType, context?: any): Token {
    if (this.check(tokenType)) {
      return this.advance();
    }

    this.error(errorType, this.peek().location, context);
  }

  private error(type: SyntaxErrorType, location: Location, context?: any): never {
    throw new SyntaxError(translate(`error.syntax.${type}`, context), location, type, context);
  }

  private ifStatement(): Statement {
    const ifToken = this.previous();

    // Check if IfStatement is allowed
    this.checkNodeAllowed("IfStatement", "IfStatementNotAllowed", ifToken.location);

    const condition = this.expression();
    this.consume("COLON", "MissingColon");

    // Consume the newline after the colon
    if (this.check("NEWLINE")) {
      this.advance();
    }

    const thenBranch = this.block();

    // Check for elif/else clauses
    let elseBranch: Statement | null = null;
    if (this.match("ELIF")) {
      // elif is handled as a nested if statement
      elseBranch = this.ifStatement();
    } else if (this.match("ELSE")) {
      this.consume("COLON", "MissingColon");

      // Consume the newline after the colon
      if (this.check("NEWLINE")) {
        this.advance();
      }

      elseBranch = this.block();
    }

    const endToken = elseBranch || thenBranch;
    return new IfStatement(condition, thenBranch, elseBranch, Location.between(ifToken, endToken));
  }

  private forInStatement(): Statement {
    const forToken = this.previous();

    // Check if ForInStatement is allowed
    this.checkNodeAllowed("ForInStatement", "ForInStatementNotAllowed", forToken.location);

    // Parse the variable name
    const variable = this.consume("IDENTIFIER", "MissingIdentifier");

    // Parse 'in' keyword
    this.consume("IN", "MissingIn");

    // Parse the iterable expression
    const iterable = this.expression();

    // Parse the colon
    this.consume("COLON", "MissingColon");

    // Consume the newline after the colon
    if (this.check("NEWLINE")) {
      this.advance();
    }

    // Parse the block body
    const bodyBlock = this.block();

    // Extract statements from BlockStatement
    const body = bodyBlock instanceof BlockStatement ? bodyBlock.statements : [bodyBlock];

    return new ForInStatement(variable, iterable, body, Location.between(forToken, bodyBlock));
  }

  private whileStatement(): Statement {
    const whileToken = this.previous();

    // Check if WhileStatement is allowed
    this.checkNodeAllowed("WhileStatement", "WhileStatementNotAllowed", whileToken.location);

    // Parse the condition expression
    const condition = this.expression();

    // Parse the colon
    this.consume("COLON", "MissingColon");

    // Consume the newline after the colon
    if (this.check("NEWLINE")) {
      this.advance();
    }

    // Parse the block body
    const bodyBlock = this.block();

    // Extract statements from BlockStatement
    const body = bodyBlock instanceof BlockStatement ? bodyBlock.statements : [bodyBlock];

    return new WhileStatement(condition, body, Location.between(whileToken, bodyBlock));
  }

  private breakStatement(): Statement {
    const breakToken = this.previous();

    // Check if BreakStatement is allowed
    this.checkNodeAllowed("BreakStatement", "BreakStatementNotAllowed", breakToken.location);

    // Python doesn't require semicolons, but consume newline if present
    if (this.check("NEWLINE")) {
      this.advance();
    }

    return new BreakStatement(breakToken, breakToken.location);
  }

  private continueStatement(): Statement {
    const continueToken = this.previous();

    // Check if ContinueStatement is allowed
    this.checkNodeAllowed("ContinueStatement", "ContinueStatementNotAllowed", continueToken.location);

    // Python doesn't require semicolons, but consume newline if present
    if (this.check("NEWLINE")) {
      this.advance();
    }

    return new ContinueStatement(continueToken, continueToken.location);
  }

  private functionDeclaration(defToken: Token): Statement {
    // Check if FunctionDeclaration is allowed
    this.checkNodeAllowed("FunctionDeclaration", "FunctionDeclarationNotAllowed", defToken.location);

    // Parse function name
    const name = this.consume("IDENTIFIER", "MissingFunctionName");

    // Parse parameter list
    this.consume("LEFT_PAREN", "MissingLeftParenthesisAfterFunctionName");

    const parameters: FunctionParameter[] = [];
    const parameterNames = new Set<string>();

    if (!this.check("RIGHT_PAREN")) {
      do {
        const paramName = this.consume("IDENTIFIER", "MissingParameterName");

        // Check for duplicate parameter names
        if (parameterNames.has(paramName.lexeme)) {
          throw new SyntaxError(
            `Duplicate parameter name '${paramName.lexeme}'`,
            paramName.location,
            "DuplicateParameterName",
            { name: paramName.lexeme }
          );
        }

        parameterNames.add(paramName.lexeme);
        parameters.push(new FunctionParameter(paramName));
      } while (this.match("COMMA"));
    }

    this.consume("RIGHT_PAREN", "MissingRightParenthesisAfterParameters");
    this.consume("COLON", "MissingColonAfterFunctionSignature");

    // Skip newline after colon
    if (this.check("NEWLINE")) {
      this.advance();
    }

    // Parse function body as a block
    const bodyBlock = this.block();
    const body = bodyBlock instanceof BlockStatement ? bodyBlock.statements : [bodyBlock];

    return new FunctionDeclaration(name, parameters, body, Location.between(defToken, this.previous()));
  }

  private returnStatement(returnToken: Token): Statement {
    // Check if ReturnStatement is allowed
    this.checkNodeAllowed("ReturnStatement", "ReturnStatementNotAllowed", returnToken.location);

    let expression: Expression | null = null;

    // Check if there's an expression to return
    if (!this.check("NEWLINE") && !this.isAtEnd()) {
      expression = this.expression();
    }

    // Consume trailing newline if present
    if (this.check("NEWLINE")) {
      this.advance();
    }

    return new ReturnStatement(
      returnToken,
      expression,
      expression ? Location.between(returnToken, this.previous()) : returnToken.location
    );
  }

  private block(): Statement {
    const startToken = this.peek();

    // Check if BlockStatement is allowed
    this.checkNodeAllowed("BlockStatement", "BlockStatementNotAllowed", startToken.location);

    // Expect an INDENT token to start the block
    this.consume("INDENT", "MissingIndent");

    const statements: Statement[] = [];

    // Parse statements until we hit a DEDENT
    while (!this.check("DEDENT") && !this.isAtEnd()) {
      // Skip empty lines
      while (this.check("NEWLINE")) {
        this.advance();
      }

      if (this.check("DEDENT") || this.isAtEnd()) {
        break;
      }

      const stmt = this.statement();
      if (stmt) {
        statements.push(stmt);
      }
    }

    // Consume the DEDENT token
    this.consume("DEDENT", "MissingDedent");

    const endToken = this.previous();

    return new BlockStatement(statements, Location.between(startToken, endToken));
  }

  private listExpression(): Expression {
    const leftBracket = this.previous();

    // Check if ListExpression is allowed
    this.checkNodeAllowed("ListExpression", "ListExpressionNotAllowed", leftBracket.location);

    const elements: Expression[] = [];

    // Handle empty list
    if (!this.check("RIGHT_BRACKET")) {
      do {
        elements.push(this.expression());
      } while (this.match("COMMA"));
    }

    const rightBracket = this.consume("RIGHT_BRACKET", "MissingRightBracket");

    return new ListExpression(elements, Location.between(leftBracket, rightBracket));
  }

  private finishCallExpression(callee: Expression): CallExpression {
    // Extract function name for better error messages
    const functionName = callee instanceof IdentifierExpression ? (callee as any).name.lexeme : null;

    // Check if we immediately encounter NEWLINE or EOF after opening paren
    // This is a common mistake: move( followed by newline or EOF
    if (this.check("NEWLINE") || this.isAtEnd()) {
      this.error("MissingRightParenthesisAfterFunctionCall", callee.location, {
        function: functionName,
      });
    }

    const args: Expression[] = [];

    // Handle empty argument list
    if (!this.check("RIGHT_PAREN")) {
      do {
        args.push(this.expression());
      } while (this.match("COMMA"));
    }

    // Use specific error with function name context
    if (!this.check("RIGHT_PAREN")) {
      this.error("MissingRightParenthesisAfterFunctionCall", callee.location, {
        function: functionName,
      });
    }

    const rightParen = this.consume("RIGHT_PAREN", "MissingRightParenthesisAfterFunctionCall");

    return new CallExpression(callee, args, Location.between(callee, rightParen));
  }

  private synchronize(): void {
    this.advance();

    while (!this.isAtEnd()) {
      if (this.previous().type === "NEWLINE") {
        return;
      }

      switch (this.peek().type) {
        case "CLASS":
        case "DEF":
        case "IF":
        case "WHILE":
        case "FOR":
        case "RETURN":
        case "TRY":
          return;
      }

      this.advance();
    }
  }
}
