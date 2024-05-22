const base = require('./base');

/**
 * The basics.
 * @type {Object}
 */
module.exports = {
  ...base,
  rules: {
    // analysis/correctness
    'import/no-unresolved': 'error',
    'import/named': 'error',
    'import/namespace': 'error',
    'import/default': 'error',
    'import/export': 'error',

    // red flags (thus, warnings)
    'import/no-named-as-default': 'warn',
    'import/no-named-as-default-member': 'warn',
    'import/no-duplicates': 'warn',
  },
  languageOptions: {
    parserOptions: {
      sourceType: 'module',
      ecmaVersion: 2018,
    },
  },
  settings: {
    'import/parsers': {
      espree: ['.js', '.cjs', '.mjs', '.jsx'],
    },
  },
};
