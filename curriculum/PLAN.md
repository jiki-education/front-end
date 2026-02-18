# Curriculum Completion Plan

## How to Use This Plan

This is a large, multi-step process. **Work through it one step at a time.** Don't try to do everything at once.

The process has two passes:

1. **Pass 1 — Scaffolding:** Get everything into the right place with the right structure. Create all levels, stub out all exercises, fix slugs, wire up registrations. The goal is for every level and exercise to exist and pass tests, even if the exercise content is placeholder. Don't get bogged down perfecting individual exercises during this pass.

2. **Pass 2 — Refinement:** Go through each exercise and level one by one, refining content, polishing scenarios, improving solutions and stubs, and ensuring quality. This is where you make things good.

Focus on completing each phase below before moving to the next. Commit after each meaningful unit of work. **After each step, stop and discuss the results with the user. Only do work you're explicitly instructed to do — don't move ahead to the next step without being told to.**

## Goal

Align this repository with:

1. **The curriculum plan** at `/Users/iHiD/Code/jiki/scripts/curriculum.md` — source of truth for what levels and exercises should exist
2. **The API seed data** at `/Users/iHiD/Code/jiki/api/db/seeds/curriculum.json` — defines the level/lesson structure the app uses, with exercise slugs that must match exactly
3. **The API projects seed** at `/Users/iHiD/Code/jiki/api/db/seeds/projects.json` — defines capstone projects

The aim is to ensure:

- All levels from the curriculum exist here with correct language features
- All exercises exist, work, and are assigned to their correct levels
- Exercise slugs match exactly between this repo and the API seed data
- The API seed data includes all levels and exercises from the curriculum plan
- All tests pass

## Available Skills

You can use these slash commands to do the work:

- **`/add-level [description]`** — Add a new level. Reads existing levels, discusses with the user, creates the level file and registers it.
- **`/add-exercise [description or path]`** — Add a new exercise. Explores base classes, discusses with the user, creates all 11 required files and registers it.
- **`/migrate-exercise [exercise-slug]`** — Migrate an exercise from Bootcamp (in `/Users/iHiD/Code/exercism/website/bootcamp_content`). Copies existing content with minimal changes.

Use `/migrate-exercise` when the exercise exists in the Bootcamp. Use `/add-exercise` when creating something new or when the reference is in the planning repo.

## Status

### Fully Checked

Nothing yet

### Implemented

