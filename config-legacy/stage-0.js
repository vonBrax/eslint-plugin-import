const base = require('./base');

/**
 * Rules in progress.
 *
 * Do not expect these to adhere to semver across releases.
 * @type {Object}
 */
module.exports = {
  ...base,
  rules: {
    'import/no-deprecated': 1,
  },
};
