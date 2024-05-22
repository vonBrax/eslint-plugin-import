/**
 * tests that require fully booting up ESLint
 */
import path from 'path';

import { expect } from 'chai';
import { CLIEngine, ESLint, loadESLint } from 'eslint';
import eslintPkg from 'eslint/package.json';
import semver from 'semver';
import * as importPlugin from '../../src/index';

describe('CLI regression tests', function () {
  describe('issue #210', function () {
    let eslint;
    let cli;
    before(function () {
      if (ESLint) {
        eslint = new ESLint({
          useEslintrc: false,
          overrideConfigFile: './tests/files/issue210.config.js',
          rulePaths: ['./src/rules'],
          overrideConfig: {
            rules: {
              named: 2,
            },
          },
          plugins: { 'eslint-plugin-import': importPlugin },
        });
      } else {
        cli = new CLIEngine({
          useEslintrc: false,
          configFile: './tests/files/issue210.config.js',
          rulePaths: ['./src/rules'],
          rules: {
            named: 2,
          },
        });
        cli.addPlugin('eslint-plugin-import', importPlugin);
      }
    });
    it("doesn't throw an error on gratuitous, erroneous self-reference", function () {
      if (eslint) {
        return eslint.lintFiles(['./tests/files/issue210.js'])
          .catch(() => expect.fail());
      } else {
        expect(() => cli.executeOnFiles(['./tests/files/issue210.js'])).not.to.throw();
      }
    });
  });

  describe('issue #1645', function () {
    let eslint;
    let cli;
    beforeEach(function () {
      if (semver.satisfies(eslintPkg.version, '< 6')) {
        this.skip();
      } else {
        if (ESLint) {
          eslint = new ESLint({
            useEslintrc: false,
            overrideConfigFile: './tests/files/just-json-files/.eslintrc.json',
            rulePaths: ['./src/rules'],
            ignore: false,
            plugins: { 'eslint-plugin-import': importPlugin },
          });
        } else {
          cli = new CLIEngine({
            useEslintrc: false,
            configFile: './tests/files/just-json-files/.eslintrc.json',
            rulePaths: ['./src/rules'],
            ignore: false,
          });
          cli.addPlugin('eslint-plugin-import', importPlugin);
        }
      }
    });

    it('throws an error on invalid JSON', () => {
      const invalidJSON = './tests/files/just-json-files/invalid.json';
      if (eslint) {
        return eslint.lintFiles([invalidJSON]).then((results) => {
          expect(results).to.eql(
            [
              {
                filePath: path.resolve(invalidJSON),
                messages: [
                  {
                    column: 2,
                    endColumn: 3,
                    endLine: 1,
                    line: 1,
                    message: 'Expected a JSON object, array or literal.',
                    nodeType: results[0].messages[0].nodeType, // we don't care about this one
                    ruleId: 'json/*',
                    severity: 2,
                    source: results[0].messages[0].source, // NewLine-characters might differ depending on git-settings
                  },
                ],
                errorCount: 1,
                ...semver.satisfies(eslintPkg.version, '>= 7.32 || ^8.0.0') && {
                  fatalErrorCount: 0,
                },
                warningCount: 0,
                fixableErrorCount: 0,
                fixableWarningCount: 0,
                source: results[0].source, // NewLine-characters might differ depending on git-settings
                ...semver.satisfies(eslintPkg.version, '>= 8.8') && {
                  suppressedMessages: [],
                },
                usedDeprecatedRules: results[0].usedDeprecatedRules, // we don't care about this one
              },
            ],
          );
        });
      } else {
        const results = cli.executeOnFiles([invalidJSON]);
        expect(results).to.eql({
          results: [
            {
              filePath: path.resolve(invalidJSON),
              messages: [
                {
                  column: 2,
                  endColumn: 3,
                  endLine: 1,
                  line: 1,
                  message: 'Expected a JSON object, array or literal.',
                  nodeType: results.results[0].messages[0].nodeType, // we don't care about this one
                  ruleId: 'json/*',
                  severity: 2,
                  source: results.results[0].messages[0].source, // NewLine-characters might differ depending on git-settings
                },
              ],
              errorCount: 1,
              warningCount: 0,
              fixableErrorCount: 0,
              fixableWarningCount: 0,
              source: results.results[0].source, // NewLine-characters might differ depending on git-settings
            },
          ],
          errorCount: 1,
          warningCount: 0,
          fixableErrorCount: 0,
          fixableWarningCount: 0,
          usedDeprecatedRules: results.usedDeprecatedRules, // we don't care about this one
        });
      }
    });
  });
});

