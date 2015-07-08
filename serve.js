#!/usr/bin/env node
'use strict';

var https = require('https');
var http = require('http');
var fs = require('fs');
var path = require('path');

function createInsecureServer(port, pubdir, opts) {
  var server = http.createServer();

  server.on('error', function (err) {
    console.error(err);
    process.exit(1);
  });

  server.on('request', require('redirect-https')({
    port: port
  }));

  server.listen(opts.insecurePort, function () {
    var msg = 'Serving ' + pubdir + ' at http://' + opts.servername;
    var p = server.address().port;
    if (80 !== p) {
      msg += ':' + p;
    }
    console.info(msg);
  });
}

function createServer(port, pubdir, content, opts) {
  var server = https.createServer(opts);
  var app = require('./app');
  var directive = { public: pubdir, content: content };

  if (opts.insecurePort) {
    createInsecureServer(port, pubdir, opts);
  }

  server.on('error', function (err) {
    console.error(err);
    process.exit(1);
  });

  server.listen(port, function () {
    var msg = 'Serving ' + pubdir + ' at https://' + opts.servername;
    var p = server.address().port;
    if (443 !== p) {
      msg += ':' + p;
    }
    console.info(msg);
  });

  if ('function' === typeof app) {
    app = app(directive);
  } else if ('function' === typeof app.create) {
    app = app.create(directive);
  }

  Promise.resolve(app).then(function (app) {
    server.on('request', app);
  });
}

module.exports.createServer = createServer;

function run() {
  var minimist = require('minimist');
  var argv = minimist(process.argv.slice(2));
  var port = argv.p || argv.port || argv._[0] || 8443;
  var pubdir = path.resolve(argv.d || argv._[1] || process.cwd());
  var content = argv.c;

  var cert = require('localhost.daplie.com-certificates');
  var opts = {
    key: cert.key
  , cert: cert.cert
  , ca: cert.ca
  , SNICallback: function (servername, cb) {
      cb(null, require('tls').createSecureContext(opts));
      return;
    }
  };

  if (argv.key || argv.cert || argv.chain) {
    if (!argv.key || !argv.cert || !argv.chain) {
      console.error("You must specify each of --key --cert and --chain (chain may be empty)");
      return;
    }

    if (!Array.isArray(argv.chain)) {
      argv.chain = [argv.chain];
    }

    opts.key = fs.readFileSync(argv.key);
    opts.cert = fs.readFileSync(argv.cert);
    // turn multiple-cert pemfile into array of cert strings
    opts.ca = argv.chain.reduce(function (chain, fullpath) {
      return chain.concat(fs.readFileSync(fullpath, 'ascii')
      .split('-----END CERTIFICATE-----')
      .filter(function (ca) {
        return ca.trim();
      }).map(function (ca) {
        return (ca + '-----END CERTIFICATE-----').trim();
      }));
    }, []);
  }

  opts.servername = 'localhost.daplie.com';
  if (argv.servername) {
    opts.servername = argv.servername;
  }
  opts.insecurePort = argv.i || argv['insecure-port'];

  createServer(port, pubdir, content, opts);
}

if (require.main === module) {
  run();
}
