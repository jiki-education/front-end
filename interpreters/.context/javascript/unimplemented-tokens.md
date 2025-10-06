# JavaScript Interpreter - Unimplemented Tokens

This document lists tokens that are recognized by the JavaScript scanner but will throw an `UnimplementedToken` error when encountered.

## Implementation

The scanner checks for unimplemented tokens in the `addToken` method and throws a syntax error immediately upon encountering them. This provides clear feedback that the feature is not yet supported.

## Unimplemented Tokens

### Keywords

- `break`, `case`, `catch`, `class`, `const`, `continue`, `debugger`, `default`
- `delete`, `do`, `export`, `extends`, `finally`, `function`, `import`
- `in`, `instanceof`, `new`, `return`, `super`, `switch`, `this`
- `throw`, `try`, `typeof`, `var`, `void`, `with`, `yield`

### Operators and Syntax

- Bitwise: `&`, `|`, `^`, `~`, `<<`, `>>`
- Assignment: `+=`, `-=`, `*=`, `/=`, `%=`, `&=`, `|=`, `^=`
- Other: `.` (dot), `[` (bracket), `%` (modulo), `?` (ternary), `:` (colon)
- Template literals: `` ` `` (backtick)
- Arrow functions: `=>`
- Comma operator: `,`

## Error Format

When an unimplemented token is encountered:

- **Error type**: `UnimplementedToken`
- **User message**: "The '[lexeme]' feature is not yet implemented."
- **System message**: "UnimplementedToken: token: [tokenType]: lexeme: [lexeme]"

## Testing

All unimplemented tokens are tested in `tests/javascript/errors/unimplemented-tokens.test.ts`.

## Future Work

As features are implemented:

1. Remove the token from the `unimplementedTokens` array in scanner.ts
2. Implement parsing and execution support
3. Update or remove the corresponding test
4. Update this documentation
