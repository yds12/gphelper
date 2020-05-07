const fs = require('fs');
const readline = require('readline');
const extractor = require('./extractor');
const htmlBuilder = require('./html-builder');
const tokenizer = require('./tokenizer');
const dal = require('./dal');

let clientConfigFile, newsItems;

function setup(config, callback){
  dal.setup(config.db);
  buildClientConfigFile(config, callback);
}

async function getItemsListPage(){
  newsItems = await extractor.extract();
  return htmlBuilder.template('index', newsItems);
}

function getClientConfigFile(){
  return clientConfigFile;
}

function buildClientConfigFile(config, callback){
  const rl = readline.createInterface({
    input: fs.createReadStream(config.keywordsFile),
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

function getItemsByIds(ids){
  let items = [];

  for(let id of ids){
    let idx = newsItems.findIndex(item => item.id === id);
    if(idx >= 0) items.push(newsItems[idx]);
  }
  return items;
}

function insertNewTokens(tokens){
  let tokenIds = [];
  return tokenIds;
}

function insertNewsItem(item){
  console.log('Trying to insert item:', item);
}

function addExamples(goodIds, badIds){
  const goodItems = getItemsByIds(goodIds);
  const badItems = getItemsByIds(badIds);
  const allItems = goodItems.concat(badItems);

  for(let i = 0; i < allItems.length; i++){
    let item = allItems[i];
    let good = i <= goodItems.length;
    let tokens = tokenizer.getTokens(item.text);
    let tokenIds = insertNewTokens();
    const itemDoc = {
      id: item.id,
      tokens: tokenIds,
      good: good
    };
    insertNewsItem(itemDoc);
  }
}

module.exports.setup = setup;
module.exports.getItemsListPage = getItemsListPage;
module.exports.buildClientConfigFile = buildClientConfigFile;
module.exports.getClientConfigFile = getClientConfigFile;
module.exports.addExamples = addExamples;
