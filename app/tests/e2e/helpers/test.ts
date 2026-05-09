import { test as base } from "@playwright/test";
import { blockUnmockedAPI } from "./api-mocks";

/**
 * Custom test fixture that automatically blocks every unmocked request to
 * the API base. Specific mocks registered within a test take precedence
 * because Playwright matches route handlers in reverse-registration order.
 *
 * Always import `test` and `expect` from this module instead of
 * `@playwright/test` so every e2e test is isolated from the real API.
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    await blockUnmockedAPI(page);
    // `use` here is Playwright's fixture-supply callback, not React's `use` hook.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(page);
  }
});

export { expect } from "@playwright/test";
