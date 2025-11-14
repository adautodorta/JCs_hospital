import eslint from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import {defineConfig, globalIgnores} from "eslint/config";
import importPlugin from "eslint-plugin-import";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx,mts}"],
    plugins: {
      import: importPlugin,
    },
    extends: [
      eslint.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      stylistic.configs.customize({
        quotes: "double",
        semi: true,
        blockSpacing: false,
      }),
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      "import/order": ["error", {
        "groups": [["external", "builtin"], ["index", "sibling", "parent", "internal"]],
        "newlines-between": "always",
        "alphabetize": {order: "asc", caseInsensitive: true},
      }],
      "import/no-cycle": "warn",
      "curly": "error",
      "@stylistic/linebreak-style": ["error", "unix"],
      "@stylistic/object-curly-spacing": ["error", "never"],
      "@stylistic/object-curly-newline": ["error", {multiline: true, consistent: true}],
      "@stylistic/brace-style": ["error", "1tbs"],
      "@typescript-eslint/no-shadow": ["error", {builtinGlobals: true, hoist: "all"}],
      "@typescript-eslint/no-unused-vars": ["error", {ignoreRestSiblings: true, argsIgnorePattern: "^_"}],
    },
  },
  {
    files: ["**/*.spec.tsx", "vitest.setup.ts"],
    rules: {
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unnecessary-boolean-literal-compare": "off",
      "@typescript-eslint/no-unnecessary-condition": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "off",
    },
  },
]);