- `maze-solve-basic` - Basic manual maze solving using only move() turn_left() turn_right()
- `space-invaders-solve-basic` - Basic Space Invaders using sequential move() and shoot() calls
- `fix-wall` - Fix the Wall: draw rectangles to fill holes in a wall (Using Functions level)
- `sunshine` - Sunshine: draw a circle to complete a sun picture (Using Functions level)
- `foxy-face` - Foxy Face: draw triangles to build a geometric fox face (Strings and Colors level)
- `penguin` - Penguin: draw shapes with colors to build a penguin (Strings and Colors level)
- `cloud-rain-sun` - Cloud, Rain & Sun: combine rectangle, circle, and ellipse (Strings and Colors level)
- `jumbled-house` - Jumbled House: rearrange shapes to build a house (Strings and Colors level)
- `golf-rolling-ball-loop` - Golf Rolling Ball Loop: use repeat loop to roll ball 60 times (Repeat Loop level)
- `space-invaders-repeat` - Space Invaders Repeat: repeat loop version of space invaders (Repeat Loop level)
- `snowman` - Snowman: use variables to position snowman parts (Variables level)
- `traffic-lights` - Traffic Lights: use variables to draw traffic light (Variables level)
- `relational-sun` - Relational Sun: use arithmetic to position sun rays (Variables level)
- `relational-snowman` - Relational Snowman: use arithmetic for snowman proportions (Variables level)
- `relational-traffic-lights` - Relational Traffic Lights: use arithmetic for traffic light positioning (Variables level)
- `structured-house` - Structured House: capstone project using variables (Variables level)
- `plant-the-flowers` - Plant the Flowers: track position variable and plant 9 flowers using repeat loop (Basic State level)
- `golf-rolling-ball-state` - Golf Rolling Ball State: track x variable and use move_ball_to(x) in a loop (Basic State level)
- `finish-wall` - Finish the Wall: use repeat loop to add top layer of bricks (Basic State level)
- `rainbow` - Rainbow: use HSL colors to draw rainbow arcs (Basic State level)
- `sunset` - Sunset: animate sky color changes with state (Basic State level)
- `sprouting-flower` - Sprouting Flower: capstone project using state (Basic State level)
- `rainbow-splodges` - Rainbow Splodges: use return values to get colors (Functions That Return Things level)
- `plant-the-flowers-scenarios` - Plant the Flowers Scenarios: multi-scenario version (Functions That Return Things level)
- `cityscape-skyscraper` - Skyscraper: use return values to build skyscraper (Functions That Return Things level)
- `space-invaders-nested-repeat` - Space Invaders Nested Repeat: nested repeat loops to shoot 4 rows of aliens (Functions That Return Things level)
- `cityscape-skyline` - Skyline: nested loops to build a city skyline (Functions That Return Things level)
- `bouncer` - Bouncer: use if statements to check age (Conditionals level)
- `space-invaders-conditional` - Scroll and Shoot: use conditionals to shoot aliens (Conditionals level)
- `bouncer-wristbands` - Bouncer Wristbands: use else/else-if for wristband colors (Conditionals level)
- `digital-clock` - Digital Clock: use conditionals to display time (Conditionals level)
- `bouncer-dress-code` - Bouncer Dress Code: use and/or for complex conditions (Complex Conditionals level)
- `golf-shot-checker` - Shot Checker: use complex conditionals to validate golf shots (Complex Conditionals level)
- `rock-paper-scissors-determine-winner` - Rock Paper Scissors: determine winner using complex conditionals (Complex Conditionals level)
- `maze-automated-solve` - Programmatically Solve a Maze: left-hand rule algorithm with sensing functions (Complex Conditionals level)
- `build-wall` - Build the Wall: nested loops to build a full brick wall with alternating rows (Conditionals and State level)
- `scroll-and-shoot` - Scroll and Shoot: move laser back and forth shooting aliens with state tracking (Conditionals and State level)
- `rainbow-ball` - Rainbow Ball: bouncing ball with rainbow trail using conditionals and state (Conditionals and State level)
- `even-or-odd` - Even or Odd: determine if a number is even or odd using remainder operator (Everything level)
- `collatz-conjecture` - Collatz Conjecture: calculate steps to reach 1 in the Collatz sequence (Everything level)
- `triangle` - Triangle: determine if a triangle is valid and classify as equilateral, isosceles, or scalene (Everything level)
- `maze-turn-around` - Turn Around: define a turn_around() function for maze solving (Make Your Own Functions level)
- `raindrops` - Raindrop Sounds: convert number to raindrop sounds based on divisibility (Everything level)

### Unimplemented

## API Alignment Issues

Changes needed in `/Users/iHiD/Code/jiki/api/db/seeds/curriculum.json`:

### Slug Fixes

- [ ] Rename `fix-the-wall` → `fix-wall` in API seed
- [ ] Rename `finish-the-wall` → `finish-wall` in API seed
- [ ] Rename `cloud-rain-sun-variables` → `cloud-rain-sun` in API seed (and move from Variables to Strings and Colors level)

### Missing Levels

- [ ] Add `functions-that-return-things` level to API seed
- [ ] Add `conditionals` level to API seed
- [ ] Add `conditionals-and-state` level to API seed

### Missing Exercises (levels 6-8)

