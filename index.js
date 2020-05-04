const server = require('./src/server.js');
const CONFIG = {};
CONFIG.localport = 3000;
CONFIG.port = process.env.PORT || CONFIG.localport;
CONFIG.publicDir = 'www';
server.start(CONFIG);
