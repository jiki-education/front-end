# Curriculum Completion Plan

## Goal

Align this repository with the curriculum defined in the planning repository at `/Users/iHiD/Code/jiki/scripts/curriculum.md`. That file is the source of truth for what levels and exercises should exist. The aim is to ensure:

1. All levels from the curriculum exist here with correct language features
2. All exercises exist, work, and are assigned to their correct levels
3. All tests pass

## Reference

The curriculum planning file (`/Users/iHiD/Code/jiki/scripts/curriculum.md`) defines:

- Each **h3 heading** is a level
- Each **exercise** listed under a level belongs to that level
- Exercises marked with a file path in `exercises/` have reference implementations in `/Users/iHiD/Code/jiki/scripts/exercises/`

## Available Skills

You can use these slash commands to do the work:

- **`/add-level [description]`** — Add a new level to the curriculum. Reads existing levels, discusses with the user, creates the level file and registers it.
- **`/add-exercise [description or path]`** — Add a new exercise. Explores base classes, discusses with the user, creates all 11 required files and registers the exercise.
- **`/migrate-exercise [exercise-slug]`** — Migrate an exercise from the Bootcamp format (in `/Users/iHiD/Code/exercism/website/bootcamp_content`). Copies existing content with minimal changes, creates all files and registrations.

Use `/migrate-exercise` when the exercise already exists in the Bootcamp. Use `/add-exercise` when creating something new or when the reference is in the planning repo rather than the Bootcamp.

## Current State

### Levels We Have

| Level File           | Level ID          | Notes                                                                |
| -------------------- | ----------------- | -------------------------------------------------------------------- |
| `using-functions.ts` | `using-functions` | Matches curriculum                                                   |
| `fundamentals.ts`    | `fundamentals`    | Does not map to a curriculum level — may need renaming/restructuring |
| `variables.ts`       | `variables`       | Matches curriculum                                                   |
| `everything.ts`      | `everything`      | Catch-all, not a real curriculum level                               |

### Levels We Need (from curriculum.md)

1. **Using Functions** — exists
2. **Strings + Colors** — MISSING
3. **Loops** — MISSING
4. **Variables** — exists
5. **Basic State** — MISSING
6. **Functions that return things** — MISSING
7. **Conditionals** — MISSING
8. **Conditionals and state** — MISSING

### Exercises We Have

These exercises exist and are implemented:

| Exercise           | Current levelId | Curriculum Level                      |
| ------------------ | --------------- | ------------------------------------- |
| `maze-solve-basic` | everything      | Using Functions                       |
| `fix-wall`         | everything      | Using Functions                       |
| `penguin`          | everything      | Strings + Colors                      |
| `jumbled-house`    | everything      | Strings + Colors                      |
| `structured-house` | everything      | Variables                             |
| `finish-wall`      | everything      | Basic State                           |
| `rainbow`          | everything      | Basic State                           |
| `sunset`           | everything      | Basic State                           |
| `sprouting-flower` | everything      | Basic State (project)                 |
| `scroll-and-shoot` | everything      | Conditionals / Conditionals and state |
| `build-wall`       | everything      | Conditionals and state                |

These exercises exist but are in the "Unused" section of curriculum.md (not yet placed in main path):

`two-fer`, `driving-test`, `guest-list`, `hamming`, `rna-transcription`, `reverse-string`, `acronym`, `meal-prep`, `chop-shop`, `after-party`, `formal-dinner`, `matching-socks`, `nucleotide-count`, `pangram`, `scrabble-score`, `protein-translation`, `anagram`

### Exercises We Need (from curriculum.md main path, not yet implemented)

**Using Functions:**

- Space Invaders (move, shoot) — new visual exercise
- Sunshine — new visual exercise (circle drawing)

**Strings + Colors:**

- Foxy Face — has bootcamp reference
- Cloud, Rain and Sun — has bootcamp reference

**Loops:**

- Golf Rolling Ball Loop — has bootcamp reference
- Move() 5 times — needs design
- Space Invaders Scroll and Shoot (repeat loop version) — variant of existing

**Variables:**

- Foxy Face (Use Variables) — has bootcamp reference
- Traffic Light — has bootcamp reference
- Maze with Variables — has bootcamp reference
- Cloud, Rain and Sun (Variables) — has bootcamp reference
- Traffic Light (Arithmetic) — has bootcamp reference

**Basic State:**

- Plant the Flowers — has bootcamp reference
- Rolling Ball — has bootcamp reference

**Functions that return things:**

- Rainbow Splodges — has bootcamp reference
- Plant the Flowers (Scenarios) — has bootcamp reference
- Shot Checker — has bootcamp reference
- Skyscraper — has bootcamp reference

**Conditionals:**

- Positive/negative/zero — has bootcamp reference
- Digital Clock — has bootcamp reference
- Leap Year — has bootcamp reference
- Shot Checker (ball drop) — has bootcamp reference
- Rock Paper Scissors — has bootcamp reference
- Solve the maze (programmatic) — has bootcamp reference

**Conditionals and state:**

- Rainbow Ball — has bootcamp reference

## Approach

### Phase 1: Levels

Add missing levels in order using `/add-level`. Each level should be inserted in the correct position in the `levels` array in `src/levels/index.ts`. The `everything` level should always remain last.

After adding levels, update existing exercises to use their correct `levelId` in `metadata.json`.

### Phase 2: Exercises with Bootcamp References

For exercises that have reference implementations in the Bootcamp, use `/migrate-exercise`.

### Phase 3: New Exercises

For exercises that don't have Bootcamp references, use `/add-exercise` with context from the planning repo's reference files.

### Phase 4: Level Assignment

Ensure every exercise's `metadata.json` has the correct `levelId` matching its position in the curriculum.

### Phase 5: Verification

- `pnpm typecheck` — all types pass
- `pnpm test` — all tests pass
- `pnpm lint` — clean
- Cross-reference against curriculum.md to confirm nothing is missing
