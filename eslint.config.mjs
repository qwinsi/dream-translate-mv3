import globals from "globals";


/** @type {import('eslint').Linter.Config[]} */
export default [
  // document, window, etc. should be globally available
  {languageOptions: { globals: globals.browser }},
  // chrome should be globally available
  {languageOptions: { globals: globals.webextensions }},
  // show red underline error for undefined variables
  { rules: { "no-undef": "error" } },
];