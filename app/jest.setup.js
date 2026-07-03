import "@testing-library/jest-dom";
import React from "react";
// `mock`-prefixed so jest's mock-factory hoisting allows referencing it below.
import mockEnMessages from "./messages/en.json";

// Polyfill Web APIs for testing (Request, Response, etc.)
// These are available in Workers/browsers but not in Node.js Jest environment
if (typeof global.Request === "undefined") {
  global.Request = class Request {
    constructor(url, init = {}) {
      this.url = url;
      this.method = init.method || "GET";
      this.headers = new Map(Object.entries(init.headers || {}));
      this.body = init.body;
    }
  };
}

if (typeof global.Response === "undefined") {
  global.Response = class Response {
    constructor(body, init = {}) {
      this.body = body;
      this.status = init.status || 200;
      this.statusText = init.statusText || "OK";
      this._headers = init.headers || {};
      this.ok = this.status >= 200 && this.status < 300;

      // Create a headers object with get method
      this.headers = {
        get: (name) => this._headers[name] || null,
        set: (name, value) => {
          this._headers[name] = value;
        }
      };
    }
  };
}

// Polyfill matchMedia (used by useScrollingTestimonials for prefers-reduced-motion).
if (typeof window !== "undefined" && typeof window.matchMedia !== "function") {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false
  });
}

// Polyfill IntersectionObserver (used by landing-page rough-annotation hooks).
if (typeof global.IntersectionObserver === "undefined") {
  global.IntersectionObserver = class IntersectionObserver {
    constructor(callback) {
      this.callback = callback;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  };
}

// Polyfill ResizeObserver (used by HeaderHeightSync and other layout hooks).
if (typeof global.ResizeObserver === "undefined") {
  global.ResizeObserver = class ResizeObserver {
    constructor(callback) {
      this.callback = callback;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// Mock next-intl so components using translations render real English strings
// (read from messages/en.json) without needing a NextIntlClientProvider in each
// test. Supports namespaces, dotted keys, {var} interpolation, and t.rich.
jest.mock("next-intl", () => {
  const messages = mockEnMessages;

  const resolve = (namespace, key) => {
    const path = namespace ? `${namespace}.${key}` : key;
    return path.split(".").reduce((node, part) => (node == null ? undefined : node[part]), messages);
  };

  const interpolate = (template, values = {}) =>
    String(template).replace(/\{(\w+)\}/g, (match, name) => (name in values ? String(values[name]) : match));

  const createTranslator = (namespace) => {
    const t = (key, values) => {
      const value = resolve(namespace, key);
      return typeof value === "string" ? interpolate(value, values) : key;
    };
    // t.rich: strip the <tag>…</tag> markup down to the rendered chunks.
    t.rich = (key, tags = {}) => {
      const value = resolve(namespace, key);
      if (typeof value !== "string") {
        return key;
      }
      const parts = [];
      const regex = /<(\w+)>(.*?)<\/\1>|([^<]+)/g;
      let match;
      while ((match = regex.exec(value)) !== null) {
        const [, tag, inner, text] = match;
        if (tag && typeof tags[tag] === "function") {
          parts.push(tags[tag](inner));
        } else {
          parts.push(tag ? inner : text);
        }
      }
      return parts;
    };
    t.markup = (key, values) => t(key, values);
    t.raw = (key) => resolve(namespace, key);
    t.has = (key) => resolve(namespace, key) !== undefined;
    return t;
  };

  return {
    useTranslations: (namespace) => createTranslator(namespace),
    useLocale: () => "en",
    useMessages: () => messages,
    useFormatter: () => ({
      dateTime: (value) => String(value),
      number: (value) => String(value),
      relativeTime: (value) => String(value),
      list: (value) => Array.from(value).join(", ")
    }),
    NextIntlClientProvider: ({ children }) => children
  };
});

// Mock the problematic ES module package
jest.mock("@exercism/highlightjs-jikiscript", () => {
  return {
    __esModule: true,
    default: () => {
      // Mock implementation that returns a basic highlight.js language definition
      return {
        name: "JikiScript",
        case_insensitive: false,
        keywords: {},
        contains: []
      };
    }
  };
});

jest.mock("@jiki/highlightjs-javascript", () => {
  return {
    __esModule: true,
    default: () => {
      return {
        name: "JavaScript",
        keywords: {},
        contains: []
      };
    }
  };
});

// Mock Next.js router
jest.mock("next/navigation", () => {
  return {
    useRouter: () => ({
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn()
    }),
    useSearchParams: () => ({
      get: jest.fn(),
      has: jest.fn(),
      getAll: jest.fn(),
      keys: jest.fn(),
      values: jest.fn(),
      entries: jest.fn(),
      forEach: jest.fn(),
      toString: jest.fn()
    }),
    usePathname: () => "/"
  };
});

// Mock SVG imports as React components
jest.mock("../public/icons/house.svg", () => {
  return function HouseIcon(props) {
    return React.createElement("div", { ...props, "data-testid": "house-icon" });
  };
});

jest.mock("../public/icons/projects.svg", () => {
  return function ProjectsIcon(props) {
    return React.createElement("div", { ...props, "data-testid": "projects-icon" });
  };
});

jest.mock("../public/icons/medal.svg", () => {
  return function MedalIcon(props) {
    return React.createElement("div", { ...props, "data-testid": "medal-icon" });
  };
});

jest.mock("../public/icons/settings.svg", () => {
  return function SettingsIcon(props) {
    return React.createElement("div", { ...props, "data-testid": "settings-icon" });
  };
});

jest.mock("../public/icons/folder.svg", () => {
  return function FolderIcon(props) {
    return React.createElement("div", { ...props, "data-testid": "folder-icon" });
  };
});

// Mock Turnstile hook so tests don't hit the real Cloudflare widget.
jest.mock("@/lib/turnstile/useTurnstile", () => ({
  useTurnstile: () => ({ execute: jest.fn().mockResolvedValue("test-token") })
}));

// Mock theme hook
jest.mock("@/lib/theme/useTheme", () => ({
  useTheme: () => ({
    theme: "light",
    setTheme: jest.fn(),
    systemTheme: "light"
  })
}));

// Mock lottie-web to prevent canvas errors in test environment
jest.mock("lottie-web", () => ({
  loadAnimation: jest.fn(() => ({
    destroy: jest.fn(),
    play: jest.fn(),
    pause: jest.fn(),
    stop: jest.fn(),
    setSpeed: jest.fn(),
    setDirection: jest.fn(),
    goToAndStop: jest.fn(),
    goToAndPlay: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn()
  })),
  destroy: jest.fn(),
  setSpeed: jest.fn(),
  setDirection: jest.fn(),
  play: jest.fn(),
  pause: jest.fn(),
  stop: jest.fn()
}));

// Mock react-lottie-player
jest.mock("react-lottie-player", () => {
  return function LottiePlayer(props) {
    return React.createElement("div", {
      ...props,
      "data-testid": "lottie-player",
      style: props.style
    });
  };
});
