# Plan to Eliminate `as any` and `as unknown` Type Casts

Found **42 instances** of type casts that can be eliminated. Here's the categorized plan:

---

## Category 1: Missing Interface Fields (10 instances) - PRIORITY 1

**JavaScript Executors** - Objects returned don't match interfaces (missing optional fields)

Files affected:

- `executeGroupingExpression.ts` - missing `expression` field
- `executeExpressionStatement.ts` - missing `expression` field
- `executeBinaryExpression.ts` - missing `left`/`right` fields
- `executeUnaryExpression.ts` - missing `operand` field
- `executeVariableDeclaration.ts` (2x) - missing fields for initialized/uninitialized

**Fix**: Add missing optional fields to `EvaluationResult*` interfaces:

- `EvaluationResultGroupingExpression` needs `expression?` (legacy field)
- `EvaluationResultBinaryExpression` needs `left?`, `right?` as optional (for describers)
- Similar for other types

**OR** (better): Remove the `as any` if the objects already match - need to verify why TypeScript isn't accepting them.

---

## Category 2: Python `pythonTypeName` Access (8 instances) - PRIORITY 2

Python code casts to access `pythonTypeName()` method which only exists on some JikiObject types.

Files affected:

- `executeSubscriptExpression.ts` (2x)
- `executeAssignmentStatement.ts` (2x)
- `executeBinaryExpression.ts` (4x for short-circuit)

**Fix**: Add type guard or helper function:

```typescript
function getPythonTypeName(obj: JikiObject): string {
  if ("pythonTypeName" in obj && typeof obj.pythonTypeName === "function") {
    return obj.pythonTypeName();
  }
  return obj.type;
}
```

Replace all `(object as any).pythonTypeName ? (object as any).pythonTypeName() : object.type` with `getPythonTypeName(object)`.

---

## Category 3: Python Short-Circuit Evaluation (4 instances) - PRIORITY 2

Python `executeBinaryExpression` returns objects with `right: null` during short-circuit, but interface expects `EvaluationResultExpression`.

Files: `executeBinaryExpression.ts` (lines 125, 146, 158, 179)

**Fix**: Update `EvaluationResultBinaryExpression` interface:

```typescript
export interface EvaluationResultBinaryExpression {
  type: "BinaryExpression";
  left: EvaluationResultExpression;
  right: EvaluationResultExpression | null; // Allow null for short-circuit
  jikiObject: JikiObject;
  immutableJikiObject: JikiObject;
}
```

---

## Category 4: Describer Type Narrowing (11 instances) - PRIORITY 3

Describers receive union types but need specific types for their helper functions.

Files:

- Python `describeSteps.ts` (5x)
- Python `describeAssignmentStatement.ts` (3x)
- Python `describeIfStatement.ts` (1x)
- Python `describeCallExpression.ts` (1x)
- Python `describeExpressionStatement.ts` (1x)

**Fix**: Update describer function signatures to accept specific types instead of unions, or use proper type guards.

Example:

```typescript
// Instead of:
describeBinaryExpression(expression, result as any, context);

// Use:
if (result.type === "BinaryExpression") {
  describeBinaryExpression(expression, result, context);
}
```

---

## Category 5: Test-Only Frame Augmentation (2 instances) - PRIORITY 4

JavaScript executor adds test-only fields to frames.

File: `javascript/executor.ts` (lines 428, 430)

**Fix**: Define `TestAugmentedFrame` interface:

```typescript
export interface TestAugmentedFrame extends Frame {
  variables: Record<string, JikiObject>;
  description: string;
}
```

Then cast properly: `frame as TestAugmentedFrame`

---

## Category 6: JikiScript Function Registration (2 instances) - PRIORITY 5

JikiScript casts callables when registering.

Files:

- `jikiscript/executor.ts` (lines 175, 179)
- `jikiscript/interpreter.ts` (line 232)

**Fix**: Update type definitions for callables to accept the specific types being passed.

---

## Category 7: Miscellaneous (5 instances) - PRIORITY 3

- JavaScript `frameDescribers.ts` - CallExpression describer (2x)
- JavaScript `describeSteps.ts` - Dictionary expression `null as any`
- JavaScript `executeStdlibMemberExpression.ts` - error.errorType cast
- JavaScript `executeCallExpression.ts` - error.errorType cast
- JikiScript `parser.ts` - field access
- JikiScript executor - setField/defineVariable

**Fix individually** based on specific context.

---

## Summary

**Total**: 42 type casts to eliminate
**Estimated effort**: 2-3 hours
**Risk**: Low - mostly adding optional fields to interfaces

**Recommended order**:

1. Python `pythonTypeName` helper (removes 8)
2. Missing interface fields (removes 10)
3. Python short-circuit `right: null` (removes 4)
4. Describer type narrowing (removes 11)
5. Remaining miscellaneous (removes 9)

This will achieve **100% type safety** with no runtime casts!
