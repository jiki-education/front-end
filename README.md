# Jiki Frontend

This is the Front End for Jiki.
For comprehensive information on Jiki, see [the Overview Repository](../overview).

## Getting Started

First, run the development server:

```bash
./bin/dev
```

Open [http://localhost:3061](http://localhost:3061) with your browser to see the result.

## Testing

### Running Tests

```bash
# Run all unit and integration tests
pnpm test

# Run tests in watch mode (re-runs on file changes)
pnpm test:watch

# Run E2E browser tests
pnpm test:e2e

# Run all tests (unit, integration, and E2E)
pnpm test:all
```

### E2E Test Setup

Before running E2E tests for the first time, install the Chrome browser for Puppeteer:

```bash
npx puppeteer browsers install chrome
```

### Test Structure

- **Unit Tests**: Located in `tests/unit/` - Pure logic tests
- **Integration Tests**: Located in `tests/integration/` - Component and feature tests
- **E2E Tests**: Located in `tests/e2e/` - Full browser automation tests

## Initial TODOs

- [ ] Svg support
- [ ] [Fonts](https://nextjs.org/docs/app/getting-started/fonts)
- [ ] Deploy on Cloudflare

---

Copyright (c) 2025 Jiki Ltd. All rights reserved.
