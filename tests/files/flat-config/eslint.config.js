const importPluginRecommended = require('../../../config/recommended');

module.exports = [
  importPluginRecommended,
  {
    rules: {
      'import/order': ['error', {
        "groups": [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
          "object",
          "type",
          "unknown"
        ],
        "distinctGroup": false,
        "newlines-between": "always",
        "alphabetize": {
          "order": "asc",
          "caseInsensitive": true
        }
      }]
    }
  }
];