- [ ] Add exercises for **Functions that return things**: Rainbow Splodges, Plant the Flowers (Scenarios), Shot Checker, Skyscraper
- [ ] Add exercises for **Conditionals**: Scroll and Shoot (if version), Positive/negative/zero, Digital Clock, Leap Year, Shot Checker (ball drop), Rock Paper Scissors, Scroll and Shoot (full L/R), Solve the maze (programmatic)
- [ ] Add exercises for **Conditionals and state**: Scroll and Shoot (stateful version), Build the Wall, Rainbow Ball

## Current State

### Levels

| #   | Curriculum Level             | Front-end Level File                     | API Seed Slug        | Status                                  |
| --- | ---------------------------- | ---------------------------------------- | -------------------- | --------------------------------------- |
| 1   | Using Functions              | `using-functions.ts` + `fundamentals.ts` | `using-functions`    | Merge fundamentals into using-functions |
| 2   | Strings + Colors             | —                                        | `strings-and-colors` | MISSING in front-end                    |
| 3   | Loops (Repeat Loop)          | —                                        | `repeat-loop`        | MISSING in front-end                    |
| 4   | Variables                    | `variables.ts`                           | `variables`          | EXISTS                                  |
| 5   | Basic State                  | —                                        | `basic-state`        | MISSING in front-end                    |
| 6   | Functions that return things | —                                        | —                    | MISSING everywhere                      |
| 7   | Conditionals                 | —                                        | —                    | MISSING everywhere                      |
| 8   | Conditionals and state       | —                                        | —                    | MISSING everywhere                      |
| —   | (catch-all)                  | `everything.ts`                          | —                    | Keep as testing/fallback level          |

**Action: Rename `fundamentals` to `using-functions`** (merge its features into using-functions, then delete fundamentals.ts).

### Exercise Slug Mismatches (API vs Front-end)

These exercises exist in both but with different slugs — **must be reconciled**:

| API Seed Slug     | Front-end Slug | Action Needed |
| ----------------- | -------------- | ------------- |
| `fix-the-wall`    | `fix-wall`     | Align slugs   |
| `finish-the-wall` | `finish-wall`  | Align slugs   |

### Exercises in API Seed — Status in Front-end

**Using Functions level:**

| API Slug                     | Front-end          | Status                                                      |
| ---------------------------- | ------------------ | ----------------------------------------------------------- |
| `maze-solve-basic`           | `maze-solve-basic` | EXISTS                                                      |
| `space-invaders-solve-basic` | —                  | MISSING — new exercise (simple move+shoot, no conditionals) |
| `fix-the-wall`               | `fix-wall`         | IMPLEMENTED (slug mismatch)                                 |
| `sunshine`                   | `sunshine`         | IMPLEMENTED                                                 |

**Strings and Colors level:**

| API Slug        | Front-end       | Status                           |
| --------------- | --------------- | -------------------------------- |
| `foxy-face`     | `foxy-face`     | IMPLEMENTED                      |
| `sun-and-rain`  | —               | MISSING — has bootcamp reference |
| `jumbled-house` | `jumbled-house` | EXISTS                           |
| `penguin`       | `penguin`       | EXISTS                           |

**Repeat Loop level:**

| API Slug                 | Front-end | Status                                                                   |
| ------------------------ | --------- | ------------------------------------------------------------------------ |
| `golf-rolling-ball-loop` | —         | MISSING — new exercise variant                                           |
| `space-invaders-loop`    | —         | MISSING — new exercise variant (repeat loop version of scroll-and-shoot) |

**Variables level:**

| API Slug                   | Front-end          | Status                           |
| -------------------------- | ------------------ | -------------------------------- |
| `cloud-rain-sun-variables` | —                  | MISSING — has bootcamp reference |
| `structured-house`         | `structured-house` | EXISTS                           |
| `maze-variables`           | —                  | MISSING — has bootcamp reference |

**Basic State level:**

