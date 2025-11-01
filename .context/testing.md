# Testing

## Overview

The project uses two testing approaches:

- **Unit/Integration Tests**: Jest with React Testing Library for component and logic testing
- **E2E Tests**: Puppeteer with Jest for full browser automation testing

## Test Structure

### Unit Tests

- **Location**: `tests/unit/`
- **Naming Convention**: `[feature].test.tsx` or `[feature].test.ts`
- **Examples**:
  - `tests/unit/AnimationTimeline.test.ts`
  - `tests/unit/components/coding-exercise/Scrubber.test.tsx`
  - `tests/unit/components/coding-exercise/scrubber/ScrubberInput.test.tsx`
- **Important**: All unit tests MUST be placed in the `tests/unit/` directory, not alongside source files
- **Directory Structure**: Match the source directory structure within `tests/unit/`

### Integration Tests

- **Location**: `tests/integration/`
- **Naming Convention**: `[feature].test.tsx` or `[feature].test.ts`
- **Example**: `tests/integration/home.test.tsx`

### E2E Tests

- **Location**: `tests/e2e/`
- **Naming Convention**: `[feature].test.ts`
- **Examples**: `tests/e2e/home.test.ts`, `tests/e2e/navigation.test.ts`

#### E2E Test Best Practices

**IMPORTANT: Never use `waitUntil: "networkidle2"`**

❌ **DON'T** use `networkidle2`:

```typescript
// BAD - Slow and unreliable
await page.goto(url, { waitUntil: "networkidle2" });
await page.waitForNavigation({ waitUntil: "networkidle2" });
```

✅ **DO** use `waitForSelector()`:

```typescript
// GOOD - Fast and explicit
await page.goto(url);
await page.waitForSelector("h1"); // Wait for specific content
```

**Why**:

- `networkidle2` waits for network idle, but **doesn't guarantee React has rendered**
- Auth checks complete instantly (synchronous localStorage), so network is idle before UI updates
- `waitForSelector()` waits for the exact element you need
- Much faster and more reliable in practice

**Pattern for navigation**:

```typescript
// Navigate to new page
await page.click('a[href="/some-page"]');
await page.waitForSelector("h1"); // Wait for page-specific content

// NOT
await page.waitForNavigation({ waitUntil: "networkidle2" }); // ❌ Slow and unreliable
```

## Configuration

### Unit Test Configuration (`jest.config.mjs`)

- Uses Next.js Jest configuration as base
- Test environment: `jest-environment-jsdom` for DOM testing
- Module mapping: `@/*` resolves to project root
- Setup file: `jest.setup.js` for test environment configuration

### E2E Test Configuration

- **Jest Config**: `jest.e2e.config.mjs` - Separate Jest configuration for E2E tests
- **Puppeteer Config**: `jest-puppeteer.config.js` - Browser launch settings
- **Test Runner**: `scripts/run-e2e-tests.js` - Manages shared dev server for all tests
- Test environment: `jest-environment-puppeteer`
- Shared dev server on port 3070 for all tests (started once, shared across test files)
- Headless mode by default (set `HEADLESS=false` for debugging)

#### E2E Performance Optimization

E2E tests use a custom runner script that:

1. Starts a single Next.js dev server on port 3070 before tests
2. Runs all test files against this shared server
3. Automatically cleans up the server and port after tests complete
4. Handles interrupts gracefully with proper cleanup

This shared-server approach dramatically improves test speed by eliminating per-test-file server startup overhead (from ~20s per test file to ~2-5s).

### TypeScript Support

- Type definitions: `jest-dom.d.ts` provides types for jest-dom matchers
- Full TypeScript support in all test files

## Running Tests

### Important: Always Check TypeScript After Tests

**After running tests, ALWAYS check for TypeScript errors by running:**

```bash
npx tsc --noEmit
```

**Note**: Do NOT use `pnpm run build` during development as it can cause Turbopack cache conflicts and ENOENT errors. Use `npx tsc --noEmit` for type checking only.

### Unit/Integration Tests

```bash
pnpm test        # Run unit tests once
pnpm test:watch  # Run unit tests in watch mode
```

### E2E Tests

```bash
pnpm test:e2e          # Run E2E tests with shared server (fast)
pnpm test:e2e:watch    # Run E2E tests in watch mode
pnpm test:e2e:headful  # Run E2E tests with visible browser (debugging)

# Run specific test files
pnpm test:e2e -- tests/e2e/home.test.ts
```

### All Tests

```bash
pnpm test:all    # Run both unit and E2E tests
```

## Writing Tests

### Unit Test Structure

```typescript
import { render, screen } from '@testing-library/react'
import ComponentName from '@/path/to/component'

describe('Component Name', () => {
  it('renders without crashing', () => {
    render(<ComponentName />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })
})
```

### E2E Test Structure

