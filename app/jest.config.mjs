import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./"
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^@jiki/interpreters$": "<rootDir>/../interpreters",
    "^@jiki/curriculum$": "<rootDir>/../curriculum"
  },
  testMatch: ["<rootDir>/tests/**/*.test.{js,jsx,ts,tsx}"],
  testPathIgnorePatterns: ["<rootDir>/tests/e2e/"]
};

export default createJestConfig(customJestConfig);
