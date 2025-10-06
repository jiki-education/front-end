const config = {
  preset: "jest-puppeteer",
  testMatch: ["<rootDir>/tests/e2e/**/*.test.{js,ts}"],
  testTimeout: 30000, // 30s to allow for compilation on page.goto
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: {
          jsx: "react",
          esModuleInterop: true,
          moduleResolution: "node"
        }
      }
    ]
  },
  testEnvironment: "jest-environment-puppeteer",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1"
  }
};

export default config;
