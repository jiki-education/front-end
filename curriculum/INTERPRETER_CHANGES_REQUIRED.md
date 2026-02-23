# Interpreter Changes Required

The following changes are needed in the JavaScript interpreter (`interpreters/src/javascript/`) to support curriculum levels 10-12.

## 1. Add `FunctionDeclaration` to JS NodeType

**File**: `interpreters/src/javascript/interfaces.ts`

Add `"FunctionDeclaration"` to the `NodeType` union. The interpreter already has full support for function declarations (parser, executor, describer) - it's just missing from the `NodeType` type, so it can't be used in `allowedNodes` level restrictions.

**Needed for**: Level 10 (Make your own functions), Level 11 (Adding inputs to your functions)

## 2. Add `ReturnStatement` to JS NodeType

**File**: `interpreters/src/javascript/interfaces.ts`

Add `"ReturnStatement"` to the `NodeType` union. Same situation - full interpreter support exists, just not in the type.

**Needed for**: Level 12 (Adding returns to your functions)

## 3. Add `checkNodeAllowed` calls in parser

**File**: `interpreters/src/javascript/parser.ts`

Neither `FunctionDeclaration` nor `ReturnStatement` currently call `checkNodeAllowed` in the parser. This means they can't be restricted by the `allowedNodes` system - they're always parseable regardless of level.

Add checks following the pattern of other statements:

```typescript
// In functionDeclaration() method (~line 390):
this.checkNodeAllowed("FunctionDeclaration", "FunctionDeclarationNotAllowed", functionToken.location);

// In returnStatement() method (~line 423):
this.checkNodeAllowed("ReturnStatement", "ReturnStatementNotAllowed", returnToken.location);
```

Also add error types to `error.ts`:

- `"FunctionDeclarationNotAllowed"`
- `"ReturnStatementNotAllowed"`

And add error messages to `locales/en/translation.json` and `locales/system/translation.json`.
