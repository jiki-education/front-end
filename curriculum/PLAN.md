# Migration Plan: Sprouting Flower Exercise with DrawExercise Base Class

## Current Branch: `migrate-sprouting-flower`

## Summary of Work Completed

### ✅ Phase 1: DrawExercise Infrastructure (Mostly Complete)

**Completed:**

1. ✅ Created `src/exercises/DrawExercise/` directory structure
2. ✅ Copied helper files from bootcamp (exact copies):
   - `shapes.ts` (243 lines) - Shape classes, SVG rendering functions
   - `utils.ts` (18 lines) - Coordinate conversion (rToA/aToR)
   - `retrievers.ts` (117 lines) - Shape retrieval functions
3. ✅ Adapted `checks.ts` (73 lines):
   - Removed bootcamp-specific imports
   - Removed `assertAllArgumentsAreVariables` (now in interpreter)
   - Kept validation functions: `checkCanvasCoverage`, `checkUniqueColoredRectangles`, etc.
4. ✅ Copied and adapted `DrawExercise.ts` (609 lines):
   - ✅ Changed imports: `@/interpreter/*` → `@jiki/interpreters`
   - ✅ Changed class: `extends Exercise` → `extends VisualExercise`
   - ✅ Changed constructor pattern to match VisualExercise
   - ✅ Added `populateView()` method
   - ✅ Updated ALL drawing methods to use `Shared.*` types and `isNumber()` type guards
   - ✅ Replaced all `instanceof Shared.Number` with `isNumber()` calls (all 10 methods updated)
   - ✅ Commented out `random_number` function (requires language-specific constructor)
   - ⚠️ **HAS TYPE ERRORS**: See issues below

**Not Started:** 5. ❌ Create `src/exercises/DrawExercise/index.ts` export file

### ⚠️ Current Type Errors (from `pnpm typecheck`)

**DrawExercise.ts issues:**

