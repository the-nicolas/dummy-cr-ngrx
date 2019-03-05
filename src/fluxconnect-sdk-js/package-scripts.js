const {series, crossEnv, concurrent, rimraf} = require('nps-utils');

module.exports = {
  scripts: {
    default: 'nps build',
    test: {
      default: 'nps test.jest',
      jest: {
        default: crossEnv('BABEL_TARGET=node jest --collectCoverage=false'),
        coverage: series(
          rimraf('test/coverage-jest'),
          crossEnv('BABEL_TARGET=node jest')
        ),
        accept: crossEnv('BABEL_TARGET=node jest -u'),
        watch: crossEnv('BABEL_TARGET=node jest --watch'),
      },
      karma: {
        default: 'karma start test/karma.conf.js --env.api="http://localhost:3333" --env.app="http://localhost:3333" --env.nats="ws://localhost:3388"',
        coverage: series(
          rimraf('test/coverage-karma'),
          'karma start test/karma.conf.js'
        ),
        watch: 'karma start test/karma.conf.js --env.api="http://localhost:3333" --env.app="http://localhost:3333" --env.nats="ws://localhost:3388" --auto-watch --no-single-run',
        debug: 'karma start test/karma.conf.js --env.api="http://localhost:3333" --env.app="http://localhost:3333" --env.nats="ws://localhost:3388" --auto-watch --no-single-run --debug'
      },
      lint: {
        default: 'eslint src',
        fix: 'eslint --fix'
      },
      all: concurrent({
        karma: series.nps('test.karma'),
        jest: 'nps test.jest',
        lint: 'nps test.lint'
      })
    },
    build: 'gulp build',
  },
};
