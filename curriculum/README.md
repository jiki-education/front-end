# Jiki Curriculum

TypeScript library that defines all exercises and learning content for the Jiki platform.

## Development Setup

After cloning the repository, run this command once to prevent CSS watch file changes from being committed:

```bash
git update-index --assume-unchanged src/css_last_touched.ts
```

This file is automatically updated by the CSS watcher during development to trigger hot module reloading in the frontend, but those local changes should not be committed.

## Development

```bash
pnpm run dev    # Watch TypeScript and CSS files
pnpm run build  # Build the package
pnpm run test   # Run tests
```

See [CLAUDE.md](./CLAUDE.md) for detailed documentation about the curriculum structure and how to create exercises.

## Curriculum

This is the canonical curriculum structure. Each level contains a sequence of video and exercise lessons.

```json
[
  {
    "level": "using-functions",
    "lessons": [
      { "type": "video", "slug": "welcome-to-jiki" },
      { "type": "exercise", "slug": "maze-solve-basic" },
      { "type": "video", "slug": "using-functions" },
      { "type": "exercise", "slug": "space-invaders-solve-basic" },
      { "type": "video", "slug": "functions-taking-inputs" },
      { "type": "exercise", "slug": "fix-wall" },
      { "type": "exercise", "slug": "sunshine" }
    ]
  },
  {
    "level": "strings-and-colors",
    "lessons": [
      { "type": "video", "slug": "strings-and-colors" },
      { "type": "exercise", "slug": "foxy-face" },
      { "type": "exercise", "slug": "penguin" },
      { "type": "exercise", "slug": "cloud-rain-sun" },
      { "type": "exercise", "slug": "jumbled-house" }
    ]
  },
  {
    "level": "repeat-loop",
    "lessons": [
      { "type": "video", "slug": "repeat-loop" },
      { "type": "exercise", "slug": "golf-rolling-ball-loop" },
      { "type": "exercise", "slug": "space-invaders-repeat" }
    ]
  },
  {
    "level": "variables",
    "lessons": [
      { "type": "video", "slug": "creating-using-variables" },
      { "type": "exercise", "slug": "snowman" },
      { "type": "exercise", "slug": "traffic-lights" },
      { "type": "video", "slug": "arithmetic-and-variables" },
      { "type": "exercise", "slug": "relational-sun" },
      { "type": "exercise", "slug": "relational-snowman" },
      { "type": "exercise", "slug": "relational-traffic-lights" },
      { "type": "project", "slug": "structured-house" }
    ]
  },
  {
    "level": "basic-state",
    "lessons": [
      { "type": "video", "slug": "updating-variables" },
      { "type": "exercise", "slug": "plant-the-flowers" },
      { "type": "exercise", "slug": "golf-rolling-ball-state" },
      { "type": "exercise", "slug": "finish-wall" },
      { "type": "video", "slug": "colors-hsl-rgb" },
      { "type": "exercise", "slug": "rainbow" },
      { "type": "exercise", "slug": "sunset" },
      { "type": "project", "slug": "sprouting-flower" }
    ]
  },
  {
    "level": "functions-that-return-things",
    "lessons": [
      { "type": "video", "slug": "functions-that-return-things" },
      { "type": "exercise", "slug": "rainbow-splodges" },
      { "type": "video", "slug": "scenarios" },
      { "type": "exercise", "slug": "plant-the-flowers-scenarios" },
      { "type": "exercise", "slug": "cityscape-skyscraper" },
      { "type": "video", "slug": "loops-in-loops" },
      { "type": "exercise", "slug": "space-invaders-nested-repeat" },
      { "type": "exercise", "slug": "cityscape-skyline" }
    ]
  },
  {
    "level": "conditionals",
    "lessons": [
      { "type": "video", "slug": "if-statements" },
      { "type": "exercise", "slug": "bouncer" },
      { "type": "exercise", "slug": "space-invaders-conditional" },
      { "type": "video", "slug": "else-and-else-if" },
      { "type": "exercise", "slug": "bouncer-wristbands" },
      { "type": "exercise", "slug": "digital-clock" }
    ]
  },
  {
    "level": "complex-conditionals",
    "lessons": [
      { "type": "video", "slug": "and-and-or" },
      { "type": "exercise", "slug": "bouncer-dress-code" },
      { "type": "exercise", "slug": "golf-shot-checker" },
      { "type": "video", "slug": "modulo-and-not" },
      { "type": "exercise", "slug": "rock-paper-scissors-determine-winner" },
      { "type": "video", "slug": "repeat-without-input" },
      { "type": "exercise", "slug": "maze-automated-solve" }
    ]
  },
  {
    "level": "conditionals-and-state",
    "lessons": [
      { "type": "exercise", "slug": "build-wall" },
      { "type": "exercise", "slug": "scroll-and-shoot" },
      { "type": "exercise", "slug": "rainbow-ball" }
    ]
  },
  {
    "level": "make-your-own-functions",
    "lessons": [
      { "type": "exercise", "slug": "maze-turn-around" },
      { "type": "exercise", "slug": "maze-walk" },
      { "type": "exercise", "slug": "look-around" },
      { "type": "exercise", "slug": "battle-procedures" },
      { "type": "exercise", "slug": "even-or-odd" },
      { "type": "exercise", "slug": "triangle" },
      { "type": "exercise", "slug": "collatz-conjecture" },
      { "type": "exercise", "slug": "leap" }
    ]
  },
  {
    "level": "string-manipulation",
    "lessons": [
      { "type": "exercise", "slug": "hello" },
      { "type": "exercise", "slug": "three-letter-acronym" },
      { "type": "exercise", "slug": "two-fer" },
      { "type": "exercise", "slug": "hamming" },
      { "type": "exercise", "slug": "raindrops" }
    ]
  },
  {
    "level": "string-iteration",
    "lessons": [
      { "type": "exercise", "slug": "reverse-string" },
      { "type": "exercise", "slug": "tile-rack" },
      { "type": "exercise", "slug": "sign-price" },
      { "type": "exercise", "slug": "driving-test" }
    ]
  },
  {
    "level": "methods-and-properties",
    "lessons": [
      { "type": "exercise", "slug": "pangram" },
      { "type": "exercise", "slug": "nucleotide" },
      { "type": "exercise", "slug": "isbn-verifier" },
      { "type": "project", "slug": "acronym" }
    ]
  },
  {
    "level": "lists",
    "lessons": [
      { "type": "exercise", "slug": "guest-list" },
      { "type": "exercise", "slug": "tile-search" },
      { "type": "exercise", "slug": "lunchbox" },
      { "type": "exercise", "slug": "meal-prep" },
      { "type": "exercise", "slug": "process-guess" },
      { "type": "exercise", "slug": "stars" },
      { "type": "exercise", "slug": "weather-symbols-part-1" },
      { "type": "exercise", "slug": "weather-symbols-part-2" },
      { "type": "exercise", "slug": "alien-detector" },
      { "type": "project", "slug": "extract-words" },
      { "type": "project", "slug": "tic-tac-toe" }
    ]
  },
  {
    "level": "dictionaries",
    "lessons": [
      { "type": "exercise", "slug": "word-count" },
      { "type": "exercise", "slug": "rna-transcription" },
      { "type": "exercise", "slug": "sieve" },
      { "type": "exercise", "slug": "spotify" },
      { "type": "exercise", "slug": "emoji-collector" }
    ]
  },
  {
    "level": "multiple-functions",
    "lessons": [
      { "type": "exercise", "slug": "lower-pangram" },
      { "type": "exercise", "slug": "alphanumeric" },
      { "type": "project", "slug": "caesar-cipher" }
    ]
  },
  {
    "level": "everything",
    "lessons": [
      { "type": "exercise", "slug": "niche-named-party" },
      { "type": "exercise", "slug": "scrabble-score" },
      { "type": "exercise", "slug": "llm-response" }
    ]
  }
]
```
