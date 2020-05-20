const util = require('./util');

class Provider {
  constructor(url, encoding){
    this.url = url;
    this.encoding = encoding || 'utf-8';
    this.itemsPipeline = [];
  }

  cutHtml(htmlBody){
    return htmlBody;
  }

  getItems(ch, baseUrl, source){
    const items = this.assembleItems(ch, baseUrl);
    this.generateItemsSource(items, source);
    this.generateItemsId(items);
    return items;
  }

  assembleItems(ch, baseUrl){
    let items = [];

    for(let pipeline of this.itemsPipeline)
      this.processPipeline(pipeline, items, ch, baseUrl);

    return items;
  }

  addItemsPipeline(pl){
    this.itemsPipeline.push(pl);
  }

  processPipeline(pl, items, ch, baseUrl){
    let mainElement = ch(pl.mainFilter);
    if(pl.useChildren) mainElement = mainElement.children();

    mainElement.each((i, e) => {
      let elements = [];

      if(pl.otherFilters){
        for(let i = 0; i <pl.otherFilters.length; i++)
          elements[i] = ch(e).find(pl.otherFilters[i]).first();
      }

      let titleElement = isNaN(pl.titleElementIdx) ? 
        ch(e) : elements[pl.titleElementIdx];
      let urlElement = isNaN(pl.urlElementIdx) ? 
        ch(e) : elements[pl.urlElementIdx];

      let href = urlElement.attr('href');

      if(!href.toLowerCase().startsWith('http') &&
         !href.toLowerCase().startsWith('www')){
        href = baseUrl + href;
      }

      let newItem = {
        title: titleElement.text(),
        link: href 
      };
      items.push(newItem);
    });
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
