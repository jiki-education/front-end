# Python Interpreter - Unimplemented Tokens

This document lists tokens that are recognized by the Python scanner but will throw an `UnimplementedToken` error when encountered.

## Implementation

The scanner checks for unimplemented tokens in the `addToken` method and throws a syntax error immediately upon encountering them. This provides clear feedback that the feature is not yet supported.

## Unimplemented Tokens

### Keywords

- `as`, `assert`, `async`, `await`, `break`, `class`, `continue`
- `def`, `del`, `except`, `finally`, `for`, `from`, `global`
- `import`, `in`, `is`, `lambda`, `nonlocal`
- `pass`, `raise`, `return`, `try`, `while`, `with`, `yield`

Note: The `not` keyword is already implemented as a unary operator.

### Operators and Syntax

- Comma operator: `,`
- Dot operator: `.`
- Semicolon: `;`
- List brackets: `[`, `]`

Note: The modulo operator `%` is already implemented as a binary operator.

## Error Format

When an unimplemented token is encountered:

- **Error type**: `UnimplementedToken`
- **User message**: "The '[lexeme]' feature is not yet implemented."
- **System message**: "UnimplementedToken: token: [tokenType]: lexeme: [lexeme]"

## Testing

All unimplemented tokens are tested in `tests/python/errors/unimplemented-tokens.test.ts`.

## Future Work

As features are implemented:

1. Remove the token from the `unimplementedTokens` array in scanner.ts
2. Implement parsing and execution support
3. Update or remove the corresponding test
4. Update this documentation

## Implementation Date

Added: 2025-09-08
