import { fixupConfigRules } from "@eslint/compat";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";

const config = [
  ...fixupConfigRules([...nextCoreWebVitals, ...nextTypeScript]),
  prettier,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "dist/**",
      "build/**",
      "coverage/**",
      "playwright-report/**",
      "test-results/**",
      "out/**",
      "public/**",
      ".agents/skills/**",
      ".claude/skills/**",
      ".github/skills/**",
      ".opencode/skills/**",
    ],
  },
];

export default config;
