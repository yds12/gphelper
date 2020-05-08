const util = require('./util');
const extractor = require('./extractor');
const htmlBuilder = require('./html-builder');
const tokenizer = require('./tokenizer');
const dal = require('./dal');

let clientConfigFile, headlines;

function setup(config, callback){
  tokenizer.initialize(config);
  dal.setup(config.db);
  dal.testConnection();
  buildClientConfigFile(config, callback);
}

async function getItemsListPage(){
  headlines = await extractor.extract();
  return htmlBuilder.template('index', headlines);
}

function getClientConfigFile(){
  return clientConfigFile;
}

function buildClientConfigFile(config, callback){
  let configFileContent = 'const CONFIG = {};';
  configFileContent += 'CONFIG.keywords = [';

  util.readLines(config.keywordsFile, (line) => {
    configFileContent += `"${line}",`;
  }, () => {
    configFileContent += '];'
    clientConfigFile = configFileContent;
    callback();
  });
}

function getItemsByIds(ids){
  let items = [];

  for(let id of ids){
    let idx = headlines.findIndex(item => item.id === id);
    if(idx >= 0) items.push(headlines[idx]);
  }
  return items;
}

function insertNewTokens(tokens){
  let insertionPromises = [];
  for(let token of tokens)
    insertionPromises.push(dal.addToken(token));

  return Promise.all(insertionPromises);
}

async function addExamples(goodIds, badIds){
  if(goodIds.length + badIds.length === 0) return;

  const goodItems = getItemsByIds(goodIds);
  const badItems = getItemsByIds(badIds);
  const allItems = goodItems.concat(badItems);

  for(let i = 0; i < allItems.length; i++){
    let item = allItems[i];
    let good = i < goodItems.length;
    let tokens = tokenizer.getTokens(item.title);
    let headlineExists = await dal.headlineExists(item.id);

    if(headlineExists) {
      console.log(`Headline ID=${item.id} already exists.`);
      continue;
    }

    try{
      let tokenIds = await insertNewTokens(tokens);

      const headline = {
        id: item.id,
        tokens: tokenIds,
        good: good
      };
      dal.insertHeadline(headline);
    } catch(err) {
      console.log('Error inserting tokens/items. Error:', err.message);
    }
  }
}

module.exports.setup = setup;
module.exports.getItemsListPage = getItemsListPage;
module.exports.buildClientConfigFile = buildClientConfigFile;
module.exports.getClientConfigFile = getClientConfigFile;
module.exports.addExamples = addExamples;
