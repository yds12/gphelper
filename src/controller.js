const util = require('./util');
const extractor = require('./extractor');
const htmlBuilder = require('./html-builder');
const tokenizer = require('./tokenizer');
const dal = require('./dal');

let clientConfigFile, newsItems;

function setup(config, callback){
  tokenizer.initialize(config);
  dal.setup(config.db);
  dal.testConnection();
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
    let idx = newsItems.findIndex(item => item.id === id);
    if(idx >= 0) items.push(newsItems[idx]);
  }
  return items;
}

function insertNewTokens(tokens){
  let tokenIds = [];
  let insertionPromises = [];

  for(let token of tokens){
    insertionPromises.push(dal.addToken(token));
    dal.addToken(token)
      .then(id => {
        tokenIds.push(id);
      }).catch(err => {
      });
  }

  return Promise.all(insertionPromises);
}

function insertNewsItem(item){
//  console.log('Trying to insert item:', item);
}

async function addExamples(goodIds, badIds){
  const goodItems = getItemsByIds(goodIds);
  const badItems = getItemsByIds(badIds);
  const allItems = goodItems.concat(badItems);

  for(let i = 0; i < allItems.length; i++){
    let item = allItems[i];
    let good = i <= goodItems.length;
    let tokens = tokenizer.getTokens(item.title);

    try{
      let tokenIds = await insertNewTokens(tokens);

      const itemDoc = {
        id: item.id,
        tokens: tokenIds,
        good: good
      };
      insertNewsItem(itemDoc);
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
