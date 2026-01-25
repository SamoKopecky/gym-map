import tseslint from "typescript-eslint"
import pluginVue from "eslint-plugin-vue"
import eslintConfigPrettier from "eslint-config-prettier"

export default tseslint.config(
  { ignores: ["dist", "node_modules", ".nuxt", ".output"] },

  // 1. Load recommended logic rules
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/recommended"],

  // 2. Minimal Vue/TS Setup
  {
    files: ["**/*.ts", "**/*.vue"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: [".vue"],
      },
    },
    rules: {
      "vue/multi-word-component-names": "off",
      "no-console": "warn",
    },
  },

  // 3. The "Muzzle": Turns off all ESLint formatting rules
  eslintConfigPrettier,
)
