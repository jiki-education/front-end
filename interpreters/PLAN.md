# JavaScript Interpreter AST Node Restrictions Implementation

## Overview

This document tracks the implementation of AST node-level restrictions for the JavaScript interpreter. This feature allows external systems (like curriculum/learning platforms) to control which JavaScript language features are available by specifying allowed AST node types.

## Design Principles

1. **No curriculum/level concepts in this repo** - This is pure infrastructure
2. **Type safety** - Exported `JavaScriptNodeType` for strong typing
3. **Specific errors** - Each node restriction has its own error type
4. **Backward compatible** - `null`/`undefined` = all nodes allowed (current behavior)
5. **Explicit restriction** - Empty array `[]` = no nodes allowed

## Implementation Status

### ✅ Phase 1: Planning & Documentation

- [x] Create PLAN.md to track implementation

### 🔄 Phase 2: Type Definitions

- [ ] Create `JavaScriptNodeType` union type with all supported AST nodes
- [ ] Update `LanguageFeatures` interface with `allowedNodes` field

### 🔄 Phase 3: Error Handling

- [ ] Add specific `SyntaxErrorType` for each restrictable node
- [ ] Implement error messages for node restrictions

### 🔄 Phase 4: Parser Implementation

- [ ] Add `isNodeAllowed()` helper method
- [ ] Add `checkNodeAllowed()` for error throwing
- [ ] Update statement parsing methods:
  - [ ] `variableDeclaration()` - VariableDeclaration
  - [ ] `ifStatement()` - IfStatement
  - [ ] `forStatement()` - ForStatement
  - [ ] `whileStatement()` - WhileStatement
  - [ ] `blockStatement()` - BlockStatement
- [ ] Update expression parsing methods:
  - [ ] `assignment()` - AssignmentExpression
  - [ ] `conditional()` - ConditionalExpression
  - [ ] `logicalOr()`/`logicalAnd()` - LogicalExpression
  - [ ] `equality()`/`comparison()` - BinaryExpression
  - [ ] `unary()` - UnaryExpression/UpdateExpression
  - [ ] `member()` - MemberExpression
  - [ ] Array literals - ArrayExpression
  - [ ] Object literals - DictionaryExpression
  - [ ] Template literals - TemplateLiteralExpression

### 🔄 Phase 5: Executor Safety

- [ ] Add `assertNodeAllowed()` defensive check
- [ ] Apply checks in execute methods

### 🔄 Phase 6: Testing

- [ ] Create `tests/javascript/language-features/allowedNodes.test.ts`
- [ ] Test each node type with allowed/restricted scenarios
- [ ] Test edge cases (empty array, null, undefined)
- [ ] Test error messages and types

### 🔄 Phase 7: Documentation

- [ ] Update `.context/javascript/architecture.md` with maintenance notes
- [ ] Document how to add new AST nodes

### 🔄 Phase 8: Validation

- [ ] Run all existing tests - ensure no regressions
- [ ] Verify type exports work correctly
- [ ] Test with example restrictions

## Supported AST Node Types

### Expressions

- `LiteralExpression` - Numbers, strings, booleans, null, undefined
- `IdentifierExpression` - Variable references
- `BinaryExpression` - Arithmetic, comparison operators
- `UnaryExpression` - Negation, NOT, unary +/-
- `LogicalExpression` - &&, || operators
- `AssignmentExpression` - Variable assignment
- `UpdateExpression` - ++, -- operators
- `GroupingExpression` - Parentheses
- `ConditionalExpression` - Ternary operator
- `ArrayExpression` - Array literals
- `DictionaryExpression` - Object literals
- `MemberExpression` - Property/element access
- `TemplateLiteralExpression` - Template strings

### Statements

- `ExpressionStatement` - Expression as statement
- `VariableDeclaration` - let declarations
- `BlockStatement` - { } blocks
- `IfStatement` - if/else statements
- `ForStatement` - for loops
- `WhileStatement` - while loops

## Maintenance Notes

### Adding New AST Node Support

When implementing support for a new AST node type:

1. **Update type definition**: Add to `JavaScriptNodeType` in `src/javascript/interfaces.ts`
2. **Add error type**: Add `<NodeName>NotAllowed` to `SyntaxErrorType` in `src/javascript/error.ts`
3. **Update parser**: Add restriction check in the relevant parsing method
4. **Add safety check**: Update executor if needed
5. **Add tests**: Cover the new node in `allowedNodes.test.ts`
6. **Update this file**: Add to the "Supported AST Node Types" section

### Example Usage

```typescript
// Allow only basic expressions and function calls
const result = interpret(code, {
  allowedNodes: ["LiteralExpression", "IdentifierExpression", "CallExpression", "ExpressionStatement"],
});

// Allow everything (default behavior)
const result = interpret(code, {
  allowedNodes: null,
});

// Allow nothing (maximum restriction)
const result = interpret(code, {
  allowedNodes: [],
});
```

## Testing Strategy

Each node type should have tests covering:

1. **Allowed**: Node in allowedNodes array → code executes
2. **Restricted**: Node not in allowedNodes → specific error thrown
3. **Null/undefined**: No restriction → code executes
4. **Empty array**: Maximum restriction → error thrown

## Related Files

- `src/javascript/interfaces.ts` - Type definitions
- `src/javascript/error.ts` - Error types
- `src/javascript/parser.ts` - Parsing logic with restrictions
- `src/javascript/executor.ts` - Safety checks
- `tests/javascript/language-features/allowedNodes.test.ts` - Tests
- `.context/javascript/architecture.md` - Architecture docs
