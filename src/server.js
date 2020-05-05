const express = require('express');
const http = require('http');
const path = require('path');
const htmlBuilder = require('./html-builder');

// Server setup
const app = express();
app.disable('x-powered-by');

const server = http.createServer(app);
let config;

function start(configurations){
  config = configurations;
  server.listen(config.port, () =>
    console.log(`Express server listening on port ${config.port}...`));
  setupRoutes();
}

function setupRoutes(){
  app.use(express.static(config.publicDir));

  app.get('/', (req, res) => {
    htmlBuilder.template('index')
      .then(result => {
        console.log('HTML successfully built. Result size:', result.length);
        res.send(result);
      })
      .catch(err => {
        console.log('Failed to build response:', err.message);
        res.status(500).send('500 Server Error.');
      });
  });

  app.get('*', (req, res) => {
    console.log('Requested URL: ', req.url);
    res.send();
  });
}

module.exports.start = start;
