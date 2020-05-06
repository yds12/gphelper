const util = require('./util');

function generateItemsId(items){
  for(let item of items){
    item.id = util.getHash(item.link);
  }
}

module.exports.generateItemsId = generateItemsId;
