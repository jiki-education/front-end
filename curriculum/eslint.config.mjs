import eslint from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  // Ignore patterns
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**",
      "**/solution.js", // Exercise solution files (not standalone code)
      "**/solution.py",
      "**/solution.jiki"
    ]
  },

  // Base ESLint recommended config for all files
  eslint.configs.recommended,

  // JavaScript files - basic rules only
  {
    files: ["**/*.{js,jsx,mjs}"],
    rules: {
      // === Function style ===
      "func-style": ["error", "declaration", { allowArrowFunctions: true }],
      "no-restricted-syntax": [
        "error",
        {
          selector: "Program > VariableDeclaration > VariableDeclarator[init.type='ArrowFunctionExpression']",
          message: "Use a function declaration for top-level APIs (e.g., `function name(){}`)"
        }
      ],
      // === Correctness / safety ===
      eqeqeq: ["error", "smart"],
      "default-case-last": "error",
      // === Noise control ===
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-else-return": "warn"
    }
  },

  // TypeScript files - full rule set with type information
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname
      }
    },
    plugins: {
      "@typescript-eslint": tseslint
    },
    rules: {
      // Disable base rules that conflict with TypeScript
      "no-unused-vars": "off",
      "no-undef": "off",

      // === Function style ===
      "func-style": ["error", "declaration", { allowArrowFunctions: true }],
      "no-restricted-syntax": [
        "error",
        {
          selector: "Program > VariableDeclaration > VariableDeclarator[init.type='ArrowFunctionExpression']",
          message: "Use a function declaration for top-level APIs (e.g., `function name(){}`)"
        }
      ],

      // === TypeScript rules ===
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-explicit-any": "warn",

      // === Correctness / safety ===
      "@typescript-eslint/strict-boolean-expressions": ["error", { allowNullableObject: true }],
      "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
      "@typescript-eslint/return-await": ["error", "in-try-catch"],
      eqeqeq: ["error", "smart"],
      "default-case-last": "error",

      // === Noise control ===
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-else-return": "warn"
    }
  }
];
