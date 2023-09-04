import * as url from 'url';
import http from 'http';
import express from 'express';

import retrace from '../retrace/index.js';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

let server = null;

export const config = {
  runner: 'browser',
  specs: ['./test/index.js'],
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    timeout: 60 * 1000,
  },
  user: process.env.SAUCE_USERNAME,
  key: process.env.SAUCE_ACCESS_KEY,
  region: 'eu',
  services: [
    ['sauce', {
      sauceConnect: true,
      sauceConnectOpts: {
      }
    }]
  ],
  capabilities: [{
    browserName: 'chrome',
    platformName: 'Windows 11',
    browserVersion: 'latest'
  }],
  logLevel: 'trace',
  onPrepare: function (_config, _capabilities) {
    var app = express();
    app.get(function(req, res, next) {
      console.log(req.path);
      next();
    });
    app.use(express.static(__dirname + '/test/fixture'));
    app.get('/retrace', function(req, res) {
      // Read the stack from a query parameter
      var stack = req.query.stack;
      // ... pass it to retrace
      retrace.map(stack).then(function(s) {
        // ... and send back the re-mapped stack trace
        res.send(s);
      })
      .catch(function(err) {
        res.status(500).send(err);
      })
      .finally(function() {
        res.end();
      });
    });
    server = http.createServer(app);
    server.listen(8001, () => console.log('server listening on port 8001') );
  },
  onComplete: function (_exitCode, _config, _capabilities, _results) {
    if (server) {
      console.log('stopping server on port 8001');
      server.close();
    }
  }
};