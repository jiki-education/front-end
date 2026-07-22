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

// next/jest builds transformIgnorePatterns itself (ignoring node_modules). next-intl
// and use-intl ship ESM that must be transformed, so extend the allowlist groups Next
// generates so these packages are transpiled by Babel rather than ignored.
// Next emits two node_modules patterns whose negative-lookahead groups we extend:
//   /node_modules/(?!.pnpm)(?!(<pkgs>)/)         — non-pnpm layout
//   /node_modules/.pnpm/(?!(<pkgs>@)              — pnpm layout (suffixed with @)
export default async function jestConfig() {
  const config = await createJestConfig(customJestConfig)();

  config.transformIgnorePatterns = (config.transformIgnorePatterns ?? []).map((pattern) =>
    pattern
      .replace(
        "(?!(interpreters|@jiki/curriculum|geist)/)",
        "(?!(interpreters|@jiki/curriculum|geist|next-intl|use-intl|intl-messageformat|@formatjs)/)"
      )
      .replace(
        "(?!(interpreters|@jiki\\+curriculum|geist)@)",
        "(?!(interpreters|@jiki\\+curriculum|geist|next-intl|use-intl|intl-messageformat|@formatjs\\+[^@]+)@)"
      )
  );

  return config;
}
