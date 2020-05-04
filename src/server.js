const express = require('express');
const http = require('http');
const path = require('path');

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
    res.sendFile(path.join(__dirname, '..', config.publicDir, 'index.html'));
  });

  app.get('/js/config.js', (req, res) => {
    res.set('Content-Type', 'application/javascript');
    res.send(`const PORT = ${config.port};`);
  });

  app.get('*', (req, res) => {
    console.log('Requested URL: ', req.url);
    res.send();
  });
}

module.exports.start = start;
