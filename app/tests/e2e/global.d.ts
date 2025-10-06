/// <reference types="jest" />

import type { Page, Browser, BrowserContext } from "puppeteer";

declare global {
  const page: Page;
  const browser: Browser;
  const context: BrowserContext;
  const jestPuppeteer: {
    debug: () => Promise<void>;
    resetPage: () => Promise<void>;
    resetBrowser: () => Promise<void>;
  };
}

export {};
