import "@testing-library/jest-dom";

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