1. **Import errors**:
   - `InterpretResult` not exported from `@jiki/interpreters` (it's in `jikiscript.InterpretResult`)
   - `Shared`, `isNumber`, `isString` export issues (need to verify actual export names)

2. **Property initialization**:
   - `canvas` and `tooltip` not initialized in constructor (declared in `populateView()`)
   - Need to add `!` assertion or initialize in constructor

3. **Method naming**:
   - Line 513: `getCurrentTime()` should be `getCurrentTimeInMs()`

4. **availableFunctions signature mismatch**:
   - VisualExercise expects: `func: (ctx: ExecutionContext) => void`
   - DrawExercise provides: `func: (ctx: ExecutionContext, ...args) => void` (with parameters)
   - This is a fundamental design issue - drawing functions take arguments but VisualExercise doesn't support that

**checks.ts issues:** 5. Parameter `requiredPercentage` has implicit `any` type (line 3)

**retrievers.ts issues:** 6. Parameters `p1`, `p2` in arrow function have implicit `any` type (line 89) 7. Parameters `a`, `b`, `c` in arrow function have implicit `any` type (line 102)

**Architecture Note:**
The user refactored Exercise into VisualExercise and IOExercise. The `availableFunctions` signature mismatch suggests DrawExercise may need special handling since drawing functions require parameters.

### ✅ Phase 2: Sprouting Flower Exercise Files

**Created:**

1. ✅ Created `src/exercises/sprouting-flower/` directory
2. ✅ Created `metadata.json` (2211 bytes) with full instructions and hints

**Empty files (not started):**

- `Exercise.ts` (0 bytes)
- `scenarios.ts` (0 bytes)
- `llm-metadata.ts` (0 bytes)
- `index.ts` (0 bytes)
- `solution.jiki` (0 bytes)
- `solution.javascript` (0 bytes)
- `solution.py` (0 bytes)
- `stub.jiki` (0 bytes)
- `stub.javascript` (0 bytes)
- `stub.py` (0 bytes)

---

## Plan for Remaining Work

### Phase 1: Fix DrawExercise.ts Type Errors

**Status:** ✅ All Jiki type conversions complete, ⚠️ Has compilation errors

**Remaining fixes needed:**

1. **Fix imports** - Correct the import paths for `InterpretResult`, `Shared`, type guards
2. **Fix property initialization** - Add `!` assertions for `canvas` and `tooltip`
3. **Fix method name** - Change `getCurrentTime()` to `getCurrentTimeInMs()`
4. **Fix availableFunctions signature** - Critical design issue:
   - VisualExercise expects: `func: (ctx: ExecutionContext) => void`
   - DrawExercise needs: `func: (ctx: ExecutionContext, ...args) => void`
   - **Solution options**:
     a. Override `availableFunctions` type in DrawExercise
     b. Change VisualExercise to support parameterized functions
     c. Make DrawExercise not extend VisualExercise
5. **Add type annotations** in `checks.ts` and `retrievers.ts` for implicit `any` parameters

**File to create:**

- `src/exercises/DrawExercise/index.ts` - Export all public APIs

### Phase 2: Create SproutingFlowerExercise

**File: `src/exercises/sprouting-flower/Exercise.ts`**

```typescript
import { DrawExercise } from "../DrawExercise";
import metadata from "./metadata.json";

export default class SproutingFlowerExercise extends DrawExercise {
  protected get slug() {
    return metadata.slug;
  }

  // Expose drawing functions (inherited from DrawExercise)
  availableFunctions = [
    {
      name: "rectangle",
      func: this.rectangle.bind(this),
      description: "Draw a rectangle at (x, y) with given width and height"
    },
    {
      name: "circle",
      func: this.circle.bind(this),
      description: "Draw a circle at (x, y) with given radius"
    },
    {
      name: "ellipse",
      func: this.ellipse.bind(this),
      description: "Draw an ellipse at (x, y) with x_radius and y_radius"
    },
    {
      name: "fill_color_hex",
      func: this.fillColorHex.bind(this),
      description: "Set the fill color using a hex color code"
    }
  ];
}
```

### Phase 3: Create Scenarios

**File: `src/exercises/sprouting-flower/scenarios.ts`**

Use `VisualScenario` type with shape retrieval in expectations:

```typescript
expectations(exercise) {
  const ex = exercise as SproutingFlowerExercise;
  return [
    {
      type: "visual" as const,
      pass: ex.getCircleAt(null as any, 50, 89, 0.4) !== undefined,
      actual: ex.getCircleAt(null as any, 50, 89, 0.4) ? "found" : "not found",
      expected: "found",
      errorHtml: "The first Flower Head isn't correct"
    },
    // ... 9 more shape checks
  ];
}
```

**Required validations (from bootcamp `config.json`):**

1. First Flower Head: `circle(50, 89, 0.4)`
2. Final Flower Head: `circle(50, 30, 24)`
3. First Pistil: `circle(50, 89, 0.1)`
4. Final Pistil: `circle(50, 30, 6)`
5. First Stem: `rectangle(49.95, 89, 0.1, 1)`
6. Final Stem: `rectangle(47, 30, 6, 60)`
7. First Left Leaf: `ellipse(49.75, 89.5, 0.2, 0.08)`
8. Final Left Leaf: `ellipse(35, 60, 12, 4.8)`
9. First Right Leaf: `ellipse(50.25, 89.5, 0.2, 0.08)`
10. Final Right Leaf: `ellipse(65, 60, 12, 4.8)`

### Phase 4: Create Solutions

**File: `src/exercises/sprouting-flower/solution.jiki`**

- ⚠️ **CRITICAL**: Copy bootcamp `example.jiki` EXACTLY - do not modify

**Files: `solution.javascript` and `solution.py`**

- Convert using `.context/language-conversion.md`
- Snake_case → camelCase for JS
- Keep snake_case for Python

### Phase 5: Create Stubs

Create starter code for all 3 languages with:

- Initial variable setup comments
- 60-iteration loop structure
- Sky and ground drawing (already provided)
- TODO comments for flower drawing

### Phase 6: Create LLM Metadata

**File: `src/exercises/sprouting-flower/llm-metadata.ts`**

Teaching guidance focusing on:

- Variable relationships (everything calculated from flower center)
- Incremental updates (flower_center_y decreases each iteration)
- Mathematical relationships (stem_width = stem_height / 10)
- Common mistakes (forgetting to update variables, using absolute values)

### Phase 7: Create Exercise Index

**File: `src/exercises/sprouting-flower/index.ts`**

- Import all solutions/stubs
- Document drawing functions in `functions` array
- Export `VisualExerciseDefinition`

### Phase 8: Registrations

1. **Exercise registry** (`src/exercises/index.ts`):

   ```typescript
   "sprouting-flower": () => import("./sprouting-flower")
   ```

2. **LLM metadata registry** (`src/llm-metadata.ts`):

   ```typescript
   import { llmMetadata as sproutingFlowerLLM } from "./exercises/sprouting-flower/llm-metadata";
   // ...
   "sprouting-flower": sproutingFlowerLLM
   ```

3. **Drawing functions in level** (`src/levels/everything.ts`):
   - Add to `allowedStdlibFunctions`: `rectangle`, `circle`, `ellipse`, `fill_color_hex`

### Phase 9: Testing

1. Run `pnpm typecheck` - must pass first
2. Run `pnpm test` - validate all tests pass
3. Manual testing required (visual exercise - needs frontend)

---

## Known Issues to Resolve

### 1. ✅ DrawExercise.ts Type Conversions - COMPLETE

**Status**: All `instanceof Jiki.*` converted to `isNumber()` type guards
**Remaining**: Compilation errors (see Phase 1 above)

### 2. ⚠️ availableFunctions Signature Mismatch - RESOLVED

**Problem**: Drawing functions need parameters but VisualExercise doesn't support them

**Bootcamp Solution**:
In bootcamp, the Exercise base class uses the `ExternalFunction` type from the interpreter:

```typescript
// From bootcamp executor.ts
export type ExternalFunction = {
  name: string
  func: Function  // Generic Function type - accepts any signature!
  description: string
  arity?: Arity
}

// From bootcamp Exercise.ts
public availableFunctions!: ExternalFunction[]
```

The `func: Function` type is generic and accepts any function signature.

**Jiki Curriculum Has This Too**:
`@jiki/interpreters` exports `ExternalFunction` from `shared/interfaces.ts`:

```typescript
export interface ExternalFunction {
  name: string;
  func: Function; // Same as bootcamp!
  description: string;
  arity?: Arity;
}
```

**Solution**:

- Change VisualExercise to use `ExternalFunction` type from `@jiki/interpreters`
- This matches bootcamp's pattern and supports parameterized functions
- DrawExercise can then use the same type

### 3. ✅ Animation Methods - VERIFIED

**Status**: `addAnimation()`, `animateIntoView()`, `animateOutOfView()` all exist in VisualExercise

### 4. ⚠️ random_number Function - COMMENTED OUT

**Status**: Commented out, not needed for sprouting-flower
**Future**: Would need language-specific constructor (jikiscript.Number, javascript.JSNumber, python.PyNumber)

---

## Success Criteria

- [ ] DrawExercise.ts compiles with no type errors
- [ ] All 4 DrawExercise helper files working (shapes, retrievers, checks, utils)
- [ ] DrawExercise index.ts exports all public APIs
- [ ] SproutingFlowerExercise extends DrawExercise correctly
- [ ] All 11 sprouting-flower files created and non-empty
- [ ] Solutions work in all 3 languages (Jiki, JS, Python)
- [ ] LLM metadata registered
- [ ] Exercise registered
- [ ] `pnpm typecheck` passes
- [ ] `pnpm test` passes (or shows expected behavior)
- [ ] Ready for frontend integration testing

---

## Estimated Remaining Work

1. **Fix DrawExercise.ts compilation errors** - 30-45 minutes
   - Fix imports (InterpretResult, Shared, type guards)
   - Add property initialization assertions
   - Fix getCurrentTime → getCurrentTimeInMs
   - **CRITICAL**: Resolve availableFunctions signature (needs architecture decision)
   - Add type annotations to checks.ts and retrievers.ts
2. **Create DrawExercise index.ts** - 5 minutes
3. **Create SproutingFlowerExercise** - 10 minutes
4. **Create scenarios** - 20 minutes (10 shape validations)
5. **Copy/convert solutions** - 30 minutes (copy Jiki, convert to JS/Python)
6. **Create stubs** - 15 minutes
7. **Create LLM metadata** - 15 minutes
8. **Create exercise index** - 10 minutes
9. **Registrations** - 10 minutes
10. **Testing and fixes** - 30-60 minutes

**Total**: ~3-4 hours remaining

**Blocker**: The `availableFunctions` signature mismatch needs to be resolved before proceeding with compilation.
