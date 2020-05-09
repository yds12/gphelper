const util = require('./util');

class Provider {
  constructor(url, encoding){
    this.url = url;
    this.encoding = encoding || 'utf-8';
  }

  cutHtml(htmlBody){
    return htmlBody;
  }

  getItems(ch, partialUrl, source){
    const items = this.assembleItems(ch, partialUrl);
    this.generateItemsSource(items, source);
    this.generateItemsId(items);
    return items;
  }

  assembleItems(ch, partialUrl){
    items = [];
    return items;
  }

  generateItemsSource(items, source){
    for(let item of items){
      item.source = source;
    }
  }

  generateItemsId(items){
    for(let item of items){
      item.id = util.getHash(item.link);
    }
  }
}


module.exports = Provider;
