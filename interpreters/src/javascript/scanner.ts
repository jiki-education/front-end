/*
 * JavaScript scanner adapted from JikiScript scanner.
 * This scanner produces tokens for JavaScript syntax.
 */

import { SyntaxError, type SyntaxErrorType } from "./error";
import { DisabledLanguageFeatureError, type DisabledLanguageFeatureErrorType } from "../shared/interfaces";
import type { Token, TokenType } from "./token";
import { Location } from "../shared/location";
import type { LanguageFeatures } from "./interfaces";
import { translate } from "./translator";

export class Scanner {
  private tokens: Token[] = [];
  private start: number = 0;
  private current: number = 0;
  private line: number = 1;
  private lineOffset: number = 0;
  private sourceCode: string = "";

  private static readonly keywords: Record<string, TokenType> = {
    break: "BREAK",
    case: "CASE",
    catch: "CATCH",
    class: "CLASS",
    const: "CONST",
    continue: "CONTINUE",
    debugger: "DEBUGGER",
    default: "DEFAULT",
    delete: "DELETE",
    do: "DO",
    else: "ELSE",
    export: "EXPORT",
    extends: "EXTENDS",
    false: "FALSE",
    finally: "FINALLY",
    for: "FOR",
    function: "FUNCTION",
    if: "IF",
    import: "IMPORT",
    in: "IN",
    instanceof: "INSTANCEOF",
    let: "LET",
    new: "NEW",
    null: "NULL",
    of: "OF",
    return: "RETURN",
    super: "SUPER",
    switch: "SWITCH",
    this: "THIS",
    throw: "THROW",
    true: "TRUE",
    try: "TRY",
    typeof: "TYPEOF",
    undefined: "UNDEFINED",
    var: "VAR",
    void: "VOID",
    while: "WHILE",
    with: "WITH",
    yield: "YIELD",
  };

  private readonly tokenizers: Record<string, Function> = {
    "(": this.tokenizeLeftParanthesis,
    ")": this.tokenizeRightParanthesis,
    "{": this.tokenizeLeftBrace,
    "}": this.tokenizeRightBrace,
    "[": this.tokenizeLeftBracket,
    "]": this.tokenizeRightBracket,
    ":": this.tokenizeColon,
    ",": this.tokenizeComma,
    ".": this.tokenizeDot,
    "+": this.tokenizePlus,
    "-": this.tokenizeMinus,
    "*": this.tokenizeStar,
    "/": this.tokenizeSlash,
    "%": this.tokenizePercent,
    ">": this.tokenizeGreater,
    "<": this.tokenizeLess,
    "!": this.tokenizeBang,
    "=": this.tokenizeEqual,
    "&": this.tokenizeAmpersand,
    "|": this.tokenizePipe,
    "^": this.tokenizeCaret,
    "~": this.tokenizeTilde,
    "?": this.tokenizeQuestion,
    ";": this.tokenizeSemicolon,
    " ": this.tokenizeWhitespace,
    "\t": this.tokenizeWhitespace,
    "\r": this.tokenizeWhitespace,
    "\n": this.tokenizeNewline,
    '"': this.tokenizeString,
    "'": this.tokenizeSingleQuoteString,
    "`": this.tokenizeTemplateLiteral,
  };

  constructor(
    private readonly languageFeatures: LanguageFeatures = {
      includeList: undefined,
      excludeList: undefined,
    }
  ) {}

  scanTokens(sourceCode: string): Token[] {
    this.sourceCode = sourceCode;
    this.reset();

    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }

    // Add synthetic EOL token to simplify parsing if needed
    if (this.shouldAddEOLToken()) {
      this.addSyntheticToken("EOL", "\n");
    }

    // Add synthetic EOF token to simplify parsing
    this.addSyntheticToken("EOF", "\0");

