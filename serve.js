#!/usr/bin/env node
'use strict';

var https = require('https');
var path = require('path');

function createServer(port, pubdir) {
  var server = https.createServer(require('localhost.daplie.com-certificates'));
  var app = require('./app');

  server.on('error', function (err) {
    console.error(err);
    process.exit(1);
  });

  server.listen(port, function () {
    var msg = 'Serving ' + pubdir + ' at https://localhost.daplie.com';
    var p = server.address().port;
    if (443 !== p) {
      msg += ':' + p;
    }
    console.log(msg);
  });

  if ('function' === typeof app) {
    app = app({ public: pubdir });
  } else if ('function' === typeof app.create) {
    app = app.create({ public: pubdir });
  }

  Promise.resolve(app).then(function (app) {
    server.on('request', app);
  });
}

module.exports.createServer = createServer;

function run() {
  var minimist = require('minimist');
  var argv = minimist(process.argv.slice(2));
  var port = argv.p || argv._[0] || 1443;
  var pubdir = path.resolve(argv.d || argv._[1] || process.cwd());
  createServer(port, pubdir);
}

if (require.main === module) {
  run();
}
