var fs                 = require('fs');
var vm                 = require('vm');
var path               = require('path');

var handlebarsJs       = fs.readFileSync(__dirname + '/handlebars.js', 'utf8');
var templateCompilerJs = fs.readFileSync(__dirname + '/ember-template-compiler.js', 'utf8');
var templateFileExtensions = /\.(hbs|hjs|handlebars)/;

module.exports = function(path) {
  var templates = fs.readdirSync(path).filter(function(file) {
    return file.match(templateFileExtensions);
  });
  
  var output = [];
  templates.forEach(function(template) {
    output.push(compile(path, template));
  });
  
  return output.join('\n\n');
};


function compile(path, file) {
  var context = vm.createContext({
    exports: {},
    template: fs.readFileSync(path + '/' + file) + ''
  });

  // Load handlebars
  vm.runInContext(handlebarsJs, context, 'handlebars.js');

  // Load the ember template compiler
  vm.runInContext(templateCompilerJs, context, 'ember-template-compiler.js');

  // Compile the template
  vm.runInContext('compiledJS = exports.precompile(template);', context);

  return 'Ember.TEMPLATES[' + JSON.stringify(templateNameForFile(file)) + '] = ' +
         'Ember.Handlebars.template(' + context.compiledJS + ');';
}

function templateNameForFile(file) {
  return file.replace(templateFileExtensions, "");
}