    return this.tokens;
  }

  private scanToken(): void {
    const c = this.advance();

    const tokenizer = this.tokenizers[c];
    // TypeScript doesn't realize that Record lookups can return undefined for missing keys
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (tokenizer) {
      tokenizer.bind(this)();
    } else {
      if (this.isDigit(c)) {
        this.tokenizeNumber();
      } else if (this.isAlpha(c)) {
        this.tokenizeIdentifier();
      } else {
        this.error("UnknownCharacter", {
          character: c,
        });
      }
    }
  }

  // Simple tokenizers
  private tokenizeLeftParanthesis() {
    this.addToken("LEFT_PAREN");
  }
  private tokenizeRightParanthesis() {
    this.addToken("RIGHT_PAREN");
  }
  private tokenizeLeftBrace() {
    this.addToken("LEFT_BRACE");
  }
  private tokenizeRightBrace() {
    this.addToken("RIGHT_BRACE");
  }
  private tokenizeLeftBracket() {
    this.addToken("LEFT_BRACKET");
  }
  private tokenizeRightBracket() {
    this.addToken("RIGHT_BRACKET");
  }
  private tokenizeColon() {
    this.addToken("COLON");
  }
  private tokenizeComma() {
    this.addToken("COMMA");
  }
  private tokenizeDot() {
    this.addToken("DOT");
  }
  private tokenizeSemicolon() {
    this.addToken("SEMICOLON");
  }
  private tokenizeQuestion() {
    this.addToken("QUESTION");
  }
  private tokenizeTilde() {
    this.addToken("TILDE");
  }
  private tokenizeCaret() {
    if (this.match("=")) {
      this.addToken("XOR_EQUAL");
    } else {
      this.addToken("CARET");
    }
  }

  private tokenizePlus() {
    if (this.match("+")) {
      this.addToken("INCREMENT");
    } else if (this.match("=")) {
      this.addToken("PLUS_EQUAL");
    } else {
      this.addToken("PLUS");
    }
  }

  private tokenizeMinus() {
    if (this.match("-")) {
      this.addToken("DECREMENT");
    } else if (this.match("=")) {
      this.addToken("MINUS_EQUAL");
    } else {
      this.addToken("MINUS");
    }
  }

  private tokenizeStar() {
    if (this.match("=")) {
      this.addToken("MULTIPLY_EQUAL");
    } else {
      this.addToken("STAR");
    }
  }

  private tokenizeSlash() {
    if (this.match("/")) {
      this.tokenizeSingleLineComment();
    } else if (this.match("*")) {
      this.tokenizeMultiLineComment();
    } else if (this.match("=")) {
      this.addToken("DIVIDE_EQUAL");
    } else {
      this.addToken("SLASH");
    }
  }

  private tokenizePercent() {
    if (this.match("=")) {
      this.addToken("MODULO_EQUAL");
    } else {
      this.addToken("PERCENT");
    }
  }

  private tokenizeBang() {
    if (this.match("=")) {
      if (this.match("=")) {
        this.addToken("NOT_STRICT_EQUAL");
      } else {
        this.addToken("NOT_EQUAL");
      }
    } else {
      this.addToken("NOT");
    }
  }

  private tokenizeEqual() {
    if (this.match("=")) {
      if (this.match("=")) {
        this.addToken("STRICT_EQUAL");
      } else {
        this.addToken("EQUAL_EQUAL");
      }
    } else if (this.match(">")) {
      this.addToken("ARROW");
    } else {
      this.addToken("EQUAL");
    }
  }

  private tokenizeGreater() {
    if (this.match("=")) {
      this.addToken("GREATER_EQUAL");
    } else if (this.match(">")) {
      this.addToken("RIGHT_SHIFT");
    } else {
      this.addToken("GREATER");
    }
  }

  private tokenizeLess() {
    if (this.match("=")) {
      this.addToken("LESS_EQUAL");
    } else if (this.match("<")) {
      this.addToken("LEFT_SHIFT");
    } else {
      this.addToken("LESS");
    }
  }

  private tokenizeAmpersand() {
    if (this.match("&")) {
      this.addToken("LOGICAL_AND");
    } else if (this.match("=")) {
      this.addToken("AND_EQUAL");
    } else {
      this.addToken("AMPERSAND");
    }
  }

  private tokenizePipe() {
    if (this.match("|")) {
      this.addToken("LOGICAL_OR");
    } else if (this.match("=")) {
      this.addToken("OR_EQUAL");
    } else {
      this.addToken("PIPE");
    }
  }

  private tokenizeWhitespace() {
    return;
  }

  private tokenizeNewline() {
    if (this.shouldAddEOLToken()) {
      this.addToken("EOL");
    }
    this.line++;
    this.lineOffset = this.current;
  }

  private tokenizeSingleLineComment(): void {
    // Consume until the end of the line
    while (this.peek() !== "\n" && !this.isAtEnd()) {
      this.advance();
    }
  }

  private tokenizeMultiLineComment(): void {
    while (!this.isAtEnd()) {
      if (this.peek() === "*" && this.peekNext() === "/") {
        this.advance(); // consume *
        this.advance(); // consume /
        return;
      }
      if (this.peek() === "\n") {
        this.line++;
        this.lineOffset = this.current + 1;
      }
      this.advance();
    }
    this.error("UnknownCharacter", { character: "/*" });
  }

  private tokenizeString(): void {
    // Keep consuming characters until we see another double quote
    while (this.peek() !== '"' && !this.isAtEnd()) {
      if (this.peek() === "\n") {
        this.line++;
        this.lineOffset = this.current + 1;
      }
      if (this.peek() === "\\") {
        this.advance(); // consume backslash
        this.advance(); // consume escaped character
      } else {
        this.advance();
      }
    }

    if (this.isAtEnd()) {
      this.error("MissingDoubleQuoteToTerminateString", {
        string: this.sourceCode.substring(this.start + 1, this.current),
      });
    }

    // Consume the closing quotation mark
    this.advance();

    // Process escape sequences in the string value
    const rawValue = this.sourceCode.substring(this.start + 1, this.current - 1);
    const processedValue = this.processEscapeSequences(rawValue);
    this.addToken("STRING", processedValue);
  }

  private tokenizeSingleQuoteString(): void {
    // Keep consuming characters until we see another single quote
    while (this.peek() !== "'" && !this.isAtEnd()) {
      if (this.peek() === "\n") {
        this.line++;
        this.lineOffset = this.current + 1;
      }
      if (this.peek() === "\\") {
        this.advance(); // consume backslash
        this.advance(); // consume escaped character
      } else {
        this.advance();
      }
    }

    if (this.isAtEnd()) {
      this.error("MissingDoubleQuoteToTerminateString", {
        string: this.sourceCode.substring(this.start + 1, this.current),
      });
    }

    // Consume the closing quotation mark
    this.advance();

    // Process escape sequences in the string value
    const rawValue = this.sourceCode.substring(this.start + 1, this.current - 1);
    const processedValue = this.processEscapeSequences(rawValue);
    this.addToken("STRING", processedValue);
  }

  private processEscapeSequences(str: string): string {
    return str
      .replace(/\\n/g, "\n")
      .replace(/\\t/g, "\t")
      .replace(/\\r/g, "\r")
      .replace(/\\'/g, "'")
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, "\\");
  }

  private tokenizeTemplateLiteral(): void {
    this.addToken("BACKTICK");

    while (this.peek() !== "`" && !this.isAtEnd()) {
      this.start = this.current;

      if (this.peek() === "$" && this.peekNext() === "{") {
        if (this.current > this.start) {
          this.addToken("TEMPLATE_LITERAL_TEXT", this.sourceCode.substring(this.start, this.current));
        }

        this.advance(); // Consume the $
        this.advance(); // Consume the {
        this.addToken("DOLLAR_LEFT_BRACE");
        this.start = this.current;

        let braceCount = 1;
        while (braceCount > 0 && !this.isAtEnd()) {
          this.start = this.current;
          this.scanToken();
          if (this.tokens[this.tokens.length - 1].type === "LEFT_BRACE") {
            braceCount++;
          } else if (this.tokens[this.tokens.length - 1].type === "RIGHT_BRACE") {
            braceCount--;
          }
        }
      } else {
        // Collect template literal text
        while (this.peek() !== "$" && this.peek() !== "`" && !this.isAtEnd()) {
          if (this.peek() === "\n") {
            this.line++;
            this.lineOffset = this.current + 1;
          }
          this.advance();
        }

        // If we stopped at a $ that's not followed by {, include it in the text
        if (this.peek() === "$" && this.peekNext() !== "{") {
          this.advance(); // Include the $ in the template text
        }

        if (this.current > this.start) {
          this.addToken("TEMPLATE_LITERAL_TEXT", this.sourceCode.substring(this.start, this.current));
        }
      }
    }

    if (this.isAtEnd()) {
      this.error("MissingBacktickToTerminateTemplateLiteral");
    }

    this.start = this.current;
    this.advance();
    this.addToken("BACKTICK"); // Consume the closing `
  }

  private tokenizeNumber(): void {
    // Handle different number formats
    if (this.sourceCode[this.start] === "0" && this.current < this.sourceCode.length) {
      const nextChar = this.peek();
      if (nextChar === "x" || nextChar === "X") {
        this.tokenizeHexNumber();
        return;
      } else if (nextChar === "b" || nextChar === "B") {
        this.tokenizeBinaryNumber();
        return;
      } else if (nextChar === "o" || nextChar === "O") {
        this.tokenizeOctalNumber();
        return;
      }
    }

    // Regular decimal number
    while (this.isDigit(this.peek())) {
      this.advance();
    }

    // Look for a fractional part
    if (this.peek() === "." && this.isDigit(this.peekNext())) {
      this.advance(); // consume the .
      while (this.isDigit(this.peek())) {
        this.advance();
      }
    }

    // Look for scientific notation
    if (this.peek() === "e" || this.peek() === "E") {
      this.advance(); // consume e/E
      if (this.peek() === "+" || this.peek() === "-") {
        this.advance(); // consume +/-
      }
      while (this.isDigit(this.peek())) {
        this.advance();
      }
    }

    const number = this.sourceCode.substring(this.start, this.current);
    this.addToken("NUMBER", Number.parseFloat(number));
  }

  private tokenizeHexNumber(): void {
    this.advance(); // consume x/X
    while (this.isHexDigit(this.peek())) {
      this.advance();
    }

    const number = this.sourceCode.substring(this.start + 2, this.current); // Skip '0x'
    this.addToken("NUMBER", parseInt(number, 16));
  }

  private tokenizeBinaryNumber(): void {
    this.advance(); // consume b/B
    while (this.peek() === "0" || this.peek() === "1") {
      this.advance();
    }

    const number = this.sourceCode.substring(this.start + 2, this.current); // Skip '0b'
    this.addToken("NUMBER", parseInt(number, 2));
  }

  private tokenizeOctalNumber(): void {
    this.advance(); // consume o/O
    while (this.isOctalDigit(this.peek())) {
      this.advance();
    }

    const number = this.sourceCode.substring(this.start + 2, this.current); // Skip '0o'
    this.addToken("NUMBER", parseInt(number, 8));
  }

  private tokenizeIdentifier(): void {
    while (this.isAllowableInIdentifier(this.peek())) {
      this.advance();
    }

    const keywordType = this.tokenForLexeme(this.lexeme());
    if (keywordType) {
      this.addToken(keywordType);
      return;
    }

    this.addToken("IDENTIFIER");
  }

  private tokenForLexeme(lexeme: string): string | null {
    return Scanner.keywords[lexeme] || null;
  }

  private addSyntheticToken(type: TokenType, lexeme: string): void {
    this.tokens.push({
      type,
      lexeme: lexeme,
      literal: null,
      location: this.location(),
    });
  }

  private addToken(type: TokenType, literal: any = null): void {
    this.verifyEnabled(type, this.lexeme());

    // Check for unimplemented tokens
    const unimplementedTokens: TokenType[] = [
      // Statement keywords
      "CASE",
      "CATCH",
      "CLASS",
      "CONST",
      "DEBUGGER",
      "DEFAULT",
      "DELETE",
      "DO",
      "EXPORT",
      "EXTENDS",
      "FINALLY",
      "IMPORT",
      "IN",
      "INSTANCEOF",
      "NEW",
      "SUPER",
      "SWITCH",
      "THIS",
      "THROW",
      "TRY",
      "TYPEOF",
      "VAR",
      "VOID",
      "WITH",
      "YIELD",
      // Operators and syntax
      "AMPERSAND",
      "CARET",
      "PERCENT",
      "PIPE",
      "QUESTION",
      "TILDE",
      "ARROW",
      "AND_EQUAL",
      "DIVIDE_EQUAL",
      "LEFT_SHIFT",
      "MINUS_EQUAL",
      "MODULO_EQUAL",
      "MULTIPLY_EQUAL",
      "OR_EQUAL",
      "PLUS_EQUAL",
      "RIGHT_SHIFT",
      "XOR_EQUAL",
    ];

    if (unimplementedTokens.includes(type)) {
      this.error("UnimplementedToken", {
        tokenType: type,
        lexeme: this.lexeme(),
      });
    }

    this.tokens.push({
      type,
      lexeme: this.lexeme(),
      literal,
      location: this.location(),
    });
  }

  private isAlpha(c: string): boolean {
    return (c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || c === "_" || c === "$";
  }

  private isDigit(c: string): boolean {
    return c >= "0" && c <= "9";
  }

  private isHexDigit(c: string): boolean {
    return this.isDigit(c) || (c >= "a" && c <= "f") || (c >= "A" && c <= "F");
  }

  private isOctalDigit(c: string): boolean {
    return c >= "0" && c <= "7";
  }

  private isAllowableInIdentifier(c: string): boolean {
    return this.isAlpha(c) || this.isDigit(c);
  }

  private isAtEnd(): boolean {
    return this.current >= this.sourceCode.length;
  }

  private shouldAddEOLToken(): boolean {
    const prev = this.previouslyAddedToken();
    return prev !== null && prev !== "EOL" && prev !== "SEMICOLON";
  }

  private advance(): string {
    return this.sourceCode[this.current++];
  }

  private peek(): string {
    if (this.isAtEnd()) {
      return "\0";
    }
    return this.sourceCode[this.current];
  }

  private peekNext(): string {
    if (this.current + 1 >= this.sourceCode.length) {
      return "\0";
    }
    return this.sourceCode[this.current + 1];
  }

  private previouslyAddedToken(): TokenType | null {
    if (this.tokens.length === 0) {
      return null;
    }
    return this.tokens[this.tokens.length - 1].type;
  }

  private match(expected: string): boolean {
    if (this.isAtEnd()) {
      return false;
    }
    if (this.sourceCode[this.current] !== expected) {
      return false;
    }

    this.current++;
    return true;
  }

  private lexeme(): string {
    return this.sourceCode.substring(this.start, this.current);
  }

  private location(): Location {
    return Location.fromLineOffset(this.start + 1, this.current + 1, this.line, this.lineOffset);
  }

  private reset() {
    this.tokens = [];
    this.start = 0;
    this.current = 0;
    this.line = 1;
    this.lineOffset = 0;
  }

  private verifyEnabled(tokenType: TokenType, lexeme: string): void {
    if (this.languageFeatures.excludeList && this.languageFeatures.excludeList.includes(tokenType)) {
      this.disabledLanguageFeatureError("DisabledFeatureExcludeListViolation", {
        excludeList: this.languageFeatures.excludeList,
        tokenType,
        lexeme,
      });
    }

    if (this.languageFeatures.includeList && !this.languageFeatures.includeList.includes(tokenType)) {
      this.disabledLanguageFeatureError("DisabledFeatureIncludeListViolation", {
        includeList: this.languageFeatures.includeList,
        tokenType,
        lexeme,
      });
    }
  }

  private error(type: SyntaxErrorType, context: any = {}): never {
    throw new SyntaxError(translate(`error.syntax.${type}`, context), this.location(), type, context);
  }

  private disabledLanguageFeatureError(type: DisabledLanguageFeatureErrorType, context: any): never {
    throw new DisabledLanguageFeatureError(
      translate(`error.disabledLanguageFeature.${type}`, context),
      this.location(),
      type,
      context
    );
  }
}

export function scan(sourceCode: string, ...args: [LanguageFeatures?]): Token[] {
  return new Scanner(...args).scanTokens(sourceCode);
}
