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

The syllabus structure (levels, and the order of the video and exercise lessons
within them) is owned by the API, not by this repository. The canonical source is
[`../../api/db/seeds/curriculum.json`](../../api/db/seeds/curriculum.json) in the
`jiki/api` repo. Read it from there rather than keeping a copy here, which only
ever drifts.

This repository owns the exercise implementations themselves, and the language
feature definitions per level in `src/levels/`.
