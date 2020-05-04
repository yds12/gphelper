const express = require('express');
const http = require('http');
const path = require('path');
const fetcher = require('./fetcher');

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
  app.get('/', (req, res) => {
//    res.sendFile(path.join(__dirname, '..', config.publicDir, 'index.html'));
    fetcher.fetch('http://www.afp.com/pt')
      .then(result => {
        console.log('Fetch successful. Result size:', result.length);
        res.send(result);
      })
      .catch(err => {
        console.log('Fetch failed.');
        res.status(500).send('500 Server Error.');
      });
  });

  app.use(express.static(config.publicDir));

  app.get('*', (req, res) => {
    console.log('Requested URL: ', req.url);
    res.send();
  });
}

module.exports.start = start;
