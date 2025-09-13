import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    rules: {
      "max-lines-per-function": [ "warn", {"max": 30, "skipComments":true, "skipBlankLines":true}, ],
      "semi": ["error", "always"]
    }
  },
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  tseslint.configs.recommended,
]);
