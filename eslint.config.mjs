import { fixupConfigRules } from "@eslint/compat";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";

const config = [
  ...fixupConfigRules([...nextCoreWebVitals, ...nextTypeScript]),
  prettier,
  {
    ignores: [
      ".next/**",
      "coverage/**",
      "playwright-report/**",
      "test-results/**",
      "out/**",
      "public/**",
    ],
  },
];

export default config;
