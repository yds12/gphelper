/*
 * This file is just an example of how config.js should look like.
 * To run the application, copy this file, rename it to config.js and
 * fill in your configuration details.
 */

const CONFIG = {};
CONFIG.localport = 3000;
CONFIG.port = process.env.PORT || CONFIG.localport;
CONFIG.publicDir = 'www';
CONFIG.keywordsFile = 'keywords.txt';
CONFIG.blacklistFile = 'blacklist.txt';
CONFIG.db = {
  dbName: 'mydb',
  host: 'localhost',
  protocol: 'http',
  port: 5984,
  user: 'adm',
  pw: '123456',
  designDocument: 'mainDesignDocument'
};

module.exports = CONFIG;
