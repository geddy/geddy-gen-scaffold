var path = require('path')
  , fs = require('fs')
  , cwd = process.cwd()
  , utilities = require('utilities')
  , genutils = require('geddy-genutils')
  , genDirname = __dirname;

var ns = 'scaffold';

// Load the basic Geddy toolkit
genutils.loadGeddy();
var utils = genutils.loadGeddyUtils();

// Tasks
task('default', function() {
  var self = this;
  var t = jake.Task['scaffold:create'];
  t.reenable();
  t.invoke.apply(t, Array.prototype.slice.call(arguments));
});

namespace(ns, function() {
  task('help', function() {
    console.log(
      fs.readFileSync(
        path.join(__dirname, 'help.txt'),
        {encoding: 'utf8'}
      )
    );
  });

  task('create', function() {

  });
});
