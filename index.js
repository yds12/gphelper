const server = require('./src/server.js');
const CONFIG = {};
CONFIG.localport = 3000;
CONFIG.port = process.env.PORT || CONFIG.localport;
CONFIG.publicDir = 'www';
CONFIG.db = {
  host: 'localhost',
  protocol: 'http',
  port: 5984,
  user: 'admin',
  pw: 'password'
};
server.start(CONFIG);
