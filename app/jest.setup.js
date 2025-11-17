import "@testing-library/jest-dom";
import React from "react";

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
