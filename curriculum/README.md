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
      { "type": "exercise", "slug": "golf-rolling-ball-state" },
      { "type": "exercise", "slug": "finish-wall" },
      { "type": "exercise", "slug": "rainbow" },
      { "type": "exercise", "slug": "sunset" },
      { "type": "exercise", "slug": "plant-the-flowers" }
    ]
  },
  {
    "level": "functions-that-return-things",
    "lessons": [{ "type": "exercise", "slug": "golf-shot-checker" }]
  }
]
```

## Projects

```json
[{ "slug": "sprouting-flower" }]
```
