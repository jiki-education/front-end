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
      "debug-dict.js",
      "debug-dict.ts",
      "vitest.config.ts",
      "tests/**",
    ],
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
          message: "Use a function declaration for top-level APIs (e.g., `function name(){}`)",
        },
      ],
      // === Correctness / safety ===
      eqeqeq: ["error", "smart"],
      // curly: ["error", "all"],
      "default-case-last": "error",
      // === Noise control ===
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-else-return": "warn",
    },
  },

  // TypeScript files - full rule set with type information
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      // Disable base rules that conflict with TypeScript
      "no-unused-vars": "off",
      "no-undef": "off",

      // === Function style ===
      // Prefer function declarations (hoisting, better for APIs),
      // but allow arrow functions when used as callbacks.
      "func-style": ["error", "declaration", { allowArrowFunctions: true }],

      // Forbid top-level arrow functions assigned to const.
      // Encourages named declarations for exported/public functions.
      "no-restricted-syntax": [
        "error",
        {
          selector: "Program > VariableDeclaration > VariableDeclarator[init.type='ArrowFunctionExpression']",
          message: "Use a function declaration for top-level APIs (e.g., `function name(){}`)",
        },
      ],

      // === Correctness / safety ===
      // Enforce strict equality (=== / !==), except allow == null for null/undefined checks.
      eqeqeq: ["error", "smart"],

      // Require braces around all control statements (if/else/while).
      curly: ["error", "all"],

      // Ensure `default` case in switch comes last.
      "default-case-last": "error",

      // Verify all switch statements on union types are exhaustive.
      "@typescript-eslint/switch-exhaustiveness-check": "error",

      // === TypeScript clarity ===
      // Always use `import type` for type-only imports.
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "separate-type-imports" },
      ],

      // Prefer `interface` over `type` for object shapes (cleaner merging).
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],

      // Discourage `any` — warn when used, but allow in rest args.
      "@typescript-eslint/no-explicit-any": "off",

      // Control use of ts-expect-error/ts-ignore.
      // Disallow blanket ignores, but allow ts-expect-error with a description.
      "@typescript-eslint/ban-ts-comment": [
        "error",
        {
          "ts-ignore": false,
          "ts-nocheck": false,
          "ts-check": true,
          "ts-expect-error": "allow-with-description",
        },
      ],

      // Prefer `prop: (arg: Type) => Return` over `method(arg: Type): Return` in interfaces.
      "@typescript-eslint/method-signature-style": ["warn", "property"],

      // === Dead code / footguns ===
      // Warn on unused variables, but allow names starting with `_`.
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],

      // Warn on conditions that are always truthy/falsey.
      "@typescript-eslint/no-unnecessary-condition": ["warn", { allowConstantLoopConditions: true }],

      // Warn if you assert types unnecessarily (e.g., value as string when already string).
      "@typescript-eslint/no-unnecessary-type-assertion": "warn",

      // Catch confusing void expressions (like using a function that returns void in a value context).
      "@typescript-eslint/no-confusing-void-expression": ["warn", { ignoreArrowShorthand: true }],

      // === Async / Promises ===
      // Disallow unhandled promises (must await or explicitly void).
      "@typescript-eslint/no-floating-promises": "error",

      // Prevent passing async functions where a void-return is expected (e.g., setTimeout).
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { arguments: false, attributes: false } },
      ],

      // Error when awaiting a non-Promise value.
      "@typescript-eslint/await-thenable": "error",

      // Warn if async functions don't use `await` inside.
      "@typescript-eslint/require-await": "warn",

      // Warn when fields/params could be marked readonly but aren't.
      "@typescript-eslint/prefer-readonly": "warn",

      // === Naming conventions ===
      "@typescript-eslint/naming-convention": [
        "warn",
        // Types, interfaces, classes, and enums in PascalCase
        { selector: "typeLike", format: ["PascalCase"] },
        { selector: "enum", format: ["PascalCase"] },
        // Variables in camelCase, PascalCase (for React components), or UPPER_CASE (constants)
        {
          selector: "variable",
          format: ["camelCase", "UPPER_CASE", "PascalCase"],
          leadingUnderscore: "allow",
        },
        // Functions in camelCase (or PascalCase for components)
        { selector: "function", format: ["camelCase", "PascalCase"] },
      ],

      // === Noise control ===
      // Allow console.warn and console.error, but discourage other console usage.
      "no-console": ["warn", { allow: ["warn", "error"] }],

      // Warn when else is redundant after return.
      "no-else-return": "warn",
    },
  },
];
