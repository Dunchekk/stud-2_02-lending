import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs}"], 
    plugins: { js }, 
    extends: ["js/recommended"], 
    languageOptions: { globals: globals.browser },
    rules: {
      "no-unused-vars": "warn", // теперь ESLint не будет падать с ошибкой, а покажет warning
      //optional

      //errors or strange constr
      "no-undef": "error",
      "no-redeclare": "error",
      "no-duplicate-imports": "warn",
      "no-undef-init": "error",
      // 'no-use-before-define': 'error',

      //good ones
      "strict": ["warn", "global"],
      // 'quotes': ['warn', 'single', { 'avoidEscape': true }],
      "semi": ["warn", "always"],
      "arrow-spacing": "warn",
      "brace-style": ["warn", "1tbs"],
      "comma-spacing": ["warn", { before: false, after: true }],
      // 'comma-dangle': ['warn', 'always-multiline'],
      "space-infix-ops": ["warn", { int32Hint: false }],
      "keyword-spacing": ["warn", { before: true, after: true }],
      "space-before-function-paren": ["warn", "never"],
      "object-curly-spacing": ["warn", "always"],
      "array-bracket-spacing": ["warn", "never"],
      "camelcase": "warn",
      "func-call-spacing": ["warn", "never"],
      "default-case": "warn",

      //mine
      // 'indent': ['warn', 4],
      "no-multiple-empty-lines": ["warn", { max: 5 }],
      "max-len": ["warn", { code: 100 }],
    },
  },
]);