```typescript
describe("Feature E2E", () => {
  // IMPORTANT: Avoid using networkidle2 with beforeEach as it can cause timeouts
  // Instead, wait for specific elements to appear
  beforeEach(async () => {
    await page.goto("http://localhost:3061/test-page");
    await page.waitForSelector('[data-testid="container"]', { timeout: 5000 });
  });

  it("performs user interaction", async () => {
    await page.click('button[type="submit"]');
    await page.waitForNavigation();
    const result = await page.$eval(".result", (el) => el.textContent);
    expect(result).toContain("Success");
  });
});
```

#### E2E Test Lifecycle Hooks

**Important Discovery**: Using `beforeEach` with `waitUntil: "networkidle2"` can cause test timeouts. Instead:

- **For test isolation**: Use `beforeEach` without `waitUntil` parameter, then wait for specific elements
- **For single test setup**: Use `beforeAll` with `waitUntil: "networkidle2"` if needed
- **Best practice**: Always wait for specific elements rather than network idle state

Example patterns:

```typescript
// ✅ GOOD: beforeEach without networkidle2
beforeEach(async () => {
  await page.goto("http://localhost:3061/test-page");
  await page.waitForSelector('[data-testid="container"]');
});

// ❌ BAD: Can cause timeouts
beforeEach(async () => {
  await page.goto("http://localhost:3061/test-page", {
    waitUntil: "networkidle2"
  });
});

// ✅ OK: beforeAll with networkidle2 (for non-repeating setup)
beforeAll(async () => {
  await page.goto("http://localhost:3061", {
    waitUntil: "networkidle2"
  });
});
```

### E2E Test Page Setup Patterns

When creating test pages for E2E tests, follow the same patterns used in production components for consistency and reliability:

#### Orchestrator Initialization Pattern

Test pages should initialize the Orchestrator following the same pattern as the CodingExercise page:

```typescript
// ✅ CORRECT: Use useRef to ensure single orchestrator instance
export default function TestPage() {
  // Create orchestrator once using useRef (prevents re-creation on re-renders)
  const orchestratorRef = useRef<Orchestrator>(
    new Orchestrator(
      "test-unique-id",
      `// Initial code for testing`
    )
  );
  const orchestrator = orchestratorRef.current;

  // Use the orchestrator store hook
  const { currentTest, breakpoints, foldedLines } = useOrchestratorStore(orchestrator);

  // Initialize test state in useEffect
  useEffect(() => {
    const frames = createTestFrames();
    const testState = {
      frames,
      time: 0,
      currentFrame: frames[0],
      // ... other test state
    };

    orchestrator.setCurrentTest(testState);
    orchestrator.setBreakpoints([2, 4, 6]);

    // Expose to window for E2E test access
    (window as any).testOrchestrator = orchestrator;

    return () => {
      delete (window as any).testOrchestrator;
    };
  }, [orchestrator]);

  return (
    <div data-testid="test-container">
      {/* Test UI components */}
    </div>
  );
}
```

#### Key Patterns for E2E Test Pages

1. **Singleton Orchestrator**: Always use `useRef` to create a single orchestrator instance
2. **Store Hook Usage**: Use `useOrchestratorStore(orchestrator)` to access state
3. **Window Exposure**: Expose the orchestrator on window for E2E test manipulation
4. **Cleanup**: Remove window references in useEffect cleanup
5. **Test IDs**: Use `data-testid` attributes for reliable element selection

#### E2E Test Structure for Orchestrator-based Tests

```typescript
describe("Feature E2E", () => {
  beforeEach(async () => {
    await page.goto("http://localhost:3061/test/feature-page");
    await page.waitForSelector('[data-testid="test-container"]');
  });

  it("should interact with orchestrator state", async () => {
    // Access the orchestrator through window
    await page.evaluate(() => {
      const orchestrator = (window as any).testOrchestrator;
      orchestrator.setBreakpoints([1, 3, 5]);
      orchestrator.setCurrentTestTime(300);
    });

    // Verify UI updates
    const breakpoints = await page.$eval('[data-testid="breakpoints"]', (el) => el.textContent);
    expect(breakpoints).toBe("1, 3, 5");
  });
});
```

## TypeScript Testing Patterns

When writing tests with TypeScript strict mode enabled, use these patterns:

### Accessing Private/Protected Properties

```typescript
// Use bracket notation for testing protected class members
expect(orchestrator["_cachedCurrentFrame"]).toBeUndefined();
orchestrator["_cachedCurrentFrame"] = mockFrame;
```

### Modifying Readonly Properties

```typescript
// Use Object.defineProperty for readonly DOM/object properties
Object.defineProperty(mockView.state!.doc, "length", {
  value: 2000,
  writable: true,
  configurable: true
});

// For DOM elements
Object.defineProperty(element, "clientHeight", {
  value: 800,
  writable: true,
  configurable: true
});
```

### Type Casting for Mocks

```typescript
// Use 'as unknown as Type' for complex type conversions
const mockOrchestrator = {
  store,
  getStore: () => store
} as unknown as Orchestrator;

// For library mocks (e.g., marked)
(marked.parse as unknown as jest.Mock).mockReturnValue("<p>HTML</p>");
```

### Complete Mock Objects

```typescript
// Provide all required properties for strict types
mockView.state!.doc.lineAt = jest.fn(() => ({
  number: 3,
  from: 100,
  to: 149,
  text: "line content",
  length: 49 // All Line properties required
}));

