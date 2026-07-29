import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname
});

const eslintConfig = [
  // Next.js recommended configs (React, a11y, performance) + baseline TypeScript
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    ignores: [
      "node_modules/**",
      ".next/**",
      ".open-next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "components/ui-kit/icon-types.ts"
    ]
  },

  // JavaScript files - basic rules only
  {
    files: ["**/*.{js,jsx}"],
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
      // curly: ["error", "all"],
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
      parser: await import("@typescript-eslint/parser"),
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
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
          message: "Use a function declaration for top-level APIs (e.g., `function name(){}`)"
        }
      ],

      // === Correctness / safety ===
      // Enforce strict equality (=== / !==), except allow == null for null/undefined checks.
      eqeqeq: ["error", "smart"],

      // Ensure `default` case in switch comes last.
      "default-case-last": "error",

      // Verify all switch statements on union types are exhaustive.
      "@typescript-eslint/switch-exhaustiveness-check": "error",

      // === TypeScript clarity ===
      // Always use `import type` for type-only imports.
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "separate-type-imports" }
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
          "ts-expect-error": "allow-with-description"
        }
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
          destructuredArrayIgnorePattern: "^_"
        }
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
        { checksVoidReturn: { arguments: false, attributes: false } }
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
          leadingUnderscore: "allow"
        },
        // Functions in camelCase (or PascalCase for components)
        { selector: "function", format: ["camelCase", "PascalCase"] }
      ],

      // === Noise control ===
      // Allow console.warn and console.error, but discourage other console usage.
      "no-console": ["warn", { allow: ["warn", "error", "debug"] }],

      // Warn when else is redundant after return.
      "no-else-return": "warn",

      // === React Compiler rules ===
      // Some React Compiler rules are disabled as they flag common patterns
      // that would require significant architectural changes to comply with.
      // See: https://github.com/jiki-education/front-end/pull/212
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/refs": "off"
    }
  },

  // No Tailwind, anywhere.
  //
  // Tailwind has been fully removed from the codebase — the whole app (product
  // pages, dev tooling, test pages) styles via CSS Modules + the hand-written
  // ui-kit. This block forbids Tailwind utility classes from reappearing in any
  // className. It is LAST so it wins over the general TS block for matched files
  // (flat config replaces, not merges, no-restricted-syntax) — hence the
  // arrow-function rule is repeated here. It does NOT flag ui-kit globals
  // (ui-*, c-*), custom z-index (z-modal), or a11y helpers (focus-ring,
  // sr-only). Tests are excluded so class-name string literals in assertions
  // (e.g. toHaveClass("...")) don't trip it. For a genuine non-Tailwind class
  // that trips it, prefer a CSS Module; only add an eslint-disable with a note
  // if truly unavoidable.
  {
    files: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}", "lib/**/*.{ts,tsx}"],
    ignores: ["**/tests/**"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "Program > VariableDeclaration > VariableDeclarator[init.type='ArrowFunctionExpression']",
          message: "Use a function declaration for top-level APIs (e.g., `function name(){}`)"
        },
        {
          // className="…" string literals containing a Tailwind utility token.
          selector:
            "JSXAttribute[name.name='className'] > Literal[value=/(^|\\s)-?(flex|inline-flex|grid|inline-grid|block|inline-block|hidden|isolate|items-(center|start|end|stretch|baseline)|justify-(center|between|around|start|end|evenly)|self-(start|center|end|stretch)|place-(items|content)-|content-(center|between|around)|(flex|grid)-(row|col|wrap|nowrap|grow|shrink|1|auto|none|cols|rows)|(gap|space)-[xy]?-?[0-9[]|[pm][xytblrse]?-(0|0\\.5|[1-9][0-9]*|\\[)|-m[xytblrse]?-|(w|h|min-w|min-h|max-w|max-h)-(0|[1-9]|full|screen|auto|fit|min|max|\\[|xs|sm|md|lg|xl|2xl|screen-)|size-[0-9[]|text-(left|center|right|start|end|justify|xs|sm|base|lg|xl|[0-9]xl|[0-9]{2,3}|white|black|transparent|current|(red|blue|green|gray|grey|slate|zinc|neutral|stone|amber|yellow|lime|emerald|teal|cyan|sky|indigo|violet|purple|fuchsia|pink|rose|orange)-[0-9])|font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black|mono|sans|serif)|(bg|border|ring|divide|outline|from|via|to|fill|stroke|caret|accent|decoration|placeholder)-(white|black|transparent|current|inherit|none|(red|blue|green|gray|grey|slate|zinc|neutral|stone|amber|yellow|lime|emerald|teal|cyan|sky|indigo|violet|purple|fuchsia|pink|rose|orange)-[0-9]|\\[)|rounded(-|$)|border(-[0-9tblrse]|$)|(top|bottom|left|right|inset|start|end)-(0|[1-9]|auto|full|\\[)|z-(0|[1-9]0*|\\[)|overflow-(auto|hidden|visible|scroll|clip|[xy]-)|opacity-[0-9[]|cursor-|pointer-events-|select-|(w|h)-\\[|shadow(-|$)|leading-|tracking-|(uppercase|lowercase|capitalize|normal-case)|truncate|(whitespace|break|text-ellipsis|text-clip)-|aspect-|object-(cover|contain|fill|none|scale)|(transition|duration|delay|ease|animate)-|(scale|rotate|translate|skew|origin)-|prose|(hover|focus|active|disabled|group-hover|focus-within|focus-visible|peer|first|last|odd|even|sm|md|lg|xl|2xl|dark|rtl|ltr):)(\\s|$)/]",
          message:
            "Tailwind utility class in className. Tailwind has been fully removed — style with a CSS Module or the ui-kit (ui-*/c-*). See app/.context/css-styles.md."
        }
      ]
    }
  }
];

export default eslintConfig;
