# JavaScript Interpreter Evolution

## 2026-07-17: i18n moves to the inject-the-dict model (no global translator)

The JavaScript interpreter previously used a **module-global** i18next instance (`translator.ts`) that statically imported every locale pack (`en`+`hu`+`system`), with `fallbackLng: "en"` and a mutable `changeLanguage`. It now follows the monorepo's inject-the-dict model (mirroring `curriculum/src/i18n/translator.ts`; see `front-end/i18n_TODO.md`):

- **`EvaluationContext.localeMessages`** carries the active locale's message dict, injected by the app per run. `interpret`/`compile`/`evaluateFunction` build **one** `translate` function via `buildTranslator(context.localeMessages)` and thread it into the `Parser` and `Executor`; it flows down to the `Scanner`, `Environment` (inherited along the scope chain), `preParse`, and stdlib error paths. Each object holds it as a plain `translate` field (`this.translate(key, ctx)`); there are no wrapper methods.
- **Shared factory**: `src/shared/i18n.ts` exports `createTranslator(dict)` (fresh `createInstance`, `lng: "x"`, `fallbackLng: false`, `escapeValue: false`) — reusable by the other interpreters later.
- **No runtime fallback** (`fallbackLng` removed): a missing key in an injected locale surfaces as the key, never silent English.
- **Default = `system`, not `en`.** When nothing is injected, the translator resolves against the bundled `system` pseudo-locale — a loud canary for a forgotten injection rather than plausible silent English. Consequently `en` is no longer import-bundled at runtime; only `system` is. `Environment` throws `InterpreterInternalError` if constructed with neither a translate function nor an enclosing scope.
- **Retired**: the global `changeLanguage`/`getLanguage` (JS only — Python/JikiScript still have them). `tests/setup.ts` no longer sets the JS language; JS tests default to `system` and inject `{ localeMessages: enMessages }` where they assert English. New guard: `tests/javascript/translations.test.ts`.

⚠️ **Coupling**: this is not shippable to students until the app injects a locale (else the app renders `system` strings); it rides the cross-package merge gate in `i18n_TODO.md`. The error-catalog type-noun leak fixes and describer i18n are separate follow-up PRs stacked on this one.

## 2026-07-15: `for` loops require `let` for their loop variable

`for (letter of rack)` (no `let`) used to fall through to the C-style for-loop parse path, so on levels where only `ForOfStatement` was allowed the student got the misleading `ForStatementNotAllowed` ("no C-style for loops"). Now the parser detects `IDENTIFIER of`/`IDENTIFIER in` after `for (` and raises the new `MissingLetInForOf`/`MissingLetInForIn` syntax errors (system context: the variable name). The node-allowed check for `ForOfStatement`/`ForInStatement` runs first, so levels without those constructs still report `ForOfStatementNotAllowed`/`ForInStatementNotAllowed` rather than advice to add `let`.

For consistency, C-style init assignment was tightened too: `for (i = 0; ...)` is now the `MissingLetInForLoopInit` syntax error even when `i` is already declared. This deliberately removed the previously supported "reuse an outer variable" init form (there was an explicit test for it); real JavaScript allows both no-`let` forms when the variable is declared, but they are unusual and are disabled in Jiki's JavaScript, and the error messages say so. Empty init (`for (; i < 3; i++)`) is still allowed, as is assignment in the update clause.

## 2026-07-15: Template literals get the same scanner guards as strings

`tokenizeTemplateLiteral` in `scanner.ts` previously scanned to EOF looking for the closing backtick, so an unterminated template literal silently swallowed the rest of the program and reported a bare `MissingBacktickToTerminateTemplateLiteral` with no context and a location pointing at the last scanned fragment. It now has the same guards as `tokenizeString`:

- **Newlines terminate**: multi-line template literals are no longer supported (a deliberate educational divergence from real JavaScript — the curriculum never uses them). Hitting end-of-line raises `MissingBacktickToTerminateTemplateLiteral` with a `string` context so the message can suggest the fixed line, mirroring `MissingDoubleQuoteToTerminateString`.
- **Quote-typo detection**: if the unterminated line ends with `"` or `'` (optionally followed by whitespace/semicolon), the new `QuoteUsedToTerminateTemplateLiteral` error fires instead, telling the student they probably typed a quote where the closing backtick should be, with the quote stripped from the suggestion.
- **Error location** spans from the opening backtick (`this.start` is restored before erroring).
- **Escape sequences** are now processed in template text via `processTemplateEscapeSequences` (single-pass): `\n`, `\t`, `\r`, `` \` ``, `\$` (prevents interpolation), and `\\`. Unknown escapes are left as-is. A trailing backslash can't swallow the terminating newline.
- **Unterminated interpolation** (`` `Hi, ${name `` hitting a backtick or end-of-line with unbalanced braces) now raises `MissingRightBraceInTemplateLiteral` from the scanner instead of the misleading missing-backtick error. Side effect: nested template literals inside interpolations are rejected (also fine educationally).
- **Brace-counting fix**: whitespace inside `${ ... }` adds no token, and the counter previously re-inspected the last-added token, double-counting the interpolation's own `LEFT_BRACE`. The loop now skips iterations where `scanToken()` added nothing.

## 2026-07-14: Only the first lint error is reported per parse

