import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./"
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  coverageDirectory: ".coverage",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^@static/(.*)$": "<rootDir>/public/static/$1",
    "^@jiki/interpreters/shared$": "<rootDir>/../interpreters/dist/shared.js",
    "^@jiki/interpreters/jikiscript$": "<rootDir>/../interpreters/dist/jikiscript.js",
    "^@jiki/interpreters/javascript$": "<rootDir>/../interpreters/dist/javascript.js",
    "^@jiki/interpreters/python$": "<rootDir>/../interpreters/dist/python.js",
    "^@jiki/interpreters$": "<rootDir>/../interpreters",
    "^@jiki/curriculum$": "<rootDir>/../curriculum",
    "^marked$": "<rootDir>/__mocks__/marked.js"
  },
  testMatch: ["<rootDir>/tests/**/*.test.{js,jsx,ts,tsx}"],
  testPathIgnorePatterns: ["<rootDir>/tests/e2e/"]
};

export default createJestConfig(customJestConfig);
