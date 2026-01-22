import "@testing-library/jest-dom";
import React from "react";

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

jest.mock("../public/icons/jiki-logo.svg", () => {
  return function JikiLogo(props) {
    return React.createElement("div", { ...props, "data-testid": "jiki-logo" });
  };
});

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
  loadAnimation: jest.fn(),
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
