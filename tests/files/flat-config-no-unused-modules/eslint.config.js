const importPluginRecommended = require('../../../config/recommended');

module.exports = [
  importPluginRecommended,
  {
    rules: {
      'import/no-unused-modules': ["warn", {'unusedExports': true}]
    }
  }
];