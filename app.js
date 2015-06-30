'use strict';

module.exports = function (opts) {
  var finalhandler = require('finalhandler');
  var serveStatic = require('serve-static');
  var serveIndex = require('serve-index');
  var serve = serveStatic(opts.public);
  var index = serveIndex(opts.public);
  var content = opts.content;

  return function (req, res) {
    if (content && '/' === req.url) {
      // res.setHeader('Content-Type', 'application/octet-stream');
      res.end(content);
      return;
    }
    var done = finalhandler(req, res);
    serve(req, res, function (err) {
      if (err) { return done(err); }
      index(req, res, done);
    });
  };
};
