import { defineConfig, globalIgnores } from "eslint/config"
import prettier from "eslint-config-prettier/flat"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    rules: {
      "@next/next/no-duplicate-head": "off",
    },
  },
  globalIgnores([".next/**", ".source/**", "out/**", "build/**", "next-env.d.ts"]),
])
