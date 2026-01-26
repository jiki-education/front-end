# Jiki Frontend

This is the Front End for Jiki.
For comprehensive information on Jiki, see [the Overview Repository](../overview).

## Getting Started

First, run the development server:

```bash
./bin/dev
```

Open [http://localhost:3061](http://localhost:3061) with your browser to see the result.

## Structure

The app is broken into a few parts:

- `app`: These are routes that use components to render.
  - `(app)`: These are all authenticated routes.
  - `(external)`: These are routes that can only be viewed when logged out (login, signup, etc.)
  - `external`: These are logged-out versions of `(app)` routes. The middleware renders this instead of the `(app)` version if the user has no cookie.
- `components`: These are the UI components rendered by the app.
- `lib`: These are supporting libraries.

## Testing

### Running Tests

```bash
# Run all unit and integration tests
pnpm test

# Run tests in watch mode (re-runs on file changes)
pnpm test:watch

# Run E2E browser tests (Playwright)
pnpm test:e2e

# Run E2E tests with visible browser
pnpm test:e2e:headed

# Run all tests (unit, integration, and E2E)
pnpm test:all
```

### E2E Test Setup

Before running Playwright E2E tests for the first time, install Chromium:

```bash
pnpm exec playwright install chromium
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