| API Slug            | Front-end     | Status                           |
| ------------------- | ------------- | -------------------------------- |
| `finish-the-wall`   | `finish-wall` | EXISTS (slug mismatch)           |
| `golf-rolling-ball` | —             | MISSING — has bootcamp reference |
| `rainbow`           | `rainbow`     | EXISTS                           |
| `sunset`            | `sunset`      | EXISTS                           |

**Projects:**

| API Slug           | Front-end          | Status |
| ------------------ | ------------------ | ------ |
| `sprouting-flower` | `sprouting-flower` | EXISTS |

### Exercises in Curriculum Plan but NOT in API Seed (levels 6-8)

These are from levels that don't exist in the API yet. They need both front-end exercises AND API seed entries:

**Functions that return things:** Rainbow Splodges, Plant the Flowers (Scenarios), Shot Checker, Skyscraper

**Conditionals:** Scroll and Shoot (if version), Positive/negative/zero, Digital Clock, Leap Year, Shot Checker (ball drop), Rock Paper Scissors, Scroll and Shoot (full L/R), Solve the maze (programmatic)

**Conditionals and state:** Scroll and Shoot (stateful version), Build the Wall, Rainbow Ball

### Existing Exercises Not Yet in Curriculum Path

These exist in the front-end but are in the "Unused" section of curriculum.md:

`two-fer`, `driving-test`, `guest-list`, `hamming`, `rna-transcription`, `reverse-string`, `acronym`, `meal-prep`, `chop-shop`, `after-party`, `formal-dinner`, `matching-socks`, `nucleotide-count`, `pangram`, `scrabble-score`, `protein-translation`, `anagram`

## Exercise Variants

Some exercises appear at multiple levels with different complexity. These are **separate exercises with different slugs**, not the same exercise. For example:

- `space-invaders-solve-basic` (Using Functions) — just move + shoot, no loops
- `space-invaders-loop` (Repeat Loop) — use repeat loop to be efficient
- `scroll-and-shoot` (Conditionals) — full version with if/else, direction tracking

- `golf-rolling-ball-loop` (Repeat Loop) — repeat-based ball movement
- `golf-rolling-ball` (Basic State) — state-tracking ball movement

Each variant uses the same base class but has different scenarios, restrictions, and learning goals.

## Approach

### Phase 1: Fix Foundations

1. **Merge `fundamentals` into `using-functions`**: Move stdlib functions and any unique features from `fundamentals.ts` into `using-functions.ts`, delete `fundamentals.ts`, update `src/levels/index.ts`
2. **Fix slug mismatches**: Decide whether to rename in front-end or API, then align

### Phase 2: Add Missing Levels (front-end)

Add levels in order using `/add-level`. Each level inserted in correct position in `src/levels/index.ts`. The `everything` level stays last.

1. `strings-and-colors`
2. `repeat-loop`
3. (variables already exists)
4. `basic-state`
5. `functions-that-return-things`
6. `conditionals`
7. `conditionals-and-state`

After adding levels, update existing exercises to use their correct `levelId` in `metadata.json`.

### Phase 3: Add Missing Exercises (front-end)

For exercises that have bootcamp references, use `/migrate-exercise`.
For new exercises (variants, new concepts), use `/add-exercise`.

Priority order: match the API seed data first (levels 1-5), then curriculum plan extras (levels 6-8).

### Phase 4: Update API Seed Data

Once front-end exercises are ready for levels 6-8:

1. Add new levels to `/Users/iHiD/Code/jiki/api/db/seeds/curriculum.json`
2. Add exercise lessons under each level
3. Add any new projects to `/Users/iHiD/Code/jiki/api/db/seeds/projects.json`

Ensure all exercise `data.slug` values match front-end exercise slugs exactly.

### Phase 5: Verification

- `pnpm typecheck` — all types pass
- `pnpm test` — all tests pass
- `pnpm lint` — clean
- Cross-reference: every exercise `data.slug` in API seed exists in `src/exercises/index.ts`
- Cross-reference: every exercise in `src/exercises/` has correct `levelId`
- Cross-reference against curriculum.md to confirm nothing is missing
