const fs = require('fs');
const readline = require('readline');
const extractor = require('./extractor');
const htmlBuilder = require('./html-builder');
const nodeCouchDb = require('node-couchdb');

const keywordsFile = 'keywords.txt';
let clientConfigFile, newsItems, db;

function setup(config, callback){
  setupDb(config.db);
  buildClientConfigFile(callback);
}

function setupDb(config){
  let db = new nodeCouchDb({
    auth: {
      user: config.user,
      pass: config.pw
  }});

//  db.listDatabases().then(dbs => {
//    console.log('Connected to database successfully! List of DBs:', dbs);
//  }, err => console.log('Error connecting to database: ', err.message));

  db.get(config.dbName, '_all_docs').then((data, headers, status) =>
    console.log(`Query from ${config.dbName}:`, data), err =>
    console.log(`Failed to query ${config.dbName}:`, err.message));
}

async function getItemsListPage(){
  newsItems = await extractor.extract();
  return htmlBuilder.template('index', newsItems);
}

function getClientConfigFile(){
  return clientConfigFile;
}

function buildClientConfigFile(callback){
  const rl = readline.createInterface({
    input: fs.createReadStream(keywordsFile),
    crlfDelay: Infinity
  });

  let configFileContent = 'const CONFIG = {};';
  configFileContent += 'CONFIG.keywords = [';

  rl.on('line', line => {
    configFileContent += `"${line}",`;
  });

  rl.on('close', () => {
    configFileContent += '];'
    clientConfigFile = configFileContent;
    callback();
  });
}

module.exports.setup = setup;
module.exports.getItemsListPage = getItemsListPage;
module.exports.buildClientConfigFile = buildClientConfigFile;
module.exports.getClientConfigFile = getClientConfigFile;
