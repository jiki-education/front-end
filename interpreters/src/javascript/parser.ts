import { SyntaxError, type SyntaxErrorType } from "./error";
import type { Expression } from "./expression";
import {
  LiteralExpression,
  BinaryExpression,
  UnaryExpression,
  GroupingExpression,
  IdentifierExpression,
  AssignmentExpression,
  UpdateExpression,
  TemplateLiteralExpression,
  ArrayExpression,
  MemberExpression,
  DictionaryExpression,
  CallExpression,
} from "./expression";
import { Location, Span } from "../shared/location";
import { Scanner } from "./scanner";
import type { Statement } from "./statement";
import {
  ExpressionStatement,
  VariableDeclaration,
  BlockStatement,
  IfStatement,
  ForStatement,
  ForOfStatement,
  RepeatStatement,
  WhileStatement,
  FunctionDeclaration,
  FunctionParameter,
  ReturnStatement,
  BreakStatement,
  ContinueStatement,
} from "./statement";
import { type Token, type TokenType, KeywordTokens } from "./token";
import { translate } from "./translator";
import type { LanguageFeatures, NodeType } from "./interfaces";
import type { EvaluationContext } from "./interpreter";

export class Parser {
  private readonly scanner: Scanner;
  private current: number = 0;
  private tokens: Token[] = [];
  private readonly languageFeatures: LanguageFeatures;

