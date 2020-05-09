const util = require('./util');

class Provider {
  constructor(url, encoding){
    this.url = url;
    this.encoding = encoding | 'utf-8';
  }

  cutHtml(htmlBody){
    return htmlBody;
  }

  getItems(ch, partialUrl, source){
    const items = this.assembleItems(ch, partialUrl, source);
    this.generateItemsId(items);
    return items;
  }

  assembleItems(ch, partialUrl, source){
    items = [];
    return items;
  }

  generateItemsId(items){
    for(let item of items){
      item.id = util.getHash(item.link);
    }
  }
}


module.exports = Provider;
