const fs = require('fs');
const readline = require('readline');
const extractor = require('./extractor');
const htmlBuilder = require('./html-builder');

const keywordsFile = 'keywords.txt';
let clientConfigFile, newsItems;

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

module.exports.getItemsListPage = getItemsListPage;
module.exports.getClientConfigFile = getClientConfigFile;
module.exports.buildClientConfigFile = buildClientConfigFile;
