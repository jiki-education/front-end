---
description: Add a new level to the curriculum
argument-hint: [level name or description of what the level should cover]
---

# Add New Level

I'll help you add a new level to the Jiki curriculum. The user will provide context about what level to create via `$ARGUMENTS`.

## Step 0: Read Context Documentation

Read the level documentation and existing levels:

```bash
cat .context/levels.md
cat .context/exercises.md
```

## Step 1: Understand the Request

Read and analyze whatever the user provided in `$ARGUMENTS` (e.g., a level name, a description of what concepts it should introduce).

## Step 2: Review Existing Levels

Read all existing level files to understand the current progression:

- `src/levels/types.ts` — The `Level` type interface
- `src/levels/index.ts` — The level registry and ordering
- `src/levels/using-functions.ts` — Level 1: Basic function calls
- `src/levels/fundamentals.ts` — Level 2: Literals, identifiers, stdlib functions
- `src/levels/variables.ts` — Level 3: Variables, assignment, arithmetic
- `src/levels/everything.ts` — Catch-all level with all features enabled

Understand what AST nodes and feature flags each level introduces, so the new level fits correctly in the progression.

## Step 3: Discussion with User

**STOP and have a conversation with the user before implementing anything.** Cover:

1. **Position in Progression**: Where does this level fit between existing levels?
   - What level comes before it?
   - What level comes after it?
   - What concepts does it bridge?

2. **Language Features — JavaScript**:
   - Which new AST node types should be allowed? (Must include all nodes from previous levels)
   - Which feature flags should change? (e.g., `allowTruthiness`, `allowTypeCoercion`, etc.)

3. **Language Features — Python**:
   - Which new AST node types should be allowed?
   - Which feature flags should change?

4. **Language Features — Jikiscript**:
   - Any new `allowedStdlibFunctions` to add? (e.g., `concatenate`, `push`, `sort_string`)
   - Any `includeList` or `excludeList` changes?

5. **Metadata**:
   - `title` — Display name for the level
   - `description` — Student-facing description of what they'll learn
   - `taughtConcepts` — Array of strings describing concepts taught at this level (used by LLM proxy)

Wait for the user's responses before proceeding.

## Step 4: Implementation

### 4.1: Create Level File

Create `src/levels/[level-name].ts`:

```typescript
import type { Level } from "./types";

export const [levelName]Level: Level = {
  id: "[level-name]",
  title: "[Level Title]",
  description: "[Student-facing description]",
  taughtConcepts: [/* concepts taught at this level */],

  languageFeatures: {
    jikiscript: {
      languageFeatures: {
        allowedStdlibFunctions: [/* stdlib functions available at this level */]
      }
    },
    javascript: {
      allowedNodes: [
        // Include ALL nodes from previous levels, plus new ones
      ],
      languageFeatures: {
        // Feature flags — later levels override earlier ones
      }
    },
    python: {
      allowedNodes: [
        // Include ALL nodes from previous levels, plus new ones
      ],
      languageFeatures: {
        // Feature flags
      }
    }
  }
};
```

### 4.2: Register in `src/levels/index.ts`

1. Add import: `import { [levelName]Level } from "./[level-name]";`
2. Add to the `levels` array in the correct position (order matters — levels accumulate features):

```typescript
export const levels = [
  usingFunctions,
  fundamentalsLevel,
  // ... insert new level in correct position
  variablesLevel,
  everythingLevel // always last
] as const;
```

### 4.3: Update Exercises

Any exercises that should belong to this level need their `metadata.json` updated:

```json
{
  "levelId": "[level-name]"
}
```

## Step 5: Type Check and Testing

### 5.1: Type Check First

```bash
pnpm typecheck
```

Fix any type errors before running tests.

### 5.2: Run Tests

```bash
pnpm test
```

All tests must pass. Level tests in `tests/levels/` verify:

- Node progression (each level extends previous)
- Feature flag consistency
- Registry completeness

## Step 6: Quality Assurance

Before committing, verify:

- [ ] Level file created at `src/levels/[level-name].ts`
- [ ] Level registered in `src/levels/index.ts` in correct position
- [ ] All nodes from previous levels included (superset principle)
- [ ] Feature flags are consistent with progression (no regression)
- [ ] Jikiscript stdlib functions appropriate for this level
- [ ] `pnpm typecheck` passes
- [ ] `pnpm test` passes
- [ ] `pnpm lint` passes
- [ ] `pnpm format:check` passes

## Step 7: Commit and PR

```bash
git add .
git commit -m "Add [level-name] level

- Introduces [concepts] between [previous-level] and [next-level]
- [Brief description of what's new]
- All tests passing

Co-Authored-By: Claude <noreply@anthropic.com>"
git push -u origin add-level-[level-name]
gh pr create --title "Add [level-name] level" --body "$(cat <<'EOF'
## Summary

Added the **[level-name]** level to the Jiki curriculum.

## Details

- **Position**: Between [previous] and [next] levels
- **New JS nodes**: [list]
- **New Python nodes**: [list]
- **Feature flag changes**: [list]
- **Stdlib additions**: [list]

## Testing

- TypeScript compilation passes
- All level tests pass
- Node progression verified

🤖 Generated with Claude Code
EOF
)"
```

## Common Issues

### Level tests fail with "node not found in previous level"

**Cause:** New level is missing nodes from earlier levels
**Fix:** Include ALL nodes from preceding levels (superset principle)

### Type error on allowedNodes

**Cause:** Invalid AST node name for the language
**Fix:** Check valid node types in `@jiki/interpreters` — use `javascript.NodeType` or `python.NodeType`

### Exercises still using old levelId

**Cause:** Exercises haven't been updated to reference the new level
**Fix:** Update `metadata.json` for exercises that belong to this level
