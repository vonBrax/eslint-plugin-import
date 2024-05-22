const importPluginRecommended = require('../../../config/recommended');
const importPluginTypescript = require('../../../config/typescript');
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');

module.exports = [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  importPluginRecommended,
  {
    files: ["**/*.ts"],
    settings: {
      'import/resolver': {
        typescript: true,
        node: true,
      }
    },
    ...importPluginTypescript,
  }
];