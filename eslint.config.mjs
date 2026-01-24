import globals from "globals";
import pluginJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        IntersectionObserver: "readonly",
        UIComponents: "readonly",
        FormHandler: "readonly",
        Navigation: "readonly",
        Notification: "readonly",
        ValidationStrategies: "readonly"
      },
    },
    rules: {
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_", "caughtErrorsIgnorePattern": "^_" }],
      "no-console": "warn",
    },
  },
  pluginJs.configs.recommended,
  eslintConfigPrettier,
];
