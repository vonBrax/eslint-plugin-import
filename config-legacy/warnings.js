const base = require('./base');

/**
 * more opinionated config.
 * @type {Object}
 */
module.exports = {
  ...base,
  rules: {
    'import/no-named-as-default': 1,
    'import/no-named-as-default-member': 1,
    'import/no-duplicates': 1,
  },
};