  constructor(context: EvaluationContext = {}) {
    this.languageFeatures = context.languageFeatures || {};
    this.scanner = new Scanner(this.languageFeatures);
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
      this.error(errorType, location, { nodeType, friendlyName });
    }
  }

  private getNodeFriendlyName(nodeType: NodeType): string {
    const friendlyNames: Record<NodeType, string> = {
      LiteralExpression: "Literals",
      BinaryExpression: "Binary expressions",
      UnaryExpression: "Unary expressions",
      GroupingExpression: "Grouping expressions",
      IdentifierExpression: "Identifiers",
      AssignmentExpression: "Assignments",
      UpdateExpression: "Update expressions",
      TemplateLiteralExpression: "Template literals",
      ArrayExpression: "Arrays",
      MemberExpression: "Member access",
      DictionaryExpression: "Objects",
      CallExpression: "Function calls",
      ExpressionStatement: "Expression statements",
      VariableDeclaration: "Variable declarations",
      BlockStatement: "Block statements",
      IfStatement: "If statements",
      ForStatement: "For loops",
      ForOfStatement: "For...of loops",
      RepeatStatement: "Repeat loops",
      WhileStatement: "While loops",
      BreakStatement: "Break statements",
      ContinueStatement: "Continue statements",
    };
    return friendlyNames[nodeType] || nodeType;
  }

  public parse(sourceCode: string): Statement[] {
    this.tokens = this.scanner.scanTokens(sourceCode);

    const statements: Statement[] = [];

    while (!this.isAtEnd()) {
      const startPosition = this.current;
      const statement = this.statement(true); // true = top level
      if (statement) {
        statements.push(statement);
      } else if (this.current === startPosition && !this.isAtEnd()) {
        // statement() returned null without advancing - unexpected token
        // Use a specific error based on the token type
        if (this.peek().type === "RIGHT_BRACE") {
          this.error("UnexpectedRightBrace", this.peek().location);
        } else {
          this.error("GenericSyntaxError", this.peek().location, { token: this.peek().lexeme });
        }
      }
    }

    return statements;
  }

  private statement(isTopLevel: boolean = false): Statement | null {
    try {
      // Skip comments and EOL tokens (they don't produce statements)
      while (this.check("LINE_COMMENT", "BLOCK_COMMENT", "EOL")) {
        this.advance();
      }

      // If we've consumed all tokens, return null
      if (this.isAtEnd()) {
        return null;
      }

      // Handle function declarations (only at top level)
      if (this.match("FUNCTION")) {
        if (!isTopLevel) {
          this.error("NestedFunctionDeclaration", this.previous().location);
        }
        return this.functionDeclaration(this.previous());
      }

      // Handle return statements
      if (this.match("RETURN")) {
        return this.returnStatement(this.previous());
      }

      // Handle break statements
      if (this.match("BREAK")) {
        return this.breakStatement(this.previous());
      }

      // Handle continue statements
      if (this.match("CONTINUE")) {
        return this.continueStatement(this.previous());
      }

      // Handle variable declarations
      if (this.match("LET", "CONST")) {
        return this.variableDeclaration(this.previous()); // Pass the LET or CONST token
      }

      // Handle if statements
      if (this.match("IF")) {
        return this.ifStatement();
      }

      // Handle for loops
      if (this.match("FOR")) {
        return this.forStatement();
      }

      // Handle repeat loops
      if (this.match("REPEAT")) {
        return this.repeatStatement();
      }

      // Handle while loops
      if (this.match("WHILE")) {
        return this.whileStatement();
      }

      // Handle block statements
      if (this.match("LEFT_BRACE")) {
        return this.blockStatement();
      }

      // Handle empty statement (just a semicolon)
      if (this.match("SEMICOLON")) {
        // Empty statement - return null to skip it
        return null;
      }

      // Handle expression statements
      // Check if ExpressionStatement is allowed
      this.checkNodeAllowed("ExpressionStatement", "ExpressionStatementNotAllowed", this.peek().location);

      const expr = this.expression();
      const semicolonToken = this.consumeSemicolon();
      // Create location that spans from expression start to semicolon end
      const statementLocation = new Location(
        expr.location.line,
        expr.location.relative,
        new Span(expr.location.absolute.begin, semicolonToken.location.absolute.end)
      );
      return new ExpressionStatement(expr, statementLocation);
    } catch (error) {
      // Skip to next statement on error
      this.synchronize();
      throw error;
    }
  }

  private variableDeclaration(keywordToken: Token): Statement {
    // Check if VariableDeclaration is allowed
    this.checkNodeAllowed("VariableDeclaration", "VariableDeclarationNotAllowed", keywordToken.location);

    const kind = keywordToken.type === "CONST" ? "const" : "let";
    const name = this.consume("IDENTIFIER", "MissingVariableName");

    let initializer: Expression | null = null;
    let semicolonToken: Token;

    // Check if we have an initializer
    if (this.check("EQUAL")) {
      this.advance(); // consume the EQUAL token
      initializer = this.expression();
      semicolonToken = this.consumeSemicolon();
    } else {
      // No initializer
      // const ALWAYS requires an initializer
      if (kind === "const") {
        throw this.error("MissingInitializerInConstDeclaration", this.peek().location);
      }
      // let requires initializer only if requireVariableInstantiation is true
      const requireInstantiation = this.languageFeatures.requireVariableInstantiation ?? true;
      if (requireInstantiation) {
        throw this.error("MissingInitializerInVariableDeclaration", this.peek().location);
      }
      semicolonToken = this.consumeSemicolon();
    }

    return new VariableDeclaration(kind, name, initializer, Location.between(keywordToken, semicolonToken));
  }

  private blockStatement(): Statement {
    const leftBrace = this.previous();

    // Check if BlockStatement is allowed
    this.checkNodeAllowed("BlockStatement", "BlockStatementNotAllowed", leftBrace.location);

    const statements = this.block(true); // true = consume the RIGHT_BRACE
    const rightBrace = this.previous(); // block() consumed the RIGHT_BRACE
    return new BlockStatement(statements, Location.between(leftBrace, rightBrace));
  }

  private block(consumeRightBrace: boolean = false): Statement[] {
    const statements: Statement[] = [];

    while (!this.isAtEnd()) {
      // Skip EOL tokens before checking for RIGHT_BRACE
      while (this.check("EOL")) {
        this.advance();
      }

      // Check if we've reached the closing brace
      if (this.check("RIGHT_BRACE")) {
        break;
      }

      const statement = this.statement();
      if (statement) {
        statements.push(statement);
      }
    }

    // Only consume the RIGHT_BRACE if requested
    if (consumeRightBrace) {
      this.consume("RIGHT_BRACE", "MissingRightBraceAfterBlock");
    }

    return statements;
  }

  private ifStatement(): Statement {
    const ifToken = this.previous();

    // Check if IfStatement is allowed
    this.checkNodeAllowed("IfStatement", "IfStatementNotAllowed", ifToken.location);

    this.consume("LEFT_PAREN", "MissingLeftParenthesisAfterIf");
    const condition = this.expression();
    this.consume("RIGHT_PAREN", "MissingRightParenthesisAfterIfCondition");
    const thenBranch = this.statement();
    let elseBranch: Statement | null = null;

    if (this.match("ELSE")) {
      elseBranch = this.statement();
    }

    const endToken = elseBranch || thenBranch;
    return new IfStatement(condition, thenBranch!, elseBranch, Location.between(ifToken, endToken!));
  }

  private whileStatement(): Statement {
    const whileToken = this.previous();

    // Check if WhileStatement is allowed
    this.checkNodeAllowed("WhileStatement", "WhileStatementNotAllowed", whileToken.location);
    this.consume("LEFT_PAREN", "MissingLeftParenthesisAfterIf"); // Reuse error type for now

    // Parse condition
    const condition = this.expression();
    this.consume("RIGHT_PAREN", "MissingRightParenthesisAfterExpression");

    // Parse body
    const body = this.statement();
    return new WhileStatement(condition, body!, Location.between(whileToken, body!));
  }

  private repeatStatement(): Statement {
    const repeatToken = this.previous();

    // Check if RepeatStatement is allowed
    this.checkNodeAllowed("RepeatStatement", "RepeatStatementNotAllowed", repeatToken.location);

    this.consume("LEFT_PAREN", "MissingLeftParenAfterRepeat");

    // Empty parens = no-argument repeat (runs forever)
    let count: Expression | null = null;
    if (!this.check("RIGHT_PAREN")) {
      count = this.expression();
    }
    this.consume("RIGHT_PAREN", "MissingRightParenAfterRepeatCount");

    const body = this.statement();
    return new RepeatStatement(repeatToken, count, body!, Location.between(repeatToken, body!));
  }

  private forStatement(): Statement {
    const forToken = this.previous();

    this.consume("LEFT_PAREN", "MissingLeftParenthesisAfterIf"); // Reuse error type for now

    // Check if this is a for...of loop by looking for "let/const identifier of"
    if (this.check("LET") || this.check("CONST")) {
      const checkpoint = this.current;
      this.advance(); // consume 'let' or 'const'
      if (this.check("IDENTIFIER")) {
        const variable = this.advance(); // consume identifier
        if (this.check("OF")) {
          // This is a for...of loop
          this.checkNodeAllowed("ForOfStatement", "ForOfStatementNotAllowed", forToken.location);
          this.advance(); // consume 'of'

          const iterable = this.expression();
          this.consume("RIGHT_PAREN", "MissingRightParenthesisAfterExpression");

          const body = this.statement();

          return new ForOfStatement(variable, iterable, body!, Location.between(forToken, body!));
        }
      }
      // Not a for...of loop, reset and parse as regular for loop
      this.current = checkpoint;
    }

    // Parse as regular C-style for loop
    this.checkNodeAllowed("ForStatement", "ForStatementNotAllowed", forToken.location);

    // Save the oneStatementPerLine setting and temporarily disable it
    // inside for loop parentheses since semicolons there are part of the for syntax
    const savedOneStatementPerLine = this.languageFeatures.oneStatementPerLine;
    this.languageFeatures.oneStatementPerLine = false;

    try {
      // Parse init (can be variable declaration or expression)
      let init: Statement | Expression | null = null;
      if (this.match("SEMICOLON")) {
        init = null; // Empty init
      } else if (this.match("LET")) {
        init = this.variableDeclaration(this.previous());
      } else if (this.match("CONST")) {
        // const is not allowed in C-style for loops because the update expression
        // would try to modify a constant variable
        throw this.error("ConstInForLoopInit", this.previous().location);
      } else {
        init = this.expression();
        this.consume("SEMICOLON", "MissingSemicolon");
      }

      // Parse condition
      let condition: Expression | null = null;
      if (!this.check("SEMICOLON")) {
        condition = this.expression();
      }
      this.consume("SEMICOLON", "MissingSemicolon");

      // Parse update
      let update: Expression | null = null;
      if (!this.check("RIGHT_PAREN")) {
        update = this.expression();
      }

      this.consume("RIGHT_PAREN", "MissingRightParenthesisAfterExpression");

      // Restore the oneStatementPerLine setting
      this.languageFeatures.oneStatementPerLine = savedOneStatementPerLine;

      // Parse body
      const body = this.statement();

      return new ForStatement(init, condition, update, body!, Location.between(forToken, body!));
    } finally {
      // Make sure we restore the setting even if there's an error
      this.languageFeatures.oneStatementPerLine = savedOneStatementPerLine;
    }
  }

  private functionDeclaration(functionToken: Token): Statement {
    // Parse function name
    const name = this.consume("IDENTIFIER", "MissingFunctionName");

    // Parse parameters
    this.consume("LEFT_PAREN", "MissingLeftParenthesisAfterFunctionName");
    const parameters: FunctionParameter[] = [];
    const parameterNames = new Set<string>();

    if (!this.check("RIGHT_PAREN")) {
      do {
        const paramName = this.consume("IDENTIFIER", "MissingParameterName");

        // Check for duplicate parameters
        if (parameterNames.has(paramName.lexeme)) {
          this.error("DuplicateParameterName", paramName.location, { name: paramName.lexeme });
        }
        parameterNames.add(paramName.lexeme);

        parameters.push(new FunctionParameter(paramName));
      } while (this.match("COMMA"));
    }

    this.consume("RIGHT_PAREN", "MissingRightParenthesisAfterParameters");

    // Parse body
    this.consume("LEFT_BRACE", "MissingLeftBraceBeforeFunctionBody");
    const body = this.block(true); // true = consume the RIGHT_BRACE
    const rightBrace = this.previous();

    return new FunctionDeclaration(name, parameters, body, Location.between(functionToken, rightBrace));
  }

  private returnStatement(returnToken: Token): Statement {
    // Check if there's an expression to return
    let expression: Expression | null = null;

    // If not at semicolon or EOL, parse the return expression
    if (!this.check("SEMICOLON") && !this.check("EOL") && !this.isAtEnd()) {
      expression = this.expression();
    }

    const semicolonToken = this.consumeSemicolon();
    return new ReturnStatement(returnToken, expression, Location.between(returnToken, semicolonToken));
  }

  private breakStatement(breakToken: Token): Statement {
    // Check if BreakStatement is allowed
    this.checkNodeAllowed("BreakStatement", "BreakStatementNotAllowed", breakToken.location);

    const semicolonToken = this.consumeSemicolon();
    return new BreakStatement(breakToken, Location.between(breakToken, semicolonToken));
  }

  private continueStatement(continueToken: Token): Statement {
    // Check if ContinueStatement is allowed
    this.checkNodeAllowed("ContinueStatement", "ContinueStatementNotAllowed", continueToken.location);

    const semicolonToken = this.consumeSemicolon();
    return new ContinueStatement(continueToken, Location.between(continueToken, semicolonToken));
  }

  private expression(): Expression {
    return this.assignment();
  }

  private assignment(): Expression {
    const expr = this.logicalOr();

    if (this.match("EQUAL")) {
      // Check if AssignmentExpression is allowed
      this.checkNodeAllowed("AssignmentExpression", "AssignmentExpressionNotAllowed", expr.location);

      const value = this.assignment();

      if (expr instanceof IdentifierExpression) {
        return new AssignmentExpression(expr.name, value, Location.between(expr, value));
      }

      if (expr instanceof MemberExpression) {
        return new AssignmentExpression(expr, value, Location.between(expr, value));
      }

      this.error("InvalidAssignmentTargetExpression", expr.location);
    }

    return expr;
  }

  private logicalOr(): Expression {
    let expr = this.logicalAnd();

    while (this.match("LOGICAL_OR")) {
      // Check if BinaryExpression is allowed (logical operators use BinaryExpression)
      this.checkNodeAllowed("BinaryExpression", "BinaryExpressionNotAllowed", this.previous().location);

      const operator = this.previous();
      const right = this.logicalAnd();
      expr = new BinaryExpression(expr, operator, right, Location.between(expr, right));
    }

    return expr;
  }

  private logicalAnd(): Expression {
    let expr = this.equality();

    while (this.match("LOGICAL_AND")) {
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

    while (this.match("EQUAL_EQUAL", "NOT_EQUAL", "STRICT_EQUAL", "NOT_STRICT_EQUAL")) {
      // Check if BinaryExpression is allowed
      this.checkNodeAllowed("BinaryExpression", "BinaryExpressionNotAllowed", this.previous().location);

      const operator = this.previous();
      const right = this.comparison();
      expr = new BinaryExpression(expr, operator, right, Location.between(expr, right));
    }

    return expr;
  }

  private comparison(): Expression {
    let expr = this.addition();

    while (this.match("GREATER", "GREATER_EQUAL", "LESS", "LESS_EQUAL")) {
      // Check if BinaryExpression is allowed
      this.checkNodeAllowed("BinaryExpression", "BinaryExpressionNotAllowed", this.previous().location);

      const operator = this.previous();
      const right = this.addition();
      expr = new BinaryExpression(expr, operator, right, Location.between(expr, right));
    }

    return expr;
  }

  private addition(): Expression {
    let expr = this.multiplication();

    while (this.match("PLUS", "MINUS")) {
      // Check if BinaryExpression is allowed
      this.checkNodeAllowed("BinaryExpression", "BinaryExpressionNotAllowed", this.previous().location);

      const operator = this.previous();
      const right = this.multiplication();
      expr = new BinaryExpression(expr, operator, right, Location.between(expr, right));
    }

    return expr;
  }

  private multiplication(): Expression {
    let expr = this.exponentiation();

    while (this.match("STAR", "SLASH")) {
      // Check if BinaryExpression is allowed
      this.checkNodeAllowed("BinaryExpression", "BinaryExpressionNotAllowed", this.previous().location);

      const operator = this.previous();
      const right = this.exponentiation();
      expr = new BinaryExpression(expr, operator, right, Location.between(expr, right));
    }

    return expr;
  }

  private exponentiation(): Expression {
    let expr = this.unary();

    // Exponentiation is right-associative, so we use recursion instead of a loop
    if (this.match("STAR_STAR")) {
      // Check if BinaryExpression is allowed
      this.checkNodeAllowed("BinaryExpression", "BinaryExpressionNotAllowed", this.previous().location);

      const operator = this.previous();
      const right = this.exponentiation(); // Right-associative recursion
      expr = new BinaryExpression(expr, operator, right, Location.between(expr, right));
    }

    return expr;
  }

  private unary(): Expression {
    // Handle prefix increment/decrement
    if (this.match("INCREMENT", "DECREMENT")) {
      // Check if UpdateExpression is allowed
      this.checkNodeAllowed("UpdateExpression", "UpdateExpressionNotAllowed", this.previous().location);

      const operator = this.previous();
      const operand = this.unary();
      if (!(operand instanceof IdentifierExpression)) {
        this.error("InvalidAssignmentTargetExpression", operator.location);
      }
      return new UpdateExpression(operator, operand, true, Location.between(operator, operand));
    }

    if (this.match("MINUS", "PLUS", "NOT")) {
      // Check if UnaryExpression is allowed
      this.checkNodeAllowed("UnaryExpression", "UnaryExpressionNotAllowed", this.previous().location);

      const operator = this.previous();
      const right = this.unary();
      return new UnaryExpression(operator, right, Location.between(operator, right));
    }

    return this.postfix();
  }

  private postfix(): Expression {
    let expr = this.primary();

    // Handle chained member access (array indexing and property access) and function calls
    // This allows expressions like arr[0][1] or obj.prop.nested or obj["key"] or func() or obj.method()
    while (true) {
      if (this.match("LEFT_PAREN")) {
        // Check if CallExpression is allowed
        this.checkNodeAllowed("CallExpression", "CallExpressionNotAllowed", this.previous().location);

        // Function call: func(arg1, arg2)
        expr = this.finishCallExpression(expr);
      } else if (this.match("LEFT_BRACKET")) {
        // Check if MemberExpression is allowed
        this.checkNodeAllowed("MemberExpression", "MemberExpressionNotAllowed", this.previous().location);

        // Bracket notation: obj["prop"] or arr[0]
        const property = this.assignment();
        this.consume("RIGHT_BRACKET", "MissingRightBracketInMemberAccess");
        const rightBracket = this.previous();
        expr = new MemberExpression(expr, property, true, Location.between(expr, rightBracket));
      } else if (this.match("DOT")) {
        // Check if MemberExpression is allowed
        this.checkNodeAllowed("MemberExpression", "MemberExpressionNotAllowed", this.previous().location);

        // Dot notation: obj.prop
        // Keywords are allowed as property names after a dot (e.g. "abc".repeat(3))
        const propertyToken = this.advance();
        if (propertyToken.type !== "IDENTIFIER" && !KeywordTokens.includes(propertyToken.type as any)) {
          this.error("InvalidDictionaryKey", propertyToken.location);
        }
        const property = new LiteralExpression(propertyToken.lexeme, propertyToken.location);
        expr = new MemberExpression(expr, property, false, Location.between(expr, propertyToken));
      } else {
        break;
      }
    }

    // Handle postfix increment/decrement
    while (this.match("INCREMENT", "DECREMENT")) {
      // Check if UpdateExpression is allowed
      this.checkNodeAllowed("UpdateExpression", "UpdateExpressionNotAllowed", this.previous().location);

      const operator = this.previous();
      if (!(expr instanceof IdentifierExpression)) {
        this.error("InvalidAssignmentTargetExpression", operator.location);
      }
      expr = new UpdateExpression(operator, expr, false, Location.between(expr, operator));
    }

    return expr;
  }

  private finishCallExpression(callee: Expression): CallExpression {
    // Extract function name for better error messages
    const functionName = callee instanceof IdentifierExpression ? (callee as any).name.lexeme : null;

    // Check if we immediately encounter EOL or semicolon after opening paren
    // This is a common mistake: move( followed by newline or move(;
    if (this.check("EOL", "SEMICOLON")) {
      this.error("MissingRightParenthesisAfterFunctionCall", callee.location, {
        function: functionName,
      });
    }

    const args: Expression[] = [];

    if (!this.check("RIGHT_PAREN")) {
      do {
        args.push(this.assignment());
      } while (this.match("COMMA"));
    }

    // Use specific error with function name context
    if (!this.check("RIGHT_PAREN")) {
      this.error("MissingRightParenthesisAfterFunctionCall", callee.location, {
        function: functionName,
      });
    }

    this.consume("RIGHT_PAREN", "MissingRightParenthesisAfterFunctionCall");
    const rightParen = this.previous();

    return new CallExpression(callee, args, Location.between(callee, rightParen));
  }

  private primary(): Expression {
    if (this.match("TRUE")) {
      // Check if LiteralExpression is allowed
      this.checkNodeAllowed("LiteralExpression", "LiteralExpressionNotAllowed", this.previous().location);
      return new LiteralExpression(true, this.previous().location);
    }

    if (this.match("FALSE")) {
      // Check if LiteralExpression is allowed
      this.checkNodeAllowed("LiteralExpression", "LiteralExpressionNotAllowed", this.previous().location);
      return new LiteralExpression(false, this.previous().location);
    }

    if (this.match("NULL")) {
      // Check if LiteralExpression is allowed
      this.checkNodeAllowed("LiteralExpression", "LiteralExpressionNotAllowed", this.previous().location);
      return new LiteralExpression(null, this.previous().location);
    }

    if (this.match("UNDEFINED")) {
      // Check if LiteralExpression is allowed
      this.checkNodeAllowed("LiteralExpression", "LiteralExpressionNotAllowed", this.previous().location);
      return new LiteralExpression(undefined, this.previous().location);
    }

    if (this.match("NUMBER")) {
      // Check if LiteralExpression is allowed
      this.checkNodeAllowed("LiteralExpression", "LiteralExpressionNotAllowed", this.previous().location);
      return new LiteralExpression(this.previous().literal as number, this.previous().location);
    }

    if (this.match("STRING")) {
      // Check if LiteralExpression is allowed
      this.checkNodeAllowed("LiteralExpression", "LiteralExpressionNotAllowed", this.previous().location);
      return new LiteralExpression(this.previous().literal as string, this.previous().location);
    }

    if (this.match("IDENTIFIER")) {
      // Check if IdentifierExpression is allowed
      this.checkNodeAllowed("IdentifierExpression", "IdentifierExpressionNotAllowed", this.previous().location);
      return new IdentifierExpression(this.previous(), this.previous().location);
    }

    if (this.match("BACKTICK")) {
      return this.parseTemplateLiteral();
    }

    if (this.match("LEFT_PAREN")) {
      const lparen = this.previous();
      // Check if GroupingExpression is allowed
      this.checkNodeAllowed("GroupingExpression", "GroupingExpressionNotAllowed", lparen.location);
      const expr = this.expression();
      this.consume("RIGHT_PAREN", "MissingRightParenthesisAfterExpression");
      const rparen = this.previous();
      return new GroupingExpression(expr, Location.between(lparen, rparen));
    }

    if (this.match("LEFT_BRACKET")) {
      return this.parseArray();
    }

    if (this.match("LEFT_BRACE")) {
      return this.parseDictionary();
    }

    this.error("MissingExpression", this.peek().location);
  }

  private match(...tokenTypes: TokenType[]): boolean {
    for (const tokenType of tokenTypes) {
      if (this.check(tokenType)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private check(...tokenTypes: TokenType[]): boolean {
    if (this.isAtEnd()) {
      return false;
    }
    return tokenTypes.includes(this.peek().type);
  }

  private advance(): Token {
    if (!this.isAtEnd()) {
      this.current++;
    }
    return this.previous();
  }

  private consume(tokenType: TokenType, errorType: SyntaxErrorType): Token {
    if (this.check(tokenType)) {
      return this.advance();
    }
    this.error(errorType, this.peek().location);
  }

  private consumeSemicolon(): Token {
    if (this.match("SEMICOLON")) {
      const semicolon = this.previous();

      // Check oneStatementPerLine: semicolon must be followed by EOL, EOF, RIGHT_BRACE, or RIGHT_PAREN (for loops)
      if (this.languageFeatures.oneStatementPerLine && !this.isAtEnd()) {
        // Skip any comments after the semicolon
        let nextIndex = this.current;
        while (
          nextIndex < this.tokens.length &&
          (this.tokens[nextIndex].type === "LINE_COMMENT" || this.tokens[nextIndex].type === "BLOCK_COMMENT")
        ) {
          nextIndex++;
        }

        // Check the next non-comment token
        if (nextIndex < this.tokens.length) {
          const nextToken = this.tokens[nextIndex];
          // Semicolon must be followed by newline, EOF, closing brace, or closing paren (for loops)
          if (
            nextToken.type !== "EOL" &&
            nextToken.type !== "EOF" &&
            nextToken.type !== "RIGHT_BRACE" &&
            nextToken.type !== "RIGHT_PAREN" &&
            nextToken.location.line === semicolon.location.line
          ) {
            throw this.error("MultipleStatementsPerLine", nextToken.location);
          }
        }
      }

      return semicolon;
    }

    // Check if semicolons are optional (default is optional)
    const requireSemicolons = this.languageFeatures.requireSemicolons ?? false;

    // If semicolons are required, throw error unless we're at end of file
    if (requireSemicolons) {
      if (!this.isAtEnd()) {
        this.error("MissingSemicolon", this.peek().location);
      }
      // Return the current token as fallback (for end of file cases)
      return this.previous();
    }

    // Semicolons are optional - allow statement boundaries without semicolon
    if (this.isAtEnd()) {
      return this.previous();
    }

    // Check if we're at a valid statement boundary
    const nextToken = this.peek();
    if (
      nextToken.type === "EOL" ||
      nextToken.type === "EOF" ||
      nextToken.type === "RIGHT_BRACE" ||
      nextToken.type === "RIGHT_PAREN"
    ) {
      return this.previous();
    }

    // Not at a statement boundary, still require semicolon
    this.error("MissingSemicolon", this.peek().location);
  }

  private synchronize(): void {
    this.advance();

    while (!this.isAtEnd()) {
      if (this.previous().type === "SEMICOLON") {
        return;
      }

      switch (this.peek().type) {
        case "NUMBER":
        case "STRING":
          return;
      }

      this.advance();
    }
  }

  private parseTemplateLiteral(): Expression {
    const startToken = this.previous(); // The opening backtick

    // Check if TemplateLiteralExpression is allowed
    this.checkNodeAllowed("TemplateLiteralExpression", "TemplateLiteralExpressionNotAllowed", startToken.location);

    const parts: (string | Expression)[] = [];

    while (!this.check("BACKTICK") && !this.isAtEnd()) {
      if (this.match("TEMPLATE_LITERAL_TEXT")) {
        parts.push(this.previous().literal as string);
      } else if (this.match("LEFT_BRACE")) {
        // Parse the interpolated expression
        const expr = this.expression();
        this.consume("RIGHT_BRACE", "MissingRightBraceInTemplateLiteral");
        parts.push(expr);
      } else {
        // Unexpected token in template literal
        this.error("UnexpectedTokenInTemplateLiteral", this.peek().location);
      }
    }

    this.consume("BACKTICK", "MissingBacktickToTerminateTemplateLiteral");
    const endToken = this.previous();

    return new TemplateLiteralExpression(parts, Location.between(startToken, endToken));
  }

  private parseArray(): Expression {
    const leftBracket = this.previous();

    // Check if ArrayExpression is allowed
    this.checkNodeAllowed("ArrayExpression", "ArrayExpressionNotAllowed", leftBracket.location);

    const elements: Expression[] = [];

    // Skip EOL tokens after opening bracket
    while (this.check("EOL")) {
      this.advance();
    }

    // Handle empty array
    if (this.check("RIGHT_BRACKET")) {
      this.advance();
      return new ArrayExpression(elements, Location.between(leftBracket, this.previous()));
    }

    // Check for leading comma (e.g., [,])
    if (this.check("COMMA")) {
      this.error("TrailingCommaInArray", this.peek().location);
    }

    // Parse array elements
    do {
      // Skip EOL tokens before element
      while (this.check("EOL")) {
        this.advance();
      }

      // Check for trailing comma before closing bracket
      if (this.check("RIGHT_BRACKET")) {
        this.error("TrailingCommaInArray", this.previous().location);
      }

      elements.push(this.assignment());
    } while (this.match("COMMA"));

    // Skip EOL tokens before closing bracket
    while (this.check("EOL")) {
      this.advance();
    }

    this.consume("RIGHT_BRACKET", "MissingRightBracketInArray");
    const rightBracket = this.previous();

    return new ArrayExpression(elements, Location.between(leftBracket, rightBracket));
  }

  private parseDictionary(): Expression {
    const leftBrace = this.previous();

    // Check if DictionaryExpression is allowed
    this.checkNodeAllowed("DictionaryExpression", "DictionaryExpressionNotAllowed", leftBrace.location);

    const elements = new Map<string, Expression>();

    // Skip EOL tokens after opening brace
    while (this.check("EOL")) {
      this.advance();
    }

    // Handle empty object
    if (this.check("RIGHT_BRACE")) {
      this.advance();
      return new DictionaryExpression(elements, Location.between(leftBrace, this.previous()));
    }

    // Check for leading comma
    if (this.check("COMMA")) {
      this.error("TrailingCommaInDictionary", this.peek().location);
    }

    // Parse object properties
    do {
      // Skip EOL tokens before property
      while (this.check("EOL")) {
        this.advance();
      }

      // Check for trailing comma before closing brace
      if (this.check("RIGHT_BRACE")) {
        this.error("TrailingCommaInDictionary", this.previous().location);
      }

      // Parse key - can be identifier, string, or number (in JavaScript)
      let key: string;
      if (this.match("IDENTIFIER")) {
        key = this.previous().lexeme;
      } else if (this.match("STRING")) {
        key = this.previous().literal as string;
      } else if (this.match("NUMBER")) {
        key = String(this.previous().literal);
      } else {
        this.error("InvalidDictionaryKey", this.peek().location);
        key = ""; // This won't be reached but TypeScript needs it
      }

      this.consume("COLON", "MissingColonInDictionary");
      const value = this.assignment();

      if (elements.has(key)) {
        this.error("DuplicateDictionaryKey", this.previous().location, { key });
      }

      elements.set(key, value);
    } while (this.match("COMMA"));

    // Skip EOL tokens before closing brace
    while (this.check("EOL")) {
      this.advance();
    }

    this.consume("RIGHT_BRACE", "MissingRightBraceInDictionary");
    const rightBrace = this.previous();

    return new DictionaryExpression(elements, Location.between(leftBrace, rightBrace));
  }

  private error(type: SyntaxErrorType, location: Location, context?: any): never {
    throw new SyntaxError(translate(`error.syntax.${type}`, context), location, type, context);
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
}

export function parse(sourceCode: string, context: EvaluationContext = {}): Statement[] {
  return new Parser(context).parse(sourceCode);
}
