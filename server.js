/*globals __dirname, process */

var express = require('express');
var app = express();
app.configure(function(){
  app.use(express.static(__dirname));
});

var fs = require('fs');

app.get('/', function(req, res) {
  var benchmarks = fs.readdirSync(__dirname + "/benchmarks");

  res.end(
    '<html><body>' +
    benchmarks.map(function(benchmark) { return "<a href='/run/" + benchmark + "'>" + benchmark + "</a>"; }).join("\n") +
    '</body></html>'
  )
});

app.get('/run/:benchmark', function(req, res){
  var emberPath = "http://builds.emberjs.com/ember-latest.prod.js";

  res.send(
    '<html><body>' +
    '  <script>console.time("init");</script>' +
    '  <script src="http://code.jquery.com/jquery-2.0.3.js"></script>' +
    '  <script src="http://builds.emberjs.com/handlebars-1.0.0.js"></script>' +
    '  <script src="' + emberPath + '"></script>' +
    '  <script src="/run/' + req.params.benchmark + '/templates.js"></script>' +
    '  <script src="/benchmarks/' + req.params.benchmark + '/index.js"></script>' +
    '  <script>console.timeEnd("init");</script>' +
    '</body></html>');
});

var compileDir = require('./lib/benchmark-template-compiler');

app.get('/run/:benchmark/templates.js', function(req, res) {
  var dirPath = __dirname + '/benchmarks/' + req.params.benchmark;
  res.end(compileDir(dirPath));
});

app.listen(process.env.PORT || 3000);