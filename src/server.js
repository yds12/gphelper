const express = require('express');
const http = require('http');
const path = require('path');
const controller = require('./controller');

// Server setup
const app = express();
app.disable('x-powered-by');

const server = http.createServer(app);
app.use(express.json());

let config;

function start(configurations){
  console.log('Configurations received:', configurations);
  config = configurations;
  server.listen(config.port, () =>
    console.log(`Express server listening on port ${config.port}...`));
  controller.setup(configurations, () => {
    setupRoutes();
  });
}

function setupRoutes(){
  app.use(express.static(config.publicDir));

  app.get('/', (req, res) => {
    controller.getItemsListPage()
      .then(result => {
        console.log('HTML successfully built. Result size:', result.length);
        res.send(result);
      })
      .catch(err => {
        console.log('Failed to build response:', err.message,
          'Complete error:', err);
        res.status(500).send('500 Server Error.');
      });
  });

  app.get('/js/config.js', (req, res) => {
    res.set('Content-Type', 'application/javascript');
    res.send(controller.getClientConfigFile());
  });

  app.get('*', (req, res) => {
    console.log('Requested URL: ', req.url);
    res.send();
  });

  app.post('/', (req, res) => {
    if(req.body.bad && req.body.good){
      controller.addExamples(req.body.good, req.body.bad);
      res.send();
    }
    else console.log('Content received via POST is invalid.');
  });
}

module.exports.start = start;