describe('Flat config tests', function () {
  describe('using commonjs', function () {
    let eslint;

    before(async function () {
      const Linter = await loadESLint({ cwd: path.join(__dirname, '../files/flat-config') });
      eslint = new Linter({ cwd: path.join(__dirname, '../files/flat-config') });
    });

    it('should report import plugin linting errors', function () {
      return eslint.lintFiles(['index.js'])
        .then((results) => {
          expect(results).to.eql(
            [
              {
                filePath: path.join(__dirname, '../files/flat-config/index.js'),
                messages: [
                  {
                    ruleId: 'import/order',
                    severity: 2,
                    message: '`node:path` import should occur before import of `../bar`',
                    line: 2,
                    column: 12,
                    nodeType: results[0].messages[0].nodeType, // we don't care about this one
                    endLine: 2,
                    endColumn: 32,
                    fix: {
                      range: [0, 62],
                      text: "var path = require('node:path');\nvar bar = require( '../bar');\n",
                    },
                  },
                ],
                ...semver.satisfies(eslintPkg.version, '>= 8.8') && {
                  suppressedMessages: [],
                },
                errorCount: 1,
                ...semver.satisfies(eslintPkg.version, '>= 7.32 || ^8.0.0') && {
                  fatalErrorCount: 0,
                },
                warningCount: 0,
                fixableErrorCount: 1,
                fixableWarningCount: 0,
                source: results[0].source, // NewLine-characters might differ depending on git-settings
                usedDeprecatedRules: results[0].usedDeprecatedRules, // we don't care about this one
              },
            ],
          );

        });
    });
  });

  describe('using ESM', function () {
    let eslint;

    before(async function () {
      const Linter = await loadESLint({ cwd: path.join(__dirname, '../files/flat-config-esm') });
      eslint = new Linter({ cwd: path.join(__dirname, '../files/flat-config-esm') });
    });

    it('should report import plugin linting errors', function () {
      return eslint.lintFiles(['index.js'])
        .then((results) => {
          expect(results).to.eql(
            [
              {
                filePath: path.join(__dirname, '../files/flat-config-esm/index.js'),
                messages: [
                  {
                    ruleId: 'import/order',
                    severity: 2,
                    message: '`node:path` import should occur before import of `../bar/index.js`',
                    line: 2,
                    column: 1,
                    nodeType: results[0].messages[0].nodeType, // we don't care about this one
                    endLine: 2,
                    endColumn: 30,
                    fix: {
                      range: [0, 64],
                      text: "import path from 'node:path';\nimport bar from '../bar/index.js';\n",
                    },
                  },
                ],
                ...semver.satisfies(eslintPkg.version, '>= 8.8') && {
                  suppressedMessages: [],
                },
                errorCount: 1,
                ...semver.satisfies(eslintPkg.version, '>= 7.32 || ^8.0.0') && {
                  fatalErrorCount: 0,
                },
                warningCount: 0,
                fixableErrorCount: 1,
                fixableWarningCount: 0,
                source: results[0].source, // NewLine-characters might differ depending on git-settings
                usedDeprecatedRules: results[0].usedDeprecatedRules, // we don't care about this one
              },
            ],
          );

        });
    });
  });

  describe('typescript support', function () {
    let eslint;

    before(async function () {
      const Linter = await loadESLint({ cwd: path.join(__dirname, '../files/flat-config-typescript') });
      eslint = new Linter({ cwd: path.join(__dirname, '../files/flat-config-typescript') });
    });

    it('should report import plugin linting errors', function () {
      return eslint.lintFiles(['index.ts'])
        .then((results) => {
          expect(results).to.eql(
            [
              {
                filePath: path.join(__dirname, '../files/flat-config-typescript/index.ts'),
                messages: [
                  {
                    ruleId: 'import/no-duplicates',
                    severity: 1,
                    message: "'/home/vonbrax/code/node/forks/eslint-plugin-import/tests/files/flat-config-typescript/foo.ts' imported multiple times.",
                    line: 1,
                    column: 22,
                    nodeType: 'Literal',
                    endLine: 1,
                    endColumn: 29,
                    fix: {
                      range: [15, 138],
                      text: ", {something, Something } from './foo';\nimport * as sideEffect from './foo';\n",
                    },
                  },
                  {
                    ruleId: 'import/no-duplicates',
                    severity: 1,
                    message: "'/home/vonbrax/code/node/forks/eslint-plugin-import/tests/files/flat-config-typescript/foo.ts' imported multiple times.",
                    line: 3,
                    column: 25,
                    nodeType: 'Literal',
                    endLine: 3,
                    endColumn: 35,
                  },
                  {
                    column: 27,
                    endColumn: 34,
                    endLine: 4,
                    line: 4,
                    message: "'/home/vonbrax/code/node/forks/eslint-plugin-import/tests/files/flat-config-typescript/foo.ts' imported multiple times.",
                    nodeType: 'Literal',
                    ruleId: 'import/no-duplicates',
                    severity: 1,
                  },
                ],
                ...semver.satisfies(eslintPkg.version, '>= 8.8') && {
                  suppressedMessages: [],
                },
                errorCount: 0,
                ...semver.satisfies(eslintPkg.version, '>= 7.32 || ^8.0.0') && {
                  fatalErrorCount: 0,
                },
                warningCount: 3,
                fixableErrorCount: 0,
                fixableWarningCount: 1,
                source: results[0].source, // NewLine-characters might differ depending on git-settings
                usedDeprecatedRules: results[0].usedDeprecatedRules, // we don't care about this one
              },
            ],
          );
        });
    });
  });

  describe('no-unused-modules', function () {
    let eslint;

    before(async function () {
      const Linter = await loadESLint({ cwd: path.join(__dirname, '../files/flat-config-no-unused-modules') });
      eslint = new Linter({ cwd: path.join(__dirname, '../files/flat-config-no-unused-modules') });
    });

    it('should report import plugin linting errors', function () {
      return eslint.lintFiles(['index.js'])
        .then((results) => {
          expect(results).to.eql(
            [{
              filePath: '/home/vonbrax/code/node/forks/eslint-plugin-import/tests/files/flat-config-no-unused-modules/index.js',
              messages: [

                {
                  column: 10,
                  endColumn: 17,
                  endLine: 4,
                  line: 4,
                  message: "exported declaration 'default' not used within other modules",
                  nodeType: 'ExportSpecifier',
                  ruleId: 'import/no-unused-modules',
                  severity: 1,
                },
                {
                  column: 19,
                  endColumn: 21,
                  endLine: 4,
                  line: 4,
                  message: "exported declaration 'i0' not used within other modules",
                  nodeType: 'ExportSpecifier',
                  ruleId: 'import/no-unused-modules',
                  severity: 1,
                },
                {
                  column: 1,
                  endColumn: 20,
                  endLine: 6,
                  line: 6,
                  message: "exported declaration 'j' not used within other modules",
                  nodeType: 'ExportNamedDeclaration',
                  ruleId: 'import/no-unused-modules',
                  severity: 1,
                },

              ],
              ...semver.satisfies(eslintPkg.version, '>= 8.8') && {
                suppressedMessages: [],
              },
              errorCount: 0,
              ...semver.satisfies(eslintPkg.version, '>= 7.32 || ^8.0.0') && {
                fatalErrorCount: 0,
              },
              warningCount: 3,
              fixableErrorCount: 0,
              fixableWarningCount: 0,
              source: results[0].source,
              usedDeprecatedRules: results[0].usedDeprecatedRules,
            }],
          );

        });
    });
  });
});
