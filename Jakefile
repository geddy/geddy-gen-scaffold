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

  desc('Creates a model scaffold.');
  task('create', {async: true}, function(name, modelProperties, engine, framework, templatesDir) {
    if (!genutils.inAppRoot()) {
      fail('You must run this generator from the root of your application.');
      return;
    }

    if (!name) {
      fail('Missing model name.');
      return;
    }

    if (!modelProperties) {
      var modelProperties = '';
    }

    if (!engine) {
      var engine = process.env['engine'] || 'ejs';
    }

    if (!framework) {
      var framework = process.env['framework'] || 'bootstrap/none';
    }

    // parse the framework
    framework = framework.split('/', 2);
    framework = {
      css: framework[0],
      js: (framework.length == 2) ? framework[1] : 'none'
    };

    if (!templatesDir) {
      var templatesDir = process.env['templates'] || path.join(__dirname, 'template');
    }

    var bower = genutils.flagSet(null, '--bower');
    var ext = genutils.template.getExtFromEngine(engine);

    // get model gen helpers
    var modelHelpers = require(path.join(path.dirname(require.resolve('geddy-gen-model')), 'helpers'));

    var properties = modelHelpers.formatModelProperties(modelProperties);
    var names = utilities.string.getInflections(name);

    var viewData = {
      engine: engine,
      framework: framework,
      name: name,
      properties: properties,
      names: names,
      genutils: genutils
    };

    // create resource
    genutils.runGen('geddy-gen-resource', [name, modelProperties], onResourceGen);

    function onResourceGen(err)
    {
      if (err) {
        console.error(err);
        fail('Error creating the resource.');
        return;
      }

      if (bower) {
        setupBower(function() {
          createViews();
          complete();
        });
      }
      else {
        createViews();
        complete();
      }
    }

    function setupBower(cb)
    {
      genutils.jake.loadFiles(genutils.getGenDir('geddy-gen-app'));
      var t = jake.Task['app:bower'];
      t.on('complete', function() {
        var deps = ['jquery'];

        console.log('installing bower components now ...');
        var deps = ['jquery'];
        if (['bootstrap', 'foundation'].indexOf(framework.css) !== -1) {
          deps.push(framework.css);
        }

        genutils.bower.install(deps, function() {
          cb();
        });

      });
      t.invoke();
    }

    function createViews()
    {
      // create views
      genutils.jake.loadFiles(genutils.getGenDir('geddy-gen-view'));
      var viewTask = jake.Task['view:create'];

      // index
      var files = new jake.FileList();
      files.include(templatesDir + '/**/*.html.ejs');

      files.toArray().forEach(function(file) {
        viewTask.reenable();
        viewTask.invoke(
          path.join(names.filename.plural, path.basename(file, path.extname(file)) + ext),
          file,
          viewData,
          transformTemplate
        );
      });
    }

    function transformTemplate(content)
    {
      return content.replace(/\<\@/g, '<%').replace(/\@\>/g, '%>').trim();
    }
  });

  desc('Clears the test temp directory.');
  task('clean', function() {
    console.log('Cleaning temp files ...');
    var tmpDir = path.join(__dirname, 'test', 'tmp');
    utilities.file.rmRf(tmpDir, {silent:true});
    fs.mkdirSync(tmpDir);
  });

  desc('Copies the test app into the temp directory.');
  task('prepare-test-app', function() {
    console.log('Preparing test app ...');
    jake.cpR(
      path.join(__dirname, 'test', 'geddy-test-app'),
      path.join(__dirname, 'test', 'tmp'),
      {silent: true}
    );
    console.log('Test app prepared.');
  });
});

testTask('Scaffold', ['scaffold:clean', 'scaffold:prepare-test-app'], function() {
  this.testFiles.exclude('test/helpers/**');
  //this.testFiles.exclude('test/fixtures/**');
  this.testFiles.exclude('test/geddy-test-app');
  this.testFiles.exclude('test/tmp/**');
  this.testFiles.include('test/**/*.js');
});