// For BlockInfo type
mockView.lineBlockAt = jest.fn(() => ({
  from: 0,
  to: 100,
  top: 0,
  bottom: 20,
  height: 20,
  length: 100,
  type: "text" as any, // Cast to any for complex union types
  widget: null,
  widgetLineBreaks: 0
}));
```

### Non-null Assertions

```typescript
// Use ! when you know the value exists
const element = array[0]!; // Assert element exists
const result = object.method!(); // Assert method exists
```

### Centralized Mock Utilities

The project provides centralized mock utilities in `tests/mocks/`:

- **`createMockFrame(timeInMicroseconds, overrides?)`** - Creates mock Frame objects with time and optional property overrides
- **`createMockTestResult(overrides?)`** - Creates mock TestResult with optional property overrides
- **`createMockOrchestrator()`** - Creates mock Orchestrator instances for testing
- **`createMockOrchestratorStore(overrides?)`** - Creates mock Zustand stores with optional state overrides
- **`createMockAnimationTimeline(overrides?)`** - Creates mock anime.js timeline objects
- **`createMockExercise(overrides?)`** - Creates mock ExerciseDefinition objects
- **`createMockTask(overrides?)`** - Creates mock Task objects
- **`createMockScenario(overrides?)`** - Creates mock Scenario objects
- **`createMockTestSuiteResult(tests)`** - Creates mock TestSuiteResult with array of test results

Use these utilities to maintain consistency across tests:

```typescript
import { createMockFrame, createMockTestResult, createMockOrchestratorStore } from "@/tests/mocks";

const frames = [
  createMockFrame(0, { line: 1 }),
  createMockFrame(100000, { line: 2 }),
  createMockFrame(200000, { line: 3 })
];
const testResult = createMockTestResult({ frames, slug: "test-1" });
const store = createMockOrchestratorStore({
  currentTestTime: 150000,
  currentTest: testResult,
  foldedLines: [2, 3]
});
```

### Best Practices

1. **Test user behavior, not implementation details**
2. **Use semantic queries** (getByRole, getByLabelText) over test IDs when possible
3. **Use `data-testid` attributes for test selectors** when semantic queries aren't sufficient
   - Example: `<div data-testid="scrubber">` can be queried with `screen.getByTestId('scrubber')`
4. **Group related tests** using `describe` blocks
5. **Keep tests focused** - one assertion per test when possible
6. **Use descriptive test names** that explain what is being tested
7. **E2E tests should test critical user journeys**
8. **Keep E2E tests independent** - each test should be able to run in isolation
9. **Component test organization**:
   - Test parent components for integration behavior
   - Test child components for specific functionality
   - Use helper functions to create mock data consistently
10. **Mock external dependencies** properly:
    - Use `jest.mock()` for module mocking
    - Create reusable mock factories for complex objects
11. **Test component event handlers** to ensure functions are called with correct arguments
12. **Accessing private/protected properties in tests**:
    - Use bracket notation `object['privateProperty']` to access private/protected class members
    - This allows testing internal state without modifying production code
    - Example: `orchestrator['_cachedCurrentFrame']` instead of `orchestrator._cachedCurrentFrame`
13. **E2E test element selection**:
    - Use `page.$$` to select multiple elements (returns array of ElementHandle)
    - Use `page.$` to select a single element (returns ElementHandle or null)
    - Example: `const buttons = await page.$$('button.action')` to get all action buttons

## CI/CD Integration

### GitHub Actions

Four separate workflows run in parallel for better performance and clarity:

- **Formatting** (`.github/workflows/formatting.yml`): Checks code style with Prettier
- **Unit Tests** (`.github/workflows/unit-tests.yml`): Runs linting and Jest unit tests with coverage
- **E2E Tests** (`.github/workflows/e2e-tests.yml`): Runs Puppeteer browser automation tests
- **Type Check** (`.github/workflows/typecheck.yml`): Validates TypeScript types across the codebase

#### Important CI Notes

- **Ubuntu Compatibility**: Workflows use `ubuntu-latest`
- **Jest Command Syntax**: Use `pnpm run test --coverage --ci` (not `pnpm test -- --coverage --ci`) to avoid flags being interpreted as test patterns
- **Node Versions**: Tests run on Node 20.x and 22.x matrix

### Git Hooks

- **Pre-commit**: Runs only unit tests (not E2E) to keep commits fast
- Configured in `.husky/pre-commit`

## Dependencies

### Unit Testing

- `jest`: Test runner
- `@testing-library/react`: React component testing utilities
- `@testing-library/jest-dom`: Custom Jest matchers for DOM assertions
- `jest-environment-jsdom`: Browser-like environment for tests

### E2E Testing

- `puppeteer`: Headless Chrome automation
- `jest-puppeteer`: Jest preset for Puppeteer integration
- `ts-jest`: TypeScript support for Jest
