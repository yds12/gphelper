const server = require('./src/server.js');
let config;

try{
  config = require('./config.js');
} catch(err){
  console.log('ERROR: File config.js must be present at the root directory. ' +
    'Try using config-mock.js as a model for it.', err.message);
  return;
}

server.start(config);