`lintWarning` in `parser.ts` now drops all lint warnings after the first one recorded. Previously a single badly formatted line could stack several messages in the editor tooltip — e.g. `if(name === "") { name = "you" }` produced `OpeningBraceContentNotOnOwnLine`, `ClosingBraceNotOnOwnLine`, **and** a nonsensical `IncorrectIndentation` ("expected 2 spaces… indented by 33 spaces", because the mid-line closing brace's column was measured as indentation). Students fix one thing at a time, and later warnings are usually side-effects of the first, so only the first is surfaced.

The `IncorrectIndentation` copy in `en/translation.json` was also reworded from "you only indented by {{actual}} spaces" to "this line is indented by {{actual}} spaces", since "only" read backwards whenever the line was over-indented.

## 2026-07-12: `exerciseFinished()` halts execution at the end of the current statement

Previously `exerciseFinished()` (called by exercises when the goal is reached, e.g. the maze character landing on the target) only broke **no-argument** `repeat()` loops. Counted repeats, `while`, `for`, `for-of` and `for-in` ignored it, so a student who wrote `repeat(50)` instead of the bare `repeat()` watched their character reach the maze target and then keep executing the remaining iterations - wandering off the target square and failing the scenario's final-position check despite visibly finishing.

Now the flag halts execution entirely, at the end of the statement that triggered it:

- `executeStatement` early-returns when `_exerciseFinished` is set, so every subsequent statement (rest of the loop body, rest of a function body, statements after the loop, remaining top-level statements) becomes a no-op.
- Every loop construct (`repeat` counted and uncounted, `while`, `for`, `for-of`, `for-in`) breaks after the iteration in which the flag was set, so loop machinery stops generating condition/iteration frames.

**Semantic change:** the old behaviour was "finish the current _iteration_, then break the no-arg repeat" - remaining statements in the finishing iteration still ran. The new behaviour stops after the current _statement_: nothing in the program executes once the exercise has finished. The expression containing the triggering call still completes normally and generates its frame.

Python and JikiScript retain the old semantics (only their no-arg repeat loops check the flag); aligning them is deliberately out of scope for now. The `ExecutionContext.exerciseFinished` doc comment in `shared/interfaces.ts` records the divergence.

## 2026-07-10: Loose equality (`==`/`!=`) rejected at parse time, with distinct messages

Rejecting `==`/`!=` when `enforceStrictEquality` is on (the default) moved from a **runtime** check in `executeBinaryExpression` to a **parse-time** check in `parser.ts` (`equality()`). Rationale:

- The feature is "this syntax is disabled in Jiki", not a runtime condition. As a runtime error, `==` inside a branch that never executed produced no error at all. As a `SyntaxError` it is flagged regardless of whether the expression would run.
- Syntax errors already flow through the app's `handleSyntaxError`, so the offending operator gets a red underline and the line gets `cm-highlightedLine--error` for free — runtime error frames never got that treatment.

Two other changes went with it:

- **`==` and `!=` now use distinct error keys** — `StrictEqualityRequired` (change `==` → `===`) and the new `StrictInequalityRequired` (change `!=` → `!==`), each with its own `en` + `system` copy. Previously both shared one message that always talked about `==`. The keys moved from `error.runtime.*` to `error.syntax.*`, and were removed from `RuntimeErrorType`. The error location is the operator token only, not the whole binary expression.
- **App side (`store.ts` `setCurrentFrame`):** runtime **error frames** now set `highlightedLineColor = ERROR_HIGHLIGHT_COLOR` (so the line gets `cm-highlightedLine--error`) while success frames reset to `INFO_HIGHLIGHT_COLOR`. Runtime error frames deliberately do **not** set an `underlineRange` — only syntax errors underline a specific location.

## 2026-07-07: Error-message i18n overhaul — all student-facing English moved to translation JSON

A wide pass over the JS interpreter's runtime/parser errors to fix a structural problem: much of the English students saw was either built in code (pluralisation, articles, "no"/"an") or hardcoded as raw `system`-format strings passed straight through `executor.error(..., { message: "..." })`, bypassing i18n entirely. The end state: **every student-facing string is rendered from `en/translation.json`; code passes only structured context.**

Key changes:

- **`InvalidNumberOfArguments` rebuilt around i18next.** Code now passes a `context` discriminator (`exact`/`atLeast`/`range`) plus raw numbers instead of assembling words. Pluralisation lives in the locale via `context` + `count` + nested `$t()`, with reusable quantity fragments in a new top-level `phrases` namespace (`slotCount`/`inputCount`). A **Hungarian (`hu`) bundle** was added (with `fallbackLng: "en"`) as a proof the design survives languages where nouns stay singular after numerals and zero is a negated existential. `executeNewExpression` was aligned to pass `context` too (it previously rendered a raw key string).

- **Overloaded/mislabelled errors split into properly-named keys:** `MissingClassNameAfterNew` (was borrowing `MissingExpression`), `UnterminatedBlockComment` (was a fake `UnknownCharacter`), `UpdateOperatorRequiresNumber` (was the misnamed `InvalidUnaryExpression`). `MissingExpression`/`UnknownCharacter`/`GenericSyntaxError` copy now uses the `{{token}}`/`{{character}}` context they already received.

- **Raw `system`-format throws rerouted** through `executor.error(type, context)` so their `en` copy renders (the `In*` operators, `ComparisonRequiresNumber`, `MethodNotYet*`, `IndexOutOfRange`, `FunctionExecutionError`, `PropertyNotFound`, etc.). `PropertyNotFound` and `IndexOutOfRange` now thread a `type` so they name the real container (arrays/strings/`Math`) instead of hardcoding "arrays".

- **The generic `TypeError` catch-all was promoted** into distinct keys (`ArrayIndexNotNumber`, `ArrayIndexNotInteger`, `StringIndexNotNumber`, `StringIndexNotInteger`, `ComputedAccessNotAllowedForStdlib`, `ComputedAccessNotAllowedForBuiltin`, `CannotReadPropertiesOfType`, `CannotSetPropertyOfType`, `BracketNotationNotAllowedOnInstance`, `NotCallable`), each with reworded educational copy and a system-message test. `TypeError` remains only as the stdlib-arg label (rendered via `error.stdlib.*`).

- **`MethodUsedWithoutParentheses`** — bare method references (`arr.push` without `()`) are now an error, not a first-class function value. Implemented as a parser lookahead: a `MemberExpression` that is immediately the callee of a call is flagged `isCalled`; the executor errors on any method resolved from an unflagged member. **`PropertyNotYetAvailable`** was split out from `MethodNotYetAvailable` so level-gated property access (e.g. `arr.length`) reports "property" rather than "method".

- **`InterpreterInternalError`** now backs all "this should never happen" cases (unreachable `default:`/dispatcher branches, the non-JikiObject guard). It is NOT a `RuntimeError`, is re-thrown out of `interpret()`, and is deliberately exempt from i18n (dev-facing crash, never shown to a student). `catch` blocks that wrap arbitrary errors re-throw it first. This convention is documented in `AGENTS.md`.

- **Dead code/keys removed:** `ArgumentError` (never raised), the `ValueError`/`TypeError` runtime `"{{message}}"` echoes, `GenericSyntaxError` + `UnexpectedRightBrace` (unreachable — a stray token throws `MissingExpression` first, so the parser's no-progress branch became an `InterpreterInternalError` guard), and the `getNodeFriendlyName` English map in `parser.ts` (passed as `friendlyName` context but rendered by no template, and unused in `app`/`curriculum` source — only present in built bundles).

Scope: JavaScript interpreter only. Python still carries the pre-overhaul patterns (raw-message TypeErrors, code-built pluralisation, `InvalidUnaryExpression`) and is the obvious follow-up.

## 2026-07-05: Quote strings in descriptions via `toDisplayString()`

A student reported that variable declaration descriptions showed string values unquoted, e.g. `let border_color = "black"` described as "set it to `black`" instead of "set it to `"black"`". The root cause was `JSString.toString()` returning the raw value, which describers inherited through `formatJSObject()`.

JikiScript avoids this by baking `JSON.stringify` into its primitive `toString()`, but the JS interpreter cannot: unlike JikiScript, JS `toString()` is the value/coercion representation and is relied on by real program-behaviour paths that must stay unquoted (`console.log` output, `array.join`/`toString`/`sort`, object property keys). Conflating value and display into `toString()` would break those. The code already hinted at this by ad-hoc quoting `JSString` inside `JSArray.toString()`/`JSDictionary.toString()`.

The fix introduces a dedicated display representation, `toDisplayString()`, as a concrete default on the shared `JikiObject` base (returns `this.toString()`), overridden only in `JSString` to return `JSON.stringify(this._value)`. The display bottlenecks `formatJSObject()` and `codeTag()` (both in `src/javascript/helpers.ts`) now call `toDisplayString()`, and the describers that bypassed those helpers by calling `.toString()` directly (return, array expression, member access, for-in key, for-of element) were switched to `.toDisplayString()`. Value paths were left untouched. Arrays/dicts inherit the default and keep their existing (already-quoting) `toString()` for display, so nested strings still render correctly. Python inherits the default no-op and is unaffected.

## 2026-06-27: No-arg `repeat()` raises MaxIterationsReached at the cap

A no-argument `repeat() { ... }` is meant to run until the exercise signals completion (`_exerciseFinished`), bounded only by the infinite-loop guard. Previously `executeRepeatStatement` passed `maxTotalLoopIterations` as the loop's literal `count`, so `while (iteration < count)` stopped the loop at exactly the cap, one iteration before `guardInfiniteLoop` (which throws only when `totalLoopIterations > max`) could fire. The result: a never-finishing loop like `repeat() { turnLeft() }` ran exactly `max` times and then exited cleanly with `status: SUCCESS` and no error frame, so the student got no feedback that they were stuck in an unproductive loop. (Before the per-exercise caps landed, the default cap of 10,000 meant this silently generated 10,000 frames and froze the browser.)

The no-arg branch now passes `count: null` and the loop runs `while (count === null || iteration < count)`, relying on `guardInfiniteLoop` to stop it. Hitting `maxTotalLoopIterations` now raises a `MaxIterationsReached` error frame, matching JikiScript (which already used an explicit `iteration >= max` check). Bounded `repeat(n)` is unchanged. The Python interpreter had the identical off-by-one and was fixed the same way.

The English `MaxIterationsReached` copy was reworded to "...The maximum number of times the loops are allowed to run in this exercise is {{max}}." in both JS and Python.

## 2026-06-26: Helpful error for dangling `else` / `else if`

A dangling `else` (or `else if`) that reached the statement level previously fell through to expression parsing and produced the unhelpful `MissingExpression` ("Missing expression in code."). This happens when an `if` block is closed early or already has an `else`, so a following `else if` has no `if` to attach to (commonly a brace-count mistake).

The parser's `statement()` now detects a leading `ELSE` token and throws the new `UnexpectedElseWithoutMatchingIf` syntax error, mirroring JikiScript's existing handling. The English message points the student at the likely cause: "There is no `if` statement that this `else` is coming after. Check whether you have too many (or too few) closing braces above this line."

Scope: JavaScript interpreter only (`parser.ts`, `error.ts`, both locale files). Python still has the same gap (a dangling `elif`/`else` is unhandled) and is a candidate follow-up.

## 2026-06-24: Exact rational arithmetic (order-independent numbers)

Numbers now carry an exact rational value (`Fraction`) internally, so mathematically equivalent expressions agree regardless of operation order. Previously every binary arithmetic result was rounded to 5 decimal places after _each_ operation, which made `1 / 7 * x` (rounds `1/7` first, then multiplies) diverge from `x / 7` (a single round). This surfaced in the Structured House drawing exercise, where `width / 7` passed the position check but `1/7 * width` did not.

The exposed `.value` is unchanged: it is still rounded to 5 decimal places, so existing exercise checks, UI output, and the external-function contract all behave exactly as before. The fix is purely internal precision.

### Mechanism

- New shared `Fraction` class (`src/shared/fraction.ts`): BigInt numerator/denominator, always normalized, with exact `+ - * / % **`(integer exponent). Operations that cannot stay rational (division by zero, non-integer exponents) return `null` so the caller falls back to float arithmetic. Built in `shared/` so JikiScript and Python can adopt it later.
- `JSNumber` gains an `exact: Fraction | null` field and a `JSNumber.fromFraction()` constructor. `.value` is rounded to display precision (5dp) via `roundToDisplayPrecision`; `.preciseValue` exposes the full-precision value for feeding the next operation.
- Numeric literals (`executeLiteralExpression`) build their exact fraction from the literal (e.g. `0.1` -> `1/10`). Integers created anywhere via `createJSObject` also get an exact fraction (always representable). Non-integer floats from irrational operations (e.g. `Math.sqrt`) are left inexact (`exact: null`) so they are never treated as exact.
- `executeBinaryExpression` routes number/number arithmetic through `numberArithmetic`: exact fraction arithmetic when both operands are exact and the op stays rational, otherwise rounded float arithmetic (preserving the old neat display for the inexact/post-irrational path). Type-coercion paths (string concat, `"5" - 2`) are unchanged.
- Unary minus negates the exact fraction when present.

### Scope

JavaScript interpreter only. JikiScript and Python still round per-operation (`DP_MULTIPLE`); porting them to `Fraction` is a planned follow-up.

## 2026-06-22: Assignment is statement-only (AssignmentInExpression)

Assignment (`=`) is now only permitted as a complete expression statement (e.g. `x = 5;`) or in a for-loop's init/update clauses (e.g. `for (i = 0; i < 3; i = i + 1)`). Using assignment anywhere else - inside an `if`/`while` condition, a function argument, a variable initializer, an array/object literal, or nested in any other expression - raises a `AssignmentInExpression` syntax error.

This blocks the classic beginner footgun `if (x = 5)` (which in real JS assigns and then tests truthiness, always entering the branch) by steering students toward `===`. Chained assignment (`x = y = 5`, `obj.a = obj.b = 42`) is also blocked, since the inner assignment is used as a value.

### Mechanism

Parser-level. `expression()`/`assignment()` take an `allowAssignment` flag (default `false`); only the three statement-position call sites (expression statement, for-init, for-update) pass `true`. When `assignment()` encounters `=` with the flag unset it throws `AssignmentInExpression` pointing at the `=` token. The RHS of a permitted assignment is parsed with the flag unset, which is what makes chained assignment an error. Because it is a parse error, it surfaces as `error` with empty `frames[]` per the shared error-handling pattern.

## 2026-06-22: Same-scope redeclaration error (VariableAlreadyDeclared)

Redeclaring a `let`/`const` binding in the same scope (e.g. `let x = 1; let x = 2;`) now raises a `VariableAlreadyDeclared` runtime error instead of silently overwriting. This matches real JavaScript, which raises a SyntaxError for that code. (Detected at execution rather than parse time, so it surfaces as a runtime error frame following the shared error-handling pattern.)

### Mechanism

- `Environment.define` takes a new `isDeclaration` parameter (default `false`); when a declaration targets a name that already exists in the current scope, it throws `VariableAlreadyDeclared`.
- `executeVariableDeclaration` passes `isDeclaration: true`; built-in injections (console, Math, Object, Number, String, custom functions/classes, secret constants) keep the default `false`, so registering them never trips the check.
- New `RuntimeErrorType` `VariableAlreadyDeclared` with translations in both `system` and `en` locale files.

### Built-ins are protected too

Unlike real JS, redeclaring an injected built-in (e.g. `let console = 1`, `let Math = 1`) also errors. In real JS those globals are not lexical bindings, so `let console = 1` is legal shadowing, but in this educational interpreter such a redeclaration is virtually always an unintentional student mistake, so erroring is more helpful than silently shadowing the built-in. Cross-scope cases (inner blocks) are unaffected and continue to flow through the existing `ShadowingDisabled` path. The secret-constant top-level path in `executeVariableDeclaration` still returns before `define`, so those remain silently ignored.

## 2026-05-12: Guard bare function references (UnexpectedUncalledFunction)

A bare callable identifier used as a value (e.g. `circle;` as a statement, or `let g = circle;`) now raises `UnexpectedUncalledFunction` instead of silently stepping. Mirrors JikiScript's `UnexpectedUncalledFunctionInExpression` so semantics match across interpreters.

### Mechanism

- New AST node `CalleeIdentifierExpression extends IdentifierExpression` in `src/javascript/expression.ts`. It inherits the `"IdentifierExpression"` type tag so node-allowance checks and existing `instanceof IdentifierExpression` introspection sites keep matching unchanged.
- Parser rewrite in `finishCallExpression` (`src/javascript/parser.ts`): a `rewriteCallee` helper walks into `GroupingExpression`s and swaps a bare `IdentifierExpression` callee for `CalleeIdentifierExpression`. Other callee shapes (`MemberExpression`, nested `CallExpression`, `NewExpression`) are untouched.
- Dispatch in `executor.evaluate` checks `CalleeIdentifierExpression` before `IdentifierExpression` (subclass first). The new `executeCalleeIdentifierExpression` does the environment lookup without the callable guard; `executeIdentifierExpression` adds the guard via `isCallable(value)`.
- New `RuntimeErrorType` `UnexpectedUncalledFunction` with translations in both `system` and `en` locale files.

### Consequence — first-class function values

As a deliberate side-effect, JS-style first-class function values are now disallowed: `let g = f;`, `return f;`, and `someFn(f)` (passing a function by identifier) all raise the new error. This matches JikiScript and forecloses callback-style higher-order functions for now. Note that `obj.method;` (a bare member-callable) still silently steps — that case goes through `executeMemberExpression` and is intentionally out of scope; track as a follow-up if it surfaces.

## 2025-10-09: Added String Search Methods (indexOf, lastIndexOf, includes, startsWith, endsWith)

### Overview

Implemented 5 essential string search methods to enable students to search and test strings for substrings. All methods use native JavaScript string methods for 100% spec compliance.

### Changes Applied

**1. String Search Methods** (`src/javascript/stdlib/string/`):

- **indexOf(searchString, position?)** - Returns first index of substring, or -1
  - Arity: `[1, 2]` (searchString required, position optional)
  - Uses native `string.value.indexOf()`
  - Handles optional position parameter (defaults to 0)
  - Returns JSNumber with index or -1

- **lastIndexOf(searchString, position?)** - Returns last index of substring, or -1
  - Arity: `[1, 2]` (searchString required, position optional)
  - Uses native `string.value.lastIndexOf()`
  - Handles optional position parameter (defaults to +Infinity)
  - Returns JSNumber with index or -1

- **includes(searchString, position?)** - Returns boolean if string contains substring
  - Arity: `[1, 2]` (searchString required, position optional)
  - Uses native `string.value.includes()`
  - Handles optional position parameter (defaults to 0)
  - Returns JSBoolean

- **startsWith(searchString, position?)** - Returns boolean if string starts with substring
  - Arity: `[1, 2]` (searchString required, position optional)
  - Uses native `string.value.startsWith()`
  - Handles optional position parameter (defaults to 0)
  - Returns JSBoolean

- **endsWith(searchString, length?)** - Returns boolean if string ends with substring
  - Arity: `[1, 2]` (searchString required, length optional)
  - Uses native `string.value.endsWith()`
  - Handles optional length parameter (defaults to string length)
  - Note: Second parameter is `length`, not `position`
  - Returns JSBoolean

**2. Registry Updates** (`src/javascript/stdlib/string/index.ts`):

- Added imports for all 5 new methods
- Removed from `notYetImplementedMethods` list
- Added to `stringMethods` export
- Separated regex-based methods (search, match, matchAll) into "Not planned" section with comment

**3. Documentation Updates**:

- **STDLIB_JS.md**: Marked 5 methods as `[x]` completed, separated regex methods to "Not planned"
- **evolution.md**: Added this comprehensive entry

**4. Test Coverage**:

- **Unit tests** (`tests/javascript/stdlib/string/`):
  - `indexOf.test.ts`: 19 tests covering basic search, position param, edge cases, errors
  - `lastIndexOf.test.ts`: 12 tests covering last occurrence, position param, edge cases
  - `includes.test.ts`: 13 tests covering found/not found, position param, edge cases
  - `startsWith.test.ts`: 14 tests covering start checks, position param, edge cases
  - `endsWith.test.ts`: 15 tests covering end checks, length param, edge cases

- **Cross-validation tests** (`tests/cross-validation/string-search-methods.test.ts`):
  - 25 tests verifying implementation matches native JavaScript exactly
  - Tests all 5 methods with various parameters
  - Validates edge cases (empty strings, negative positions, etc.)

### Implementation Notes

**Native Method Usage**:

Following the established pattern, all methods delegate to native JavaScript string methods:

- `indexOf()` → `string.value.indexOf()`
- `lastIndexOf()` → `string.value.lastIndexOf()`
- `includes()` → `string.value.includes()`
- `startsWith()` → `string.value.startsWith()`
- `endsWith()` → `string.value.endsWith()`

**Parameter Handling**:

- All methods use `Math.trunc()` to convert position/length to integers
- Optional parameters handled with proper defaults
- Guards validate argument count and types

**Regex Methods Excluded**:

- `search()`, `match()`, `matchAll()` moved to "Not planned" section
- These require regex support which is not yet implemented
- Can be added in future when regex support is ready

### Supported Syntax

```javascript
let str = "hello world";

// Find first occurrence
str.indexOf("world"); // Returns 6
str.indexOf("xyz"); // Returns -1
str.indexOf("o", 5); // Returns 7 (starts search from index 5)

// Find last occurrence
str.lastIndexOf("o"); // Returns 7
str.lastIndexOf("o", 5); // Returns 4 (searches up to index 5)

// Check if string contains substring
str.includes("world"); // Returns true
str.includes("xyz"); // Returns false
str.includes("world", 7); // Returns false (search starts after "world")

// Check if string starts with substring
str.startsWith("hello"); // Returns true
str.startsWith("world"); // Returns false
str.startsWith("world", 6); // Returns true (checks from index 6)

// Check if string ends with substring
str.endsWith("world"); // Returns true
str.endsWith("hello"); // Returns false
str.endsWith("hello", 5); // Returns true (considers first 5 chars)
```

### Test Results

- All 73 new tests passing
- All existing tests still passing
- Cross-validation confirms native JavaScript parity
- TypeScript compilation with zero errors

### Benefits

- **Expanded stdlib**: 5 new string methods available to students
- **Consistent patterns**: All follow established stdlib architecture
- **100% native parity**: Using native methods ensures correct behavior
- **Educational value**: Students can learn string searching techniques

### Future Enhancements

- Add regex support to enable `search()`, `match()`, `matchAll()`
- Add string extraction methods (`slice()`, `substring()`, `charAt()`, `at()`)
- Add string modification methods (`replace()`, `split()`, `trim()`, etc.)

## 2025-10-09: Added Array Methods Batch (9 methods: splice, sort, reverse, fill, lastIndexOf, toString, entries, keys, values)

### Overview

Implemented a comprehensive batch of 9 array methods (4 mutating, 5 accessor) to expand JavaScript stdlib capabilities. Added JSIterator class to support iterator-returning methods.

### Changes Applied

**1. JSIterator Class** (`src/javascript/jsObjects/JSIterator.ts`):

- New JikiObject subclass representing JavaScript Array Iterators
- Stores items array and iterator type ("entries" | "keys" | "values")
- Returns "[object Array Iterator]" as string representation
- Immutable clone behavior (returns self)

**2. Mutating Methods** (`src/javascript/stdlib/array/`):

- **splice()** - Remove/add elements at position, returns deleted elements array
  - Arity: `[1, Infinity]` (start required, deleteCount + items optional)
  - Uses native `array.elements.splice()`
  - Handles all JavaScript splice behaviors (negative indices, insertion, etc.)

- **sort()** - Sort array in place, returns sorted array
  - Arity: `[0, 1]` (optional comparator function)
  - Default: Lexicographic sort (converts to strings)
  - Custom comparators: Not yet supported (throws LogicError)

- **reverse()** - Reverse array in place, returns reversed array
  - Arity: `[0, 0]` (no arguments)
  - Uses native `array.elements.reverse()`

- **fill()** - Fill array with value, returns modified array
  - Arity: `[1, 3]` (value required, start/end optional)
  - Uses native `array.elements.fill()`
  - Supports partial filling with start/end indices

**3. Accessor Methods** (`src/javascript/stdlib/array/`):

- **lastIndexOf()** - Find last occurrence, returns index or -1
  - Arity: `[1, 2]` (searchElement required, fromIndex optional)
  - Manual search loop (not using native method to ensure JikiObject equality)
  - Handles negative fromIndex

- **toString()** - Convert array to comma-separated string
  - Arity: `[0, 0]` (no arguments)
  - Joins elements with commas (equivalent to `join(",")`)
  - Returns JSString

- **entries()** - Returns iterator of [index, value] pairs
  - Arity: `[0, 0]` (no arguments)
  - Creates JSArray of [index, value] pairs
  - Returns JSIterator with type "entries"

- **keys()** - Returns iterator of array indices
  - Arity: `[0, 0]` (no arguments)
  - Creates array of JSNumber indices
  - Returns JSIterator with type "keys"

- **values()** - Returns iterator of array values
  - Arity: `[0, 0]` (no arguments)
  - Clones elements for snapshot
  - Returns JSIterator with type "values"

**4. Registry Updates** (`src/javascript/stdlib/array/index.ts`):

- Added imports for all 9 new methods
- Removed from `notYetImplementedMethods` list
- Added to `arrayMethods` export

**5. Object Exports** (`src/javascript/jsObjects/index.ts`):

- Added `JSIterator` export

**6. Documentation Updates**:

- **STDLIB_JS.md**: Marked all 9 methods as `[x]` completed
- **evolution.md**: Added this comprehensive entry

**7. Test Updates**:

- Fixed `stdlib-errors.test.ts`: Removed `sort` and `reverse` from unimplemented methods list
- All existing cross-validation tests pass (already covered by existing test suite)

### Implementation Notes

**Native Method Usage**:

Following the established pattern, all methods delegate to native JavaScript array methods where possible:

- `splice()` → `array.elements.splice()`
- `sort()` → `array.elements.sort()`
- `reverse()` → `array.elements.reverse()`
- `fill()` → `array.elements.fill()`

**Manual Implementation**:

- `lastIndexOf()` uses manual search to ensure JikiObject equality checking
- Iterator methods create snapshots of data and wrap in JSIterator

**sort() Limitations**:

- Currently only supports default lexicographic sort
- Custom comparator functions throw LogicError (requires function support)
- Future enhancement: Support for comparator functions

### Supported Syntax

```javascript
let arr = [3, 1, 2];

// Mutating methods
arr.splice(1, 1, 99); // Returns [1], arr now [3, 99, 2]
arr.sort(); // Returns sorted arr
arr.reverse(); // Returns reversed arr
arr.fill(0, 1, 3); // Returns arr with [1,3) filled with 0

// Accessor methods
arr.lastIndexOf(2); // Returns last index of 2
arr.toString(); // Returns "3,99,2"
arr.entries(); // Returns JSIterator of [index, value]
arr.keys(); // Returns JSIterator of indices
arr.values(); // Returns JSIterator of values
```

### Test Results

- All 2550 tests passing (was 2549)
- Fixed 1 test in `stdlib-errors.test.ts`
- TypeScript compilation with zero errors
- Cross-validation tests confirm native parity

### Benefits

- **Expanded stdlib**: 9 new array methods available to students
- **Consistent patterns**: All follow established stdlib architecture
- **Type safety**: JSIterator properly integrated into type system
- **Educational value**: Students can learn more array manipulation techniques

### Future Enhancements

- Add comparator function support for `sort()`
- Implement iterator protocol for for...of loops with iterators
- Add Array.from() and Array.isArray() static methods

## 2025-10-07: Added Array Mutating Methods (push, pop, shift, unshift)

### Overview

Implemented four essential array mutating methods (`push`, `pop`, `shift`, `unshift`) that modify arrays in place. Refactored JSArray to use native JavaScript array methods for improved maintainability and 100% compatibility with native behavior.

### Changes Applied

**1. JSArray Refactoring** (`src/javascript/jsObjects/JSArray.ts`):

- Changed `elements` field from `private readonly` to `public readonly`
- This allows stdlib methods to directly access and use native JavaScript array methods
- The array reference is readonly but contents remain mutable, enabling proper method behavior

**2. Refactored at() Method** (`src/javascript/stdlib/array/at.ts`):

- Updated to use native `array.elements.at(index)` instead of custom logic
- Simplified implementation while maintaining all existing behavior
- Ensures 100% compatibility with JavaScript's native `at()` method

**3. Implemented Mutating Methods**:

- **push()** (`src/javascript/stdlib/array/push.ts`):
  - Accepts variable arguments (arity: `[1, Infinity]`)
  - Uses native `array.elements.push(...args)`
  - Returns JSNumber with new array length

- **pop()** (`src/javascript/stdlib/array/pop.ts`):
  - Accepts no arguments (arity: `0`)
  - Uses native `array.elements.pop()`
  - Returns removed element or JSUndefined if array is empty

- **shift()** (`src/javascript/stdlib/array/shift.ts`):
  - Accepts no arguments (arity: `0`)
  - Uses native `array.elements.shift()`
  - Returns removed first element or JSUndefined if array is empty

- **unshift()** (`src/javascript/stdlib/array/unshift.ts`):
  - Accepts variable arguments (arity: `[1, Infinity]`)
  - Uses native `array.elements.unshift(...args)`
  - Returns JSNumber with new array length

**4. Stdlib Registry Updates** (`src/javascript/stdlib/array/index.ts`):

- Removed `push`, `pop`, `shift`, `unshift` from `notYetImplementedMethods` list
- Added imports and exports for all four new methods

**5. Test Infrastructure Improvements**:

- Moved `TestAugmentedFrame` type from inline definitions to `src/shared/frames.ts` for reuse
- Updated all test files (JavaScript and Python) to import from shared location
- Ensures type consistency across the entire test suite

**6. Comprehensive Test Coverage**:

- **Unit tests** (`tests/javascript/array-properties-methods.test.ts`):
  - Added 14 new tests covering all four methods
  - Tests for basic functionality, edge cases, return values, mutations
  - Tests for argument validation (too many/few arguments)

- **Cross-validation tests** (`tests/cross-validation/javascript/stdlib/array-methods.test.ts`):
  - Added 17 new tests verifying implementation matches native JavaScript
  - Tests for push/pop/shift/unshift with various scenarios
  - Verifies mutations, return values, and array state changes

- **Error tests** (`tests/javascript/stdlib-errors.test.ts`):
  - Updated to reflect that push/pop/shift/unshift are now implemented
  - Changed test cases to use other unimplemented methods (indexOf, etc.)

### Benefits of Native Method Approach

- **Simpler code**: No need to reimplement JavaScript's array logic
- **100% compatibility**: Native methods guarantee matching behavior
- **Easier maintenance**: Less custom code to maintain and debug
- **Future-proof**: Easy to add more array methods using the same pattern

### Supported Syntax

```javascript
let arr = [1, 2, 3];
arr.push(4); // Returns 4 (new length)
arr.pop(); // Returns 4 (removed element)
arr.shift(); // Returns 1 (first element)
arr.unshift(0); // Returns 3 (new length)
```

## 2025-10-07: Added Exponentiation Operator (`**`)

### Overview

Implemented full support for the JavaScript exponentiation operator (`**`), enabling students to perform power operations with proper operator precedence and right-associativity.

### Changes Applied

**1. Token System** (`src/javascript/token.ts`):

- Added `STAR_STAR` token type for the `**` operator

**2. Scanner Update** (`src/javascript/scanner.ts`):

- Modified `tokenizeStar()` method to check for `**` before `*=` and `*`
- Pattern: `**` → `STAR_STAR`, `*=` → `MULTIPLY_EQUAL`, `*` → `STAR`

**3. Parser Enhancement** (`src/javascript/parser.ts`):

- Added `exponentiation()` method between `multiplication()` and `unary()` in precedence chain
- Implemented right-associative parsing using recursion instead of loop
- Proper precedence: `2 * 3 ** 2` parses as `2 * (3 ** 2)` = 18
- Right-associativity: `2 ** 3 ** 2` parses as `2 ** (3 ** 2)` = 512

**4. Executor Implementation** (`src/javascript/executor/executeBinaryExpression.ts`):

- Added `STAR_STAR` case using JavaScript's native `**` operator
- Follows same type checking pattern as multiplication (verifies numbers when type coercion disabled)
- Computes: `left ** right`

**5. Comprehensive Test Coverage**:

- **Scanner tests** (`tests/javascript/scanner.test.ts`): Added `**` token test
- **Parser tests** (`tests/javascript/concepts/arithmetic.test.ts`):
  - Basic exponentiation parsing
  - Right-associativity verification (`2 ** 3 ** 2`)
  - Precedence verification (`2 * 3 ** 2`)
- **Interpreter tests** (`tests/javascript/interpreter/arithmetic.test.ts`):
  - Basic computation: `2 ** 3` = 8
  - Decimal results: `4 ** 0.5` = 2
  - Right-associativity: `2 ** 3 ** 2` = 512
  - Precedence: `2 * 3 ** 2` = 18
- **Cross-validation tests** (`tests/cross-validation/javascript/core/basic-operations.test.ts`):
  - Verified implementation matches native JavaScript behavior
  - Tests for basic exponentiation, precedence, and right-associativity

### Supported Syntax

```javascript
// Basic exponentiation
let result = 2 ** 3; // 8

// Right-associative (evaluates right to left)
let result = 2 ** (3 ** 2); // 2 ** (3 ** 2) = 2 ** 9 = 512

// Higher precedence than multiplication
let result = 2 * 3 ** 2; // 2 * (3 ** 2) = 2 * 9 = 18

// Works with decimals
let result = 4 ** 0.5; // 2 (square root)
```

### Implementation Notes

**Operator Precedence**:

JavaScript operator precedence (high to low):

1. Grouping `()`
2. Unary `+`, `-`, `!`
3. Exponentiation `**` (right-associative)
4. Multiplication/Division `*`, `/`
5. Addition/Subtraction `+`, `-`
6. Comparison `>`, `<`, `>=`, `<=`
7. Equality `===`, `!==`, `==`, `!=`
8. Logical AND `&&`
9. Logical OR `||`
10. Assignment `=`

**Right-Associativity**:

Unlike most binary operators, exponentiation is right-associative:

- `2 ** 3 ** 2` = `2 ** (3 ** 2)` = `2 ** 9` = `512`
- NOT `(2 ** 3) ** 2` = `8 ** 2` = `64`

This is implemented using recursion in the parser's `exponentiation()` method instead of the typical while-loop pattern used for left-associative operators.

### Test Results

- All 2,399 tests passing (including new exponentiation tests)
- No regressions from implementation
- TypeScript compilation with zero errors
- Cross-validation confirms native JavaScript parity

### Educational Benefits

- Students learn power operations with visual frame-by-frame execution
- Operator precedence rules reinforced through examples
- Right-associativity demonstrated clearly (uncommon but important concept)
- Natural progression from basic arithmetic to advanced operations

## 2025-10-07: Added const Support in for...of Loops and Error for const in C-Style for Loops

### Overview

Enhanced the JavaScript interpreter to properly support `const` in for...of loops (matching native JavaScript behavior) and added a syntax error for using `const` in C-style for loops (where it would cause runtime errors).

### Changes Applied

**1. Parser Enhancement** (`src/javascript/parser.ts`):

- Modified `forStatement()` to check for both `LET` and `CONST` tokens when detecting for...of loops (line 316)
- Added specific error for `const` in C-style for loop init (lines 353-356)
- Error thrown at parse time with clear educational message

**2. Error Type** (`src/javascript/error.ts`):

- Added `ConstInForLoopInit` syntax error type
- Prevents students from writing code that would fail at runtime

**3. Translation Updates**:

- `system/translation.json`: `"ConstInForLoopInit"`
- `en/translation.json`: Educational message explaining why const doesn't work in C-style loops and suggesting let or for...of

**4. Test Coverage**:

- New test file: `tests/javascript/syntaxErrors/const-in-for-loop.test.ts` (10 tests)
  - Syntax errors for `const` in C-style for loops
  - Successful execution with `let` in C-style for loops
  - Successful execution with `const` in for...of loops (arrays and strings)
  - Successful execution with `let` in for...of loops
- Cross-validation tests added:
  - `tests/cross-validation/javascript/for-of.test.ts`: Added 2 tests for const in for...of
  - `tests/cross-validation/javascript/core/const.test.ts`: Added 1 test for const in for...of

### Supported Syntax

**Valid** (matches native JavaScript):

```javascript
// const in for...of loops (new binding each iteration)
for (const item of [1, 2, 3]) {
  console.log(item);
}

for (const char of "abc") {
  console.log(char);
}

// let in C-style for loops
for (let i = 0; i < 5; i++) {
  console.log(i);
}
```

**Invalid** (syntax error with helpful message):

```javascript
// const in C-style for loop (would fail at i++)
for (const i = 0; i < 5; i++) {
  console.log(i);
}
// Error: "You cannot use 'const' in a C-style for loop..."
```

### Rationale

In JavaScript:

- `for (const i = 0; i < 5; i++)` is invalid because `i++` tries to modify a const variable
- `for (const item of array)` is valid because each iteration creates a new const binding

Catching this at parse time (rather than runtime) provides better educational feedback to students.

### Implementation Notes

- For...of loops currently define loop variables using `environment.define()` without tracking const vs let
- Full const semantics in for...of loop bodies (preventing reassignment) would require tracking variable kind in `ForOfStatement` AST node
- This is deferred to a future enhancement as it's a separate feature from preventing const in C-style loops

### Test Results

- All 2387 tests passing (including 10 new tests)
- No regressions from implementation
- TypeScript compilation with zero errors

## 2025-10-07: Added const Declaration Support

### Overview

Implemented full support for JavaScript `const` declarations, enabling students to declare immutable variable bindings that cannot be reassigned.

### Changes Applied

**1. Statement Structure** (`src/javascript/statement.ts`):

- Modified `VariableDeclaration` class to include `kind` field (`"let" | "const"`)
- Constructor now accepts keyword type to distinguish between let and const

**2. Parser Enhancement** (`src/javascript/parser.ts`):

- Updated `statement()` to handle both `LET` and `CONST` tokens
- Modified `variableDeclaration()` to track declaration kind
- Enforced that const declarations MUST have initializers (syntax error if missing)
- This requirement applies regardless of `requireVariableInstantiation` language feature

**3. Environment Structure** (`src/javascript/environment.ts`):

- Introduced `VariableMetadata` interface: `{ value: JikiObject, isConst: boolean }`
- Changed internal storage from `Map<string, JikiObject>` to `Map<string, VariableMetadata>`
- Updated `define()` to accept `isConst` parameter (defaults to false)
- Updated `update()` to check const status and throw `AssignmentToConstant` error
- This structure allows future extensions (e.g., var support, TDZ tracking)

**4. Executor Implementation** (`src/javascript/executor`):

- Modified `executeVariableDeclaration.ts` to pass `isConst` flag to environment
- Modified `executeAssignmentExpression.ts` to pass location to update() for error reporting
- Environment now throws `AssignmentToConstant` runtime error on const reassignment attempts

**5. Error Types**:

- Added `MissingInitializerInConstDeclaration` syntax error type (`src/javascript/error.ts`)
- Added `AssignmentToConstant` runtime error type (`src/javascript/executor.ts`)
- Updated translation files with appropriate error messages (system and English)

**6. Scanner Update** (`src/javascript/scanner.ts`):

- Removed `CONST` from `unimplementedTokens` list (already in keywords)

**7. Describers** (`src/javascript/describers/describeVariableDeclaration.ts`):

- Updated to distinguish between "constant" and "variable" in descriptions
- Shows appropriate wording based on declaration kind

**8. Evaluation Result** (`src/javascript/evaluation-result.ts`):

- Added `kind` field to `EvaluationResultVariableDeclaration`

### Testing

- Created comprehensive test suite (`tests/javascript/concepts/const.test.ts`) covering:
  - Basic const declarations with various value types
  - Const initializer requirement (syntax error without)
  - Const reassignment prevention (runtime error)
  - Shallow immutability (array/object properties can be modified)
  - Interaction with let declarations
  - Scoping and shadowing behavior
  - Educational descriptions

- Created cross-validation tests (`tests/cross-validation/javascript/core/const.test.ts`)
- Updated scanner test to remove const from unimplemented tokens list

### Key Design Decisions

**1. Shallow Immutability**: Following JavaScript semantics, `const` prevents reassignment but allows mutation:

- `const arr = [1, 2]; arr[0] = 99` → Allowed
- `const arr = [1, 2]; arr = [3, 4]` → Runtime error

**2. Required Initializer**: Const always requires initializer, even when `requireVariableInstantiation: false`

**3. Future-Ready Environment**: `VariableMetadata` structure supports future features:

- `kind: 'let' | 'const' | 'var'` for var support
- `isInitialized: boolean` for temporal dead zone (TDZ)
- Other variable-specific metadata

## 2025-10-07: Added for...of Loop Support

### Overview

Implemented full support for JavaScript `for...of` loops, enabling students to iterate over arrays and strings using modern JavaScript syntax.

### Changes Applied

**1. Token System** (`src/javascript/token.ts`, `src/javascript/scanner.ts`):

- Added `OF` keyword token to support `for...of` syntax

**2. AST Node** (`src/javascript/statement.ts`):

- Created `ForOfStatement` class with fields: `variable`, `iterable`, `body`, `location`

**3. Type System Updates**:

- Added `ForOfStatement` to `NodeType` union (`src/javascript/interfaces.ts`)
- Added `ForOfStatementNotAllowed` syntax error type (`src/javascript/error.ts`)
- Added `ForOfLoopTargetNotIterable` runtime error type (`src/javascript/executor.ts`)

**4. Parser Enhancement** (`src/javascript/parser.ts`):

- Modified `forStatement()` to detect `for...of` pattern via lookahead
- Checks for `let identifier of` sequence
- Falls back to C-style for loop if pattern doesn't match
- Supports node-level restrictions via `allowedNodes` feature flag

**5. Executor Implementation** (`src/javascript/executor/executeForOfStatement.ts`):

- Validates iterable is `JSArray` or `JSString`
- Creates new scope for loop variable
- Handles empty iterables (generates single frame, no iterations)
- Supports `break` and `continue` statements
- Converts string characters to `JSString` objects during iteration
- Generates educational frames for each iteration

**6. Evaluation Result** (`src/javascript/evaluation-result.ts`):

- Added `EvaluationResultForOfStatement` interface with fields: `variable`, `iterable`, `currentElement`, `iteration`

**7. Describer** (`src/javascript/describers/describeForOfStatement.ts`):

- Educational descriptions for empty iterables
- Per-iteration descriptions showing variable assignment
- Uses "list" terminology for arrays (consistent with JikiScript)

**8. Translation Updates**:

- `en/translation.json`: "The for...of loop requires an iterable value (like an array or string), but you provided a {{type}} with value {{value}}."
- `system/translation.json`: "ForOfLoopTargetNotIterable: type: {{type}}: value: {{value}}"

**9. Comprehensive Test Suite**:

- **Concept tests** (`tests/javascript/concepts/for-of-loops.test.ts`): 19 tests covering:
  - Basic array iteration
  - String iteration
  - Empty iterables
  - Nested loops
  - Break/continue behavior
  - Variable scoping
  - Error handling (6 tests for non-iterable types)
- **Cross-validation tests** (`tests/cross-validation/javascript/for-of.test.ts`): 8 tests verifying behavior matches native JavaScript

### Supported Syntax

```javascript
// Array iteration
for (let item of [1, 2, 3]) {
  // ...
}

// String iteration
for (let char of "hello") {
  // ...
}

// With break/continue
for (let num of numbers) {
  if (num === 5) break;
  if (num === 3) continue;
  // ...
}
```

### Error Handling

The implementation provides clear error messages for non-iterable values:

```javascript
for (let x of 42) {
} // Error: requires iterable (number provided)
for (let x of true) {
} // Error: requires iterable (boolean provided)
for (let x of { a: 1 }) {
} // Error: requires iterable (object provided)
```

### Implementation Notes

- Only supports `let` declarations (not `const` or bare identifiers)
- Loop variable is scoped to the loop body
- Arrays are called "lists" in user-facing messages for consistency with JikiScript
- String characters are converted to `JSString` objects during iteration
- Empty iterables generate a single frame showing no iterations will occur

## 2025-10-07: Improved Error Handling for Unclosed Function Calls

### Overview

Enhanced JavaScript parser to provide specific, educational error messages when function call parentheses are not closed, matching the quality of JikiScript's error handling.

### Problem Identified

Previously, `move(\nmove()` would report generic `MissingExpression` error without context about which function or what went wrong. This made debugging difficult for students learning JavaScript.

### Changes Applied

**1. New Error Type** (`src/javascript/error.ts`):

- Added `MissingRightParenthesisAfterFunctionCall` error type
- Replaces generic `MissingExpression` in function call contexts

**2. Parser Enhancement** (`src/javascript/parser.ts` lines 611-642):

- Early detection: Checks for EOL/semicolon immediately after opening `(`
- Extracts function name from callee for error context
- Reports error at function location (not next token location)
- Provides specific error instead of generic "missing expression"

**3. Translation Updates**:

- `en/translation.json`: "Did you forget the closing parenthesis ')' when calling the {{function}} function?"
- `system/translation.json`: "MissingRightParenthesisAfterFunctionCall: function: {{function}}"

**4. Comprehensive Test Suite** (`tests/javascript/syntaxErrors.test.ts`):

- 18 new tests covering all edge cases
- Single line, multi-line, nested calls
- Various function names and argument patterns

### Impact

**Before**:

```
move()
move(
move()
→ Error: MissingExpression (line 2, generic, no context)
```

**After**:

```
move()
move(
move()
→ Error: MissingRightParenthesisAfterFunctionCall (line 2, function: "move")
```

### Test Results

- All 952 JavaScript tests passing
- 18 new syntax error tests added
- Error quality now matches JikiScript

### Educational Benefits

- Students get clear, actionable error messages
- Error points to correct line (where unclosed paren is)
- Function name in context helps identify which call has the issue
- Consistent error quality across all three interpreters

## 2025-10-07: Change requireSemicolons Default to Optional (False)

### Overview

Changed the default value of `requireSemicolons` from `true` to `false`, making semicolons optional by default in JavaScript code. This enables beginners to write simpler code without semicolons initially.

### Motivation

Simplify the learning curve for beginners by removing the requirement to remember semicolons. Students can write natural code like `move()\nmove()` from day one, and semicolons can be introduced as a later educational concept. This aligns with modern JavaScript best practices where ASI (Automatic Semicolon Insertion) handles statement boundaries.

### Changes Applied

**1. Parser Default** (`src/javascript/parser.ts:760`):

- Changed: `const requireSemicolons = this.languageFeatures.requireSemicolons ?? false;`
- Previously: `?? true`

**2. Test Updates**:

- Updated tests in `syntax-errors.test.ts` to explicitly set `requireSemicolons: true` when testing for missing semicolon errors (6 tests)
- Updated tests in `compile.test.ts` to explicitly set `requireSemicolons: true` when testing compilation failures (1 test)
- Reorganized `requireSemicolons.test.ts` to reflect new default behavior (23 tests total)

### Impact

- **All 2,228 tests pass** with the new default
- **Backward compatible**: Code can still require semicolons by setting `requireSemicolons: true`
- **Simpler for beginners**: Students can write code without semicolons by default
- **Educational progression**: Semicolons can be introduced gradually as needed
- **Only 10 tests needed updates** (99.6% of tests unaffected)

### Files Modified

- `src/javascript/parser.ts` - Changed default to `false`
- `tests/javascript/syntax-errors.test.ts` - Updated 6 tests to explicitly require semicolons
- `tests/javascript/compile.test.ts` - Updated 1 test to explicitly require semicolons
- `tests/javascript/language-features/requireSemicolons.test.ts` - Reorganized 23 tests to reflect new default

## 2025-10-06: Add requireSemicolons Language Feature Flag

### Overview

Added a new language feature flag `requireSemicolons` to make semicolons optional in JavaScript code. When disabled, semicolons become optional at statement boundaries (end of line, end of file, closing braces).

### Motivation

Educational progression: Allow students to write simpler code initially (`move()\nmove()`) and introduce semicolons as a later concept. Aligns with many modern JavaScript practices where ASI (Automatic Semicolon Insertion) handles statement boundaries.

### Changes Applied

**1. LanguageFeatures Interface** (`src/javascript/interfaces.ts`):

- Added `requireSemicolons?: boolean` flag
- Default: `true` (semicolons required - backward compatible)
- When `false`: Semicolons optional at statement boundaries

**2. Parser consumeSemicolon Method** (`src/javascript/parser.ts:725-789`):

Updated logic to support optional semicolons:

```typescript
private consumeSemicolon(): Token {
  // If semicolon present, consume it
  if (this.match("SEMICOLON")) { ... }

  // Check flag (defaults to true)
  const requireSemicolons = this.languageFeatures.requireSemicolons ?? true;

  // If required, throw error (unless EOF)
  if (requireSemicolons) {
    if (!this.isAtEnd()) {
      this.error("MissingSemicolon", this.peek().location);
    }
    return this.previous();
  }

  // If optional, allow statement boundaries without semicolon
  const nextToken = this.peek();
  if (nextToken.type === "EOL" || "EOF" || "RIGHT_BRACE" || "RIGHT_PAREN") {
    return this.previous();
  }

  // Still require semicolon on same line
  this.error("MissingSemicolon", this.peek().location);
}
```

**3. Test Suite** (`tests/javascript/language-features/requireSemicolons.test.ts`):

Comprehensive tests covering:

- Default behavior (semicolons required)
- Optional semicolons with `requireSemicolons: false`
- Multiple statements on separate lines without semicolons
- Function calls, return, break, continue without semicolons
- Block statements without semicolons
- Still requiring semicolons on same line
- Explicit `requireSemicolons: true` behavior

### Behavior Details

**When `requireSemicolons: false`:**

- ✅ Allows: `move()\nmove()` (separate lines)
- ✅ Allows: `let x = 1\nlet y = 2` (separate lines)
- ✅ Allows: `if (true) { let x = 1\n}` (before closing brace)
- ❌ Requires: `let x = 1; let y = 2` (same line - semicolon still needed)
- ✅ Still accepts: `let x = 1;` (semicolons when provided)

**When `requireSemicolons: true` (default):**

- All semicolons required (current behavior maintained)
- Ensures backward compatibility

### Files Modified

- `src/javascript/interfaces.ts` - Added `requireSemicolons` flag
- `src/javascript/parser.ts` - Updated `consumeSemicolon()` logic
- `tests/javascript/language-features/requireSemicolons.test.ts` - New test suite

### Impact

- ✅ Backward compatible (defaults to `true`)
- ✅ All existing tests pass
- ✅ Enables educational progression
- ✅ Consistent with modern JavaScript practices

## 2025-10-06: Type System Refactoring to Union Types

### Overview

Completed major refactoring of JavaScript interpreter's type system to use union types instead of base interfaces, aligning with JikiScript's proven architecture and eliminating problematic type casts.

### Motivation

The PR review identified critical type safety issues with break/continue implementation using `as any` casts. Investigation revealed a fundamental architectural difference between JavaScript and JikiScript:

- **JavaScript (Before)**: Used base `EvaluationResult` interface with required `jikiObject` field
- **JikiScript**: Used union types with valueless statements having `jikiObject?: undefined`
- **Problem**: Break/Continue statements don't produce values, forcing use of `as any` to bypass type system

### Changes Applied

**1. Evaluation Result Type System** (`src/javascript/evaluation-result.ts`):

- **Before**: Base interface with required fields

  ```typescript
  export interface EvaluationResult {
    type: string;
    jikiObject: JikiObject;
    immutableJikiObject: JikiObject;
  }
  ```

- **After**: Union types with `never` for valueless statements

  ```typescript
  export interface EvaluationResultBreakStatement {
    type: "BreakStatement";
    jikiObject: never;
    immutableJikiObject: never;
  }

  export type EvaluationResultStatement =
    | EvaluationResultExpressionStatement
    | EvaluationResultVariableDeclaration
    | ...
    | EvaluationResultBreakStatement
    | EvaluationResultContinueStatement;

  export type EvaluationResult =
    | EvaluationResultStatement
    | EvaluationResultExpression;
  ```

**2. Executor Signatures** (`src/javascript/executor.ts`):

- Removed defensive `| null` typing from signatures:
  - `addSuccessFrame(result: EvaluationResult)` (was `EvaluationResult | null`)
  - `executeStatement(statement: Statement): void` (was `EvaluationResult | null`)
  - `addFrame(result?: EvaluationResult)` (was `result?: EvaluationResult | null`)

- Changed `evaluate()` return type to narrow union:
  - `evaluate(expression: Expression): EvaluationResultExpression` (was `EvaluationResult`)
  - Ensures expressions can't accidentally return statement results

**3. Break/Continue Executors**:

- Replaced `as any` casts with type-safe `executeFrame<T>()` pattern:

  ```typescript
  // Before:
  const result = { type: "BreakStatement" };
  executor.addSuccessFrame(statement.location, result as any, statement);

  // After:
  executor.executeFrame<EvaluationResultBreakStatement>(statement, () => {
    return { type: "BreakStatement" } as EvaluationResultBreakStatement;
  });
  ```

- Fixed `ContinueFlowControlError` constructor (removed unused `lexeme` parameter)

**4. Expression Executor Return Types**:

Updated all expression executors to return specific types instead of broad `EvaluationResult`:

- `executeLiteralExpression`: Returns `EvaluationResultLiteralExpression`
- `executeBinaryExpression`: Returns `EvaluationResultBinaryExpression`
- `executeUnaryExpression`: Returns `EvaluationResultUnaryExpression`
- `executeGroupingExpression`: Returns `EvaluationResultGroupingExpression`
- `executeArrayExpression`: Returns `EvaluationResultArrayExpression`

Helper functions also updated to use narrower types (e.g., `EvaluationResultExpression` instead of `EvaluationResult`)

**5. BlockStatement Handling**:

- Confirmed BlockStatements don't generate frames (just create scope)
- Removed premature `EvaluationResultBlockStatement` type that was added
- Removed BlockStatement case from frameDescribers
- Comment in executor confirms: "Block statements should not generate frames, just execute their contents"

### Files Modified

**Core Types**:

- `src/javascript/evaluation-result.ts` - Complete refactor to union types

**Executor**:

- `src/javascript/executor.ts` - Signature updates, added `EvaluationResultExpression` import
- `src/javascript/executor/executeBreakStatement.ts` - Type-safe frame generation
- `src/javascript/executor/executeContinueStatement.ts` - Type-safe frame generation, removed lexeme param
- `src/javascript/executor/executeBlockStatement.ts` - Simplified (no frame generation)

**Expression Executors** (return type updates):

- `executeLiteralExpression.ts`
- `executeBinaryExpression.ts`
- `executeUnaryExpression.ts`
- `executeGroupingExpression.ts`
- `executeArrayExpression.ts`

**Member Expression Handlers** (parameter type updates):

- `executeArrayMemberExpression.ts`
- `executeDictionaryMemberExpression.ts`
- `executeStdlibMemberExpression.ts`

**Describers**:

- `src/javascript/frameDescribers.ts` - Removed unused BlockStatement import and case
- `src/javascript/describers/describeSteps.ts` - Updated import paths
- `src/javascript/describers/describeTemplateLiteralExpression.ts` - Updated import paths

### Benefits Achieved

**Type Safety**:

- Eliminated all `as any` casts from break/continue implementation
- Compiler now enforces that valueless statements can't have `jikiObject` accessed
- Clear distinction between statements and expressions at type level

**Architecture Consistency**:

- JavaScript now matches JikiScript's union type pattern exactly
- Same approach to handling valueless statements
- Consistent across all three interpreters (JikiScript, JavaScript, Python)

**Maintainability**:

- Explicit types make code intent clearer
- Compiler catches more errors at build time
- Easier to understand which result types have values

**Code Quality**:

- No defensive `| null` typing needed
- Narrower types in expression evaluation
- Better IDE autocomplete and type checking

### Test Results

- All 2120 tests passing
- No regressions introduced
- TypeScript compilation with zero errors
- All functionality preserved while improving type safety

### Technical Notes

**Why `never` instead of `?: undefined`**:

While JikiScript uses `jikiObject?: undefined`, we chose `jikiObject: never` because:

- More explicit that field should never be accessed
- Compiler catches accidental access attempts
- Still requires `as EvaluationResultBreakStatement` cast in `executeFrame<T>()` callback
- Trade-off accepted for explicitness

**BlockStatement Frames**:

Initial implementation mistakenly added BlockStatement frames, causing test failures. Investigation confirmed:

- JikiScript doesn't generate BlockStatement frames
- Executor comment explicitly states this intent
- Block statements only create scope, statements inside generate frames
- Removed premature type and frame handling

### Impact

This refactoring establishes JavaScript interpreter on the same type-safe foundation as JikiScript:

- Eliminates last remaining `as any` casts from flow control
- Provides template for future valueless statement types
- Ensures long-term maintainability through stricter typing
- Maintains backward compatibility (all tests pass)

## 2025-10-06: Break and Continue Statements - Bug Fixes

### Overview

Fixed three critical issues in the initial break/continue implementation based on PR review feedback.

### Fixes Applied

**1. ContinueFlowControlError Constructor Inconsistency**

- **Issue**: `ContinueFlowControlError` took `location` and `lexeme` parameters, but `lexeme` was never used
- **Fix**: Removed unused `lexeme` parameter to match `BreakFlowControlError` pattern
- **Files**: `src/javascript/executor/executeContinueStatement.ts`

**2. Type Casting with `as any`**

- **Issue**: Both executors used `addSuccessFrame(result as any)` to bypass type checking
- **Fix**: Replaced with `executeFrame<T>()` pattern following JikiScript's approach
- **Benefit**: Proper type safety without casts, consistent with return statement pattern
- **Files**: `executeBreakStatement.ts`, `executeContinueStatement.ts`

**3. Continue with Update Expression Verification**

- **Issue**: Need to verify `continue` executes update expression before next iteration in for loops
- **Fix**: Added comprehensive test that verifies update runs after continue
- **Test**: New test checks iteration count, accumulated values, and final loop variable value
- **Result**: Confirmed implementation is correct - update expression runs after continue

### Test Updates

**New Test** (`tests/javascript/concepts/break-continue.test.ts`):

- "continue executes update expression in for loop" - Verifies critical behavior:
  - `count` variable increments on every iteration (including when continue is called)
  - Loop variable `i` reaches final value, proving update expression executed
  - Accumulated value `x` correctly skips the continue iteration

**Test Count**: 9 tests total (was 8)

### Technical Details

**Before**:

```typescript
export class ContinueFlowControlError extends Error {
  constructor(public location: Location, public lexeme: string) { ... }
}

executor.addSuccessFrame(statement.location, result as any, statement);
throw new ContinueFlowControlError(statement.location, statement.keyword.lexeme);
```

**After**:

```typescript
export class ContinueFlowControlError extends Error {
  constructor(public location: Location) { ... }
}

executor.executeFrame<EvaluationResultContinueStatement>(statement, () => {
  return { type: "ContinueStatement" };
});
throw new ContinueFlowControlError(statement.location);
```

## 2025-10-06: Break and Continue Statements Implementation

### Overview

Implemented `break` and `continue` statements for JavaScript loops, enabling students to learn loop flow control with Jiki's frame-by-frame visualization.

### Core Implementation

**AST Nodes** (`src/javascript/statement.ts`):

- `BreakStatement`: Represents `break` statements with keyword token and location
- `ContinueStatement`: Represents `continue` statements with keyword token and location

**Flow Control Errors** (`src/javascript/executor/executeBreakStatement.ts`, `executeContinueStatement.ts`):

- `BreakFlowControlError`: Exception class for break flow control with location
- `ContinueFlowControlError`: Exception class for continue flow control with location
- Both use `executeFrame<T>()` pattern for type-safe frame generation

**Execution Modules**:

- `executeBreakStatement.ts`: Creates frame and throws `BreakFlowControlError`
- `executeContinueStatement.ts`: Creates frame and throws `ContinueFlowControlError`
- `executeLoop()`: Helper method that catches `BreakFlowControlError` to exit loops
- `executeLoopIteration()`: Helper method that catches `ContinueFlowControlError` to skip to next iteration

**Executor Updates** (`src/javascript/executor.ts`):

- Added `executeLoop()` and `executeLoopIteration()` helper methods
- Updated `executeForStatement` and `executeWhileStatement` to use flow control helpers
- Added break/continue handling in `withExecutionContext()` for top-level error detection
- Flow control errors bubble up through `executeStatement()` to loop handlers

**Parser Enhancements** (`src/javascript/parser.ts`):

- Added `breakStatement()` method for parsing `break` statements
- Added `continueStatement()` method for parsing `continue` statements
- Node restriction support via `checkNodeAllowed()`

**Scanner Updates** (`src/javascript/scanner.ts`):

- Removed `BREAK` and `CONTINUE` from unimplemented tokens list
- Tokens now fully operational

**Error Types**:

- Runtime: `BreakOutsideLoop`, `ContinueOutsideLoop`
- Syntax: `BreakStatementNotAllowed`, `ContinueStatementNotAllowed` (for node restrictions)

**Frame Generation**:

- Added `describeBreakStatement.ts` - "This line immediately exited the loop"
- Added `describeContinueStatement.ts` - "This line stopped running any more code in this iteration"

**Evaluation Results** (`src/javascript/evaluation-result.ts`):

- Added `EvaluationResultBreakStatement` type (no jikiObject needed)
- Added `EvaluationResultContinueStatement` type (no jikiObject needed)

### Flow Control Architecture

**Exception-Based Flow Control**:

1. Break/continue statements generate success frames
2. Throw flow control exception
3. Exception bubbles through `executeStatement()` calls (re-thrown)
4. Loop helpers (`executeLoop`, `executeLoopIteration`) catch and handle
5. If caught at top level, converted to error frame

**Loop Integration**:

- For loops: `executeLoop()` wraps entire while loop, `executeLoopIteration()` wraps body execution
- While loops: Same pattern as for loops
- Nested loops: Inner loop handlers catch first, outer loops unaffected

### Translation System

**Added translations** in `src/javascript/locales/en/translation.json` and `system/translation.json`:

- `BreakOutsideLoop`: "You used the 'break' keyword, but you're not inside a loop..."
- `ContinueOutsideLoop`: "You used the 'continue' keyword, but you're not inside a loop..."
- `BreakStatementNotAllowed`: "Break statements are not allowed at your current learning level"
- `ContinueStatementNotAllowed`: "Continue statements are not allowed at your current learning level"

### Test Coverage

**New Test Suite** (`tests/javascript/concepts/break-continue.test.ts`): 9 comprehensive tests

**Break Tests**:

- Break in for loop (exits early)
- Break in while loop (exits early)
- Break outside loop generates runtime error

**Continue Tests**:

- Continue in for loop (skips iterations)
- Continue executes update expression in for loop (verifies correct behavior)
- Continue in while loop (skips iterations)
- Continue outside loop generates runtime error

**Nested Loop Tests**:

- Break only exits inner loop
- Continue only affects inner loop

### Impact and Benefits

**Educational Value**:

- Students learn loop flow control with frame-by-frame visualization
- Clear error messages when break/continue used incorrectly
- Nested loop behavior shown visually

**Architecture Consistency**:

- Follows shared flow control pattern from JikiScript
- Parse errors as returned errors, runtime errors as frames
- Frame generation compatible with Jiki UI

**Test Results**:

- All 8 new tests passing
- No regressions in existing 300+ tests

## 2025-10-03: User-Defined Functions Implementation

### Overview

Implemented complete support for user-defined functions in JavaScript, including function declaration and return statements. This enables students to learn function concepts with Jiki's frame-by-frame visualization.

### Core Implementation

**AST Nodes** (`src/javascript/statement.ts`):

- `FunctionDeclaration`: Represents `function` statements with name, parameters, and body
- `ReturnStatement`: Represents `return` statements with optional expression
- `FunctionParameter`: Represents function parameter declarations

**Callables** (`src/javascript/functions.ts`):

- `JSUserDefinedFunction`: Extends `JSCallable` base class for user-defined functions
  - Stores function declaration AST
  - Provides `getDeclaration()` accessor for execution
  - Returns `<function name>` string representation
- `ReturnValue`: Exception class for unwinding call stack on return
  - Contains return value as JikiObject
  - Includes location for error reporting

**Execution Modules**:

- `executeFunctionDeclaration.ts`: Creates `JSUserDefinedFunction` and binds to environment
- `executeReturnStatement.ts`: Evaluates return value and throws `ReturnValue` exception
- `executeCallExpression.ts`: Enhanced to handle user-defined function calls:
  - Creates new environment chained to function's parent (closure support)
  - Binds parameters to argument values
  - Executes function body statements
  - Catches `ReturnValue` exceptions for return flow
  - Returns undefined for functions without explicit return

**Parser Enhancements** (`src/javascript/parser.ts`):

- Added `functionDeclaration()` method for parsing `function` statements
- Handles JavaScript syntax: `function name(params) { body }`
- Validates duplicate parameter names
- Added `returnStatement()` method for parsing `return` statements

**Error Types** (`src/javascript/error.ts`):

- Added function-specific errors: `MissingFunctionName`, `MissingLeftParenthesisAfterFunctionName`, `MissingParameterName`, `MissingRightParenthesisAfterParameters`, `MissingLeftBraceAfterFunctionSignature`, `DuplicateParameterName`, `ReturnOutsideFunction`

**Frame Generation**:

- Added `describeReturnStatement.ts` describer for educational frame descriptions
- Return statements generate frames showing return value or void return

**Evaluation Results** (`src/javascript/evaluation-result.ts`):

- Added `EvaluationResultReturnStatement` type with expression and jikiObject fields

### JavaScript-Specific Implementation Details

**Syntax Handling**:

- JavaScript uses `function name(params) {}` with braces
- Contrast with Python's `def name(params):` with indentation
- Parser consumes LEFT_BRACE after function signature
- Body statements parsed until matching RIGHT_BRACE

**Scope and Closures**:

- Functions create new environment chained to current environment
- Enables proper closure support and scope chain resolution
- Parameters bound to new environment before body execution
- Environment restored after function execution completes

**Return Behavior**:

- Explicit `return value` evaluates expression and returns as JikiObject
- Explicit `return` (no value) returns undefined
- Implicit return (reaching end of function) returns undefined
- All return paths use `ReturnValue` exception for stack unwinding

### Scanner Updates

**Removed from unimplemented tokens** (`src/javascript/scanner.ts`):

- `FUNCTION` token now fully implemented
- `RETURN` token now fully implemented

### Test Coverage

**New Test Suite** (`tests/javascript/functions.test.ts`): 17 comprehensive tests

**Basic Functionality**:

- Simple function definition and call
- Functions with single and multiple parameters
- Return value handling (explicit and implicit)
- Void functions without return statement

**Scope and Closures**:

- Variable access in function scope
- Closure over parent environment variables
- Parameter shadowing of outer variables

**Syntax Error Tests**:

- Missing function name after `function`
- Missing parentheses around parameters
- Missing braces around body
- Duplicate parameter names

**Runtime Error Tests**:

- Wrong number of arguments (too few, too many)
- Return statement outside function
- Undefined function calls

**Complex Scenarios**:

- Nested function calls
- Conditionals inside functions
- Multiple return paths in single function

### Translation System

**Added translations** in `src/javascript/locales/en/translation.json` and `system/translation.json`:

- All function-specific error messages with context placeholders
- Consistent with shared error format pattern

### Impact and Benefits

**Educational Value**:

- Students can learn function declaration and return statements
- Frame-by-frame visualization shows parameter binding and return flow
- Clear error messages guide students through syntax requirements

**Architecture Consistency**:

- Follows shared interpreter architecture patterns exactly
- Parse errors as returned errors, runtime errors as frames
- Frame generation compatible with Jiki UI

**Test Results**:

- All tests passing including 17 new function tests
- No regressions from implementation

### Parallel Implementation

This JavaScript implementation was developed in parallel with the Python user-defined functions implementation (same PR), sharing:

- Common architectural patterns (ReturnValue exception, environment chaining)
- Similar test structure and coverage
- Consistent error handling approach
- Aligned frame generation

### Future Enhancements

Potential additions for future development:

- Function expressions (`const fn = function() {}`)
- Arrow functions (`const fn = () => {}`)
- Default parameter values
- Rest parameters (`...args`)
- Destructuring parameters
- Async functions

This implementation establishes JavaScript functions as a core educational feature with complete visualization support and robust error handling.

## 2025-10-03: Removal of Executor Location Tracking

- **Removed**: `private location: Location` field from JavaScript executor
- **Change**: Error frames now use precise error locations (`error.location`) instead of broad statement locations
- **Implementation**:
  - Removed location tracking state from executor class
  - Removed location setting/resetting in `executeFrame()` wrapper
  - All error creation uses `error.location` for precise error reporting
  - Changed location parameters from `Location | null` to non-nullable `Location`
  - Introduced `Location.unknown` as fallback for unavailable locations
- **Benefits**:
  - Simpler executor state management
  - More precise error reporting pointing to exact sub-expressions
  - Clearer intent with explicit location handling
  - Reduced complexity in error handling code
- **Impact**: Updated approximately 20+ error creation sites across JavaScript executor modules

## 2025-10-03: Compile Function with CompilationResult Pattern

- **Added**: `compile()` function for parse-only validation
- **Implementation**:
  - New `compile()` function in `src/javascript/interpreter.ts`
  - Parses source code without executing it
  - Returns `{ success: true }` on successful compilation
  - Returns `{ success: false, error: SyntaxError }` on parse/syntax errors
- **Shared Types**:
  - Created `src/shared/errors.ts` with:
    - `SyntaxError` interface that all interpreter SyntaxError classes conform to
    - `CompilationResult` discriminated union type for type-safe error handling
  - Exported from main `src/index.ts` for cross-interpreter consistency
- **Benefits**:
  - Type-safe with discriminated union (`success` field)
  - Cleaner API than throwing exceptions or returning different types
  - Consistent structure across all three interpreters
  - Easy to use: `if (result.success) { ... } else { console.error(result.error) }`
- **Use Case**: Allows syntax validation before execution, useful for educational feedback

## 2025-09-24: Nested Objects and Lists Support

- **Added**: Full support for complex nested structures and multiline syntax
- **Parser Changes**:
  - Fixed `parseArray()` to skip EOL tokens after opening bracket, before elements, and before closing bracket
  - Mirrors the EOL handling in `parseDictionary()` for consistency
  - Enables multiline array literals and nested structures
- **Features**:
  - Complex nested patterns like `x[0].something[0]['foo'][5] = 'bar'`
  - Multiline arrays and objects work correctly
  - Deep nesting of arrays and objects
  - Mixed bracket and dot notation in nested structures
  - Dynamic property creation in nested structures
- **Test Coverage**: Comprehensive tests for nested patterns, deep nesting, multiline syntax, and real-world JSON-like structures

## 2025-09-24: Object Property Writing

- **Added**: Support for object property assignment via dot notation and bracket notation
- **Executor Changes**:
  - Extended `executeAssignmentExpression` to handle JSDictionary objects alongside arrays
  - Property keys are converted to strings matching JavaScript semantics
  - Support for both computed (bracket) and non-computed (dot) notation
  - Creates new properties if they don't exist
  - Overwrites existing properties with new values
- **Features**:
  - Dot notation assignment (`obj.name = "value"`)
  - Bracket notation with strings (`obj["name"] = "value"`)
  - Bracket notation with numbers (`obj[42] = "value"`)
  - Bracket notation with variables (`obj[key] = "value"`)
  - Bracket notation with expressions (`obj[prefix + "_id"] = value`)
  - Nested property assignment (`obj.user.profile.name = "new"`)
  - Mixed arrays and objects (`obj.list[0] = value`, `arr[0].prop = value`)
  - Property type changes when overwriting
- **Error Handling**:
  - TypeError when trying to set properties on primitives (number, boolean, string)
  - TypeError when trying to set properties on null or undefined
  - Maintains consistent error reporting with array assignment
- **Test Coverage**: Comprehensive tests for all assignment patterns, property creation, overwriting, and error cases

## 2025-09-24: Object Property Reading

- **Added**: Support for object property access via dot notation and bracket notation
- **Parser Changes**:
  - Enabled DOT token (removed from unimplemented list)
  - Extended `postfix()` to handle both dot notation (`obj.prop`) and bracket notation (`obj["prop"]`)
  - Added EOL token skipping in dictionary parsing for multiline objects
  - Dot notation creates non-computed MemberExpression with string literal
  - Bracket notation creates computed MemberExpression with evaluated expression
- **Executor Changes**:
  - Extended `executeMemberExpression` to handle JSDictionary objects
  - Converts property keys to strings (matching JavaScript semantics)
  - Returns `undefined` for missing properties (JS semantics)
  - Proper error handling for non-object/array property access
- **Error Handling**:
  - TypeError when accessing properties of primitives (number, boolean, string)
  - TypeError when accessing properties of null or undefined
  - Runtime errors properly captured in frames with `status: "ERROR"`
- **Features**:
  - Chained property access (`obj.user.profile.name`)
  - Mixed notation (`obj.data["items"]["item-1"]`)
  - Arrays in objects and objects in arrays
  - Dynamic property access with expressions (`obj[key]`, `obj[5+5]`)
- **Test Coverage**: Comprehensive tests for dot notation, bracket notation, mixed notation, edge cases, and error conditions

## 2025-09-23: Array Element Assignment

- **Added**: Full support for array element assignment (e.g., `arr[0] = value`)
- **Parser Changes**:
  - Modified `AssignmentExpression` to accept `MemberExpression` as target
  - Supports chained assignments like `arr[0][1] = value`
- **Executor Changes**:
  - Extended `executeAssignmentExpression` to handle member expression targets
  - Validates target is an array and index is a valid integer
  - Automatically extends arrays when assigning beyond current length (JS semantics)
  - Fills gaps with `undefined` when extending
- **Error Handling**:
  - TypeError for non-array targets or non-numeric indices
  - IndexOutOfRange for negative indices
  - Proper error frames for runtime errors
- **Reading Behavior**: Out-of-bounds reads return `undefined` (JS semantics)
- **Test Coverage**: Comprehensive tests for basic assignment, chaining, extension, and error cases

# JavaScript Interpreter Evolution History

This document tracks the historical development and changes specific to the JavaScript interpreter.

## List (Array) Index Reading Implementation (January 2025)

### Changes Made

Added support for array index reading (member access) without chaining:

**Features Added**:

- Array element access with bracket notation `arr[index]`
- Comprehensive bounds checking
- Type validation for indices (must be integer numbers)
- Proper error handling for runtime errors

**Implementation Details**:

1. **Expression Class** (`src/javascript/expression.ts`):
   - Added `MemberExpression` class for array indexing
   - Supports computed property access (bracket notation)
   - Future-ready for dot notation with `computed` flag

2. **Parser Updates** (`src/javascript/parser.ts`):
   - Modified `postfix()` method to handle `LEFT_BRACKET` after expressions
   - Parses array index access without chaining (single level only for now)
   - Proper error recovery with `MissingRightBracketInMemberAccess`

3. **Executor Module** (`src/javascript/executor/executeMemberExpression.ts`):
   - Validates object is array (JSArray)
   - Validates property is number (JSNumber)
   - Checks for negative indices
   - Checks for out of bounds access
   - Validates indices are integers (not floats)
   - Returns element with proper cloning for immutability

4. **Evaluation Result** (`src/javascript/evaluation-result.ts`):
   - Added `EvaluationResultMemberExpression` type
   - Includes object and property evaluation results

5. **Describers** (`src/javascript/describers/describeMemberExpression.ts`):
   - Describes array access operations
   - Shows accessed index and resulting value

6. **Error Handling**:
   - `IndexOutOfRange`: For negative or out-of-bounds indices
   - `TypeError`: For non-numeric indices or non-array objects
   - All errors follow RuntimeError pattern for proper frame generation

**Tests**: Comprehensive test coverage in `tests/javascript/arrays.test.ts`

- Valid access cases (first, middle, last elements)
- Variable and expression indices
- Out of bounds errors (negative and too high)
- Non-numeric index errors (strings, floats)
- Non-array access errors

**Chaining Support Added**:

- Full support for chained array access (e.g., `arr[0][1]`, `matrix[i][j]`)
- Parser uses while loop to handle multiple consecutive bracket operations
- Works with nested arrays of any depth
- Supports variable and expression indices in chains

**Tests Added for Chaining**:

- 2D and 3D array access
- Variable indices in chains
- Expression indices in chains
- Error handling in chains (out of bounds, non-array access)
- Mixed data types in nested arrays

**Known Limitations**:

- Only bracket notation, no dot notation yet
- Array modification not implemented

**Next Steps**:

- Implement array element assignment
- Add dot notation for object property access

## Template Literals Implementation (January 2025)

### Changes Made

Added full support for JavaScript template literals (backtick strings with interpolation):

**Features Added**:

- Template literals with backticks `` `text` ``
- String interpolation with `${expression}`
- Multi-line template literals
- Dollar sign literals (e.g., `` `Price: $100` ``)

**Implementation Details**:

1. **Scanner Updates** (`src/javascript/scanner.ts`):
   - Removed `BACKTICK`, `DOLLAR_LEFT_BRACE`, and `TEMPLATE_LITERAL_TEXT` from unimplemented tokens
   - Fixed infinite loop bug when dollar sign appears without interpolation
   - Added logic to include standalone `$` characters in template text

2. **Expression Class** (`src/javascript/expression.ts`):
   - Added `TemplateLiteralExpression` class with `parts` array
   - Parts can be strings (literal text) or Expressions (interpolations)

3. **Parser Updates** (`src/javascript/parser.ts`):
   - Added `parseTemplateLiteral()` method
   - Integrated template literal parsing in `primary()` method
   - Handles nested expressions within `${}` interpolations

4. **Executor Module** (`src/javascript/executor/executeTemplateLiteralExpression.ts`):
   - Evaluates each interpolated expression
   - Converts all values to strings (following JavaScript semantics)
   - Returns combined string result

5. **Describers** (`src/javascript/describers/describeTemplateLiteralExpression.ts`):
   - Describes evaluation of interpolated expressions
   - Shows final combined string result

**Known Limitations**:

- Escape sequences in template literals not fully supported (e.g., `` \` ``)
- Complex escape handling may need future refinement

**Tests**: 24 out of 27 tests passing in `tests/javascript/template-literals.test.ts`

## Strict Equality Operators Implementation (January 2025)

### Changes Made

Added support for strict equality operators (`===` and `!==`) with an `enforceStrictEquality` language feature:

**Features Added**:

- `===` (strict equality - no type coercion)
- `!==` (strict inequality - no type coercion)
- `enforceStrictEquality` language feature (default: true)

**Implementation Details**:

1. **Scanner Updates** (`src/javascript/scanner.ts`):
   - Removed `STRICT_EQUAL` and `NOT_STRICT_EQUAL` from unimplemented tokens list
   - Tokens were already being properly tokenized

2. **Parser Updates** (`src/javascript/parser.ts`):
   - Updated `equality()` method to handle `STRICT_EQUAL` and `NOT_STRICT_EQUAL` tokens
   - Same precedence level as `EQUAL_EQUAL` and `NOT_EQUAL`

3. **Executor Updates**:
   - Added `enforceStrictEquality` to `LanguageFeatures` interface
   - Default set to `true` in executor constructor
   - Added `StrictEqualityRequired` runtime error type
   - Updated `executeBinaryExpression.ts`:
     - When `enforceStrictEquality` is true, using `==` or `!=` throws error
     - `===` and `!==` perform strict equality (no type coercion)
     - Error format: `"StrictEqualityRequired: operator: =="`

4. **Tests** (`tests/javascript/language-features/strictEquality.test.ts`):
   - Comprehensive test coverage for both feature states
   - Tests for strict equality with different types
   - Tests for error cases when loose equality is used with enforcement
   - Tests for both loose and strict equality when feature is disabled

**Rationale**: This feature helps students learn the importance of strict equality in JavaScript by making it the default behavior, while still allowing loose equality when explicitly enabled for educational progression.

## Comparison Operators Implementation (January 2025)

### Changes Made

Added full support for comparison and equality operators to the JavaScript interpreter:

**Operators Added**:

- `>` (greater than)
- `<` (less than)
- `>=` (greater than or equal)
- `<=` (less than or equal)
- `==` (equality with type coercion)
- `!=` (inequality with type coercion)

**Implementation Details**:

1. **Parser Updates** (`src/javascript/parser.ts`):
   - Added `comparison()` method between `addition()` and `equality()` in precedence chain
   - Added `equality()` method between `comparison()` and `logicalAnd()`
   - Proper operator precedence: multiplication → addition → comparison → equality → logical

2. **Executor Updates** (`src/javascript/executor/executeBinaryExpression.ts`):
   - Added cases for all comparison operators in `handleBinaryOperation()`
   - Added `verifyNumbersForComparison()` helper for type checking
   - Comparison operators (`>`, `<`, `>=`, `<=`) require numbers
   - Equality operators (`==`, `!=`) use JavaScript's type coercion

3. **Error Handling**:
   - Added `ComparisonRequiresNumber` runtime error type
   - Comparison operators throw error when used with non-numbers
   - Error format: `"ComparisonRequiresNumber: operator: >: left: string"`

4. **Tests** (`tests/javascript/concepts/comparison.test.ts`):
   - Comprehensive test coverage for all operators
   - Tests for numbers (integers, decimals, negatives)
   - Tests for error cases with non-numbers
   - Tests for operator precedence and complex expressions
   - Tests for equality with type coercion

**Note**: Type coercion for comparison operators will be controlled by feature flags in future updates.

## Major Architecture Alignment (January 2025)

### Background

The JavaScript interpreter was extensively refactored to align with JikiScript's proven architecture patterns, ensuring consistent behavior and UI compatibility across all interpreters.

### Key Changes Made

**Before (Divergent Architecture)**:

- Complex `executeStatementsWithFrames()` function in interpreter
- Manual frame creation scattered throughout interpreter.ts
- Runtime errors returned as `{ error: RuntimeError }`
- Frame management mixed with execution logic
- Inconsistent error handling between parse and runtime errors

**After (Aligned Architecture)**:

- Clean separation: interpreter handles parsing, executor handles execution
- Frame management encapsulated within executor using `addFrame()` methods
- Runtime errors become error frames with `status: "ERROR"`
- Consistent `executeFrame()` wrapper pattern for all operations
- Parse errors as returned errors, runtime errors as frames

### Specific Implementation Changes

**1. Executor (`src/javascript/executor.ts`)**:

- Added `addFrame()`, `addSuccessFrame()`, `addErrorFrame()` methods
- Added `executeFrame()` wrapper for consistent frame generation
- Added `withExecutionContext()` for proper error boundaries
- Now always returns `error: null` (runtime errors become frames)

**2. Interpreter (`src/javascript/interpreter.ts`)**:

- Simplified to single `interpret()` function
- Removed complex `executeStatementsWithFrames()`
- Only handles parse errors as returned errors
- Clean separation between compile and execute phases

**3. Parser (`src/javascript/parser.ts`)**:

- Fixed `consumeSemicolon()` to return token for location tracking
- Fixed ExpressionStatement location to include semicolon in span
- Improved statement location accuracy for error reporting

**4. Tests**:

- Updated error tests to expect error frames instead of returned errors
- Added system language configuration for consistent error messages
- Fixed test expectations to match new error handling pattern

### Impact of Changes

- **Consistency**: JavaScript now matches JikiScript's proven architecture exactly
- **Maintainability**: Clear separation of concerns, easier to extend
- **Testability**: 313 tests passing with improved error handling
- **UI Compatibility**: Proper frame generation ensures UI integration works correctly

## Object System Evolution

### January 2025: File Standardization

- **File Rename**: `jsObjects.ts` → `jikiObjects.ts` for consistency across all interpreters
- **Field Standardization**: Removed duplicate `jsObject` field from `EvaluationResult`, kept only standardized `jikiObject` field

**Before (Duplicate Fields)**:

```typescript
type EvaluationResult = {
  type: string;
  jikiObject: JikiObject;
  jsObject: JikiObject; // ❌ Duplicate field - removed
};
```

**After (Standardized)**:

```typescript
type EvaluationResult = {
  type: string;
  jikiObject: JikiObject; // ✅ Single, consistent field
};
```

### Benefits Achieved

- Eliminated confusion about which field to use
- Consistent with JikiScript and Python interpreters
- Simplified cross-interpreter functionality maintenance

## Language Features Implementation

### Progressive Development

JavaScript interpreter supports configurable language features for educational purposes:

**allowShadowing Feature**:

- Controls whether variables in inner scopes can shadow outer variables
- When `false`: Runtime error "ShadowingDisabled" for shadowing attempts
- When `true`: Normal JavaScript shadowing behavior
- Educational benefit: Helps students understand scoping without confusion

### Implementation Timeline

- Basic expressions and operators (arithmetic, logical, comparison)
- Variable declarations with `let` keyword
- Block statements with lexical scoping
- If/else statement support with comprehensive testing
- Variable assignment operations with scope validation

## Test Coverage Evolution

### Current Test Status

- **313 tests passing** covering comprehensive functionality
- **Syntax Error Tests**: Comprehensive error coverage for invalid syntax
- **Runtime Error Tests**: Variable scoping, type operations, and validation
- **Concept Tests**: Feature-specific testing for variables, blocks, arithmetic
- **Integration Tests**: End-to-end interpretation validation

### Testing Patterns Established

- System language configuration for error message consistency
- Frame-based error validation following shared architecture
- Modular test organization matching executor architecture

## Error System Development

### Error Type Coverage

- **13 Syntax Error types**: Basic parsing and lexical errors
- **4 Runtime Error types**: Variable access, type operations, unsupported features
- Consistent system message format: `"ErrorType: context: {{variable}}"`

### Translation System

- Self-contained translation system with system/en language support
- Educational error messages tailored to JavaScript syntax
- Independent from other interpreters while following shared conventions

## Modular Architecture Implementation

### Executor Pattern

JavaScript follows the established modular executor pattern:

- Individual executor modules for each AST node type
- Consistent interface: `(executor: Executor, node: ASTNode) → EvaluationResult`
- Easy extensibility for new JavaScript features
- Clear separation between execution logic and frame management

### Current Executor Coverage

**Expression Executors**:

- Literal, Binary, Unary, Grouping, Identifier, Assignment expressions

**Statement Executors**:

- Expression statements, Variable declarations, Block statements, If statements

## Historical Context

### Why JavaScript Alignment Was Necessary

- **UI Compatibility**: Ensure consistent frame generation across all interpreters
- **Maintainability**: Eliminate architectural divergence that made maintenance difficult
- **Educational Consistency**: Provide uniform learning experience
- **Testing Reliability**: Establish consistent error handling patterns

### Lessons from Refactoring

- Early alignment prevents architectural divergence
- Consistent error handling is critical for UI integration
- Test coverage must be maintained during refactoring
- Clear separation of concerns improves maintainability

### Current Status

JavaScript interpreter now serves as a reference implementation alongside JikiScript:

- Follows shared architecture patterns exactly
- Maintains JavaScript-specific functionality while ensuring cross-interpreter consistency
- Provides educational JavaScript experience with frame-by-frame visualization
- Supports progressive language learning with configurable features

This evolution establishes JavaScript as a core component of the Jiki educational ecosystem with full architectural consistency.
