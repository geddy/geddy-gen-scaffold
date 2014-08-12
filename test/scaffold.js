var path = require('path')
  , assert = require('assert')
  , fs = require('fs')
  , exec = require('child_process').exec
  , utilities = require('utilities')
  , tests;

var testAppDir = path.join(__dirname, 'tmp', 'geddy-test-app');
var testsDir = path.join(testAppDir, 'test', 'models');

function createScaffold(name, argv, cb)
{
  if (!argv) {
    argv = []
  }

  if (typeof argv === 'function') {
    cb = argv;
    argv = [];
  }

  var p = exec(path.join(__dirname, 'helpers', 'exec.js') + ' ' + name + ' ' + argv.join(' '), cb);
  p.stdout.pipe(process.stdout);
}

var tests = {
  'beforeEach': function()
  {
    // go into app directory
    process.chdir(testAppDir);
  },
  'Create Zooby scaffold without engine and framework specified --bower': function(next)
  {
    createScaffold('Zooby', ['title:string', 'weight:integer', '--bower'], function(err, stdout, stderr) {
      if (err) {
        console.error(err);
        fail();
        return;
      }

      next();
    });
  }
};
module.exports = tests;