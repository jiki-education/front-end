import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const eslintConfig = [
  {
    ignores: ["node_modules/**", "dist/**", ".wrangler/**", "coverage/**"]
  },

  // TypeScript files - full rule set with type information
  {
    files: ["**/*.{ts}"],
    languageOptions: {
      parser: await import("@typescript-eslint/parser"),
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname
      }
    },
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
      curly: ["error", "all"],
      "default-case-last": "error",
      "@typescript-eslint/switch-exhaustiveness-check": "error",

      // === TypeScript clarity ===
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "separate-type-imports" }
      ],
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-ts-comment": [
        "error",
        {
          "ts-ignore": false,
          "ts-nocheck": false,
          "ts-check": true,
          "ts-expect-error": "allow-with-description"
        }
      ],
      "@typescript-eslint/method-signature-style": ["warn", "property"],

      // === Dead code / footguns ===
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_"
        }
      ],
      "@typescript-eslint/no-unnecessary-condition": ["warn", { allowConstantLoopConditions: true }],
      "@typescript-eslint/no-unnecessary-type-assertion": "warn",
      "@typescript-eslint/no-confusing-void-expression": ["warn", { ignoreArrowShorthand: true }],

      // === Async / Promises ===
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { arguments: false, attributes: false } }
      ],
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/require-await": "warn",
      "@typescript-eslint/prefer-readonly": "warn",

      // === Naming conventions ===
      "@typescript-eslint/naming-convention": [
        "warn",
        { selector: "typeLike", format: ["PascalCase"] },
        { selector: "enum", format: ["PascalCase"] },
        {
          selector: "variable",
          format: ["camelCase", "UPPER_CASE", "PascalCase"],
          leadingUnderscore: "allow"
        },
        { selector: "function", format: ["camelCase", "PascalCase"] }
      ],

      // === Noise control ===
      "no-console": ["warn", { allow: ["warn", "error", "debug"] }],
      "no-else-return": "warn"
    }
  }
];

export default eslintConfig;
